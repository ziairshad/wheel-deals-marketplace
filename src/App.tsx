
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import CarDetailsPage from "./pages/CarDetailsPage";
import AuthPage from "./pages/AuthPage";
import SellYourCarPage from "./pages/SellYourCarPage";
import MyListingsPage from "./pages/MyListingsPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />}>
              <Route index element={<HomePage />} />
              <Route path="car/:id" element={<CarDetailsPage />} />
              <Route path="auth" element={<AuthPage />} />
              <Route 
                path="sell" 
                element={
                  <ProtectedRoute>
                    <SellYourCarPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="my-listings" 
                element={
                  <ProtectedRoute>
                    <MyListingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
