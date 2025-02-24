import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Package, AlertCircle, Search,
  Plus, Filter, ArrowUpDown,
  Edit, History, ShoppingCart
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastOrdered: string;
  price: number;
}

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const inventory: InventoryItem[] = [
    {
      id: "INV001",
      name: "Premium Car Paint - Red",
      category: "Paint",
      quantity: 50,
      threshold: 20,
      supplier: "AutoPaint Pro",
      status: 'in-stock',
      lastOrdered: "2024-03-01",
      price: 89.99
    },
    {
      id: "INV002",
      name: "Body Filler - Standard",
      category: "Body Materials",
      quantity: 15,
      threshold: 25,
      supplier: "Auto Body Supply Co",
      status: 'low-stock',
      lastOrdered: "2024-02-15",
      price: 45.50
    },
    {
      id: "INV003",
      name: "Clear Coat - Premium",
      category: "Paint",
      quantity: 0,
      threshold: 10,
      supplier: "AutoPaint Pro",
      status: 'out-of-stock',
      lastOrdered: "2024-01-30",
      price: 129.99
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'default';
      case 'low-stock':
        return 'secondary';
      case 'out-of-stock':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <h3 className="text-2xl font-bold">65</h3>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h3 className="text-2xl font-bold">3</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Inventory Grid */}
      <div className="grid gap-6">
        {inventory.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-1">Category: {item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-500">Threshold: {item.threshold}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p>{item.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Ordered</p>
                <p>{new Date(item.lastOrdered).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p>${item.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Order
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 