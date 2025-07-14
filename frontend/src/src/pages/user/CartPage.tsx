import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { bookAppointment } from "@/service/appoinmentService/appoinmentService";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart, getTotalAmount, getTotalDuration } = useCart();
  console.log(cart);
  
  const navigate = useNavigate();
  const { user } = useAuth ? useAuth() : { user: null };
  const isUserDashboard = user && typeof window !== 'undefined' && window.location.pathname.startsWith('/user/');

  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const timeSlots = [
    "9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"
  ];

  // Stepper state
  const [step, setStep] = useState(1); // 1 = Cart, 2 = Appointment

  const goToStep = (n: number) => setStep(n);
  // const phone = "+919065807555"; // Replace with actual number (with country code, no +)

const handleWhatsAppBooking = () => {
  const phoneNumber = "919065807555"; // ✅ Replace with your real WhatsApp business number

  const message = encodeURIComponent(
    `Namaste didi! 😊\n\nMain kuch services book karna chahti hoon:\n\n${cart
      .map(
        s =>
          `• ${s.name} × ${s.quantity} — ₹${s.price * s.quantity}`
      )
      .join("\n")}\n\nAddress Jamshedpur ka hi hai. Time confirm kar dijiyega. Dhanyawaad! 🙏`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

  window.open(whatsappUrl, "_blank");
};



  const handleWebsiteBooking = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    goToStep(2);
  };

  const handleBackToCart = () => goToStep(1);

  const { toast } = useToast();

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setBookingLoading(true);
    try {
      // Prepare the payload
      const payload = {
        userId: user.id,
        serviceIds: cart.map((item) => item.id),
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        duration: `${getTotalDuration()}min`,
        totalAmount: getTotalAmount(),
        specialPreferences: "Use herbal products. No artificial colors.", // You may want to collect this from a form field
        whatsappNumber: user.phone || ""
      };
      await bookAppointment(payload);
      setBookingLoading(false);
      clearCart();
      setShowBooking(false);
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully booked!",
        variant: "default"
      });
    } catch (err) {
      setBookingLoading(false);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 relative">
      {!isUserDashboard && <Header />}
      <main className="max-w-screen-lg mx-auto px-4 py-10">
        {/* Stepper UI */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${step === 1 ? 'font-bold text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent/10'}`}
            onClick={() => goToStep(1)}
            disabled={step === 1}
            style={{ cursor: step === 1 ? 'default' : 'pointer' }}
          >
            Step 1 <span className="hidden md:inline">- Cart</span>
          </button>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block text-muted-foreground"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${step === 2 ? 'font-bold text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent/10'}`}
            onClick={() => cart.length > 0 && goToStep(2)}
            disabled={step === 2 || cart.length === 0}
            style={{ cursor: step === 2 || cart.length === 0 ? 'default' : 'pointer' }}
          >
            Step 2 <span className="hidden md:inline">- Appointment</span>
          </button>
        </div>
        <div className="relative overflow-x-hidden min-h-[800px]">
          <motion.div
            className="absolute w-full left-0 top-0"
            animate={{ x: step === 1 ? 0 : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ zIndex: step === 1 ? 2 : 0 }}
          >
            <div className="max-w-4xl mx-auto space-y-8">
              <h1 className="text-3xl font-bold text-center text-foreground">Your Selected Services</h1>
              <AnimatePresence mode="wait">
                {cart.length === 0 ? (
                  <motion.div
                    key="empty"
                    className="text-center text-muted-foreground text-lg py-20 flex flex-col items-center gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span>Your cart is empty.</span>
                    <span className="text-base text-foreground">Ready to treat yourself? Browse our services and book your appointment now!</span>
                    <Button
                      className="mt-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold rounded-lg shadow"
                      onClick={() => navigate(user ? '/user/services' : '/')}
                    >
                      {user ? 'Add Services & Book Appointment' : 'Browse Services'}
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <AnimatePresence>
                        {cart.map(item => (
                          <motion.div
                            key={item.id}
                            className="flex justify-between items-center p-4 bg-card rounded-xl shadow border border-border hover:shadow-lg transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div>
                              <h2 className="font-semibold text-foreground">{item.name}</h2>
                              <p className="text-sm text-muted-foreground">
                                Category: {item.category?.name || "N/A"}
                              </p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold text-foreground">₹{item.price * item.quantity}</span>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)} className="hover:bg-destructive/10 focus-visible:ring-destructive">
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => addToCart(item)} className="hover:bg-success/10 focus-visible:ring-success">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <motion.div
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl font-semibold text-lg text-accent-foreground border-t border-primary/30 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <span>Total Time: {getTotalDuration()} mins</span>
                        <span>Total: ₹{getTotalAmount()}</span>
                      </motion.div>
                    </div>
                    <div className="space-y-3 mt-8">
                      <h3 className="font-semibold text-center text-foreground">Choose Your Booking Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          onClick={handleWhatsAppBooking}
                          className="bg-success hover:bg-success/80 text-success-foreground flex items-center gap-2 justify-center shadow-md hover:scale-[1.03] transition-transform"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Book via WhatsApp
                        </Button>
                        <Button
                          onClick={handleWebsiteBooking}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white flex items-center gap-2 justify-center shadow-md hover:scale-[1.03] transition-transform"
                        >
                          <Phone className="w-4 h-4" />
                          Book via Website
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        WhatsApp: Instant booking via chat | Website: Track appointments
                      </p>
                      <div className="flex justify-center">
                        <Button variant="ghost" onClick={clearCart} className="hover:bg-destructive/10 text-destructive">
                          Clear Cart
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.div
            className="absolute w-full left-0 top-0"
            animate={{ x: step === 2 ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ zIndex: step === 2 ? 2 : 0 }}
          >
            <div className="max-w-4xl mx-auto space-y-8 bg-card/80 p-6 rounded-2xl shadow-xl border border-border">
              <div className="flex items-center gap-2 mb-4">
                {/* <Button variant="ghost" onClick={handleBackToCart} className="hover:bg-accent/20">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back to Cart
                </Button> */}
                <h2 className="text-2xl font-bold text-foreground ml-2">Book Appointment</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Select Time</label>
                  <div className="flex gap-2 flex-wrap">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="min-w-[90px]"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                {user ? (
                  <Button
                    onClick={handleConfirmBooking}
                    className="w-full bg-primary text-primary-foreground mt-4"
                    disabled={!selectedDate || !selectedTime || bookingLoading}
                  >
                    {bookingLoading ? "Booking..." : "Confirm Appointment"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleWhatsAppBooking}
                    className="w-full bg-success text-success-foreground mt-4 flex items-center gap-2 justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Book via WhatsApp
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      {!isUserDashboard && <Footer />}
    </div>
  );
};

export default CartPage;