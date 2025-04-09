
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Pencil } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchCarById } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CarGallery from "@/components/CarGallery";
import CarSpecs from "@/components/car-details/CarSpecs";
import CarHeader from "@/components/car-details/CarHeader";
import ContactInfo from "@/components/car-details/ContactInfo";
import SafetyTips from "@/components/car-details/SafetyTips";
import CarDescription from "@/components/car-details/CarDescription";
import CarDetailsSkeleton from "@/components/car-details/CarDetailsSkeleton";
import CarDetailsError from "@/components/car-details/CarDetailsError";

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      if (!id) throw new Error('Car ID is required');
      return await fetchCarById(id);
    }
  });

  // Check if the current user is the owner of the listing
  const isOwner = user && car && user.id === car.user_id;

  if (isLoading) {
    return <CarDetailsSkeleton />;
  }

  if (error || !car) {
    return <CarDetailsError />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to listings
          </Link>
          
          {isOwner && (
            <Button
              onClick={() => navigate(`/edit/${car.id}`)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Listing
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Gallery */}
            <CarGallery 
              images={car.images || []} 
              title={`${car.year} ${car.make} ${car.model}`} 
            />
            
            {/* Car Title & Price */}
            <CarHeader car={car} />
            
            {/* Car Specs */}
            <CarSpecs car={car} />
            
            {/* Description */}
            <CarDescription car={car} />
          </div>
          
          {/* Sidebar Column - Sticky */}
          <div className="space-y-6 sticky top-6 self-start max-h-screen overflow-y-auto pb-6">
            {/* Contact Information */}
            <ContactInfo car={car} />
            
            {/* Safety Tips */}
            <SafetyTips />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CarDetailsPage;
