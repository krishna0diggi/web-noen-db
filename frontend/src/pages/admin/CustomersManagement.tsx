import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Edit, Phone, Mail, Calendar, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalBookings: number;
  totalSpent: number;
  status: "active" | "inactive" | "vip";
  lastVisit: string;
  avatar?: string;
}

export default function CustomersManagement() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2023-06-15",
      totalBookings: 12,
      totalSpent: 1450,
      status: "vip",
      lastVisit: "2024-01-20"
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@example.com", 
      phone: "+1 (555) 234-5678",
      joinDate: "2023-09-22",
      totalBookings: 8,
      totalSpent: 720,
      status: "active",
      lastVisit: "2024-01-18"
    },
    {
      id: "3",
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 345-6789",
      joinDate: "2023-12-10",
      totalBookings: 15,
      totalSpent: 2100,
      status: "vip",
      lastVisit: "2024-01-22"
    }
  ]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 3,
    totalItems: 25,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPreviousPage: false,
  });

  const updateCustomerStatus = (id: string, newStatus: "active" | "inactive" | "vip") => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
    toast({
      title: "Status Updated",
      description: "Customer status has been updated successfully.",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "vip": return "default";
      case "active": return "secondary";
      case "inactive": return "outline";
      default: return "secondary";
    }
  };

  const columns = [
    {
      key: "name" as keyof Customer,
      label: "Customer",
      render: (value: string, row: Customer) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={row.avatar} />
            <AvatarFallback className="text-sm font-semibold">
              {row.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {row.email}
            </div>
          </div>
        </div>
      ),
      width: "300px"
    },
    {
      key: "phone" as keyof Customer,
      label: "Phone",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: "status" as keyof Customer,
      label: "Status",
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    {
      key: "totalSpent" as keyof Customer,
      label: "Total Spent",
      render: (value: number) => (
        <div className="font-semibold text-primary">${value}</div>
      )
    },
    {
      key: "totalBookings" as keyof Customer,
      label: "Bookings",
      render: (value: number) => (
        <div className="text-center">{value}</div>
      )
    },
    {
      key: "lastVisit" as keyof Customer,
      label: "Last Visit",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <DataTable
        data={customers}
        columns={columns}
        pagination={pagination}
        title="Customer Management"
        subtitle="Manage customer accounts and track their activity"
        searchable
        searchPlaceholder="Search customers by name or email..."
        onPageChange={(page) => setPagination({...pagination, currentPage: page})}
        onPageSizeChange={(pageSize) => setPagination({...pagination, itemsPerPage: pageSize})}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                Customer registration form would go here
              </div>
            </DialogContent>
          </Dialog>
        }
        rowActions={(customer) => (
          <>
            <Select 
              value={customer.status} 
              onValueChange={(value: "active" | "inactive" | "vip") => updateCustomerStatus(customer.id, value)}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </>
        )}
      />
    </div>
  );
}