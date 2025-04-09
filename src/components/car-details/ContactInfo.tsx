
import React from "react";
import { User, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CarListingRow } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ContactInfoProps {
  car: CarListingRow;
}

const ContactInfo = ({ car }: ContactInfoProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCallDialog, setShowCallDialog] = React.useState(false);

  const handleCallClick = () => {
    if (user) {
      setShowCallDialog(true);
    } else {
      // Redirect to auth page with the current location as the return destination
      navigate("/auth", { state: { from: location } });
    }
  };

  const makePhoneCall = () => {
    if (car.contact_phone) {
      window.location.href = `tel:${car.contact_phone}`;
    }
    setShowCallDialog(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h2 className="font-semibold">Contact Information</h2>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-start">
          <User className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
          <div>
            <div className="text-sm text-muted-foreground">Seller</div>
            <div className="font-medium">{car.contact_name || "Not provided"}</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
          <div>
            <div className="text-sm text-muted-foreground">Location</div>
            <div className="font-medium">{car.location}</div>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
          <div className="w-full">
            <div className="text-sm text-muted-foreground">Phone</div>
            <Button 
              onClick={handleCallClick} 
              className="mt-1 w-full"
              variant="default"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Seller
            </Button>
          </div>
        </div>
      </div>

      {/* Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Call Seller</DialogTitle>
            <DialogDescription>
              You're about to call {car.contact_name || "the seller"} about the {car.year} {car.make} {car.model}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center font-medium text-lg">{car.contact_phone || "No phone number available"}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallDialog(false)}>Cancel</Button>
            <Button onClick={makePhoneCall} disabled={!car.contact_phone}>
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactInfo;
