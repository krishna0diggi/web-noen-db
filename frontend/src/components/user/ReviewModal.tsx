import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Send, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { reviewStore } from "@/lib/review-store";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Please write at least 10 characters").max(500, "Comment is too long"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: number;
    service: string;
    stylist: string;
    date: string;
    price: number;
  };
}

export const ReviewModal = ({ isOpen, onClose, appointment }: ReviewModalProps) => {
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  // Check if review already exists for this appointment
  const existingReview = reviewStore.getReviewByAppointment(appointment.id.toString());

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };

  const onSubmit = (data: ReviewFormData) => {
    if (existingReview) {
      toast({
        title: "Review Already Submitted",
        description: "You have already reviewed this appointment.",
        variant: "destructive",
      });
      return;
    }

    const reviewData = {
      customerId: "user123", // This would come from auth context
      customerName: "Current User", // This would come from auth context
      customerEmail: "user@example.com", // This would come from auth context
      appointmentId: appointment.id.toString(),
      service: appointment.service,
      stylist: appointment.stylist,
      rating: data.rating,
      comment: data.comment,
      date: appointment.date,
      status: "pending" as const,
    };

    reviewStore.addReview(reviewData);

    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. Your review is now pending approval.",
    });

    // Reset form and close modal
    form.reset();
    setSelectedRating(0);
    setHoverRating(0);
    onClose();
  };

  if (existingReview) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Review Already Submitted</DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
              </motion.div>
              <div>
                <h3 className="font-semibold mb-2">Thank you for your review!</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  You have already submitted a review for this appointment.
                </p>
                <div className="flex justify-center items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < existingReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  "{existingReview.comment}"
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Status: <span className="capitalize font-medium">{existingReview.status}</span>
                </p>
              </div>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Leave a Review
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">
              How was your experience?
            </CardTitle>
            <div className="text-center space-y-1">
              <div className="font-medium">{appointment.service}</div>
              <div className="text-sm text-muted-foreground">with {appointment.stylist}</div>
              <div className="text-xs text-muted-foreground">{appointment.date}</div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Rating Stars */}
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-center block">Rating *</FormLabel>
                      <FormControl>
                        <div className="flex justify-center gap-1 my-4">
                          {Array.from({ length: 5 }, (_, i) => {
                            const starValue = i + 1;
                            return (
                              <motion.button
                                key={i}
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleRatingClick(starValue)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={cn(
                                    "w-8 h-8 transition-colors",
                                    (hoverRating || selectedRating) >= starValue
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300 hover:text-yellow-200"
                                  )}
                                />
                              </motion.button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Comment */}
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Review *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your experience..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/500 characters
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <Send className="w-4 h-4" />
                    Submit Review
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};