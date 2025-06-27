interface Discount {
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
  createdAt: string;
}

class DiscountStore {
  private static instance: DiscountStore;
  private discounts: Discount[] = [];
  private listeners: (() => void)[] = [];

  static getInstance(): DiscountStore {
    if (!DiscountStore.instance) {
      DiscountStore.instance = new DiscountStore();
    }
    return DiscountStore.instance;
  }

  constructor() {
    this.loadFromStorage();
    // Clear existing data and add fresh sample discounts for demo
    this.discounts = [];
    this.addSampleDiscounts();
  }

  private addSampleDiscounts() {
    const sampleDiscounts = [
      {
        name: "New Year Special",
        description: "Celebrate the new year with amazing savings!",
        discountType: "percentage" as const,
        discountValue: 25, // 25% off - so $50 becomes $37.50
        validUntil: "2025-12-31T23:59:59Z",
        applicableServices: ["All Services"],
        customerTier: "all" as const,
        isActive: true,
        isFestival: true,
      },
      {
        name: "Hair Styling Discount",
        description: "Special discount for hair services",
        discountType: "percentage" as const,
        discountValue: 30, // 30% off - so $50 becomes $35.00
        validUntil: "2025-12-31T23:59:59Z",
        applicableServices: ["Hair Styling"],
        customerTier: "all" as const,
        isActive: true,
        isFestival: false,
      },
      {
        name: "Fixed $15 Off",
        description: "Get $15 off any service",
        discountType: "fixed" as const,
        discountValue: 15, // $15 off - so $50 becomes $35.00
        validUntil: "2025-12-31T23:59:59Z",
        applicableServices: ["All Services"],
        customerTier: "all" as const,
        isActive: true,
        isFestival: false,
      }
    ];

    sampleDiscounts.forEach(discount => this.addDiscount(discount));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('salon-discounts');
    if (stored) {
      this.discounts = JSON.parse(stored);
    }
  }

  private saveToStorage() {
    localStorage.setItem('salon-discounts', JSON.stringify(this.discounts));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getActiveDiscounts(): Discount[] {
    const now = new Date();
    return this.discounts.filter(discount => 
      discount.isActive && new Date(discount.validUntil) > now
    );
  }

  getAllDiscounts(): Discount[] {
    return [...this.discounts];
  }

  addDiscount(discount: Omit<Discount, 'id' | 'createdAt'>): void {
    const newDiscount: Discount = {
      ...discount,
      id: `discount-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.discounts.push(newDiscount);
    this.saveToStorage();
  }

  updateDiscount(id: string, updates: Partial<Discount>): void {
    const index = this.discounts.findIndex(d => d.id === id);
    if (index !== -1) {
      this.discounts[index] = { ...this.discounts[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteDiscount(id: string): void {
    this.discounts = this.discounts.filter(d => d.id !== id);
    this.saveToStorage();
  }

  activateDiscount(id: string): void {
    this.updateDiscount(id, { isActive: true });
  }

  deactivateDiscount(id: string): void {
    this.updateDiscount(id, { isActive: false });
  }
}

export const discountStore = DiscountStore.getInstance();
export type { Discount };