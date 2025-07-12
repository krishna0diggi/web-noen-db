import { useState, useEffect } from "react";
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
import { Scissors, Sparkles, Clock, MapPin, Phone, Mail, Star, Calendar, Users, Heart, Award, Shield, UserCircle, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { getCategories } from "@/service/adminService/adminService";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import CategorySection from "@/components/ui/CategorySection";

interface IndexProps {
  showServiceSection?: boolean;
}

const Index = ({ showServiceSection = true }: IndexProps) => {
  const [showAllServices, setShowAllServices] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

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
        <Header />
        {/* Active Offers Banner */}
        {/* <div className="w-full px-2 sm:px-4 pt-8">
        <DiscountBanner variant="homepage" />
      </div> */}
        {/* Hero Section */}
        <AnimatedSection>
          <section
            className="py-10 sm:py-20 px-4 sm:px-6 relative min-h-[620px] flex items-center justify-center"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dqkqmpy5m/image/upload/v1752318070/beauty-banner2_la16a9.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Black fade overlay from bottom */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>
            <div className="w-full max-w-screen-lg mx-auto text-center relative z-10">
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
                className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-pink-700 via-pink-500 to-accent bg-clip-text text-transparent px-2 py-2 rounded-lg inline-block shadow-2xl drop-shadow-lg tracking-tight border border-pink-500/50"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              >
                Transform <span className="text-pink-400 font-black">Your</span> Beauty
              </motion.h1>

                <motion.p
                className="text-md text-white mb-8 max-w-2xl mx-auto px-4 py-3 rounded-lg bg-black/10 shadow-md"
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

        {/* Decorative curve after hero section */}
        <div className="relative -mt-4">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 md:h-32 lg:h-40 block">
            <path fill="#fff" d="M0,80 C360,160 1080,0 1440,80 L1440,120 L0,120 Z" />
          </svg>
        </div>

        {/* Services Section (now Category Section) */}
        <AnimatedSection>
          {showServiceSection && <CategorySection categories={categories} />}
        </AnimatedSection>

        {/* Customer Reviews Section */}
        <AnimatedSection>
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
            <div className="w-full max-w-screen-lg mx-auto">
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
          <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-card/30">
            <div className="w-full max-w-screen-lg mx-auto">
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
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
            <div className="w-full max-w-screen-lg mx-auto">
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
          <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
            <div className="w-full max-w-screen-lg mx-auto text-center">
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

        <Footer />
      </div>
    </>
  );
};

export default Index;
