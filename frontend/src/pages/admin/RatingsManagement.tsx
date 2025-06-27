import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, MoveUp, MoveDown, Star, MapPin, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function RatingsManagement() {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Rating[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      comment: "Amazing experience! The hair styling was perfect and the staff was incredibly professional. Highly recommend!",
      rating: 5,
      type: "website",
      date: "2024-01-15",
      order: 1
    },
    {
      id: "2", 
      name: "Mike Chen",
      comment: "Best salon in the city! Great location, friendly staff, and excellent services. Will definitely come back.",
      rating: 5,
      type: "google",
      date: "2024-01-20",
      location: "Downtown",
      order: 2
    },
    {
      id: "3",
      name: "Emily Davis", 
      comment: "The facial treatment was absolutely incredible. My skin has never looked better. Thank you!",
      rating: 4.8,
      type: "website",
      date: "2024-01-18",
      order: 3
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      comment: "Professional service, clean environment, and amazing results. The bridal package was perfect!",
      rating: 5,
      type: "google",
      date: "2024-01-22",
      location: "Central Area",
      order: 4
    }
  ]);

  const [editingRating, setEditingRating] = useState<Rating | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sortedRatings = [...ratings].sort((a, b) => a.order - b.order);

  const handleAddRating = (newRating: Omit<Rating, "id" | "order">) => {
    const rating: Rating = {
      ...newRating,
      id: Math.random().toString(36).substr(2, 9),
      order: ratings.length + 1
    };
    setRatings([...ratings, rating]);
    toast({
      title: "Rating Added",
      description: "New customer rating has been added successfully.",
    });
    setIsDialogOpen(false);
  };

  const handleEditRating = (updatedRating: Rating) => {
    setRatings(ratings.map(r => r.id === updatedRating.id ? updatedRating : r));
    toast({
      title: "Rating Updated",
      description: "Customer rating has been updated successfully.",
    });
    setIsDialogOpen(false);
    setEditingRating(null);
  };

  const handleDeleteRating = (id: string) => {
    setRatings(ratings.filter(r => r.id !== id));
    toast({
      title: "Rating Deleted",
      description: "Customer rating has been deleted successfully.",
    });
  };

  const moveRating = (id: string, direction: "up" | "down") => {
    const currentRating = ratings.find(r => r.id === id);
    if (!currentRating) return;

    const newOrder = direction === "up" ? currentRating.order - 1 : currentRating.order + 1;
    const swapRating = ratings.find(r => r.order === newOrder);

    if (swapRating) {
      setRatings(ratings.map(r => {
        if (r.id === id) return { ...r, order: newOrder };
        if (r.id === swapRating.id) return { ...r, order: currentRating.order };
        return r;
      }));
      
      toast({
        title: "Order Updated",
        description: "Rating order has been updated successfully.",
      });
    }
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Ratings Management</h1>
          <p className="text-muted-foreground">Manage customer reviews and ratings displayed on homepage</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingRating(null)}>
              <Plus className="w-4 h-4" />
              Add Rating
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRating ? "Edit Rating" : "Add New Rating"}</DialogTitle>
            </DialogHeader>
            <RatingForm
              rating={editingRating}
              onSubmit={editingRating ? handleEditRating : handleAddRating}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingRating(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sortedRatings.map((rating, index) => (
          <motion.div
            key={rating.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    rating.type === "google"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {rating.type === "google" ? (
                      <MapPin className="w-6 h-6" />
                    ) : (
                      <Globe className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{rating.name}</h4>
                      <Badge variant={rating.type === "google" ? "secondary" : "default"}>
                        {rating.type === "google" ? "Google Maps" : "Website"}
                      </Badge>
                      <Badge variant="outline">Order: {rating.order}</Badge>
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
                    
                    <p className="text-muted-foreground mb-3">"{rating.comment}"</p>
                    
                    <p className="text-xs text-muted-foreground">
                      {new Date(rating.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveRating(rating.id, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveRating(rating.id, "down")}
                      disabled={index === sortedRatings.length - 1}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingRating(rating);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Rating</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this rating? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteRating(rating.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface RatingFormProps {
  rating?: Rating | null;
  onSubmit: (rating: any) => void;
  onCancel: () => void;
}

function RatingForm({ rating, onSubmit, onCancel }: RatingFormProps) {
  const [formData, setFormData] = useState({
    name: rating?.name || "",
    comment: rating?.comment || "",
    rating: rating?.rating || 5,
    type: rating?.type || "website",
    location: rating?.location || "",
    date: rating?.date || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating ? { ...rating, ...formData } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Customer Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({...formData, rating: parseFloat(value)})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5.0 Stars</SelectItem>
            <SelectItem value="4.9">4.9 Stars</SelectItem>
            <SelectItem value="4.8">4.8 Stars</SelectItem>
            <SelectItem value="4.7">4.7 Stars</SelectItem>
            <SelectItem value="4.6">4.6 Stars</SelectItem>
            <SelectItem value="4.5">4.5 Stars</SelectItem>
            <SelectItem value="4">4.0 Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="type">Review Type</Label>
        <Select value={formData.type} onValueChange={(value: "website" | "google") => setFormData({...formData, type: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website">Website Review</SelectItem>
            <SelectItem value="google">Google Maps Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "google" && (
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="e.g., Downtown, Central Area"
          />
        </div>
      )}

      <div>
        <Label htmlFor="comment">Review Comment</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({...formData, comment: e.target.value})}
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Review Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {rating ? "Update Rating" : "Add Rating"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}