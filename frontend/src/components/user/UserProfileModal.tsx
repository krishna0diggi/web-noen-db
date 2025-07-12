import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, MapPin, LogOut, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/service/userService/userService";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal = ({ isOpen, onClose }: UserProfileModalProps) => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const userId = user?.id || 0;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userProfile, setUserProfile] = useState({
    id: 0,
    name: "",
    phone: "",
    address: ""
  });

  const [editData, setEditData] = useState({
    id: 0,
    name: "",
    address: ""
  });

  // Fetch user profile from API when modal opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (isOpen && userId) {
        try {
          const profile = await getUserProfile(userId);
          setUserProfile({
            id: profile.id,
            name: profile.name,
            phone: profile.phone,
            address: profile.address || ""
          });
          setEditData({
            id: profile.id,
            name: profile.name,
            address: profile.address || ""
          });
        } catch (e) {
          toast({
            title: "Error",
            description: "Failed to fetch profile.",
            variant: "destructive",
          });
        }
      }
    };
    fetchProfile();
  }, [isOpen, userId]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateUserProfile(editData);
      // Re-fetch profile after update to ensure latest data
      const profile = await getUserProfile(userId);
      setUserProfile({
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        address: profile.address || ""
      });
      setEditData({
        id: profile.id,
        name: profile.name,
        address: profile.address || ""
      });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      id: userProfile.id,
      name: userProfile.name,
      address: userProfile.address
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    window.location.href = "/";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            My Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture */}
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">{userProfile.name}</div>
              )}
            </div>

            {/* Phone Field (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={userProfile.phone}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  placeholder="Enter your address"
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-md">
                  {userProfile.address || "Not added"}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} className="flex-1" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full gap-2"
                variant="outline"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            )}

            <Separator />

            <Button
              onClick={logout}
              variant="destructive"
              className="w-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
