import { useState, useEffect } from "react";
import { Edit, Trash2, Star, MessageSquare, Calendar, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { reviewStore, type Review } from "@/lib/review-store";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Load reviews from store
  useEffect(() => {
    const updateReviews = () => {
      setReviews(reviewStore.getAllReviews());
    };
    
    updateReviews();
    const unsubscribe = reviewStore.subscribe(updateReviews);
    return unsubscribe;
  }, []);

  const handleUpdateReview = (id: string, updatedReview: Partial<Review>) => {
    reviewStore.updateReview(id, updatedReview);
    setEditingReview(null);
    setIsDialogOpen(false);
    const review = reviews.find(r => r.id === id);
    toast({
      title: "Review Updated",
      description: `Review from ${review?.customerName} has been updated.`,
    });
  };

  const handleDeleteReview = (id: string) => {
    const review = reviews.find(r => r.id === id);
    reviewStore.deleteReview(id);
    toast({
      title: "Review Deleted",
      description: `Review from ${review?.customerName} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleStatusChange = (id: string, status: Review["status"]) => {
    const review = reviews.find(r => r.id === id);
    reviewStore.updateReview(id, { status });
    toast({
      title: "Status Updated",
      description: `Review from ${review?.customerName} has been ${status}.`,
    });
  };

  const getStatusColor = (status: Review["status"]) => {
    switch (status) {
      case "approved":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-warning fill-current" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const filteredReviews = (() => {
    let filtered = filter === "all" ? reviews : reviews.filter(review => review.status === filter);
    
    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  })();

  const ReviewEditForm = ({ review, onSubmit, onCancel }: {
    review: Review;
    onSubmit: (data: Partial<Review>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      comment: review.comment,
      response: review.response || "",
      status: review.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="comment">Customer Comment</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="response">Your Response</Label>
          <Textarea
            id="response"
            value={formData.response}
            onChange={(e) => setFormData({...formData, response: e.target.value})}
            placeholder="Write a response to this review..."
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as Review["status"]})}
            className="w-full p-2 border border-border rounded-md bg-background"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">Update Review</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Reviews</h1>
          <p className="text-muted-foreground">Manage and respond to customer feedback</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({reviews.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            size="sm"
          >
            Pending ({reviews.filter(r => r.status === "pending").length})
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
            size="sm"
          >
            Approved ({reviews.filter(r => r.status === "approved").length})
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {review.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{review.customerName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{review.service}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingReview(review);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                  <span className="ml-2 font-medium">{review.rating}/5</span>
                </div>
                <Badge className={getStatusColor(review.status)} variant="secondary">
                  {review.status}
                </Badge>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Customer Feedback</span>
                </div>
                <p className="text-sm text-foreground">{review.comment}</p>
              </div>
              
              {review.response && (
                <div className="bg-accent/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Your Response</span>
                  </div>
                  <p className="text-sm text-foreground">{review.response}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-1">
                  {review.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(review.id, "approved")}
                        className="text-xs"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(review.id, "rejected")}
                        className="text-xs"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          {editingReview && (
            <ReviewEditForm
              review={editingReview}
              onSubmit={(data) => handleUpdateReview(editingReview.id, data)}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}