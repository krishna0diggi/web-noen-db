import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { ROLES } from '../types/roles';
// import { useAuth } from "./AuthContext";
import { useAuth } from "./AuthContext";
import { ROLES } from "@/models/role";


interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps = {}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // 1. While loading user => show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 2. If no authentication => go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role; // "admin" | "user" | "superadmin" | undefined
  

  // 3. If user role is still missing => force to wait
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading {userRole} role...</div>
      </div>
    );
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 5. Redirect admins to dashboard
  if (userRole === ROLES.ADMIN) {
    const fromPath = location.pathname;
    if (fromPath === "/" || fromPath === "/protected" || fromPath === "/home") {
      return <Navigate to="/datacruize" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
