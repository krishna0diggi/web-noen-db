import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserProfileModal } from "@/components/user/UserProfileModal";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Scissors, ShoppingCart, User, Home, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart } = useCart();
  const { logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/user", icon: Home },
    { name: "Services", href: "/user/services", icon: Scissors },
    { name: "Appointments", href: "/user/appointments", icon: Calendar },
    { name: "Cart", href: "/user/cart", icon: ShoppingCart },
  ];

  // Mock cart count - replace with actual cart state

  //  {cart.length > 0 && (
  //               <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
  //                 {cart.length}
  //               </span>
  //             )}
  // // const cart = []; // Replace with actual cart state from context or props
  // cart.length
  const cartCount = cart.length; // Replace with actual cart count from context or props

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LooksNLove
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                      {item.name === "Cart" && cartCount > 0 && (
                        <Badge variant="destructive" className="ml-1 text-xs">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <User className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 flex space-x-1 overflow-x-auto pb-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href} className="flex-shrink-0">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    {item.name === "Cart & History" && cartCount > 0 && (
                      <Badge variant="destructive" className="ml-1 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default UserLayout;