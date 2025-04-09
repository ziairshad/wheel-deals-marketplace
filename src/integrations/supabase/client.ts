
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Supabase URL and anon key
const supabaseUrl = 'https://quwvbnrtlvdtvelcwqsy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1d3ZibnJ0bHZkdHZlbGN3cXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTkwNTMsImV4cCI6MjA1OTczNTA1M30.oQTaRkZ1quaK-el94QhOBXqjLnda8oET1SPyvh0AKk8';

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

// Helper function to add demo car listings
export const addDemoCarListings = async (userId: string) => {
  const demoListings = [
    {
      make: "Toyota",
      model: "Camry",
      year: 2019,
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
      images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop"]
    },
    {
      make: "Honda",
      model: "CR-V",
      year: 2020,
      price: 110000,
      mileage: 32000,
      body_type: "SUV",
      transmission: "Automatic",
      fuel_type: "Petrol",
      exterior_color: "Silver",
      location: "Abu Dhabi",
      description: "Spacious Honda CR-V with all the latest features. Perfect for family trips and daily commute.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1568844293986-ca3c5aea413f?w=800&auto=format&fit=crop"]
    },
    {
      make: "BMW",
      model: "3 Series",
      year: 2021,
      price: 195000,
      mileage: 15000,
      body_type: "Sedan",
      transmission: "Automatic",
      fuel_type: "Petrol",
      exterior_color: "Black",
      location: "Sharjah",
      description: "Luxury BMW 3 Series with premium features and powerful engine. Sporty and comfortable.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop"]
    },
    {
      make: "Mercedes-Benz",
      model: "GLC",
      year: 2022,
      price: 240000,
      mileage: 8000,
      body_type: "SUV",
      transmission: "Automatic",
      fuel_type: "Diesel",
      exterior_color: "Gray",
      location: "Dubai",
      description: "Elegant Mercedes-Benz GLC with cutting-edge technology and refined interior. Excellent condition.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1606664608504-14281d34ee36?w=800&auto=format&fit=crop"]
    },
    {
      make: "Audi",
      model: "A4",
      year: 2020,
      price: 170000,
      mileage: 25000,
      body_type: "Sedan",
      transmission: "Automatic",
      fuel_type: "Petrol",
      exterior_color: "Blue",
      location: "Ajman",
      description: "Sophisticated Audi A4 with premium interior and smooth driving experience. Well maintained.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?w=800&auto=format&fit=crop"]
    },
    {
      make: "Ford",
      model: "Mustang",
      year: 2018,
      price: 145000,
      mileage: 40000,
      body_type: "Coupe",
      transmission: "Manual",
      fuel_type: "Petrol",
      exterior_color: "Red",
      location: "Ras Al Khaimah",
      description: "Classic Ford Mustang with powerful V8 engine. Thrilling driving experience guaranteed.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop"]
    },
    {
      make: "Nissan",
      model: "Pathfinder",
      year: 2019,
      price: 120000,
      mileage: 38000,
      body_type: "SUV",
      transmission: "Automatic",
      fuel_type: "Petrol",
      exterior_color: "Brown",
      location: "Fujairah",
      description: "Rugged Nissan Pathfinder with ample space for family adventures. Great off-road capability.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop"]
    },
    {
      make: "Kia",
      model: "Sportage",
      year: 2021,
      price: 95000,
      mileage: 18000,
      body_type: "SUV",
      transmission: "Automatic",
      fuel_type: "Hybrid",
      exterior_color: "Green",
      location: "Umm Al Quwain",
      description: "Modern Kia Sportage with fuel-efficient hybrid engine. Packed with safety features.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1607853554306-b1f99b5500d7?w=800&auto=format&fit=crop"]
    },
    {
      make: "Hyundai",
      model: "Tucson",
      year: 2020,
      price: 88000,
      mileage: 29000,
      body_type: "SUV",
      transmission: "Automatic",
      fuel_type: "Petrol",
      exterior_color: "Silver",
      location: "Abu Dhabi",
      description: "Reliable Hyundai Tucson with comfortable interior and smooth ride. Great value for money.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1601929862217-f1bf94503333?w=800&auto=format&fit=crop"]
    },
    {
      make: "Tesla",
      model: "Model 3",
      year: 2022,
      price: 210000,
      mileage: 5000,
      body_type: "Sedan",
      transmission: "Automatic",
      fuel_type: "Electric",
      exterior_color: "White",
      location: "Dubai",
      description: "Cutting-edge Tesla Model 3 with long range battery and autopilot features. Zero emissions.",
      status: "available",
      user_id: userId,
      images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop"]
    }
  ];

  const { data, error } = await supabase
    .from('car_listings')
    .insert(demoListings);

  if (error) {
    console.error("Error adding demo listings:", error);
    throw new Error('Failed to add demo car listings');
  }

  return { success: true };
};
