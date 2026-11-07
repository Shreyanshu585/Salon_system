import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FullscreenLoader } from "@/components/ui/FullscreenLoader";

export function ProtectedRoute({ children, roles }) {
  const { authenticated, initializing, roles: userRoles } = useAuth();
  const location = useLocation();

  if (initializing) return <FullscreenLoader />;
  if (!authenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && roles.length > 0 && !roles.some((r) => userRoles.includes(r))) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
