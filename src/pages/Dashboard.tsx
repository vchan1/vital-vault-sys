import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Calendar, DollarSign } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,234",
      icon: Users,
      trend: "+12% from last month",
      color: "text-blue-600",
    },
    {
      title: "Active Doctors",
      value: "45",
      icon: Activity,
      trend: "+2 new this month",
      color: "text-green-600",
    },
    {
      title: "Appointments Today",
      value: "28",
      icon: Calendar,
      trend: "8 pending",
      color: "text-purple-600",
    },
    {
      title: "Revenue This Month",
      value: "$45,231",
      icon: DollarSign,
      trend: "+18% from last month",
      color: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Hospital Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your hospital overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium">Dr. Smith - Patient #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Today at {9 + i}:00 AM</p>
                  </div>
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg hover:shadow-lg transition-all">
                <Calendar className="h-6 w-6 mb-2" />
                <p className="font-medium">New Appointment</p>
              </button>
              <button className="p-4 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground rounded-lg hover:shadow-lg transition-all">
                <Users className="h-6 w-6 mb-2" />
                <p className="font-medium">Add Patient</p>
              </button>
              <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                <Activity className="h-6 w-6 mb-2" />
                <p className="font-medium">Add Doctor</p>
              </button>
              <button className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all">
                <DollarSign className="h-6 w-6 mb-2" />
                <p className="font-medium">New Bill</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
