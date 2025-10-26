-- Fix patient insertion: Allow users to create their own patient record
-- This fixes the error when logged-in users try to add patient information

CREATE POLICY "Users can create their own patient record"
ON public.patients
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());