
export interface CarFormData {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  color: string;
  location: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  vin: string;
}

export interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  images: string[];
  created_at: string;
  location: string;
  body_type?: string;
  transmission?: string;
  fuel_type?: string;
  exterior_color?: string;
  description?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  vin?: string;
  user_id?: string;
}

// Helper function to convert from API format to form format
export function convertToFormData(carListing: CarListing): CarFormData {
  return {
    make: carListing.make || '',
    model: carListing.model || '',
    year: carListing.year?.toString() || '',
    price: carListing.price?.toString() || '',
    mileage: carListing.mileage?.toString() || '',
    bodyType: carListing.body_type || '',
    transmission: carListing.transmission || '',
    fuelType: carListing.fuel_type || '',
    color: carListing.exterior_color || '',
    location: carListing.location || '',
    description: carListing.description || '',
    contactName: carListing.contact_name || '',
    contactPhone: carListing.contact_phone || '',
    contactEmail: carListing.contact_email || '',
    vin: carListing.vin || '',
  };
}
