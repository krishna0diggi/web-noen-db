import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Clock, User, Phone, Mail, Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  notes?: string;
}

const initialAppointments: Appointment[] = [
  // Today's appointments
  {
    id: "1",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@email.com",
    customerPhone: "+1 (555) 123-4567",
    customerAvatar: "SJ",
    service: "Hair Cut & Style",
    date: "2024-06-12",
    time: "10:00 AM",
    duration: "60 min",
    price: 85,
    status: "confirmed",
    notes: "Client prefers layers and wants to keep length"
  },
  {
    id: "2",
    customerName: "Emily Davis",
    customerEmail: "emily@email.com",
    customerPhone: "+1 (555) 234-5678",
    customerAvatar: "ED",
    service: "Manicure & Pedicure",
    date: "2024-06-12",
    time: "11:30 AM",
    duration: "90 min",
    price: 65,
    status: "pending",
  },
  {
    id: "3",
    customerName: "Maria Garcia",
    customerEmail: "maria@email.com",
    customerPhone: "+1 (555) 345-6789",
    customerAvatar: "MG",
    service: "Facial Treatment",
    date: "2024-06-12",
    time: "2:00 PM",
    duration: "75 min",
    price: 120,
    status: "confirmed",
  },
  {
    id: "4",
    customerName: "Jessica Brown",
    customerEmail: "jessica@email.com",
    customerPhone: "+1 (555) 567-8901",
    customerAvatar: "JB",
    service: "Hair Color & Highlights",
    date: "2024-06-12",
    time: "4:00 PM",
    duration: "120 min",
    price: 180,
    status: "pending",
    notes: "First time client, wants natural blonde highlights"
  },
  
  // Tomorrow's appointments
  {
    id: "5",
    customerName: "Lisa Wilson",
    customerEmail: "lisa@email.com",
    customerPhone: "+1 (555) 456-7890",
    customerAvatar: "LW",
    service: "Eyebrow Threading",
    date: "2024-06-13",
    time: "9:00 AM",
    duration: "30 min",
    price: 25,
    status: "confirmed",
  },
  {
    id: "6",
    customerName: "Amanda Taylor",
    customerEmail: "amanda@email.com",
    customerPhone: "+1 (555) 678-9012",
    customerAvatar: "AT",
    service: "Bridal Makeup",
    date: "2024-06-13",
    time: "1:00 PM",
    duration: "90 min",
    price: 200,
    status: "confirmed",
    notes: "Wedding is on Saturday, trial run needed"
  },
  {
    id: "7",
    customerName: "Rachel Green",
    customerEmail: "rachel@email.com",
    customerPhone: "+1 (555) 789-0123",
    customerAvatar: "RG",
    service: "Deep Conditioning Treatment",
    date: "2024-06-13",
    time: "3:30 PM",
    duration: "60 min",
    price: 75,
    status: "confirmed",
  },
  
  // Future appointments
  {
    id: "8",
    customerName: "Michelle Lee",
    customerEmail: "michelle@email.com",
    customerPhone: "+1 (555) 890-1234",
    customerAvatar: "ML",
    service: "Keratin Treatment",
    date: "2024-06-15",
    time: "10:00 AM",
    duration: "180 min",
    price: 250,
    status: "confirmed",
    notes: "Has fine hair, use gentle formula"
  },
  {
    id: "9",
    customerName: "Nicole White",
    customerEmail: "nicole@email.com",
    customerPhone: "+1 (555) 901-2345",
    customerAvatar: "NW",
    service: "Gel Manicure",
    date: "2024-06-16",
    time: "2:00 PM",
    duration: "45 min",
    price: 45,
    status: "pending",
  },
  {
    id: "10",
    customerName: "Sophia Martinez",
    customerEmail: "sophia@email.com",
    customerPhone: "+1 (555) 012-3456",
    customerAvatar: "SM",
    service: "Hair Cut & Blow Dry",
    date: "2024-06-18",
    time: "11:00 AM",
    duration: "75 min",
    price: 95,
    status: "confirmed",
  },
  
  // Past completed appointments
  {
    id: "11",
    customerName: "Diana Prince",
    customerEmail: "diana@email.com",
    customerPhone: "+1 (555) 123-9876",
    customerAvatar: "DP",
    service: "Full Facial Package",
    date: "2024-06-10",
    time: "1:00 PM",
    duration: "90 min",
    price: 150,
    status: "completed",
    notes: "Regular client, loves the hydrating mask"
  },
  {
    id: "12",
    customerName: "Emma Stone",
    customerEmail: "emma@email.com",
    customerPhone: "+1 (555) 234-9876",
    customerAvatar: "ES",
    service: "Pedicure Deluxe",
    date: "2024-06-09",
    time: "3:00 PM",
    duration: "60 min",
    price: 55,
    status: "completed",
  },
  {
    id: "13",
    customerName: "Olivia Davis",
    customerEmail: "olivia@email.com",
    customerPhone: "+1 (555) 345-9876",
    customerAvatar: "OD",
    service: "Hair Styling for Event",
    date: "2024-06-08",
    time: "4:00 PM",
    duration: "90 min",
    price: 120,
    status: "completed",
    notes: "Loved the updo style, wants to book again"
  },
  
  // Past cancelled appointments
  {
    id: "14",
    customerName: "Grace Kelly",
    customerEmail: "grace@email.com",
    customerPhone: "+1 (555) 456-9876",
    customerAvatar: "GK",
    service: "Hair Color Touch-up",
    date: "2024-06-07",
    time: "2:00 PM",
    duration: "90 min",
    price: 95,
    status: "cancelled",
    notes: "Client cancelled due to illness"
  },
  {
    id: "15",
    customerName: "Natalie Portman",
    customerEmail: "natalie@email.com",
    customerPhone: "+1 (555) 567-9876",
    customerAvatar: "NP",
    service: "Eyebrow Wax & Tint",
    date: "2024-06-05",
    time: "11:00 AM",
    duration: "45 min",
    price: 40,
    status: "cancelled",
  },
];

const services = [
  "Hair Cut & Style",
  "Manicure & Pedicure", 
  "Facial Treatment",
  "Hair Color & Highlights",
  "Eyebrow Threading",
  "Bridal Makeup",
  "Deep Conditioning Treatment",
  "Keratin Treatment",
  "Gel Manicure",
  "Hair Cut & Blow Dry",
  "Full Facial Package",
  "Pedicure Deluxe",
  "Hair Styling for Event",
  "Hair Color Touch-up",
  "Eyebrow Wax & Tint"
];

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleAddAppointment = (newAppointment: Partial<Appointment>) => {
    const appointment: Appointment = {
      id: Date.now().toString(),
      customerName: newAppointment.customerName || "",
      customerEmail: newAppointment.customerEmail || "",
      customerPhone: newAppointment.customerPhone || "",
      customerAvatar: newAppointment.customerName?.split(' ').map(n => n[0]).join('') || "UN",
      service: newAppointment.service || "",
      date: newAppointment.date || "",
      time: newAppointment.time || "",
      duration: newAppointment.duration || "",
      price: newAppointment.price || 0,
      status: newAppointment.status || "pending",
      notes: newAppointment.notes || "",
    };
    setAppointments([...appointments, appointment]);
    setIsDialogOpen(false);
    toast({
      title: "Appointment Created",
      description: `New appointment for ${appointment.customerName} has been scheduled.`,
    });
  };

  const handleEditAppointment = (id: string, updatedAppointment: Partial<Appointment>) => {
    const appointment = appointments.find(apt => apt.id === id);
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
    ));
    setEditingAppointment(null);
    setIsDialogOpen(false);
    toast({
      title: "Appointment Updated",
      description: `Appointment for ${appointment?.customerName} has been updated.`,
    });
  };

  const handleDeleteAppointment = (id: string) => {
    const appointment = appointments.find(apt => apt.id === id);
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    toast({
      title: "Appointment Deleted",
      description: `Appointment for ${appointment?.customerName} has been cancelled.`,
      variant: "destructive",
    });
  };

  const handleStatusChange = (id: string, status: Appointment["status"]) => {
    const appointment = appointments.find(apt => apt.id === id);
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
    toast({
      title: "Status Updated",
      description: `Appointment for ${appointment?.customerName} marked as ${status}.`,
    });
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      case "completed":
        return "bg-info text-info-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredAppointments = (() => {
    const today = new Date().toISOString().split('T')[0];
    
    let filtered = appointments;
    
    // Apply status/date filter
    switch (filter) {
      case "today":
        filtered = appointments.filter(apt => apt.date === today);
        break;
      case "upcoming":
        filtered = appointments.filter(apt => apt.date > today);
        break;
      case "completed":
        filtered = appointments.filter(apt => apt.status === "completed");
        break;
      case "cancelled":
        filtered = appointments.filter(apt => apt.status === "cancelled");
        break;
      default:
        filtered = appointments;
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(apt => 
        apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.customerPhone.includes(searchQuery)
      );
    }
    
    return filtered;
  })();

  const AppointmentForm = ({ appointment, onSubmit, onCancel }: {
    appointment?: Appointment | null;
    onSubmit: (appointment: Partial<Appointment>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      customerName: appointment?.customerName || "",
      customerEmail: appointment?.customerEmail || "",
      customerPhone: appointment?.customerPhone || "",
      service: appointment?.service || "",
      date: appointment?.date || "",
      time: appointment?.time || "",
      duration: appointment?.duration || "",
      price: appointment?.price || 0,
      status: appointment?.status || "pending" as Appointment["status"],
      notes: appointment?.notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              value={formData.customerPhone}
              onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="service">Service</Label>
            <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              placeholder="e.g., 10:00 AM"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g., 60 min"
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Appointment["status"]})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Add any special notes or requirements..."
            rows={3}
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {appointment ? "Update Appointment" : "Create Appointment"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments Management</h1>
          <p className="text-muted-foreground">Manage customer appointments and scheduling</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              Cards
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setEditingAppointment(null)}>
                <Plus className="w-4 h-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? "Edit Appointment" : "Create New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <AppointmentForm
                appointment={editingAppointment}
                onSubmit={editingAppointment 
                  ? (data) => handleEditAppointment(editingAppointment.id, data)
                  : handleAddAppointment
                }
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({appointments.length})
          </Button>
          <Button
            variant={filter === "today" ? "default" : "outline"}
            onClick={() => setFilter("today")}
            size="sm"
          >
            Today ({appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length})
          </Button>
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
            size="sm"
          >
            Upcoming ({appointments.filter(apt => apt.date > new Date().toISOString().split('T')[0]).length})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            size="sm"
          >
            Completed ({appointments.filter(apt => apt.status === "completed").length})
          </Button>
          <Button
            variant={filter === "cancelled" ? "default" : "outline"}
            onClick={() => setFilter("cancelled")}
            size="sm"
          >
            Cancelled ({appointments.filter(apt => apt.status === "cancelled").length})
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle>Appointments Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                            {appointment.customerAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{appointment.customerName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.customerEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{appointment.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell className="font-medium">${appointment.price}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)} variant="secondary">
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {appointment.status === "pending" && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "confirmed")}
                              title="Confirm"
                            >
                              <CheckCircle className="w-4 h-4 text-success" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "cancelled")}
                              title="Cancel"
                            >
                              <XCircle className="w-4 h-4 text-destructive" />
                            </Button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, "completed")}
                            title="Mark Complete"
                          >
                            <CheckCircle className="w-4 h-4 text-info" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingAppointment(appointment);
                            setIsDialogOpen(true);
                          }}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {appointment.customerAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{appointment.customerName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)} variant="secondary">
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="truncate">{appointment.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{appointment.customerPhone}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Duration: </span>
                    <span className="font-medium">{appointment.duration}</span>
                  </div>
                  <div className="font-semibold text-lg">${appointment.price}</div>
                </div>
                
                {appointment.notes && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setEditingAppointment(appointment);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                  {appointment.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(appointment.id, "confirmed")}
                    >
                      Confirm
                    </Button>
                  )}
                  {appointment.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(appointment.id, "completed")}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}