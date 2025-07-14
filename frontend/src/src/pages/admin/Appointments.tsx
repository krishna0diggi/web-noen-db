import { useState, useEffect } from "react";
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
import { appointmentsAdmin, updateAppointmentStatus } from "@/service/appoinmentService/appoinmentService";
import { motion, AnimatePresence } from "framer-motion";

// New appointment type for new data structure
interface Service {
  name: string;
  price: number;
  durationInMinutes: number;
}

interface Appointment {
  id: number;
  userId: number;
  userName: string;
  date: string;
  time: string;
  totalAmount: string;
  status: string;
  services: Service[];
  userPhone?: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "completed" | "cancelled">("all");
  const { toast } = useToast();

  // Fetch appointments from API when filter changes
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        let data;
        if (filter === "all") {
          // No filter param for 'all'
          data = await appointmentsAdmin("");
        } else {
          data = await appointmentsAdmin(filter.toLowerCase());
        }
        setAppointments(data || []);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch appointments.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filter, toast]);

  const handleAddAppointment = (newAppointment: Partial<Appointment>) => {
    const appointment: Appointment = {
      id: Date.now(),
      userId: newAppointment.userId || 0,
      userName: newAppointment.userName || "",
      date: newAppointment.date || "",
      time: newAppointment.time || "",
      totalAmount: newAppointment.totalAmount || "0",
      status: newAppointment.status || "Pending",
      services: newAppointment.services || [],
      userPhone: newAppointment.userPhone || ""
    };
    setAppointments([...appointments, appointment]);
    setIsDialogOpen(false);
    toast({
      title: "Appointment Created",
      description: `New appointment for ${appointment.userName} has been scheduled.`,
    });
  };

  const handleEditAppointment = (id: number, updatedAppointment: Partial<Appointment>) => {
    const appointment = appointments.find(apt => apt.id === id);
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
    ));
    setEditingAppointment(null);
    setIsDialogOpen(false);
    toast({
      title: "Appointment Updated",
      description: `Appointment for ${appointment?.userName} has been updated.`,
    });
  };

  const handleDeleteAppointment = (id: number) => {
    const appointment = appointments.find(apt => apt.id === id);
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    toast({
      title: "Appointment Deleted",
      description: `Appointment for ${appointment?.userName} has been cancelled.`,
      variant: "destructive",
    });
  };

  const handleStatusChange = async (id: number, status: Appointment["status"]) => {
    const appointment = appointments.find(apt => apt.id === id);
    setLoading(true);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(appointments.map(appointment => 
        appointment.id === id ? { ...appointment, status } : appointment
      ));
      toast({
        title: "Status Updated",
        description: `Appointment for ${appointment?.userName} marked as ${status}.`,
      });
    } catch (error) {
      toast({ title: "Error", description: `Failed to update status for appointment ${id}.`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-300";
      case "completed":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
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
        filtered = appointments.filter(apt => apt.status.toLowerCase() === "completed");
        break;
      case "cancelled":
        filtered = appointments.filter(apt => apt.status.toLowerCase() === "cancelled");
        break;
      default:
        filtered = appointments;
    }
    // Search filter removed
    return filtered;
  })();

  // --- Update AppointmentForm to match new structure ---
  const AppointmentForm = ({ appointment, onSubmit, onCancel }: {
    appointment?: Appointment | null;
    onSubmit: (appointment: Partial<Appointment>) => void;
    onCancel: () => void;
  }) => {
    // Only userName, userPhone, date, time, status, and services[]
    const [formData, setFormData] = useState({
      userName: appointment?.userName || "",
      userPhone: appointment?.userPhone || "",
      date: appointment?.date || "",
      time: appointment?.time || "",
      status: appointment?.status || "Pending",
      services: appointment?.services || [],
    });
    // For demo, allow adding a single service (could be extended to multiple)
    const [service, setService] = useState({ name: "", price: 0, durationInMinutes: 0 });

    const handleAddService = () => {
      if (service.name && service.price && service.durationInMinutes) {
        setFormData({ ...formData, services: [...formData.services, { ...service }] });
        setService({ name: "", price: 0, durationInMinutes: 0 });
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Calculate totalAmount as string
      const totalAmount = formData.services.reduce((sum, s) => sum + s.price, 0).toFixed(2);
      onSubmit({ ...formData, totalAmount });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="userName">Customer Name</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="userPhone">Phone</Label>
            <Input
              id="userPhone"
              value={formData.userPhone}
              onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g., 10:00 AM"
              required
            />
          </div>
        </div>
        <div>
          <Label>Services</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Service Name"
              value={service.name}
              onChange={e => setService({ ...service, name: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={service.price}
              onChange={e => setService({ ...service, price: Number(e.target.value) })}
            />
            <Input
              placeholder="Duration (min)"
              type="number"
              value={service.durationInMinutes}
              onChange={e => setService({ ...service, durationInMinutes: Number(e.target.value) })}
            />
            <Button type="button" onClick={handleAddService}>Add</Button>
          </div>
          <ul className="list-disc pl-5">
            {formData.services.map((s, i) => (
              <li key={i}>{s.name} - ₹{s.price} ({s.durationInMinutes} min)</li>
            ))}
          </ul>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={value => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
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
         
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === "today" ? "default" : "outline"}
            onClick={() => setFilter("today")}
            size="sm"
          >
            Today
          </Button>
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
            size="sm"
          >
            Upcoming
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            size="sm"
          >
            Completed
          </Button>
          <Button
            variant={filter === "cancelled" ? "default" : "outline"}
            onClick={() => setFilter("cancelled")}
            size="sm"
          >
            Cancelled
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          Loading...
        </div>
      ) : viewMode === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle>Appointments Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service(s)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredAppointments.map((appointment, idx) => {
                    const totalDuration = appointment.services.reduce((sum, s) => sum + s.durationInMinutes, 0);
                    return (
                      <motion.tr
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: idx * 0.07 }}
                      >
                        <TableCell>{appointment.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{appointment.userName}</p>
                            <p className="text-sm text-muted-foreground">{appointment.userPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4">
                            {appointment.services.map((s, i) => (
                              <li key={i}>{s.name}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{totalDuration} min</TableCell>
                        <TableCell>₹{appointment.totalAmount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)} variant="secondary">
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {appointment.status.toLowerCase() === "pending" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStatusChange(appointment.id, "Confirmed")}
                                  title="Confirm"
                                >
                                  <CheckCircle className="w-4 h-4 text-success" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStatusChange(appointment.id, "Cancelled")}
                                  title="Cancel"
                                >
                                  <XCircle className="w-4 h-4 text-destructive" />
                                </Button>
                              </>
                            )}
                            {appointment.status.toLowerCase() === "confirmed" && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStatusChange(appointment.id, "Completed")}
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
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAppointments.map((appointment, idx) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: idx * 0.07 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                            {appointment.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{appointment.userName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{appointment.services.map(s => s.name).join(", ")}</p>
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
                        <span className="truncate">{appointment.userPhone}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Duration: </span>
                        <span className="font-medium">{appointment.services.reduce((sum, service) => sum + service.durationInMinutes, 0)} min</span>
                      </div>
                      <div className="font-semibold text-lg">${appointment.totalAmount}</div>
                    </div>
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
                      {appointment.status === "Pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(appointment.id, "Confirmed")}
                        >
                          Confirm
                        </Button>
                      )}
                      {appointment.status === "Confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(appointment.id, "Completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}