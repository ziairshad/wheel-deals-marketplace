
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "./pages/HomePage";
import CarDetailsPage from "./pages/CarDetailsPage";
import SellYourCarPage from "./pages/SellYourCarPage";
import EditCarPage from "./pages/EditCarPage";
import MyListingsPage from "./pages/MyListingsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/car/:id" element={<CarDetailsPage />} />
              <Route 
                path="/sell" 
                element={
                  <ProtectedRoute requirePhoneVerification={true}>
                    <SellYourCarPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute requirePhoneVerification={true}>
                    <EditCarPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-listings" 
                element={
                  <ProtectedRoute>
                    <MyListingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/auth" element={<AuthPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
