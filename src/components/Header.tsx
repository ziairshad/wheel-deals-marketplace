
import { Link } from "react-router-dom";
import { Car, Home, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-car-blue" />
          <span className="text-xl font-bold text-car-blue">Wheel Deals</span>
        </Link>
        
        <div className="flex-1 mx-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search makes, models, or keywords..."
              className="w-full bg-background pl-8 pr-4"
            />
          </div>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          
          <Button className="bg-car-blue hover:bg-blue-700">
            Sell Your Car
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
