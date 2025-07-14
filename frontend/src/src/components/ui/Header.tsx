import { Link, useNavigate } from "react-router-dom";
import { Scissors, Shield, Calendar, UserCircle, LogIn, LogOut, ShoppingCart } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Cart from "@/components/ui/Cart";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  // Hide header if user is logged in and on /user/* route
  const isUserDashboard = user && window.location.pathname.startsWith('/user/');
  if (isUserDashboard) return null;
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-screen-lg mx-auto px-4 py-4">
       <div className="overflow-x-auto">
  <div className="flex items-center justify-between min-w-[600px] sm:min-w-full">

          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LooksNLove
              </span>
            </div>
          </Link>

         

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded hover:bg-primary/10 transition-colors"
              onClick={() => navigate(user ? '/user/cart' : '/cart')}
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                  {cart.length}
                </span>
              )}
            </button>
            <ThemeToggle />

            {!user && (
              <Button asChild variant="outline">
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Link>
              </Button>
            )}

            {user?.role === "ADMIN" && (
              <Button asChild variant="outline">
                <Link to="/admin">
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              </Button>
            )}

            {user && (
              <>
                {user.role !== "admin" && (
                  <Button asChild className="gap-2">
                    <Link to="/user">
                      <Calendar className="w-4 h-4" />
                      Book Now
                    </Link>
                  </Button>
                )}
                {user.role === "admin" && (
                  <Button asChild variant="outline">
                    <Link to="/admin">
                      <Shield className="w-4 h-4 mr-1" />
                      Admin
                    </Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <UserCircle className="w-5 h-5" />
                      {user.name?.split(" ")[0] || "Profile"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white shadow-lg rounded-md p-1 mt-2 min-w-[150px] border">
                    {/* <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded">
                        <UserCircle className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2 px-2 py-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
