
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect to auth page but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user's email has been verified
  if (!user.email_confirmed_at) {
    toast.error("Please verify your email before accessing this page.");
    return <Navigate to="/auth" state={{ from: location, requireVerification: true }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
