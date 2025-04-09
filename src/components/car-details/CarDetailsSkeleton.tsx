
import React from "react";
import { Car } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CarDetailsSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full rounded-lg mb-6" />
            <div className="flex space-x-2 mb-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-24 h-24 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarDetailsSkeleton;
