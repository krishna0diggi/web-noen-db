import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Clock, Plus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-card";
import { BookingModal } from "@/components/user/BookingModal";
import { DiscountBanner } from "@/components/ui/discount-banner";
import { discountStore, type Discount } from "@/lib/discount-store";
import { calculateDiscountedPrice } from "@/lib/discount-utils";
import SEOHead from "@/components/seo/SEOHead";

const UserServices = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeDiscounts, setActiveDiscounts] = useState<Discount[]>([]);

  // Get active discounts
  useEffect(() => {
    const updateDiscounts = () => {
      setActiveDiscounts(discountStore.getActiveDiscounts());
    };
    updateDiscounts();
    const unsubscribe = discountStore.subscribe(updateDiscounts);
    return unsubscribe;
  }, []);

  // Mock data - replace with API calls
  const services = [
    {
      id: 1,
      name: "Hair Styling",
      description: "Professional hair styling with expert stylists",
      price: 50,
      duration: 60,
      category: "hair",
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      available: true,
    },
    {
      id: 2,
      name: "Facial Treatment",
      description: "Rejuvenating facial treatment for glowing skin",
      price: 80,
      duration: 90,
      category: "skincare",
      rating: 4.9,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop",
      available: true,
    },
    {
      id: 3,
      name: "Manicure",
      description: "Complete nail care and beautiful nail art",
      price: 35,
      duration: 45,
      category: "nails",
      rating: 4.7,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
      available: true,
    },
    {
      id: 4,
      name: "Deep Cleansing Facial",
      description: "Deep pore cleansing for problematic skin",
      price: 120,
      duration: 120,
      category: "skincare",
      rating: 4.6,
      reviews: 87,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
      available: false,
    },
    {
      id: 5,
      name: "Hair Coloring",
      description: "Professional hair coloring with premium products",
      price: 150,
      duration: 180,
      category: "hair",
      rating: 4.8,
      reviews: 142,
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop",
      available: true,
    },
    {
      id: 6,
      name: "Pedicure",
      description: "Relaxing foot care and nail treatment",
      price: 45,
      duration: 60,
      category: "nails",
      rating: 4.5,
      reviews: 73,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop",
      available: true,
    },
  ];

  const categories = [
    { value: "all", label: "All Services" },
    { value: "hair", label: "Hair" },
    { value: "skincare", label: "Skincare" },
    { value: "nails", label: "Nails" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-50", label: "$0 - $50" },
    { value: "51-100", label: "$51 - $100" },
    { value: "101-200", label: "$101 - $200" },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    let matchesPrice = true;
    if (selectedPriceRange !== "all") {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      matchesPrice = service.price >= min && service.price <= max;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToCart = (service: any) => {
    // TODO: Implement cart functionality with API
    toast({
      title: "Added to Cart",
      description: `${service.name} has been added to your cart.`,
    });
  };

  const handleBookNow = (service: any) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <SEOHead 
        title="Beauty Services - Book Premium Ladies Salon Treatments | LooksNLove"
        description="Explore LooksNLove's comprehensive range of beauty services including professional hair styling, nail care, facial treatments, and spa services. Book your appointment with expert female stylists for premium beauty treatments."
        keywords="beauty services NYC, ladies salon services, hair styling services, nail care Manhattan, facial treatments, spa services, beauty appointments, professional styling, women beauty treatments"
        url="https://looksnlove.com/user/services"
      />
    <div className="space-y-8">
      {/* Header */}
      <AnimatedSection>
        <motion.div 
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-muted-foreground mb-6">
            Discover our premium beauty services designed just for you
          </p>
        </motion.div>
      </AnimatedSection>

      {/* Active Discounts */}
      <DiscountBanner variant="dashboard" />

      {/* Filters */}
      <AnimatedSection>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatedSection>

      {/* Services Grid */}
      <AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <StaggerItem key={service.id}>
              <motion.div
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="h-full"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col group">
                  {/* Animated reflection effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 z-10 pointer-events-none"
                    initial={false}
                    animate={{
                      background: [
                        "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.0) 55%, transparent 100%)",
                        "linear-gradient(225deg, transparent 0%, rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.0) 55%, transparent 100%)",
                        "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.0) 55%, transparent 100%)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="aspect-video relative overflow-hidden">
                    <motion.img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    {!service.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Unavailable</Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="flex-grow">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {service.name}
                      </CardTitle>
                      <div className="text-right">
                        {(() => {
                          const serviceForDiscount = {
                            id: service.id.toString(),
                            name: service.name,
                            originalPrice: service.price,
                            description: service.description,
                            category: service.category,
                            duration: `${service.duration}min`,
                            rating: service.rating
                          };
                          const pricing = calculateDiscountedPrice(serviceForDiscount, activeDiscounts);
                          const hasDiscount = pricing.savings > 0;
                          
                          return hasDiscount ? (
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground line-through">${service.price}</div>
                              <div className="text-2xl font-bold text-green-600">${pricing.discountedPrice}</div>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                Save ${pricing.savings.toFixed(2)}
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-primary">${service.price}</div>
                          );
                        })()}
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-4 h-4" />
                          {service.duration}min
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{service.rating}</span>
                        <span className="text-muted-foreground">({service.reviews})</span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {service.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => handleAddToCart(service)}
                          disabled={!service.available}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1"
                      >
                        <Button
                          className="w-full gap-2"
                          onClick={() => handleBookNow(service)}
                          disabled={!service.available}
                        >
                          <Plus className="w-4 h-4" />
                          Book Now
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filteredServices.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-muted-foreground">No services found matching your criteria.</div>
          </motion.div>
        )}
      </AnimatedSection>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          service={selectedService}
        />
      )}
    </div>
    </>
  );
};

export default UserServices;