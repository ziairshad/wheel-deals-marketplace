export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  location: string;
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  description: string;
  features: string[];
  images: string[];
  status: "available" | "sold" | "pending";
  bodyType: string;
  engine: string;
  drivetrain: string;
  sellerType: "dealer" | "private";
  sellerName: string;
  listedDate: string;
}

// Define valid emirates
export type Emirate = "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah";

export const emirates: Emirate[] = [
  "Abu Dhabi",
  "Dubai", 
  "Sharjah", 
  "Ajman", 
  "Umm Al Quwain", 
  "Ras Al Khaimah", 
  "Fujairah"
];

export const cars: Car[] = [
  {
    id: "1",
    make: "BMW",
    model: "3 Series",
    year: 2021,
    price: 157000,
    mileage: 15430,
    fuelType: "Gasoline",
    transmission: "Automatic",
    location: "Dubai",
    exteriorColor: "Alpine White",
    interiorColor: "Black",
    vin: "WBA5R7C08LFH38394",
    description: "This BMW 3 Series is in excellent condition with low mileage. Features include premium package, navigation, heated seats, and more. Clean title and service records available.",
    features: [
      "Navigation System",
      "Leather Seats",
      "Sunroof",
      "Bluetooth",
      "Backup Camera",
      "Heated Seats",
      "Keyless Entry",
      "Lane Departure Warning"
    ],
    images: [
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1606664608504-14281d34ee36?auto=format&fit=crop&q=80&w=1000"
    ],
    status: "available",
    bodyType: "Sedan",
    engine: "2.0L Turbo I4",
    drivetrain: "RWD",
    sellerType: "dealer",
    sellerName: "Premium Auto Group",
    listedDate: "2023-03-15"
  },
  {
    id: "2",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 179500,
    mileage: 8750,
    fuelType: "Electric",
    transmission: "Automatic",
    location: "Abu Dhabi",
    exteriorColor: "Midnight Silver",
    interiorColor: "White",
    vin: "5YJ3E1EA4NF123456",
    description: "Tesla Model 3 Long Range with Premium Interior. Autopilot included. Great condition with very low mileage. Still under manufacturer warranty.",
    features: [
      "Autopilot",
      "Premium Sound System",
      "Glass Roof",
      "Heated Seats",
      "Navigation",
      "Wireless Charging",
      "Smart Summon",
      "Sentry Mode"
    ],
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1553260168-69b041873e65?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1551952238-2315a31e1f29?auto=format&fit=crop&q=80&w=1000"
    ],
    status: "available",
    bodyType: "Sedan",
    engine: "Electric",
    drivetrain: "AWD",
    sellerType: "private",
    sellerName: "Michael T.",
    listedDate: "2023-03-25"
  },
  {
    id: "3",
    make: "Toyota",
    model: "RAV4",
    year: 2020,
    price: 119000,
    mileage: 28500,
    fuelType: "Hybrid",
    transmission: "Automatic",
    location: "Sharjah",
    exteriorColor: "Blueprint",
    interiorColor: "Gray",
    vin: "JTMW1RFV4LD012345",
    description: "Toyota RAV4 Hybrid XLE with excellent fuel economy. Well maintained with service records. Features include all-wheel drive, Toyota Safety Sense, and more.",
    features: [
      "All-Wheel Drive",
      "Toyota Safety Sense",
      "Apple CarPlay",
      "Android Auto",
      "Backup Camera",
      "Lane Keeping Assist",
      "Adaptive Cruise Control",
      "Power Liftgate"
    ],
    images: [
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1621019333482-b7eaffbd3a5f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1593007791384-1f99bdf4ba5c?auto=format&fit=crop&q=80&w=1000"
    ],
    status: "available",
    bodyType: "SUV",
    engine: "2.5L Hybrid",
    drivetrain: "AWD",
    sellerType: "dealer",
    sellerName: "Mountain States Toyota",
    listedDate: "2023-02-10"
  },
  {
    id: "4",
    make: "Ford",
    model: "F-150",
    year: 2019,
    price: 145900,
    mileage: 35200,
    fuelType: "Gasoline",
    transmission: "Automatic",
    location: "Ras Al Khaimah",
    exteriorColor: "Magnetic Gray",
    interiorColor: "Black",
    vin: "1FTEW1E53KFA12345",
    description: "Ford F-150 XLT SuperCrew 4x4 with the 5.0L V8 engine. Features include towing package, bed liner, and power equipment group. Great for work or play!",
    features: [
      "4x4",
      "Towing Package",
      "Spray-in Bedliner",
      "Running Boards",
      "Backup Camera",
      "Bluetooth",
      "Trailer Brake Controller",
      "Sync 3"
    ],
    images: [
      "https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1609710236943-69da8e8379df?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1000"
    ],
    status: "available",
    bodyType: "Truck",
    engine: "5.0L V8",
    drivetrain: "4WD",
    sellerType: "dealer",
    sellerName: "Texas Trucks",
    listedDate: "2023-01-30"
  },
  {
    id: "5",
    make: "Honda",
    model: "Civic",
    year: 2022,
    price: 98900,
    mileage: 12650,
    fuelType: "Gasoline",
    transmission: "Automatic",
    location: "Ajman",
    exteriorColor: "Sonic Gray",
    interiorColor: "Black",
    vin: "19XFL1H75NE012345",
    description: "Honda Civic Touring with Honda Sensing safety features, leather interior, and premium audio. Low mileage and excellent condition.",
    features: [
      "Honda Sensing",
      "Leather Seats",
      "Sunroof",
      "Apple CarPlay",
      "Android Auto",
      "Wireless Charging",
      "Heated Seats",
      "Bose Audio"
    ],
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1590080875262-c7f81a47d88d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1584273422310-1421591a357e?auto=format&fit=crop&q=80&w=1000"
    ],
    status: "pending",
    bodyType: "Sedan",
    engine: "1.5L Turbo",
    drivetrain: "FWD",
    sellerType: "private",
    sellerName: "Jennifer L.",
    listedDate: "2023-03-05"
  },
  {
    id: "6",
    make: "Audi",
    model: "Q5",
    year: 2020,
    price: 164500,
    mileage: 24180,
    fuelType: "Gasoline",
    transmission: "Automatic",
    location: "Fujairah",
    exteriorColor: "Mythos Black",
    interiorColor: "Rock Gray",
    vin: "WA1BNAFY7L2012345",
    description: "Audi Q5 Premium Plus with S-Line exterior package, Technology package, and more. Features quattro all-wheel drive and panoramic sunroof.",
    features: [
      "Quattro All-Wheel Drive",
      "Panoramic Sunroof",
      "Bang & Olufsen Sound",
      "Virtual Cockpit",
      "Heated Seats",
      "Audi Pre Sense",
      "Power Tailgate",
      "Navigation"
    ],
    images: [
      "https://images.unsplash.com/photo-1607853554306-b1f99b5500d7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1604943072149-672e18159032?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"
    ],
    status: "available",
    bodyType: "SUV",
    engine: "2.0L Turbo",
    drivetrain: "AWD",
    sellerType: "dealer",
    sellerName: "Windy City Audi",
    listedDate: "2023-02-18"
  }
];

// Helper function to format price with AED currency without decimal places
export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-AE', { 
    style: 'currency', 
    currency: 'AED', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  });
};

// Helper function to format mileage
export const formatMileage = (mileage: number): string => {
  return mileage.toLocaleString('en-US') + " km";
};
