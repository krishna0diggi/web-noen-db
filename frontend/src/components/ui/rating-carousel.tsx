import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Globe } from "lucide-react";

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

interface RatingCarouselProps {
  ratings: Rating[];
  className?: string;
}

export function RatingCarousel({ ratings, className = "" }: RatingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Sort ratings by order
  const sortedRatings = [...ratings].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!isHovered && sortedRatings.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sortedRatings.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered, sortedRatings.length]);

  if (sortedRatings.length === 0) return null;

  const currentRating = sortedRatings[currentIndex];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-200 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentRating.type === "google"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-primary/10 text-primary"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentRating.type === "google" ? (
                    <MapPin className="w-6 h-6" />
                  ) : (
                    <Globe className="w-6 h-6" />
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg">{currentRating.name}</h4>
                    <Badge variant={currentRating.type === "google" ? "secondary" : "default"}>
                      {currentRating.type === "google" ? "Google Maps" : "Website"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(currentRating.rating)}
                    </div>
                    <span className="text-sm font-medium">{currentRating.rating.toFixed(1)}</span>
                    {currentRating.location && (
                      <span className="text-xs text-muted-foreground">• {currentRating.location}</span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    "{currentRating.comment}"
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {new Date(currentRating.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {sortedRatings.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {sortedRatings.length > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <motion.button
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all pointer-events-auto"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + sortedRatings.length) % sortedRatings.length)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ←
          </motion.button>
          <motion.button
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all pointer-events-auto"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % sortedRatings.length)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.button>
        </div>
      )}
    </div>
  );
}