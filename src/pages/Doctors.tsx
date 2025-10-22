import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Mail, Phone } from "lucide-react";

export default function Doctors() {
  const doctors = [
    {
      id: "D001",
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      email: "sarah.j@hospital.com",
      phone: "(555) 111-2222",
      patients: 45,
      availability: "Mon-Fri, 9AM-5PM",
    },
    {
      id: "D002",
      name: "Dr. Michael Chen",
      specialization: "Neurology",
      email: "michael.c@hospital.com",
      phone: "(555) 333-4444",
      patients: 38,
      availability: "Tue-Sat, 10AM-6PM",
    },
    {
      id: "D003",
      name: "Dr. Emily Brown",
      specialization: "Pediatrics",
      email: "emily.b@hospital.com",
      phone: "(555) 555-6666",
      patients: 52,
      availability: "Mon-Fri, 8AM-4PM",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Doctors</h1>
          <p className="text-muted-foreground">Manage doctor profiles and schedules</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {doctor.name.split(" ")[1][0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </div>
                <Activity className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {doctor.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {doctor.phone}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Active Patients</span>
                  <span className="font-semibold text-primary">{doctor.patients}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Available: {doctor.availability}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View Schedule
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
