import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pill } from "lucide-react";

export default function Pharmacy() {
  const medicines = [
    {
      id: "M001",
      name: "Lisinopril",
      stock: 250,
      price: 12.99,
      manufacturer: "PharmaCo",
      description: "ACE inhibitor for hypertension",
    },
    {
      id: "M002",
      name: "Metformin",
      stock: 180,
      price: 8.50,
      manufacturer: "MediLabs",
      description: "Oral diabetes medicine",
    },
    {
      id: "M003",
      name: "Amoxicillin",
      stock: 320,
      price: 15.75,
      manufacturer: "BioPharm",
      description: "Antibiotic for bacterial infections",
    },
    {
      id: "M004",
      name: "Atorvastatin",
      stock: 45,
      price: 22.00,
      manufacturer: "PharmaCo",
      description: "Cholesterol-lowering medication",
    },
    {
      id: "M005",
      name: "Omeprazole",
      stock: 15,
      price: 18.50,
      manufacturer: "MediLabs",
      description: "Proton pump inhibitor",
    },
  ];

  const getStockStatus = (stock: number) => {
    if (stock > 200) return { label: "In Stock", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" };
    if (stock > 50) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" };
    return { label: "Critical", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Pharmacy Inventory</h1>
          <p className="text-muted-foreground">Manage medicine stock and pricing</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search medicines..." className="pl-10" />
          </div>
        </CardHeader>
      </Card>

      {/* Medicine Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medicines.map((medicine) => {
          const stockStatus = getStockStatus(medicine.stock);
          return (
            <Card key={medicine.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                      <Pill className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{medicine.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{medicine.id}</p>
                    </div>
                  </div>
                  <Badge className={stockStatus.color}>
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{medicine.description}</p>
                
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Stock</span>
                    <span className="font-semibold">{medicine.stock} units</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-semibold text-primary">${medicine.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Manufacturer</span>
                    <span className="text-sm font-medium">{medicine.manufacturer}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    Edit
                  </Button>
                  <Button className="flex-1" size="sm">
                    Restock
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
