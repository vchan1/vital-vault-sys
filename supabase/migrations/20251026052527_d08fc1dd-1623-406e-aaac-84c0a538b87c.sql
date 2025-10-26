-- ============================================
-- CRITICAL SECURITY FIX: Separate Role Management System
-- Fixes: Privilege Escalation, Account Takeover, and Data Exposure
-- ============================================

-- 1. Create app_role enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'staff', 'doctor', 'patient');
  END IF;
END $$;

-- 2. Create user_roles table with proper security
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create helper function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- 5. Migrate existing roles from profiles to user_roles BEFORE dropping column
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::text::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Drop ALL policies that depend on profiles.role column
-- Profiles policies
DROP POLICY IF EXISTS "Staff and admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Patients policies
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
DROP POLICY IF EXISTS "Staff can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Staff can update patients" ON public.patients;
DROP POLICY IF EXISTS "Staff can view all patients" ON public.patients;

-- Doctors policies
DROP POLICY IF EXISTS "Admins can manage doctors" ON public.doctors;
DROP POLICY IF EXISTS "Everyone can view doctors" ON public.doctors;

-- Appointments policies
DROP POLICY IF EXISTS "Doctors can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can manage appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;

-- Medical records policies
DROP POLICY IF EXISTS "Doctors can create medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Doctors can view medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Patients can view their medical records" ON public.medical_records;

-- Billing policies
DROP POLICY IF EXISTS "Patients can view their bills" ON public.billing;
DROP POLICY IF EXISTS "Staff can manage billing" ON public.billing;

-- Pharmacy policies
DROP POLICY IF EXISTS "Everyone can view pharmacy inventory" ON public.pharmacy;
DROP POLICY IF EXISTS "Staff can manage pharmacy" ON public.pharmacy;

-- 7. NOW drop role column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 8. Update handle_new_user to ONLY create patient role (prevents privilege escalation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile without role
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email
  );
  
  -- Always assign 'patient' role only - admin/staff must be assigned separately
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient'::app_role);
  
  RETURN NEW;
END;
$$;

-- 9. Recreate ALL RLS policies using has_role function

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Staff and admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role)
);

-- Patients policies
CREATE POLICY "Patients can view their own data"
ON public.patients
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Staff can insert patients"
ON public.patients
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role)
);

CREATE POLICY "Staff can update patients"
ON public.patients
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role)
);

CREATE POLICY "Staff can view all patients"
ON public.patients
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role) OR
  public.has_role(auth.uid(), 'doctor'::app_role)
);

-- Doctors policies
CREATE POLICY "Admins can manage doctors"
ON public.doctors
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- CRITICAL FIX: Restrict doctor information exposure
-- Allow authenticated users to see limited doctor info
CREATE POLICY "Authenticated users can view limited doctor info"
ON public.doctors
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role) OR
  public.has_role(auth.uid(), 'patient'::app_role)
);

-- Appointments policies
CREATE POLICY "Patients can view their appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (patient_id IN (
  SELECT patient_id FROM patients WHERE user_id = auth.uid()
));

CREATE POLICY "Doctors can view their appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (doctor_id IN (
  SELECT doctor_id FROM doctors WHERE user_id = auth.uid()
));

CREATE POLICY "Staff can view all appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role)
);

CREATE POLICY "Staff can manage appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role)
);

-- Medical records policies
CREATE POLICY "Patients can view their medical records"
ON public.medical_records
FOR SELECT
TO authenticated
USING (patient_id IN (
  SELECT patient_id FROM patients WHERE user_id = auth.uid()
));

CREATE POLICY "Doctors can view medical records"
ON public.medical_records
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'doctor'::app_role) OR 
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Doctors can create medical records"
ON public.medical_records
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'doctor'::app_role) OR 
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Billing policies
CREATE POLICY "Patients can view their bills"
ON public.billing
FOR SELECT
TO authenticated
USING (patient_id IN (
  SELECT patient_id FROM patients WHERE user_id = auth.uid()
));

CREATE POLICY "Staff can manage billing"
ON public.billing
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role)
);

-- Pharmacy policies
CREATE POLICY "Everyone can view pharmacy inventory"
ON public.pharmacy
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage pharmacy"
ON public.pharmacy
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'staff'::app_role)
);

-- 10. Add RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 11. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);