import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, User, Calendar, Plus } from "lucide-react";

export default function Billing() {
  const bills = [
    {
      id: "B001",
      patient: "John Doe",
      amount: 1250.00,
      status: "paid",
      description: "Cardiology Consultation & Tests",
      date: "2024-10-15",
      dueDate: "2024-10-30",
    },
    {
      id: "B002",
      patient: "Jane Smith",
      amount: 850.00,
      status: "pending",
      description: "Neurology Consultation",
      date: "2024-10-18",
      dueDate: "2024-11-01",
    },
    {
      id: "B003",
      patient: "Bob Johnson",
      amount: 450.00,
      status: "overdue",
      description: "Annual Checkup",
      date: "2024-09-20",
      dueDate: "2024-10-20",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const totalRevenue = bills.filter(b => b.status === "paid").reduce((sum, b) => sum + b.amount, 0);
  const pendingAmount = bills.filter(b => b.status === "pending").reduce((sum, b) => sum + b.amount, 0);
  const overdueAmount = bills.filter(b => b.status === "overdue").reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Billing</h1>
          <p className="text-muted-foreground">Manage patient bills and payments</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              ${pendingAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">
              Overdue Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              ${overdueAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bills List */}
      <div className="grid gap-6">
        {bills.map((bill) => (
          <Card key={bill.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-4 min-w-[120px]">
                    <DollarSign className="h-6 w-6 text-primary mb-1" />
                    <p className="text-2xl font-bold text-primary">
                      ${bill.amount.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{bill.description}</h3>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Patient: {bill.patient}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Bill Date: {bill.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {bill.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  {bill.status !== "paid" && (
                    <Button size="sm">Mark as Paid</Button>
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
