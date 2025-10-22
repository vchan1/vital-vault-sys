import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, User, Activity } from "lucide-react";

export default function Appointments() {
  const appointments = [
    {
      id: "A001",
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      date: "2024-10-22",
      time: "09:00 AM",
      status: "scheduled",
      type: "Cardiology Checkup",
    },
    {
      id: "A002",
      patient: "Jane Smith",
      doctor: "Dr. Michael Chen",
      date: "2024-10-22",
      time: "10:30 AM",
      status: "completed",
      type: "Neurology Consultation",
    },
    {
      id: "A003",
      patient: "Bob Johnson",
      doctor: "Dr. Emily Brown",
      date: "2024-10-22",
      time: "02:00 PM",
      status: "scheduled",
      type: "Pediatric Checkup",
    },
    {
      id: "A004",
      patient: "Alice Williams",
      doctor: "Dr. Sarah Johnson",
      date: "2024-10-23",
      time: "11:00 AM",
      status: "scheduled",
      type: "Follow-up",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage patient appointments</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-4 min-w-[100px]">
                    <Calendar className="h-5 w-5 text-primary mb-1" />
                    <p className="text-xs text-muted-foreground">{appointment.date}</p>
                    <p className="font-semibold text-primary">{appointment.time}</p>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{appointment.type}</h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Patient: {appointment.patient}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        <span>Doctor: {appointment.doctor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  {appointment.status === "scheduled" && (
                    <Button variant="outline" size="sm">Reschedule</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
