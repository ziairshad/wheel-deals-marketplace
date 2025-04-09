
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Car className="h-6 w-6 text-car-blue mr-2" />
          <span className="font-bold text-xl">AutoMarket</span>
        </Link>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/my-listings")}
                className="hidden sm:inline-flex"
              >
                My Listings
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/sell")}
                className="hidden sm:inline-flex"
              >
                Sell Your Car
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="flex items-center"
              >
                <UserCircle className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/auth")}>
              <UserCircle className="h-5 w-5 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
