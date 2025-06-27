import { useState } from "react";
import { Plus, Edit, Trash2, Star, DollarSign, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  discount: number;
  category: string;
  image: string;
}

const initialServices: Service[] = [
  {
    id: "1",
    name: "Hair Cut & Style",
    description: "Professional haircut with styling and blow-dry",
    price: 85,
    duration: "60 min",
    rating: 4.8,
    discount: 10,
    category: "Hair",
    image: "💇‍♀️",
  },
  {
    id: "2",
    name: "Manicure & Pedicure",
    description: "Complete nail care with gel polish",
    price: 65,
    duration: "90 min",
    rating: 4.9,
    discount: 0,
    category: "Nails",
    image: "💅",
  },
  {
    id: "3",
    name: "Facial Treatment",
    description: "Deep cleansing facial with moisturizing",
    price: 120,
    duration: "75 min",
    rating: 4.7,
    discount: 15,
    category: "Skincare",
    image: "🧴",
  },
  {
    id: "4",
    name: "Eyebrow Threading",
    description: "Professional eyebrow shaping and threading",
    price: 25,
    duration: "30 min",
    rating: 4.6,
    discount: 0,
    category: "Eyebrows",
    image: "✨",
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleAddService = (newService: Partial<Service>) => {
    const service: Service = {
      id: Date.now().toString(),
      name: newService.name || "",
      description: newService.description || "",
      price: newService.price || 0,
      duration: newService.duration || "",
      rating: 0,
      discount: newService.discount || 0,
      category: newService.category || "",
      image: newService.image || "💄",
    };
    setServices([...services, service]);
    setIsDialogOpen(false);
    toast({
      title: "Service Created",
      description: `${service.name} has been added to your services.`,
    });
  };

  const handleEditService = (id: string, updatedService: Partial<Service>) => {
    const service = services.find(s => s.id === id);
    setServices(services.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    ));
    setEditingService(null);
    setIsDialogOpen(false);
    toast({
      title: "Service Updated",
      description: `${service?.name} has been successfully updated.`,
    });
  };

  const handleDeleteService = (id: string) => {
    const service = services.find(s => s.id === id);
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Service Deleted",
      description: `${service?.name} has been removed from your services.`,
      variant: "destructive",
    });
  };

  const categories = Array.from(new Set(services.map(service => service.category)));
  
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const ServiceForm = ({ service, onSubmit, onCancel }: {
    service?: Service | null;
    onSubmit: (service: Partial<Service>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: service?.name || "",
      description: service?.description || "",
      price: service?.price || 0,
      duration: service?.duration || "",
      discount: service?.discount || 0,
      category: service?.category || "",
      image: service?.image || "💄",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g., 60 min"
              required
            />
          </div>
          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="image">Emoji Icon</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            placeholder="💄"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {service ? "Update Service" : "Add Service"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services Management</h1>
          <p className="text-muted-foreground">Manage your salon services, pricing, and discounts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingService(null)}>
              <Plus className="w-4 h-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <ServiceForm
              service={editingService}
              onSubmit={editingService 
                ? (data) => handleEditService(editingService.id, data)
                : handleAddService
              }
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 p-2 border border-border rounded-md bg-background"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{service.image}</div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingService(service);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{service.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <span className="font-semibold text-foreground">${service.price}</span>
                  {service.discount > 0 && (
                    <Badge variant="secondary" className="bg-success text-success-foreground">
                      -{service.discount}%
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{service.duration}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}