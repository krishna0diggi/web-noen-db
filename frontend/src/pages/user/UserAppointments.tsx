import { useEffect, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { getAppointmentByUserId } from "@/service/appoinmentService/appoinmentService";
import { motion, AnimatePresence } from "framer-motion";

const UserAppointments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForBooking, setSelectedAppointmentForBooking] = useState<any>(null);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<any>(null);

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

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getAppointmentByUserId(user.id);
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user?.id]);

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
            {/* <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Book New Appointment
            </Button> */}
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
                        {service.name} - ₹{service.price} ({service.duration}min)
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

      {/* Appointments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-8">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No appointments found.</div>
        ) : (
          <AnimatePresence>
            {[...appointments].reverse().map((appointment, idx) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: idx * 0.07 }}
              >
                <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/40 bg-card/90">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Left: Appointment Info */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground">Appointment #</span>
                        <span className="text-sm font-bold text-primary">{idx + 1}</span>
                        <Badge variant={getStatusColor(appointment.status?.toLowerCase())} className="capitalize">
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time} <span className="ml-1">({appointment.duration})</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="font-semibold mb-1">Services Booked:</div>
                        <ul className="divide-y divide-border bg-muted/40 rounded-lg overflow-hidden">
                          {appointment.services?.map((service: any, idx: number) => (
                            <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2">
                              <span className="font-medium text-foreground">{service.name}</span>
                              <span className="text-xs text-muted-foreground mt-1 sm:mt-0">
                                ₹{service.price} • {service.durationInMinutes} min
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/* Right: Actions & Total */}
                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                      <div className="text-lg font-bold text-primary mb-1">Total: ₹{appointment.totalAmount}</div>
                      {appointment.status?.toLowerCase() === "confirmed" && (
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
                      {appointment.status?.toLowerCase() === "pending" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {appointment.status?.toLowerCase() === "completed" && (
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
                            disabled={!!reviewStore.getReviewByAppointment(appointment.id?.toString())}
                          >
                            <Star className="w-4 h-4" />
                            {reviewStore.getReviewByAppointment(appointment.id?.toString()) ? "Reviewed" : "Leave Review"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>



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