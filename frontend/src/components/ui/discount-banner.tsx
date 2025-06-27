import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Percent, Gift, Zap, Star, Clock, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { discountStore, type Discount } from "@/lib/discount-store";


interface DiscountBannerProps {
  className?: string;
  showBookButton?: boolean;
  variant?: "homepage" | "dashboard";
}

// Utility function to calculate remaining time
const calculateTimeRemaining = (validUntil: string) => {
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

export const DiscountBanner = ({ className = "", showBookButton = true, variant = "dashboard" }: DiscountBannerProps) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: string | null}>({});

  // Get active discounts from store
  useEffect(() => {
    const updateDiscounts = () => {
      const activeDiscounts = discountStore.getActiveDiscounts();
      setDiscounts(activeDiscounts);
    };

    updateDiscounts();
    const unsubscribe = discountStore.subscribe(updateDiscounts);
    return unsubscribe;
  }, []);

  const visibleDiscounts = useMemo(() => {
    return discounts.slice(0, variant === "homepage" ? 1 : 2);
  }, [discounts, variant]);

  // Update countdown every minute
  useEffect(() => {
    if (visibleDiscounts.length === 0) return;

    const updateCountdown = () => {
      const newTimeRemaining: {[key: string]: string | null} = {};
      visibleDiscounts.forEach(discount => {
        newTimeRemaining[discount.id] = calculateTimeRemaining(discount.validUntil);
      });
      setTimeRemaining(newTimeRemaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [visibleDiscounts]);

  if (visibleDiscounts.length === 0) return null;

  const getDiscountIcon = (discount: Discount) => {
    if (discount.isFestival) return Gift;
    if (discount.customerTier === "vip") return Star;
    return Percent;
  };

  const getDiscountColor = (discount: Discount) => {
    if (discount.isFestival) return "from-orange-400 to-red-500";
    if (discount.customerTier === "vip") return "from-purple-400 to-pink-500";
    return "from-green-400 to-blue-500";
  };

  return (
    <div className={className}>
      {variant === "homepage" && visibleDiscounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 10px rgba(59, 130, 246, 0.2)",
                "0 0 20px rgba(59, 130, 246, 0.4)",
                "0 0 10px rgba(59, 130, 246, 0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-lg"
          >
            <Card className="border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <Gift className="w-4 h-4 text-white" />
                    </motion.div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground text-sm">{visibleDiscounts[0].name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Timer className="w-3 h-3" />
                        <span className="text-orange-600 font-medium">
                          {timeRemaining[visibleDiscounts[0].id] || "Calculating..."}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xl font-bold text-primary"
                    >
                      {visibleDiscounts[0].discountType === "percentage" 
                        ? `${visibleDiscounts[0].discountValue}%`
                        : `$${visibleDiscounts[0].discountValue}`
                      }
                    </motion.div>
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      OFF
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {variant === "dashboard" && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-accent/3" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="font-bold text-lg">🎉 Active Offers</h3>
              </div>
              <Badge variant="secondary" className="animate-pulse text-xs">
                {visibleDiscounts.length} Active
              </Badge>
            </div>
            
            <div className="space-y-3">
              {visibleDiscounts.map((discount, index) => {
                const Icon = getDiscountIcon(discount);
                const colorClass = getDiscountColor(discount);
                
                return (
                  <motion.div
                    key={discount.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <motion.div
                      animate={discount.isFestival ? { 
                        boxShadow: [
                          "0 0 8px rgba(255, 165, 0, 0.2)",
                          "0 0 15px rgba(255, 165, 0, 0.4)",
                          "0 0 8px rgba(255, 165, 0, 0.2)"
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-3 border rounded-lg bg-card/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-8 h-8 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm flex items-center gap-1 flex-wrap">
                              <span className="truncate">{discount.name}</span>
                              {discount.isFestival && <Badge variant="secondary" className="text-xs px-1">🎊</Badge>}
                              {discount.customerTier === "vip" && <Badge variant="secondary" className="text-xs px-1">⭐</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-orange-600 font-medium">
                                {timeRemaining[discount.id] || "Calculating..."}
                              </span>
                            </div>
                          </div>
                        </div>
                        <motion.div 
                          animate={discount.isFestival ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-right flex-shrink-0"
                        >
                          <div className="text-lg font-bold text-primary">
                            {discount.discountType === "percentage" 
                              ? `${discount.discountValue}%`
                              : `$${discount.discountValue}`
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">OFF</div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
            
            {showBookButton && (
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/user/services">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-accent">
                      <Gift className="w-4 h-4" />
                      Book with Discount
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};