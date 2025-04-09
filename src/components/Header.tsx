
import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { useMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMobile();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Car Marketplace
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:space-x-4">
          <nav className="flex items-center space-x-6">
            <Link to="/" className="font-medium text-sm transition-colors hover:text-foreground">
              Home
            </Link>
            <Link to="/sell" className="font-medium text-sm transition-colors hover:text-foreground">
              Sell Your Car
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-listings"
                className="font-medium text-sm transition-colors hover:text-foreground"
              >
                My Listings
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url || user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.name || "Avatar"} />
                      <AvatarFallback>{(user?.user_metadata?.name || "U").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="grid gap-2 px-2 py-1">
                    <div className="grid gap-0.5">
                      <p className="text-sm font-medium text-foreground">{user?.user_metadata?.name || user?.email}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/my-listings");
                    }}
                  >
                    My Listings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/sell");
                    }}
                  >
                    Sell Your Car
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      navigate("/auth");
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex md:hidden flex-1 justify-end">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="ml-2"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open main menu</span>
          </Button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"></div>
          
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              
              <div className="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                <div className="bg-card px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-base font-semibold leading-6 text-foreground" id="modal-title">
                        Menu
                      </h3>
                      <div className="mt-4">
                        <nav className="grid gap-6">
                          <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className="font-medium text-sm transition-colors hover:text-foreground"
                          >
                            Home
                          </Link>
                          <Link
                            to="/sell"
                            onClick={closeMobileMenu}
                            className="font-medium text-sm transition-colors hover:text-foreground"
                          >
                            Sell Your Car
                          </Link>
                          {isAuthenticated && (
                            <Link
                              to="/my-listings"
                              onClick={closeMobileMenu}
                              className="font-medium text-sm transition-colors hover:text-foreground"
                            >
                              My Listings
                            </Link>
                          )}
                          {!isAuthenticated ? (
                            <Link
                              to="/auth"
                              onClick={closeMobileMenu}
                              className="font-medium text-sm transition-colors hover:text-foreground"
                            >
                              Sign In
                            </Link>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                signOut();
                                closeMobileMenu();
                                navigate("/auth");
                              }}
                            >
                              Sign Out
                            </Button>
                          )}
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
