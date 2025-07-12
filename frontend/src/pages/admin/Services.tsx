import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "@/service/adminService/adminService";
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

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export default function Services() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleAddCategory = async (data: Partial<Category>) => {
    if (editingCategory) {
      // Update existing category via API
      try {
        const updated = await updateCategory(editingCategory.id, data);
        setCategories(categories.map((cat) =>
          cat.id === editingCategory.id ? updated : cat
        ));
        toast({
          title: "Category Updated",
          description: `${updated.name} updated successfully.`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update category.",
          variant: "destructive"
        });
      }
    } else {
      // Add new category via API
      try {
        const newCategory = await createCategory(data);
        setCategories([...categories, newCategory]);
        toast({
          title: "Category Added",
          description: `${newCategory.name} created successfully.`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to add category.",
          variant: "destructive"
        });
      }
    }
    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      toast({
        title: "Category Deleted",
        description: `${categoryToDelete.name} has been removed successfully.`,
        variant: "destructive"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete the category.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const CategoryForm = ({ onSubmit, onCancel, initialData }: { onSubmit: (data: Partial<Category>) => void; onCancel: () => void; initialData?: Partial<Category> }) => {
    const [formData, setFormData] = useState({
      name: initialData?.name || "",
      description: initialData?.description || ""
    });

    useEffect(() => {
      setFormData({
        name: initialData?.name || "",
        description: initialData?.description || ""
      });
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">{initialData ? "Update Category" : "Add Category"}</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Service Categories</h1>
        <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => { setIsCategoryDialogOpen(open); if (!open) setEditingCategory(null); }}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => { setEditingCategory(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleAddCategory}
              onCancel={() => { setIsCategoryDialogOpen(false); setEditingCategory(null); }}
              initialData={editingCategory || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md">
            <CardHeader className="pb-2 flex justify-between items-start">
              <div>
                <CardTitle>{category.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleDeleteCategory(category)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="link"
                className="px-0 text-blue-600"
                onClick={() =>
                  navigate(`/admin/services/${category.slug}`, {
                    state: { id: category.id },
                  })
                }
              >
                See All Services
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
