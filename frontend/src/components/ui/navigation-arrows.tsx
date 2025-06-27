import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationArrowsProps {
  className?: string;
  showHome?: boolean;
}

export function NavigationArrows({ className, showHome = true }: NavigationArrowsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleForward = () => {
    navigate(1);
  };

  const handleHome = () => {
    navigate("/");
  };

  const isHomePage = location.pathname === "/";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBack}
        className="gap-2"
        disabled={isHomePage}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleForward}
        className="gap-2"
      >
        <ArrowRight className="w-4 h-4" />
        Forward
      </Button>

      {showHome && !isHomePage && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleHome}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Home
        </Button>
      )}
    </div>
  );
}