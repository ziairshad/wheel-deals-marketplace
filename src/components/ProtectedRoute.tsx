
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requirePhoneVerification?: boolean;
};

const ProtectedRoute = ({ children, requirePhoneVerification = false }: ProtectedRouteProps) => {
  const { user, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect to auth page but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If phone verification is required but not verified
  if (requirePhoneVerification && profile && !profile.phone_verified) {
    // Redirect to auth page to complete verification
    return <Navigate to="/auth" state={{ 
      from: location, 
      verifyPhone: true 
    }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
