import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Calendar, User, DollarSign, Clock, Eye, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customerName: string;
  services: string[];
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  date: string;
  time: string;
  paymentStatus: "paid" | "pending" | "failed";
}

export default function OrdersManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "Sarah Johnson",
      services: ["Hair Styling", "Facial Treatment"],
      totalAmount: 130,
      status: "confirmed",
      date: "2024-01-25",
      time: "10:00 AM",
      paymentStatus: "paid"
    },
    {
      id: "ORD-002",
      customerName: "Mike Chen",
      services: ["Manicure & Pedicure"],
      totalAmount: 35,
      status: "pending",
      date: "2024-01-26",
      time: "2:00 PM",
      paymentStatus: "pending"
    },
    {
      id: "ORD-003",
      customerName: "Emily Davis",
      services: ["Bridal Package", "Hair Coloring"],
      totalAmount: 320,
      status: "completed",
      date: "2024-01-23",
      time: "9:00 AM",
      paymentStatus: "paid"
    }
  ]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 2,
    totalItems: 15,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPreviousPage: false,
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "confirmed": return "secondary";
      case "pending": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getPaymentVariant = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  const updateOrderStatus = (id: string, newStatus: "pending" | "confirmed" | "completed" | "cancelled") => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Order Updated",
      description: "Order status has been updated successfully.",
    });
  };

  const columns = [
    {
      key: "id" as keyof Order,
      label: "Order ID",
      render: (value: string) => (
        <div className="font-mono font-medium">{value}</div>
      ),
      width: "120px"
    },
    {
      key: "customerName" as keyof Order,
      label: "Customer",
      render: (value: string, row: Order) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(row.date).toLocaleDateString()} at {row.time}
          </div>
        </div>
      ),
      width: "200px"
    },
    {
      key: "services" as keyof Order,
      label: "Services",
      render: (value: string[]) => (
        <div className="space-y-1">
          {value.map((service, index) => (
            <Badge key={index} variant="outline" className="text-xs mr-1">
              {service}
            </Badge>
          ))}
        </div>
      ),
      width: "250px"
    },
    {
      key: "totalAmount" as keyof Order,
      label: "Amount",
      render: (value: number) => (
        <div className="font-semibold text-lg">${value}</div>
      ),
      width: "100px"
    },
    {
      key: "status" as keyof Order,
      label: "Status",
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)}>
          {value.toUpperCase()}
        </Badge>
      ),
      width: "120px"
    },
    {
      key: "paymentStatus" as keyof Order,
      label: "Payment",
      render: (value: string) => (
        <Badge variant={getPaymentVariant(value)}>
          {value.toUpperCase()}
        </Badge>
      ),
      width: "100px"
    }
  ];

  return (
    <div className="p-6">
      <DataTable
        data={orders}
        columns={columns}
        pagination={pagination}
        title="Orders Management"
        subtitle="Manage customer orders and appointments"
        searchable
        searchPlaceholder="Search orders by ID or customer name..."
        onPageChange={(page) => setPagination({...pagination, currentPage: page})}
        onPageSizeChange={(pageSize) => setPagination({...pagination, itemsPerPage: pageSize})}
        rowActions={(order) => (
          <>
            <Select 
              value={order.status} 
              onValueChange={(value: "pending" | "confirmed" | "completed" | "cancelled") => updateOrderStatus(order.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Order Details - {order.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Customer Information</h4>
                    <p>{order.customerName}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Services</h4>
                    <ul className="list-disc list-inside">
                      {order.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Total Amount</h4>
                    <p className="text-2xl font-bold">${order.totalAmount}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {order.status === "pending" && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => updateOrderStatus(order.id, "confirmed")}
                  className="gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                  className="gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </Button>
              </>
            )}
          </>
        )}
      />
    </div>
  );
}