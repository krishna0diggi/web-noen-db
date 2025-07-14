interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  appointmentId: string;
  service: string;
  stylist: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  response?: string;
  createdAt: string;
}

class ReviewStore {
  private static instance: ReviewStore;
  private reviews: Review[] = [];
  private listeners: (() => void)[] = [];

  static getInstance(): ReviewStore {
    if (!ReviewStore.instance) {
      ReviewStore.instance = new ReviewStore();
    }
    return ReviewStore.instance;
  }

  constructor() {
    this.loadFromStorage();
    // Add some sample reviews if none exist
    if (this.reviews.length === 0) {
      this.addSampleReviews();
    }
  }

  private addSampleReviews() {
    const sampleReviews = [
      {
        customerId: "user123",
        customerName: "Sarah Johnson",
        customerEmail: "sarah@example.com",
        appointmentId: "3",
        service: "Hair Styling",
        stylist: "Maria Garcia",
        rating: 5,
        comment: "Amazing service! The stylist was very professional and I love my new haircut. Will definitely come back!",
        date: "2024-01-15",
        status: "approved" as const,
        response: "Thank you so much Sarah! We're delighted you loved your new style. See you soon! 💄"
      },
      {
        customerId: "user456",
        customerName: "Emily Davis",
        customerEmail: "emily@example.com",
        appointmentId: "4",
        service: "Facial Treatment",
        stylist: "Lisa Chen",
        rating: 4,
        comment: "Great facial service, very relaxing atmosphere. Only minor issue was the wait time.",
        date: "2024-01-10",
        status: "approved" as const,
      },
      {
        customerId: "user789",
        customerName: "Maria Garcia",
        customerEmail: "maria@example.com",
        appointmentId: "5",
        service: "Manicure",
        stylist: "Emma Wilson",
        rating: 5,
        comment: "The manicure was incredible! My nails look perfect. The staff was very knowledgeable.",
        date: "2024-01-08",
        status: "pending" as const,
      }
    ];

    sampleReviews.forEach(review => this.addReview(review));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('salon-reviews');
    if (stored) {
      this.reviews = JSON.parse(stored);
    }
  }

  private saveToStorage() {
    localStorage.setItem('salon-reviews', JSON.stringify(this.reviews));
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

  getAllReviews(): Review[] {
    return [...this.reviews];
  }

  getApprovedReviews(): Review[] {
    return this.reviews.filter(review => review.status === "approved");
  }

  getPendingReviews(): Review[] {
    return this.reviews.filter(review => review.status === "pending");
  }

  getReviewsByCustomer(customerId: string): Review[] {
    return this.reviews.filter(review => review.customerId === customerId);
  }

  getReviewByAppointment(appointmentId: string): Review | undefined {
    return this.reviews.find(review => review.appointmentId === appointmentId);
  }

  addReview(review: Omit<Review, 'id' | 'createdAt'>): void {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.reviews.push(newReview);
    this.saveToStorage();
  }

  updateReview(id: string, updates: Partial<Review>): void {
    const index = this.reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reviews[index] = { ...this.reviews[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteReview(id: string): void {
    this.reviews = this.reviews.filter(r => r.id !== id);
    this.saveToStorage();
  }

  approveReview(id: string, response?: string): void {
    this.updateReview(id, { status: "approved", response });
  }

  rejectReview(id: string): void {
    this.updateReview(id, { status: "rejected" });
  }
}

export const reviewStore = ReviewStore.getInstance();
export type { Review };