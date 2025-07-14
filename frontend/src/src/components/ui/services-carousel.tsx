import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  name: string;
  description: string;
  price: string;
  icon: any;
  popular: boolean;
  rating: number;
  bookings: number;
}

interface ServicesCarouselProps {
  services: Service[];
  className?: string;
}

export function ServicesCarousel({ services, className }: ServicesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320, // Card width + gap
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320, // Card width + gap
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Navigation Arrows - Hidden on mobile */}
      <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          onClick={scrollLeft}
          variant="outline"
          size="icon"
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background shadow-lg"
        >
          <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
        </Button>
      </div>
      
      <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          onClick={scrollRight}
          variant="outline"
          size="icon"
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background shadow-lg"
        >
          <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
        </Button>
      </div>

      {/* Services Container - Mobile responsive with full width usage */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-2 sm:px-4 md:px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
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
            className="flex-shrink-0 w-72 sm:w-80 md:w-80 lg:w-80 snap-center"
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

      {/* Mobile scroll indicator */}
      <div className="flex justify-center mt-6 gap-2 md:hidden">
        {Array.from({ length: services.length }).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-muted/60 transition-colors"
          />
        ))}
      </div>
      
      {/* Desktop scroll indicator */}
      <div className="hidden md:flex justify-center mt-4 gap-2">
        {Array.from({ length: Math.ceil(services.length / 3) }).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-muted transition-colors"
          />
        ))}
      </div>
    </div>
  );
}