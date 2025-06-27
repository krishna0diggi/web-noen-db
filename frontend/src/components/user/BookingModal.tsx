import { useState, useEffect, useMemo } from "react";
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
import { CalendarIcon, Clock, User, Star, CheckCircle, Percent, Gift, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { discountStore, type Discount } from "@/lib/discount-store";

const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  expert: z.string({
    required_error: "Please select an expert",
  }),
  preferences: z.string().optional(),
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
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [applicableDiscounts, setApplicableDiscounts] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // Check for applicable discounts when modal opens
  useEffect(() => {
    if (isOpen) {
      const activeDiscounts = discountStore.getActiveDiscounts();
      
      // Filter discounts applicable to this service
      const applicable = activeDiscounts.filter(discount => {
        // Check if discount applies to this service
        return discount.applicableServices.includes('All Services') ||
               discount.applicableServices.includes(service.name);
      });
      
      setApplicableDiscounts(applicable);
      
      // Auto-select the best discount (highest value)
      if (applicable.length > 0) {
        const bestDiscount = applicable.reduce((best, current) => {
          const bestValue = best.discountType === 'percentage' ? best.discountValue : (best.discountValue / service.price) * 100;
          const currentValue = current.discountType === 'percentage' ? current.discountValue : (current.discountValue / service.price) * 100;
          return currentValue > bestValue ? current : best;
        });
        setSelectedDiscount(bestDiscount);
      }
    }
  }, [isOpen, service]);

  // Calculate pricing with discount
  const pricing = useMemo(() => {
    const originalPrice = service.price;
    let discountedPrice = originalPrice;
    let savings = 0;

    if (selectedDiscount) {
      if (selectedDiscount.discountType === 'percentage') {
        discountedPrice = originalPrice * (1 - selectedDiscount.discountValue / 100);
        savings = originalPrice - discountedPrice;
      } else {
        discountedPrice = Math.max(0, originalPrice - selectedDiscount.discountValue);
        savings = originalPrice - discountedPrice;
      }
    }

    return {
      originalPrice,
      discountedPrice: Math.round(discountedPrice * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      hasDiscount: selectedDiscount !== null
    };
  }, [service.price, selectedDiscount]);

  // Calculate remaining time for discount
  const getTimeRemaining = (validUntil: string) => {
    const now = new Date();
    const endDate = new Date(validUntil);
    const timeDiff = endDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return null;
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return "Less than 1 hour left";
  };

  // Mock data - replace with API calls
  const experts = [
    {
      id: 0,
      name: "Any Expert",
      speciality: "System will assign the best available expert",
      rating: 4.8,
      experience: "Auto-assign",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      isDefault: true
    },
    {
      id: 1,
      name: "Sarah Johnson",
      speciality: "Hair Styling & Coloring",
      rating: 4.9,
      experience: "8 years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Maria Garcia",
      speciality: "Skincare & Facial Treatments",
      rating: 4.8,
      experience: "6 years",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Thompson",
      speciality: "Nail Art & Manicure",
      rating: 4.7,
      experience: "5 years",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    },
  ];

  // Mock available time slots based on selected date
  const getAvailableTimeSlots = (date: Date) => {
    const slots = [
      { time: "09:00", available: true, expertId: 1 },
      { time: "09:30", available: false, expertId: 1 },
      { time: "10:00", available: true, expertId: 1 },
      { time: "10:30", available: true, expertId: 2 },
      { time: "11:00", available: false, expertId: 2 },
      { time: "11:30", available: true, expertId: 2 },
      { time: "14:00", available: true, expertId: 3 },
      { time: "14:30", available: true, expertId: 3 },
      { time: "15:00", available: false, expertId: 3 },
      { time: "15:30", available: true, expertId: 1 },
      { time: "16:00", available: true, expertId: 2 },
      { time: "16:30", available: true, expertId: 3 },
    ];
    return slots;
  };

  const availableSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : [];
  const selectedExpert = form.watch("expert");
  const filteredSlots = selectedExpert && selectedExpert !== "0"
    ? availableSlots.filter(slot => slot.expertId === parseInt(selectedExpert))
    : availableSlots;

  const onSubmit = (data: BookingFormData) => {
    const originalPrice = service.price;
    const finalPrice = pricing.hasDiscount ? pricing.discountedPrice : originalPrice;
    const discountAmount = pricing.hasDiscount ? pricing.savings : 0;

    const bookingData = {
      bookingId: `BK${Date.now()}`,
      service: {
        id: service.id,
        name: service.name,
        originalPrice: originalPrice,
        discountedPrice: finalPrice,
        duration: service.duration,
        category: service.category,
      },
      discount: selectedDiscount ? {
        id: selectedDiscount.id,
        name: selectedDiscount.name,
        type: selectedDiscount.discountType,
        value: selectedDiscount.discountValue,
        savings: discountAmount,
        description: selectedDiscount.description
      } : null,
      appointment: {
        date: format(data.date, "yyyy-MM-dd"),
        timeSlot: data.timeSlot,
        expert: experts.find(exp => exp.id === parseInt(data.expert)),
        preferences: data.preferences || "",
      },
      customer: {
        // This would come from auth context in real app
        id: "user123",
        name: "Current User",
        email: "user@example.com",
      },
      pricing: {
        originalPrice: originalPrice,
        discountAmount: discountAmount,
        finalPrice: finalPrice,
        savings: discountAmount
      },
      status: "pending",
      totalCost: finalPrice,
      createdAt: new Date().toISOString(),
    };

    // Log the JSON response for backend integration
    console.log("Booking JSON Response:", JSON.stringify(bookingData, null, 2));
    
    const discountMessage = selectedDiscount 
      ? ` with ${selectedDiscount.name} discount (Save $${discountAmount})`
      : '';
    
    toast({
      title: "Booking Request Submitted!",
      description: `Your appointment for ${service.name}${discountMessage} has been requested. Total: $${finalPrice}`,
    });

    // Reset form and close modal
    form.reset();
    setSelectedDate(undefined);
    setSelectedDiscount(null);
    setApplicableDiscounts([]);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
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
                
                {/* Pricing with Discount */}
                <div className="space-y-3">
                  {pricing.hasDiscount ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                    >
                      <div className="text-sm text-muted-foreground mb-1">Original Price</div>
                      <div className="text-lg line-through text-muted-foreground">${pricing.originalPrice}</div>
                      <div className="text-xs text-muted-foreground mb-2">minus discount</div>
                      <div className="text-3xl font-bold text-green-600 mb-2">${pricing.discountedPrice}</div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold">
                        💰 You Save ${pricing.savings}!
                      </Badge>
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">${service.price}</div>
                    </div>
                  )}
                  
                  <div className="flex justify-center items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} minutes</span>
                  </div>
                  
                  {/* Active Discount Display */}
                  {selectedDiscount && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-3 rounded-lg border",
                        selectedDiscount.isFestival 
                          ? "border-orange-200 bg-orange-50" 
                          : "border-green-200 bg-green-50"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {selectedDiscount.isFestival ? (
                          <Gift className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Percent className="w-4 h-4 text-green-600" />
                        )}
                        <span className="font-medium text-sm">
                          {selectedDiscount.name} Applied!
                        </span>
                        {selectedDiscount.isFestival && (
                          <Badge variant="secondary" className="text-xs">🎊 Festival</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {selectedDiscount.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Timer className="w-3 h-3" />
                        <span className="text-orange-600 font-medium">
                          {getTimeRemaining(selectedDiscount.validUntil) || "Expires soon"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expert Selection */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Choose Your Expert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="expert"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-3">
                            {experts.map((expert) => (
                              <motion.div
                                key={expert.id}
                                whileHover={{ scale: 1.02 }}
                                className={cn(
                                  "p-4 rounded-lg border cursor-pointer transition-all",
                                  field.value === expert.id.toString()
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                )}
                                onClick={() => field.onChange(expert.id.toString())}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={expert.image}
                                    alt={expert.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium">{expert.name}</h4>
                                    <p className="text-sm text-muted-foreground">{expert.speciality}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs">{expert.rating}</span>
                                      </div>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <span className="text-xs text-muted-foreground">{expert.experience}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
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
                              <div className="grid grid-cols-3 gap-2">
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

                {/* Special Preferences */}
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
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <span>Book Appointment</span>
                    {pricing.hasDiscount ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ${pricing.discountedPrice}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        ${service.price}
                      </Badge>
                    )}
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