import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MoveUp, MoveDown, Eye, EyeOff, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  bookings: number;
  popular: boolean;
  order: number;
  visible: boolean;
}

export default function ServiceOrdering() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Hair Styling",
      description: "Professional cuts, colors, and treatments",
      price: "Starting at $50",
      rating: 4.8,
      bookings: 245,
      popular: true,
      order: 1,
      visible: true
    },
    {
      id: "2",
      name: "Facial Treatments", 
      description: "Deep cleansing and anti-aging facials",
      price: "Starting at $80",
      rating: 4.9,
      bookings: 189,
      popular: true,
      order: 2,
      visible: true
    },
    {
      id: "3",
      name: "Manicure & Pedicure",
      description: "Complete nail care and design", 
      price: "Starting at $35",
      rating: 4.7,
      bookings: 312,
      popular: true,
      order: 3,
      visible: true
    },
    {
      id: "4",
      name: "Hair Coloring",
      description: "Professional hair coloring and highlights",
      price: "Starting at $120",
      rating: 4.8,
      bookings: 167,
      popular: true,
      order: 4,
      visible: true
    },
    {
      id: "5",
      name: "Deep Tissue Massage",
      description: "Relaxing full body massage therapy",
      price: "Starting at $90",
      rating: 4.9,
      bookings: 203,
      popular: true,
      order: 5,
      visible: true
    },
    {
      id: "6",
      name: "Bridal Package",
      description: "Complete makeover for your special day",
      price: "Starting at $200", 
      rating: 4.6,
      bookings: 89,
      popular: false,
      order: 6,
      visible: false
    },
    {
      id: "7",
      name: "Eyebrow Threading",
      description: "Precise eyebrow shaping and styling",
      price: "Starting at $25",
      rating: 4.5,
      bookings: 134,
      popular: false,
      order: 7,
      visible: false
    },
    {
      id: "8",
      name: "Makeup Application",
      description: "Professional makeup for special events",
      price: "Starting at $75",
      rating: 4.7,
      bookings: 156,
      popular: true,
      order: 8,
      visible: true
    }
  ]);

  const sortedServices = [...services].sort((a, b) => a.order - b.order);

  const moveService = (id: string, direction: "up" | "down") => {
    const currentService = services.find(s => s.id === id);
    if (!currentService) return;

    const newOrder = direction === "up" ? currentService.order - 1 : currentService.order + 1;
    const swapService = services.find(s => s.order === newOrder);

    if (swapService) {
      setServices(services.map(s => {
        if (s.id === id) return { ...s, order: newOrder };
        if (s.id === swapService.id) return { ...s, order: currentService.order };
        return s;
      }));
      
      toast({
        title: "Order Updated",
        description: "Service order has been updated successfully.",
      });
    }
  };

  const toggleServiceVisibility = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ));
    
    const service = services.find(s => s.id === id);
    toast({
      title: `Service ${service?.visible ? 'Hidden' : 'Shown'}`,
      description: `${service?.name} is now ${service?.visible ? 'hidden from' : 'visible on'} the homepage.`,
    });
  };

  const togglePopularStatus = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, popular: !s.popular } : s
    ));
    
    const service = services.find(s => s.id === id);
    toast({
      title: `Popular Status Updated`,
      description: `${service?.name} is now ${service?.popular ? 'removed from' : 'marked as'} popular services.`,
    });
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Service Ordering</h1>
        <p className="text-muted-foreground">Manage the order and visibility of services on the homepage</p>
      </div>

      <div className="grid gap-4">
        {sortedServices.map((service, index) => (
          <motion.div
            key={service.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`${service.visible ? 'border-border' : 'border-muted bg-muted/30'}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{service.name}</h4>
                      <Badge variant="outline">Order: {service.order}</Badge>
                      {service.popular && <Badge>Popular</Badge>}
                      {!service.visible && <Badge variant="secondary">Hidden</Badge>}
                    </div>
                    
                    <p className="text-muted-foreground mb-2">{service.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">{service.price}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(service.rating)}
                        <span className="ml-1">{service.rating}</span>
                      </div>
                      <span className="text-muted-foreground">{service.bookings} bookings</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`visible-${service.id}`} className="text-sm">
                        Visible on Homepage
                      </Label>
                      <Switch
                        id={`visible-${service.id}`}
                        checked={service.visible}
                        onCheckedChange={() => toggleServiceVisibility(service.id)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor={`popular-${service.id}`} className="text-sm">
                        Popular Service
                      </Label>
                      <Switch
                        id={`popular-${service.id}`}
                        checked={service.popular}
                        onCheckedChange={() => togglePopularStatus(service.id)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveService(service.id, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveService(service.id, "down")}
                        disabled={index === sortedServices.length - 1}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Homepage Display Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Visible Services (Order on Homepage):</h4>
              <div className="flex flex-wrap gap-2">
                {sortedServices
                  .filter(s => s.visible)
                  .map((service) => (
                    <Badge key={service.id} variant="outline">
                      {service.order}. {service.name}
                    </Badge>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Popular Services Carousel:</h4>
              <div className="flex flex-wrap gap-2">
                {sortedServices
                  .filter(s => s.popular && s.visible)
                  .map((service) => (
                    <Badge key={service.id}>
                      {service.order}. {service.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}