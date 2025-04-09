
import React from "react";
import { Car } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CarDetailsError = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 text-center">
        <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Car Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The car listing you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button>Browse Available Cars</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default CarDetailsError;
