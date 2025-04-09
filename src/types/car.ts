
export interface CarFormData {
  id?: string;
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
