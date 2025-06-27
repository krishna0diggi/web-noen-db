import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Percent, Gift, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { discountStore, type Discount } from "@/lib/discount-store";

export default function DiscountManagement() {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  // Load discounts from store
  useEffect(() => {
    const updateDiscounts = () => {
      setDiscounts(discountStore.getAllDiscounts());
    };
    
    updateDiscounts();
    const unsubscribe = discountStore.subscribe(updateDiscounts);
    return unsubscribe;
  }, []);

  const [pagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 2,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    description: "",
    applicableServices: [] as string[],
    customerTier: "all" as "all" | "vip" | "regular",
    validFrom: "",
    validTo: "",
    isActive: true,
    isFestival: false,
    usageLimit: undefined as number | undefined
  });

  const availableServices = ["Hair Styling", "Facial Treatment", "Massage", "Bridal Package", "Manicure", "Pedicure"];

  const resetForm = () => {
    setFormData({
      name: "",
      type: "percentage",
      value: 0,
      description: "",
      applicableServices: [],
      customerTier: "all",
      validFrom: "",
      validTo: "",
      isActive: true,
      isFestival: false,
      usageLimit: undefined
    });
    setEditingDiscount(null);
  };

  const handleOpenDialog = (discount?: Discount) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        name: discount.name,
        type: discount.discountType,
        value: discount.discountValue,
        description: discount.description,
        applicableServices: discount.applicableServices,
        customerTier: discount.customerTier,
        validFrom: discount.validUntil.split('T')[0], // Convert ISO to date
        validTo: discount.validUntil.split('T')[0],
        isActive: discount.isActive,
        isFestival: discount.isFestival,
        usageLimit: undefined
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDiscount) {
      // Update existing discount
      discountStore.updateDiscount(editingDiscount.id, {
        name: formData.name,
        discountType: formData.type,
        discountValue: formData.value,
        description: formData.description,
        applicableServices: formData.applicableServices,
        customerTier: formData.customerTier,
        validUntil: `${formData.validTo}T23:59:59Z`,
        isActive: formData.isActive,
        isFestival: formData.isFestival
      });
      toast({
        title: "Discount Updated",
        description: "Discount has been updated successfully.",
      });
    } else {
      // Create new discount
      discountStore.addDiscount({
        name: formData.name,
        discountType: formData.type,
        discountValue: formData.value,
        description: formData.description,
        applicableServices: formData.applicableServices,
        customerTier: formData.customerTier,
        validUntil: `${formData.validTo}T23:59:59Z`,
        isActive: formData.isActive,
        isFestival: formData.isFestival
      });
      toast({
        title: "Discount Created",
        description: "New discount has been created successfully.",
      });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    discountStore.deleteDiscount(id);
    toast({
      title: "Discount Deleted",
      description: "Discount has been deleted successfully.",
    });
  };

  const toggleDiscountStatus = (id: string) => {
    const discount = discounts.find(d => d.id === id);
    if (discount) {
      if (discount.isActive) {
        discountStore.deactivateDiscount(id);
      } else {
        discountStore.activateDiscount(id);
      }
      toast({
        title: "Discount Updated",
        description: `Discount ${discount.isActive ? 'deactivated' : 'activated'} successfully.`,
      });
    }
  };

  const columns = [
    {
      key: "name" as keyof Discount,
      label: "Discount Name",
      render: (value: string, row: Discount) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {value}
            {row.isFestival && <Badge variant="secondary" className="text-xs">Festival</Badge>}
          </div>
          <div className="text-sm text-muted-foreground">{row.description}</div>
        </div>
      ),
      width: "250px"
    },
    {
      key: "discountValue" as keyof Discount,
      label: "Value",
      render: (value: number, row: Discount) => (
        <div className="font-semibold text-primary">
          {row.discountType === "percentage" ? `${value}%` : `$${value}`} OFF
        </div>
      )
    },
    {
      key: "customerTier" as keyof Discount,
      label: "Customer Tier",
      render: (value: string) => (
        <Badge variant={value === "vip" ? "default" : value === "regular" ? "secondary" : "outline"}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    {
      key: "validUntil" as keyof Discount,
      label: "Valid Until",
      render: (value: string) => (
        <div className="text-sm">
          <div>{new Date(value).toLocaleDateString()}</div>
        </div>
      )
    },
    {
      key: "isActive" as keyof Discount,
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "outline"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      )
    }
  ];

  return (
    <div className="p-6">
      <DataTable
        data={discounts}
        columns={columns}
        pagination={pagination}
        title="Discount & Promotion Management"
        subtitle="Manage VIP benefits, festival discounts, and promotional offers"
        searchable
        searchPlaceholder="Search discounts..."
        actions={
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4" />
            Add Discount
          </Button>
        }
        rowActions={(discount) => (
          <>
            <Switch
              checked={discount.isActive}
              onCheckedChange={() => toggleDiscountStatus(discount.id)}
            />
            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(discount)}>
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
                  <AlertDialogTitle>Delete Discount</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this discount? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(discount.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      />

      {/* Discount Form Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDiscount ? "Edit Discount" : "Create New Discount"}
            </DialogTitle>
            <DialogDescription>
              {editingDiscount 
                ? "Update the discount details below." 
                : "Create a new discount or promotional offer."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Discount Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Summer Sale"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Discount Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "percentage" | "fixed") => 
                    setFormData({...formData, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">
                  Discount Value {formData.type === "percentage" ? "(%)" : "($)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  placeholder={formData.type === "percentage" ? "20" : "50"}
                  min="0"
                  max={formData.type === "percentage" ? "100" : undefined}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerTier">Customer Tier</Label>
                <Select
                  value={formData.customerTier}
                  onValueChange={(value: "all" | "vip" | "regular") => 
                    setFormData({...formData, customerTier: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="vip">VIP Only</SelectItem>
                    <SelectItem value="regular">Regular Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the discount offer..."
                rows={3}
              />
            </div>

            <div>
              <Label>Applicable Services</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.applicableServices.includes("all")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, applicableServices: ["all"]});
                        } else {
                          setFormData({...formData, applicableServices: []});
                        }
                      }}
                    />
                    <span>All Services</span>
                  </label>
                </div>
                {availableServices.map((service) => (
                  <div key={service}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.applicableServices.includes(service)}
                        disabled={formData.applicableServices.includes("all")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData, 
                              applicableServices: [...formData.applicableServices.filter(s => s !== "all"), service]
                            });
                          } else {
                            setFormData({
                              ...formData, 
                              applicableServices: formData.applicableServices.filter(s => s !== service)
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valid From</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="validTo">Valid Until</Label>
                <Input
                  id="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit || ""}
                  onChange={(e) => setFormData({
                    ...formData, 
                    usageLimit: e.target.value ? Number(e.target.value) : undefined
                  })}
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </div>
              <div className="space-y-3 pt-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFestival"
                    checked={formData.isFestival}
                    onCheckedChange={(checked) => setFormData({...formData, isFestival: checked})}
                  />
                  <Label htmlFor="isFestival">Festival Offer</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingDiscount ? "Update Discount" : "Create Discount"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Percent className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{discounts.filter(d => d.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Active Discounts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{discounts.length}</div>
            <div className="text-sm text-muted-foreground">Total Discounts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{discounts.filter(d => d.isFestival && d.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Festival Offers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-primary font-bold">VIP</span>
            </div>
            <div className="text-2xl font-bold">{discounts.filter(d => d.customerTier === "vip" && d.isActive).length}</div>
            <div className="text-sm text-muted-foreground">VIP Benefits</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}