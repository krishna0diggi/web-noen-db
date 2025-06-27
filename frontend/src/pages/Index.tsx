import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { ServicesCarousel } from "@/components/ui/services-carousel";
import { AnimatedCard, AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-card";
import { RatingGrid } from "@/components/ui/rating-grid";
import { DiscountBanner } from "@/components/ui/discount-banner";
import SEOHead from "@/components/seo/SEOHead";
import { Scissors, Sparkles, Clock, MapPin, Phone, Mail, Star, Calendar, Users, Heart, Award, Shield } from "lucide-react";

const Index = () => {
  const [showAllServices, setShowAllServices] = useState(false);

  const services = [
    {
      name: "Hair Styling",
      description: "Professional cuts, colors, and treatments",
      price: "Starting at $50",
      icon: Scissors,
      popular: true,
      rating: 4.8,
      bookings: 245
    },
    {
      name: "Facial Treatments", 
      description: "Deep cleansing and anti-aging facials",
      price: "Starting at $80",
      icon: Sparkles,
      popular: true,
      rating: 4.9,
      bookings: 189
    },
    {
      name: "Manicure & Pedicure",
      description: "Complete nail care and design", 
      price: "Starting at $35",
      icon: Heart,
      popular: true,
      rating: 4.7,
      bookings: 312
    },
    {
      name: "Bridal Package",
      description: "Complete makeover for your special day",
      price: "Starting at $200", 
      icon: Award,
      popular: false,
      rating: 4.6,
      bookings: 89
    },
    {
      name: "Hair Coloring",
      description: "Professional hair coloring and highlights",
      price: "Starting at $120",
      icon: Sparkles,
      popular: true,
      rating: 4.8,
      bookings: 167
    },
    {
      name: "Deep Tissue Massage",
      description: "Relaxing full body massage therapy",
      price: "Starting at $90",
      icon: Heart,
      popular: true,
      rating: 4.9,
      bookings: 203
    },
    {
      name: "Eyebrow Threading",
      description: "Precise eyebrow shaping and styling",
      price: "Starting at $25",
      icon: Sparkles,
      popular: false,
      rating: 4.5,
      bookings: 134
    },
    {
      name: "Makeup Application",
      description: "Professional makeup for special events",
      price: "Starting at $75",
      icon: Heart,
      popular: true,
      rating: 4.7,
      bookings: 156
    }
  ];

  const popularServices = services.filter(service => service.popular);
  const displayedServices = showAllServices ? popularServices : popularServices.slice(0, 4);

  const features = [
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Open 7 days a week with extended hours"
    },
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Only the finest products and equipment"
    },
    {
      icon: Users,
      title: "Expert Stylists",
      description: "Certified professionals with years of experience"
    }
  ];

  const ratings = [
    {
      id: "1",
      name: "Sarah Johnson",
      comment: "Amazing experience! The hair styling was perfect and the staff was incredibly professional. Highly recommend!",
      rating: 5,
      type: "website" as const,
      date: "2024-01-15",
      order: 1
    },
    {
      id: "2", 
      name: "Mike Chen",
      comment: "Best salon in the city! Great location, friendly staff, and excellent services. Will definitely come back.",
      rating: 5,
      type: "google" as const,
      date: "2024-01-20",
      location: "Downtown",
      order: 2
    },
    {
      id: "3",
      name: "Emily Davis", 
      comment: "The facial treatment was absolutely incredible. My skin has never looked better. Thank you!",
      rating: 4.8,
      type: "website" as const,
      date: "2024-01-18",
      order: 3
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      comment: "Professional service, clean environment, and amazing results. The bridal package was perfect!",
      rating: 5,
      type: "google" as const,
      date: "2024-01-22",
      location: "Central Area",
      order: 4
    }
  ];

  return (
    <>
      <SEOHead 
        title="LooksNLove - Premium Ladies Salon & Beauty Services | Best Hair, Nail & Spa Treatments"
        description="LooksNLove is the leading ladies salon in New York offering premium beauty services including hair styling, nail care, facial treatments, bridal packages, and spa services. Book your appointment for professional beauty treatments with expert stylists."
        keywords="ladies salon NYC, beauty salon New York, hair salon Manhattan, nail salon, spa services, hair styling, hair coloring, facial treatment, manicure, pedicure, bridal makeup, beauty treatments, professional styling, women salon, beauty parlour, hair care, skin care, nail art, wedding makeup"
        url="https://looksnlove.com"
      />
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 relative">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LooksNLove
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
              <a href="#reviews" className="text-foreground hover:text-primary transition-colors">Reviews</a>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button asChild variant="outline">
                <a href="/admin">Admin</a>
              </Button>
              <Button asChild className="gap-2">
                <a href="/user">
                  <Calendar className="w-4 h-4" />
                  Book Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Active Offers Banner */}
      <div className="w-full px-2 sm:px-4 pt-8">
        <DiscountBanner variant="homepage" />
      </div>

      {/* Hero Section */}
      <AnimatedSection>
        <section className="py-10 sm:py-20 px-2 sm:px-4">
          <div className="w-full text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                ✨ Premium Beauty Experience
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              Transform Your Beauty
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience luxury and elegance at our premium salon. Professional treatments, 
              expert stylists, and exceptional service await you.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="gap-2 text-lg px-8 py-6">
                  <a href="/user/services">
                    <Sparkles className="w-5 h-5" />
                    Explore Services
                  </a>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                  <a href="/user">
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection>
        <section id="services" className="py-12 sm:py-16 lg:py-20 px-2 sm:px-4 bg-card/30">
          <div className="w-full max-w-none">
            <motion.div 
              className="text-center mb-8 sm:mb-12 lg:mb-16"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Most Popular Services</h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
                Discover our most loved beauty treatments that customers can't get enough of
              </p>
            </motion.div>
            
            {/* Services Grid - 2 rows layout */}
            <div className="w-full px-2 sm:px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
                {popularServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.25, 0.4, 0.25, 1]
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <Card className="relative overflow-hidden group bg-gradient-to-br from-card via-card to-card/95 border-border/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 h-full">
                      {/* Animated reflection effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        initial={false}
                        animate={{
                          background: [
                            "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.0) 55%, transparent 100%)",
                            "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.0) 55%, transparent 100%)"
                          ]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      {/* Glass effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 group-hover:to-white/10 transition-all duration-300" />
                      
                      {service.popular && (
                        <motion.div
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                        >
                          <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-gradient-to-r from-primary to-accent shadow-lg text-xs sm:text-sm">
                            Popular
                          </Badge>
                        </motion.div>
                      )}
                      
                      <CardContent className="p-4 sm:p-6 text-center relative z-10">
                        <motion.div 
                          className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors"
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 5,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </motion.div>
                        
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-muted-foreground mb-3 sm:mb-4 text-sm leading-relaxed line-clamp-2">{service.description}</p>
                        
                        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 flex-wrap">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-sm sm:text-base">{service.rating}</span>
                          <span className="text-muted-foreground text-xs sm:text-sm">({service.bookings} bookings)</span>
                        </div>
                        
                        <div className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4">{service.price}</div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button asChild className="w-full text-sm sm:text-base" variant="outline" size="sm">
                            <a href="/user/services">View Details</a>
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* See More Button */}
            <motion.div 
              className="text-center mt-8 sm:mt-12 lg:mt-16 px-2 sm:px-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="gap-2 text-base sm:text-lg px-6 sm:px-8 py-3">
                  <a href="/user/services">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    View All Services
                  </a>
                </Button>
              </motion.div>
              <p className="text-muted-foreground mt-4 text-sm sm:text-base">
                Showing {popularServices.length} popular services • Scroll to see more
              </p>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Customer Reviews Section */}
      <AnimatedSection>
        <section className="py-12 sm:py-16 lg:py-20 px-2 sm:px-4">
          <div className="w-full max-w-none">
            <motion.div 
              className="text-center mb-8 sm:mb-12 lg:mb-16"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">What Our Customers Say</h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
                Real reviews from our valued customers who experienced our premium beauty services
              </p>
            </motion.div>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full"
            >
              <RatingGrid ratings={ratings} className="" />
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* About Section */}
      <AnimatedSection>
        <section id="about" className="py-12 sm:py-16 lg:py-20 px-2 sm:px-4 bg-card/30">
          <div className="w-full max-w-none">
            <motion.div 
              className="text-center mb-12 sm:mb-16"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">About LooksNLove</h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-2 sm:px-4">
                  Established in 2018, LooksNLove has been the premier destination for luxury beauty treatments in the heart of the city. 
                  Our team of certified professionals brings over 50 years of combined experience in hair styling, skincare, and wellness.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">5000+</div>
                    <p className="text-muted-foreground">Happy Customers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">8+</div>
                    <p className="text-muted-foreground">Expert Stylists</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">15+</div>
                    <p className="text-muted-foreground">Premium Services</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection>
        <section className="py-12 sm:py-16 lg:py-20 px-2 sm:px-4">
          <div className="w-full max-w-none">
            <motion.div 
              className="text-center mb-12 sm:mb-16"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Why Choose Us</h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
                We're committed to providing the best beauty experience
              </p>
            </motion.div>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <StaggerItem key={index}>
                  <motion.div 
                    className="text-center group"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground text-base sm:text-lg">{feature.description}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-20 px-2 sm:px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <div className="w-full text-center">
            <motion.h2 
              className="text-4xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Transform Your Look?
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Book your appointment today and experience the difference of professional beauty care
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="gap-2 text-lg px-8 py-6">
                <a href="/user">
                  <Calendar className="w-5 h-5" />
                  Book Your Appointment
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer id="contact" className="bg-card border-t border-border py-16 px-2 sm:px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">LooksNLove</span>
              </div>
              <p className="text-muted-foreground">
                Your premier destination for beauty and wellness treatments.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/user/services" className="block text-muted-foreground hover:text-primary transition-colors">Services</a>
                <a href="/user" className="block text-muted-foreground hover:text-primary transition-colors">Book Appointment</a>
                <a href="/user/appointments" className="block text-muted-foreground hover:text-primary transition-colors">My Appointments</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                <p className="text-muted-foreground">Hair Styling</p>
                <p className="text-muted-foreground">Facial Treatments</p>
                <p className="text-muted-foreground">Nail Care</p>
                <p className="text-muted-foreground">Bridal Packages</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground text-sm">123 Beauty Street, City</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground text-sm">info@salonbeauty.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 LooksNLove. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Index;
