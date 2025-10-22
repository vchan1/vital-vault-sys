import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, Activity } from "lucide-react";

export default function MedicalRecords() {
  const records = [
    {
      id: "R001",
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      date: "2024-10-15",
      diagnosis: "Hypertension",
      prescription: "Lisinopril 10mg, once daily",
      notes: "Patient showing improvement. Continue medication and follow up in 3 months.",
    },
    {
      id: "R002",
      patient: "Jane Smith",
      doctor: "Dr. Michael Chen",
      date: "2024-10-18",
      diagnosis: "Migraine",
      prescription: "Sumatriptan 50mg as needed",
      notes: "Advised lifestyle changes. Avoid triggers and maintain sleep schedule.",
    },
    {
      id: "R003",
      patient: "Bob Johnson",
      doctor: "Dr. Emily Brown",
      date: "2024-10-20",
      diagnosis: "Annual Checkup",
      prescription: "Multivitamin supplement",
      notes: "All vitals normal. Patient in good health. Schedule next checkup in 12 months.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Medical Records</h1>
          <p className="text-muted-foreground">View and manage patient medical records</p>
        </div>
      </div>

      <div className="grid gap-6">
        {records.map((record) => (
          <Card key={record.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{record.diagnosis}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Record ID: {record.id}</p>
                  </div>
                </div>
                <Button variant="outline">View Full Record</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-medium">{record.patient}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Doctor</p>
                    <p className="font-medium">{record.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Visit Date</p>
                    <p className="font-medium">{record.date}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Prescription</p>
                  <p className="text-sm bg-accent p-3 rounded-lg">{record.prescription}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Doctor's Notes</p>
                  <p className="text-sm bg-accent p-3 rounded-lg">{record.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
