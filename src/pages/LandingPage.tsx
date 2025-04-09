
import React from "react";
import { Link } from "react-router-dom";
import { Car, Shield, CheckCircle, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 py-20 px-4 md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Buy & Sell Used Cars – Directly, Safely, and Without the Middlemen
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-3xl mx-auto">
            A trusted UAE platform connecting real car buyers and sellers. 
            No dealers. No spam. Just verified users and approved listings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="text-base font-semibold bg-car-blue hover:bg-blue-700 py-6"
            >
              <Link to="/browse">Browse Cars</Link>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline" 
              className="text-base font-semibold border-car-blue text-car-blue hover:bg-blue-50 py-6"
            >
              <Link to="/sell">Sell My Car</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Key Highlights Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">
            Why Choose Wheel Deals?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Highlight 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                <Car className="w-8 h-8 text-car-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Direct from Owner</h3>
              <p className="text-slate-600">No hidden markups. No shady dealerships.</p>
            </div>
            
            {/* Highlight 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                <Shield className="w-8 h-8 text-car-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Verified Users</h3>
              <p className="text-slate-600">All buyers and sellers go through verification.</p>
            </div>
            
            {/* Highlight 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                <CheckCircle className="w-8 h-8 text-car-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Ad Approval Guarantee</h3>
              <p className="text-slate-600">Every listing is manually reviewed for authenticity.</p>
            </div>
            
            {/* Highlight 4 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                <Banknote className="w-8 h-8 text-car-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">100% Free, Always</h3>
              <p className="text-slate-600">No listing fees. No commissions. No surprises. Ever.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Join thousands of satisfied UAE drivers who found their perfect ride on Wheel Deals.
          </p>
          <Button 
            asChild
            size="lg"
            className="text-base font-semibold bg-car-blue hover:bg-blue-700 py-6"
          >
            <Link to="/browse">Get Started Today</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
