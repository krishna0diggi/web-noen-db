import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, DollarSign, Edit, Star, Trash2 } from "lucide-react";
import {
  getServiceById,
  createService,
  updateService,
  deleteService
} from "@/service/adminService/adminService";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

interface Service {
  id: number;
  name: string;
  description: string;
  features: string[];
  price: number;
  discountedPrice: number;
  durationInMinutes: number;
  image: string;
  isAvailable: boolean;
  categoryId: number;
  category: {
    id: number;
    name: string;
    description: string;
    slug: string;
  };
}

export default function CategoryDetailsPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = location.state?.id;

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCategoryServices() {
      try {
        const data = await getServiceById(Number(categoryId));
        setServices(data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    }
    if (categoryId) fetchCategoryServices();
  }, [categoryId]);

  const handleSubmit = async (formData: any) => {
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await createService(formData);
      }
      const refreshed = await getServiceById(Number(categoryId));
      setServices(refreshed);
      setEditingService(null);
      setDialogOpen(false);
    } catch (err) {
      console.error("Failed to save service", err);
    }
  };

  const handleDelete = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteService(serviceToDelete.id);
      const refreshed = await getServiceById(Number(categoryId));
      setServices(refreshed);
      toast({
        title: "Service Deleted",
        description: "The service has been removed successfully.",
        variant: "destructive"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete the service.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const category = services[0]?.category || null;

  return (
    <div className="p-6 space-y-4">
      <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      {category && (
        <>
          <h2 className="text-2xl font-bold">{category.name}</h2>
          <p className="text-muted-foreground">{category.description}</p>
        </>
      )}

      {/* Add / Edit Service */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setEditingService(null)}>Add New Service</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <ServiceForm
            categoryId={Number(categoryId)}
            service={editingService}
            onCancel={() => {
              setEditingService(null);
              setDialogOpen(false);
            }}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>{service.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setEditingService(service);
                    setDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => handleDelete(service)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <img src={service.image} alt={service.name} className="w-full h-40 object-cover rounded-md" />
              <div className="flex justify-between text-sm">
                <span className="flex gap-1 items-center text-green-600 font-semibold">
                  <DollarSign className="w-4 h-4" /> ₹{service.discountedPrice}
                </span>
                <span className="text-muted-foreground">{service.durationInMinutes} min</span>
              </div>
              {/* {service.rating && (
                <div className="flex gap-1 text-yellow-600 items-center">
                  <Star className="w-4 h-4 fill-current" /> {service.rating}
                </div>
              )} */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ServiceForm({
  service,
  onSubmit,
  onCancel,
  categoryId,
}: {
  service?: Partial<Service> | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  categoryId: number;
}) {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    features: (service?.features || []).join("\n"),
    price: service?.price || 0,
    discountedPrice: service?.discountedPrice || 0,
    durationInMinutes: service?.durationInMinutes || 0,
    image: service?.image || "",
    isAvailable: service?.isAvailable ?? true,
    categoryId: categoryId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      features: formData.features.split("\n").map((f) => f.trim()).filter(Boolean),
      categoryId,
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label>Name</Label>
      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

      <Label>Description</Label>
      <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

      <Label>Features (One per line)</Label>
      <Textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price</Label>
          <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: +e.target.value })} />
        </div>
        <div>
          <Label>Discounted Price</Label>
          <Input type="number" value={formData.discountedPrice} onChange={(e) => setFormData({ ...formData, discountedPrice: +e.target.value })} />
        </div>
      </div>

      <Label>Duration (Minutes)</Label>
      <Input type="number" value={formData.durationInMinutes} onChange={(e) => setFormData({ ...formData, durationInMinutes: +e.target.value })} />

      <Label>Image URL</Label>
      <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />

      <Label>Availability</Label>
      <RadioGroup value={formData.isAvailable ? "yes" : "no"} onValueChange={(val) => setFormData({ ...formData, isAvailable: val === "yes" })}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yes" id="available-yes" />
          <Label htmlFor="available-yes">Available</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="no" id="available-no" />
          <Label htmlFor="available-no">Not Available</Label>
        </div>
      </RadioGroup>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">{service ? "Update" : "Add"} Service</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
