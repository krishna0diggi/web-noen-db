import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, CheckCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  duration: z.number().min(1, "Minimum 1 hour").max(4, "Maximum 4 hours").default(1),
  preferences: z.string().optional(),
  whatsapp: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: number;
    name: string;
    price: number;
    duration: number;
    category: string;
  };
}

export const BookingModal = ({ isOpen, onClose, service }: BookingModalProps) => {
  console.log(isOpen);
  console.log(onClose);
  console.log(service);
  
  
  
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const getAvailableTimeSlots = (date: Date) => {
    const slots = [
      { time: "09:00", available: true },
      { time: "09:30", available: false },
      { time: "10:00", available: true },
      { time: "10:30", available: true },
      { time: "11:00", available: false },
      { time: "11:30", available: true },
      { time: "14:00", available: true },
      { time: "14:30", available: true },
      { time: "15:00", available: false },
      { time: "15:30", available: true },
      { time: "16:00", available: true },
      { time: "16:30", available: true },
    ];
    return slots;
  };

  const availableSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : [];
  const filteredSlots = availableSlots;

  const onSubmit = (data: BookingFormData) => {
    const originalPrice = service.price;
    const finalPrice = originalPrice;

    const bookingData = {
      bookingId: `BK${Date.now()}`,
      service: {
        id: service.id,
        name: service.name,
        originalPrice: originalPrice,
        discountedPrice: finalPrice,
        duration: data.duration,
        category: service.category,
      },
      discount: null,
      appointment: {
        date: format(data.date, "yyyy-MM-dd"),
        timeSlot: data.timeSlot,
        duration: data.duration,
        preferences: data.preferences || "",
        whatsapp: data.whatsapp || "",
      },
      customer: {
        id: "user123",
        name: "Current User",
        email: "user@example.com",
      },
      pricing: {
        originalPrice: originalPrice,
        discountAmount: 0,
        finalPrice: finalPrice,
        savings: 0
      },
      status: "pending",
      totalCost: finalPrice,
      createdAt: new Date().toISOString(),
    };

    console.log("Booking JSON Response:", JSON.stringify(bookingData, null, 2));

    toast({
      title: "Booking Request Submitted!",
      description: `Your appointment for ₹${service.name} has been requested. Total: ₹${finalPrice}`,
    });

    form.reset();
    setSelectedDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Book Your Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Service Details & Special Preferences */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {service.category}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">₹{service.price}</div>
                  </div>
                  <div className="flex justify-center items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Special Preferences (moved here, but still inside Form context) */}
            <Form {...form}>
              <Card>
                <CardHeader>
                  <CardTitle>Special Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="preferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Any specific requests or preferences?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., specific hair color, skin sensitivity, nail design preferences..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* WhatsApp Communication Field */}
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>WhatsApp Number (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter WhatsApp number for communication (e.g. +1234567890)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-muted-foreground mt-1">
                          If provided, you can interact with the expert or admin via WhatsApp about scheduling, timing, and more.
                        </div>
                        {/* WhatsApp Inquiry Shortcut */}
                        <div className="mt-3 flex items-center gap-2">
                          <a
                            href="https://wa.me/1234567890?text=I%20wanted%20to%20book%20the%20service%20at%20LooksNLove%20Salon."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-green-600 hover:underline text-sm"
                          >
                            <Phone className="w-4 h-4" />
                            WhatsApp Admin: Inquiry / Book Instantly
                          </a>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </Form>
          </motion.div>
          {/* Right: Booking Form (without preferences/whatsapp) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Date Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Select Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setSelectedDate(date);
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                {/* Time Slot Selection */}
                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Available Time Slots
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="timeSlot"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-2">
                                {filteredSlots.map((slot) => (
                                  <Button
                                    key={slot.time}
                                    type="button"
                                    variant={field.value === slot.time ? "default" : "outline"}
                                    disabled={!slot.available}
                                    className={cn(
                                      "h-10",
                                      !slot.available && "opacity-50 cursor-not-allowed"
                                    )}
                                    onClick={() => field.onChange(slot.time)}
                                  >
                                    {slot.time}
                                  </Button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}
                {/* Duration Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (hours)</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value?.toString() || "1"}
                              onValueChange={val => field.onChange(Number(val))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1,2,3,4].map(h => (
                                  <SelectItem key={h} value={h.toString()}>{h} hour{h > 1 ? 's' : ''}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <span>Book Appointment</span>
                    <Badge variant="secondary">
                      ₹{service.price}
                    </Badge>
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};