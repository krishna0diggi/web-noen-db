import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Globe, ChevronLeft, ChevronRight } from "lucide-react";

interface Rating {
  id: string;
  name: string;
  comment: string;
  rating: number;
  type: "website" | "google";
  date: string;
  location?: string;
  order: number;
}

interface RatingGridProps {
  ratings: Rating[];
  className?: string;
}

export function RatingGrid({ ratings, className = "" }: RatingGridProps) {
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  
  // Sort ratings by order
  const sortedRatings = [...ratings].sort((a, b) => a.order - b.order);
  
  // Get 5 ratings for display (3 center + 2 sides)
  const visibleRatings = [];
  for (let i = 0; i < 5; i++) {
    const index = (currentStartIndex + i) % sortedRatings.length;
    visibleRatings.push(sortedRatings[index]);
  }

  const handlePrevious = () => {
    setCurrentStartIndex((prev) => 
      prev === 0 ? sortedRatings.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentStartIndex((prev) => 
      (prev + 1) % sortedRatings.length
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-200 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  const RatingCard = ({ rating, variant = "full" }: { rating: Rating; variant?: "full" | "partial-left" | "partial-right" }) => {
    const isPartial = variant !== "full";
    
    return (
      <motion.div
        className={`relative ${
          variant === "partial-left" ? "overflow-hidden" : 
          variant === "partial-right" ? "overflow-hidden" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isPartial ? 0.7 : 1, y: 0 }}
        whileHover={{ 
          opacity: 1, 
          scale: isPartial ? 1.02 : 1.05,
          zIndex: 10
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Shadow overlays for partial cards */}
        {variant === "partial-left" && (
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/60 to-transparent z-10 pointer-events-none" />
        )}
        {variant === "partial-right" && (
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/60 to-transparent z-10 pointer-events-none" />
        )}
        
        <Card className={`bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 h-full ${
          isPartial ? "cursor-pointer" : ""
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  rating.type === "google"
                    ? "bg-blue-500/10 text-blue-500"
                    : "bg-primary/10 text-primary"
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {rating.type === "google" ? (
                  <MapPin className="w-6 h-6" />
                ) : (
                  <Globe className="w-6 h-6" />
                )}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-lg truncate">{rating.name}</h4>
                  <Badge variant={rating.type === "google" ? "secondary" : "default"} className="text-xs">
                    {rating.type === "google" ? "Google" : "Website"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {renderStars(rating.rating)}
                  </div>
                  <span className="text-sm font-medium">{rating.rating.toFixed(1)}</span>
                  {rating.location && (
                    <span className="text-xs text-muted-foreground">• {rating.location}</span>
                  )}
                </div>
                
                <p className={`text-muted-foreground leading-relaxed mb-3 ${
                  isPartial ? "line-clamp-2" : "line-clamp-3"
                }`}>
                  "{rating.comment}"
                </p>
                
                <p className="text-xs text-muted-foreground">
                  {new Date(rating.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (sortedRatings.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Arrows - Hidden on mobile, positioned better on desktop */}
      <div className="hidden lg:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none z-20">
        <motion.button
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all pointer-events-auto shadow-lg -ml-6"
          onClick={handlePrevious}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </motion.button>
        <motion.button
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all pointer-events-auto shadow-lg -mr-6"
          onClick={handleNext}
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
        </motion.button>
      </div>

      {/* Mobile Layout - Single column with horizontal scroll, full width */}
      <div className="block lg:hidden">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-2 sm:px-4">
          {sortedRatings.map((rating, index) => (
            <motion.div
              key={`${rating.id}-mobile-${index}`}
              className="flex-shrink-0 w-80 snap-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <motion.div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                        rating.type === "google"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-primary/10 text-primary"
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {rating.type === "google" ? (
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <h4 className="font-semibold text-base sm:text-lg truncate">{rating.name}</h4>
                        <Badge variant={rating.type === "google" ? "secondary" : "default"} className="text-xs">
                          {rating.type === "google" ? "Google" : "Website"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          {renderStars(rating.rating)}
                        </div>
                        <span className="text-sm font-medium">{rating.rating.toFixed(1)}</span>
                        {rating.location && (
                          <span className="text-xs text-muted-foreground">• {rating.location}</span>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-3 text-sm line-clamp-3">
                        "{rating.comment}"
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        {new Date(rating.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Complex grid */}
      <div className="hidden lg:block">
        <div className="grid grid-rows-2 gap-6 h-[600px]">
          {/* Top Row - 3 full cards */}
          <div className="grid grid-cols-3 gap-6">
            {visibleRatings.slice(0, 3).map((rating, index) => (
              <RatingCard key={`${rating.id}-${currentStartIndex}-${index}`} rating={rating} variant="full" />
            ))}
          </div>
          
          {/* Bottom Row - 2 partial cards */}
          <div className="grid grid-cols-2 gap-8 px-16">
            {visibleRatings.slice(3, 5).map((rating, index) => (
              <RatingCard 
                key={`${rating.id}-${currentStartIndex}-${index + 3}`} 
                rating={rating} 
                variant={index === 0 ? "partial-left" : "partial-right"} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Buttons */}
      <div className="flex lg:hidden justify-center gap-4 mt-6">
        <motion.button
          className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all shadow-lg"
          onClick={handlePrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.button
          className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all shadow-lg"
          onClick={handleNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6 lg:mt-8">
        {sortedRatings.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStartIndex % sortedRatings.length
                ? "bg-primary w-6 lg:w-8"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => setCurrentStartIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Corner Shadow Effects */}
      <div className="absolute top-0 left-0 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}