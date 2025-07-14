import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, MapPin, User, Trash2, Plus, Minus, CreditCard, Calendar, RotateCcw, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookingModal } from "@/components/user/BookingModal";
import { ReviewModal } from "@/components/user/ReviewModal";
import { reviewStore } from "@/lib/review-store";
import { Link } from "react-router-dom";

const UserCart = () => {
  const { toast } = useToast();

  // Modal state for Book Again and Leave Review
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForBooking, setSelectedAppointmentForBooking] = useState<any>(null);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<any>(null);

  // Mock cart data - replace with state management/API
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      service: "Hair Styling",
      price: 50,
      duration: 60,
      quantity: 1,
      date: "2024-01-25",
      time: "10:00 AM",
      stylist: "Sarah Johnson",
      location: "Main Salon",
    },
    {
      id: 2,
      service: "Facial Treatment",
      price: 80,
      duration: 90,
      quantity: 1,
      date: "2024-01-25",
      time: "2:00 PM",
      stylist: "Maria Garcia",
      location: "Spa Room 1",
    },
  ]);

  // Mock booking history - replace with API calls
  const bookingHistory = [
    {
      id: 1,
      service: "Manicure",
      date: "2024-01-15",
      time: "3:30 PM",
      duration: 45,
      stylist: "Lisa Chen",
      location: "Nail Station",
      price: 35,
      status: "completed",
      rating: 5,
    },
    {
      id: 2,
      service: "Hair Coloring",
      date: "2024-01-10",
      time: "9:00 AM",
      duration: 180,
      stylist: "Emma Wilson",
      location: "Color Room",
      price: 150,
      status: "completed",
      rating: 4,
    },
    {
      id: 3,
      service: "Facial Treatment",
      date: "2023-12-20",
      time: "11:00 AM",
      duration: 90,
      stylist: "Maria Garcia",
      location: "Spa Room 1",
      price: 80,
      status: "completed",
      rating: 5,
    },
  ];

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Service has been removed from your cart.",
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalDuration = () => {
    return cartItems.reduce((total, item) => total + (item.duration * item.quantity), 0);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality with payment API
    toast({
      title: "Checkout Started",
      description: "Redirecting to payment...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const handleBookAgain = (booking: any) => {
    // Convert booking to service format for booking modal
    const serviceForBooking = {
      id: booking.id,
      name: booking.service,
      price: booking.price,
      duration: booking.duration,
      category: "general", // Default category
    };
    setSelectedAppointmentForBooking(serviceForBooking);
    setIsBookingModalOpen(true);
  };

  const handleLeaveReview = (booking: any) => {
    setSelectedAppointmentForReview(booking);
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Cart & History
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Review your selected services and booking history
        </p>
      </div>

      <Tabs defaultValue="cart" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12 sm:h-10">
          <TabsTrigger value="cart" className="gap-1 sm:gap-2 text-sm sm:text-base">
            <Plus className="w-4 h-4" />
            <span className="truncate">Cart ({cartItems.length})</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1 sm:gap-2 text-sm sm:text-base">
            <Calendar className="w-4 h-4" />
            <span className="truncate">History ({bookingHistory.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cart" className="space-y-4 sm:space-y-6">
          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-4">
                        {/* Service Info */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg sm:text-xl font-semibold pr-2">{item.service}</h3>
                            <div className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
                              ₹{item.price}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{item.stylist}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                              <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>{item.time} ({item.duration}min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 sm:h-8 sm:w-8"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 sm:h-8 sm:w-8"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="gap-2 h-9"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <Card className="lg:sticky lg:top-8">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span>Services ({cartItems.length})</span>
                        <span className="font-medium">₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span>Total Duration</span>
                        <span className="font-medium">{calculateTotalDuration()}min</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg sm:text-xl">
                        <span>Total</span>
                        <span className="text-primary">₹{calculateTotal()}</span>
                      </div>
                    </div>
                    
                    <Button onClick={handleCheckout} className="w-full gap-2 h-11 sm:h-12 text-base" size="lg">
                      <CreditCard className="w-5 h-5" />
                      Proceed to Checkout
                    </Button>

                    <div className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                      You can modify or cancel your booking up to 24 hours before your appointment.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-4">Your cart is empty</div>
                <Button asChild>
                  <Link to="/user/services">Browse Services</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {bookingHistory.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header with service, status, and rating */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg sm:text-xl font-semibold pr-2">{booking.service}</h3>
                        <div className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
                          ₹{booking.price}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={getStatusColor(booking.status)} className="text-xs">
                          {booking.status}
                        </Badge>
                        {booking.rating && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            {"★".repeat(booking.rating)}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({booking.rating}/5)
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{booking.stylist}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{booking.time} ({booking.duration}min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{booking.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {booking.status === "completed" && (
                      <div className="pt-2 border-t">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2 h-9 flex-1 sm:flex-none"
                            onClick={() => handleBookAgain(booking)}
                          >
                            <RotateCcw className="w-4 h-4" />
                            Book Again
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2 h-9 flex-1 sm:flex-none"
                            onClick={() => handleLeaveReview(booking)}
                            disabled={!!reviewStore.getReviewByAppointment(booking.id.toString())}
                          >
                            <Star className="w-4 h-4" />
                            {reviewStore.getReviewByAppointment(booking.id.toString()) ? "Reviewed" : "Leave Review"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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

export default UserCart;