export interface Discount {
  id: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validUntil: string;
  applicableServices: string[];
  customerTier: "all" | "regular" | "vip";
  isFestival: boolean;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice?: number;
  description: string;
  category: string;
  duration: string;
  rating: number;
  image?: string;
}

/**
 * Calculate discounted price for a service based on applicable discounts
 */
export const calculateDiscountedPrice = (
  service: Service,
  activeDiscounts: Discount[],
  customerTier: "regular" | "vip" = "regular"
): { discountedPrice: number; appliedDiscount?: Discount; savings: number } => {
  let bestDiscount: Discount | undefined;
  let maxSavings = 0;

  // Find the best applicable discount
  for (const discount of activeDiscounts) {
    if (!discount.isActive) continue;

    // Check if discount applies to customer tier
    if (discount.customerTier !== "all" && discount.customerTier !== customerTier) continue;

    // Check if discount applies to this service
    const appliesToService = discount.applicableServices.includes("All Services") ||
                            discount.applicableServices.some(serviceName => 
                              service.name.toLowerCase().includes(serviceName.toLowerCase()) ||
                              service.category.toLowerCase().includes(serviceName.toLowerCase())
                            );

    if (!appliesToService) continue;

    // Check if discount is still valid
    const now = new Date();
    const validUntil = new Date(discount.validUntil);
    if (now > validUntil) continue;

    // Calculate savings
    let savings = 0;
    if (discount.discountType === "percentage") {
      savings = service.originalPrice * (discount.discountValue / 100);
    } else {
      savings = Math.min(discount.discountValue, service.originalPrice);
    }

    // Keep track of best discount
    if (savings > maxSavings) {
      maxSavings = savings;
      bestDiscount = discount;
    }
  }

  const discountedPrice = Math.max(0, service.originalPrice - maxSavings);

  return {
    discountedPrice,
    appliedDiscount: bestDiscount,
    savings: maxSavings
  };
};

/**
 * Apply discounts to a list of services
 */
export const applyDiscountsToServices = (
  services: Service[],
  activeDiscounts: Discount[],
  customerTier: "regular" | "vip" = "regular"
): Service[] => {
  return services.map(service => {
    const { discountedPrice, appliedDiscount, savings } = calculateDiscountedPrice(
      service,
      activeDiscounts,
      customerTier
    );

    return {
      ...service,
      discountedPrice: savings > 0 ? discountedPrice : undefined,
      appliedDiscount,
      savings
    };
  });
};

/**
 * Get all active discounts for a customer tier
 */
export const getActiveDiscountsForTier = (
  allDiscounts: Discount[],
  customerTier: "regular" | "vip" = "regular"
): Discount[] => {
  const now = new Date();
  
  return allDiscounts.filter(discount => {
    if (!discount.isActive) return false;
    
    // Check if discount is still valid
    const validUntil = new Date(discount.validUntil);
    if (now > validUntil) return false;
    
    // Check if discount applies to customer tier
    return discount.customerTier === "all" || discount.customerTier === customerTier;
  });
};

/**
 * Calculate time remaining for a discount
 */
export const calculateTimeRemaining = (validUntil: string): string | null => {
  const now = new Date();
  const endDate = new Date(validUntil);
  const timeDiff = endDate.getTime() - now.getTime();
  
  if (timeDiff <= 0) return null;
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
  return "Less than 1 minute left";
};
