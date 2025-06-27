import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, MapPin, User, Plus, Search, RotateCcw, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { BookingModal } from "@/components/user/BookingModal";
import { ReviewModal } from "@/components/user/ReviewModal";
import { reviewStore } from "@/lib/review-store";

const UserAppointments = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForBooking, setSelectedAppointmentForBooking] = useState<any>(null);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<any>(null);

  // Mock appointment data - replace with API calls
  const appointments = [
    {
      id: 1,
      service: "Hair Styling",
      stylist: "Sarah Johnson",
      date: "2024-01-20",
      time: "10:00 AM",
      duration: 60,
      location: "Main Salon",
      status: "confirmed",
      price: 50,
    },
    {
      id: 2,
      service: "Facial Treatment",
      stylist: "Maria Garcia",
      date: "2024-01-25",
      time: "2:00 PM",
      duration: 90,
      location: "Spa Room 1",
      status: "pending",
      price: 80,
    },
    {
      id: 3,
      service: "Manicure",
      stylist: "Lisa Chen",
      date: "2024-01-15",
      time: "3:30 PM",
      duration: 45,
      location: "Nail Station",
      status: "completed",
      price: 35,
    },
    {
      id: 4,
      service: "Hair Coloring",
      stylist: "Emma Wilson",
      date: "2024-01-10",
      time: "9:00 AM",
      duration: 180,
      location: "Color Room",
      status: "cancelled",
      price: 150,
    },
  ];

  // Mock available services for booking
  const services = [
    { id: 1, name: "Hair Styling", price: 50, duration: 60 },
    { id: 2, name: "Facial Treatment", price: 80, duration: 90 },
    { id: 3, name: "Manicure", price: 35, duration: 45 },
    { id: 4, name: "Pedicure", price: 45, duration: 60 },
    { id: 5, name: "Hair Coloring", price: 150, duration: 180 },
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const stylists = [
    "Sarah Johnson", "Maria Garcia", "Lisa Chen", "Emma Wilson", "Kate Brown"
  ];

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.stylist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "pending": return "secondary";
      case "completed": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const handleBookAppointment = (formData: any) => {
    // TODO: Implement booking API call
    toast({
      title: "Appointment Booked",
      description: "Your appointment has been successfully booked!",
    });
  };

  const handleCancelAppointment = (appointmentId: number) => {
    // TODO: Implement cancel API call
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled.",
      variant: "destructive",
    });
  };

  const handleRescheduleAppointment = (appointmentId: number) => {
    // TODO: Implement reschedule functionality
    toast({
      title: "Reschedule Requested",
      description: "Please select a new date and time.",
    });
  };

  const handleBookAgain = (appointment: any) => {
    // Convert appointment to service format for booking modal
    const serviceForBooking = {
      id: appointment.id,
      name: appointment.service,
      price: appointment.price,
      duration: appointment.duration,
      category: "general", // Default category
    };
    setSelectedAppointmentForBooking(serviceForBooking);
    setIsBookingModalOpen(true);
  };

  const handleLeaveReview = (appointment: any) => {
    setSelectedAppointmentForReview(appointment);
    setIsReviewModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedAppointmentForBooking(null);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedAppointmentForReview(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and schedule new appointments
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Book New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - ${service.price} ({service.duration}min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stylist">Preferred Stylist</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stylist" />
                  </SelectTrigger>
                  <SelectContent>
                    {stylists.map((stylist) => (
                      <SelectItem key={stylist} value={stylist}>
                        {stylist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => handleBookAppointment({})} className="w-full">
                Book Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{appointment.service}</h3>
                    <Badge variant={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {appointment.stylist}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {appointment.time} ({appointment.duration}min)
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {appointment.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-2xl font-bold text-primary">
                    ${appointment.price}
                  </div>
                  
                  {appointment.status === "confirmed" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRescheduleAppointment(appointment.id)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  {appointment.status === "pending" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </Button>
                  )}
                  
                  {appointment.status === "completed" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleBookAgain(appointment)}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Book Again
                      </Button>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleLeaveReview(appointment)}
                        disabled={!!reviewStore.getReviewByAppointment(appointment.id.toString())}
                      >
                        <Star className="w-4 h-4" />
                        {reviewStore.getReviewByAppointment(appointment.id.toString()) ? "Reviewed" : "Leave Review"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">No appointments found.</div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedAppointmentForBooking && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          service={selectedAppointmentForBooking}
        />
      )}

      {/* Review Modal */}
      {selectedAppointmentForReview && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          appointment={selectedAppointmentForReview}
        />
      )}
    </div>
  );
};

export default UserAppointments;