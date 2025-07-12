import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer'
import { getServiceById, getServicesByCategory } from '@/service/adminService/adminService'
import { useCart } from '@/contexts/CartContext'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Minus, Plus, MessageCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BookingModal } from '@/components/user/BookingModal';
import { useTheme } from '@/components/ui/theme-provider';
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const ServiceDetail = () => {
  const { categorySlug } = useParams()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate()
  const location = useLocation();
  const categoryId = location.state?.id;
  const { addToCart, cart, removeFromCart } = useCart();
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchServices() {
      setLoading(true)
      try {
        const data = await getServiceById(categoryId)
        console.log(data);
        
        setServices(data)
      } catch (err) {
        setServices([])
      }
      setLoading(false)
    }
    if (categoryId) fetchServices()
  }, [categoryId])

  // Helper functions for total
  const getTotalAmount = () => cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const getTotalDuration = () => cart.reduce((sum, item) => sum + (item.durationInMinutes || 0) * (item.quantity || 1), 0);

  const handleWhatsAppBooking = () => {
    if (cart.length === 0) return;
    const msg = encodeURIComponent(
      `Hi, I want to book these services:\n${cart.map((s) => `- ${s.name} (₹${s.price}${s.quantity ? ` x${s.quantity}` : ''})`).join("\n")}`
    );
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };
  const handleWebsiteBooking = () => {
    if (cart.length === 0) return;
    localStorage.setItem('pendingBooking', JSON.stringify(cart));
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-gradient-to-br from-background via-accent/5 to-primary/5 relative">
      <Header />
      <main className="max-w-screen-lg mx-auto px-4 py-10">
        <button
          className="mb-6 flex items-center gap-2 text-primary hover:underline font-medium"
          onClick={() => navigate(-1)}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-3xl font-bold mb-8 text-center capitalize">
          {services.length > 0 && services[0].category?.name
            ? `${services[0].category.name} Services `
            : 'Services'}
        </h1>
        <div className="flex items-center gap-4 mb-8">
          <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
            {/* <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({cart.length})
                <Badge className="absolute -top-2 -right-2 bg-pink-500">
                  {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                </Badge>
              </Button>
            </DialogTrigger> */}
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Your Selected Services</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.categoryName || item.category?.name})</span>
                        <div className="text-sm text-gray-500">Qty: {item.quantity || 1}</div>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <span className="font-medium">₹{item.price * (item.quantity || 1)}</span>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div> */}
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg font-semibold text-lg">
                    <span>Total ({getTotalDuration()} mins)</span>
                    <span>₹{getTotalAmount()}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Choose Your Booking Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      onClick={handleWhatsAppBooking}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Book via WhatsApp
                    </Button>
                    <Button
                      onClick={handleWebsiteBooking}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Login & Book Online
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    WhatsApp booking: Instant booking via chat | Online booking: Track your appointments & history
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" onClick={() => navigate('/login')}>
            Login
          </Button> */}
        </div>
        {loading ? (
          <LoadingSpinner className="py-20" />
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-lg text-muted-foreground">
            No services found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {Array.isArray(services) ? services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: idx * 0.07 }}
                >
                  <Card
                    className="bg-white/80 shadow hover:shadow-lg transition-all h-full flex flex-col cursor-pointer"
                  >
                    <CardContent className="p-6 flex flex-col flex-1">
                      <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                      <p className="text-muted-foreground mb-4 flex-1">
                        {service.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <span className="font-bold text-primary text-lg">
                          ₹{service.price}
                        </span>
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedService({
                              id: service.id,
                              name: service.name,
                              price: service.price,
                              duration: service.durationInMinutes || service.duration || 60,
                              category: service.category?.name || service.category || '',
                            });
                            setIsBookingModalOpen(true);
                          }}
                        >
                          Book Now
                        </Button>
                        <Button
                          size="sm"
                          variant={cart.some((s) => s.id === service.id) ? "secondary" : "outline"}
                          onClick={e => {
                            e.stopPropagation();
                            addToCart(service);
                          }}
                          disabled={cart.some((s) => s.id === service.id)}
                        >
                          {cart.some((s) => s.id === service.id) ? "Added" : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )) : null}
            </AnimatePresence>
          </div>
        )}
        {/* Booking Modal */}
        {selectedService && (
          <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedService(null);
            }}
            service={selectedService}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default ServiceDetail