import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Create a custom type for car_listings table
export type CarListingRow = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  body_type: string | null;
  transmission: string | null;
  fuel_type: string | null;
  exterior_color: string | null;
  location: string;
  description: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  status: string;
  created_at: string;
  images: string[] | null;
  vin: string | null;
  regional_specs: string | null;
}

// Helper function to fetch car by id that handles type safety
export const fetchCarById = async (id: string) => {
  const { data, error } = await supabase
    .from('car_listings')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    throw new Error('Failed to fetch car details');
  }
  
  return data as CarListingRow;
};

// Simplified function to add a single demo car listing if needed
export const addDemoCarListing = async (userId: string) => {
  const demoListing = {
    make: "Toyota",
    model: "Camry",
    year: 2021,
    price: 85000,
    mileage: 45000,
    body_type: "Sedan",
    transmission: "Automatic",
    fuel_type: "Petrol",
    exterior_color: "White",
    location: "Dubai",
    description: "Well-maintained Toyota Camry with excellent fuel economy and smooth ride. Perfect family car.",
    status: "available",
    user_id: userId,
    images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop"],
    regional_specs: "GCC Specs"
  };

  const { data, error } = await supabase
    .from('car_listings')
    .insert(demoListing);

  if (error) {
    console.error("Error adding demo listing:", error);
    throw new Error('Failed to add demo car listing');
  }

  return { success: true };
};
