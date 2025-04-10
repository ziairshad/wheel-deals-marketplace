
import { Link } from "react-router-dom";
import { Car } from "lucide-react";

type AuthHeaderProps = {
  activeTab: string;
  emailSent: boolean;
};

const AuthHeader = ({ activeTab, emailSent }: AuthHeaderProps) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <Link to="/" className="flex items-center gap-2 mb-4">
        <Car className="h-8 w-8 text-car-blue" />
        <span className="text-2xl font-bold text-car-blue">Wheel Deals</span>
      </Link>
      
      {emailSent ? (
        <h1 className="text-2xl font-semibold text-center">Check Your Email</h1>
      ) : (
        <h1 className="text-2xl font-semibold text-center">
          {activeTab === "login" ? "Welcome back" : "Create an account"}
        </h1>
      )}
      
      {emailSent ? (
        <p className="text-center text-muted-foreground mt-2">
          We've sent you a verification email. Please check your inbox and click the link to verify your account.
        </p>
      ) : (
        <p className="text-center text-muted-foreground mt-2">
          {activeTab === "login" 
            ? "Enter your credentials to access your account" 
            : "Fill in your details to create a new account"}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;
