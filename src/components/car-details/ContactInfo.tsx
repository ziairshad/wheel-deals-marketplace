
import React from "react";
import { User, MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CarListingRow } from "@/integrations/supabase/client";

interface ContactInfoProps {
  car: CarListingRow;
}

const ContactInfo = ({ car }: ContactInfoProps) => {
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
          <div>
            <div className="text-sm text-muted-foreground">Phone</div>
            <div className="font-medium">{car.contact_phone || "Not provided"}</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="font-medium">{car.contact_email || "Not provided"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
