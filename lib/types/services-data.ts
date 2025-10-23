export interface Service {
  id: string;
  name: string;
  price: string;
  description?: string;
  category: string;
  duration: number;
  isActive: boolean;
}

export interface ServiceCategory {
  id: string;
  title: string;
  badge: string;
  services: Service[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "basic",
    title: "Basic Services",
    badge: "Essential",
    services: [
      {
        id: "dental-consultation",
        name: "Dental Consultation / Checkup",
        price: "₱500 – ₱1,500",
        description: "Basic dental examination to check overall condition of teeth and gums",
        category: "Basic Services",
        duration: 30,
        isActive: true,
      },
      {
        id: "oral-prophylaxis",
        name: "Oral Prophylaxis (Cleaning)",
        price: "₱1,200 – ₱3,000",
        description: "Regular teeth cleaning, recommended every 6 months",
        category: "Basic Services",
        duration: 60,
        isActive: true,
      },
      {
        id: "tooth-xray",
        name: "Tooth X-Ray",
        price: "₱700 – ₱2,500+",
        description: "Depends on type (periapical, panoramic, etc.)",
        category: "Basic Services",
        duration: 15,
        isActive: true,
      },
      {
        id: "simple-extraction",
        name: "Simple Tooth Extraction",
        price: "₱1,500 – ₱5,000",
        description: "Basic tooth extraction procedure",
        category: "Basic Services",
        duration: 30,
        isActive: true,
      },
      {
        id: "deep-cleaning",
        name: "Deep Cleaning / Scaling and Root Planing",
        price: "₱3,000 – ₱10,000+",
        description: "For early signs of gum disease, deeper cleaning procedure",
        category: "Basic Services",
        duration: 90,
        isActive: true,
      },
    ],
  },
  {
    id: "fillings",
    title: "Dental Fillings",
    badge: "Restorative",
    services: [
      {
        id: "amalgam-filling",
        name: "Amalgam Filling (Silver)",
        price: "₱800 – ₱2,500",
        description: "Traditional silver-colored filling material",
        category: "Dental Fillings",
        duration: 30,
        isActive: true,
      },
      {
        id: "composite-filling",
        name: "Composite Filling (Tooth-colored)",
        price: "₱1,500 – ₱4,500+",
        description: "Natural-looking tooth-colored filling",
        category: "Dental Fillings",
        duration: 45,
        isActive: true,
      },
      {
        id: "ceramic-filling",
        name: "Ceramic/Gold Filling",
        price: "₱5,000 – ₱15,000+",
        description: "Premium filling materials for durability",
        category: "Dental Fillings",
        duration: 60,
        isActive: true,
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Treatments",
    badge: "Popular",
    services: [
      {
        id: "surgical-extraction",
        name: "Surgical/Impacted Tooth Extraction",
        price: "₱10,000 – ₱30,000+",
        description: "Complex extraction for impacted teeth",
        category: "Advanced Treatments",
        duration: 60,
        isActive: true,
      },
      {
        id: "root-canal",
        name: "Root Canal Treatment",
        price: "₱5,000 – ₱20,000+",
        description: "Treatment for infected tooth pulp, cleaned and sealed",
        category: "Advanced Treatments",
        duration: 90,
        isActive: true,
      },
      {
        id: "basic-crown",
        name: "Dental Crowns (Basic - Metal or PFM)",
        price: "₱8,000 – ₱20,000+",
        description: "Cap for damaged tooth, metal or porcelain-fused-to-metal",
        category: "Advanced Treatments",
        duration: 120,
        isActive: true,
      },
      {
        id: "premium-crown",
        name: "Dental Crowns (Premium - Zirconia, Emax)",
        price: "₱30,000 – ₱45,000+",
        description: "High-quality aesthetic crowns",
        category: "Advanced Treatments",
        duration: 120,
        isActive: true,
      },
      {
        id: "teeth-whitening",
        name: "Teeth Whitening (Bleaching)",
        price: "₱9,000 – ₱30,000+",
        description: "Laser or in-clinic whitening procedure",
        category: "Advanced Treatments",
        duration: 60,
        isActive: true,
      },
    ],
  },
  {
    id: "replacement",
    title: "Tooth Replacement",
    badge: "Restoration",
    services: [
      {
        id: "partial-denture",
        name: "Partial Denture",
        price: "₱10,000 – ₱30,000+",
        description: "Removable denture for missing teeth",
        category: "Tooth Replacement",
        duration: 180,
        isActive: true,
      },
      {
        id: "full-denture",
        name: "Full Denture",
        price: "Contact for pricing",
        description: "Complete denture set, depends on number of teeth",
        category: "Tooth Replacement",
        duration: 240,
        isActive: true,
      },
      {
        id: "dental-bridge",
        name: "Dental Bridges",
        price: "₱20,000 – ₱60,000+",
        description: "Replacement of missing teeth using adjacent teeth",
        category: "Tooth Replacement",
        duration: 180,
        isActive: true,
      },
      {
        id: "dental-implant",
        name: "Dental Implants",
        price: "₱80,000 – ₱150,000+",
        description: "Permanent tooth replacement using titanium post + crown",
        category: "Tooth Replacement",
        duration: 300,
        isActive: true,
      },
    ],
  },
  {
    id: "cosmetic",
    title: "Cosmetic & Orthodontics",
    badge: "Premium",
    services: [
      {
        id: "dental-veneers",
        name: "Dental Veneers",
        price: "₱12,000 – ₱35,000+ per tooth",
        description: "For aesthetic purposes - straight, white, beautiful teeth",
        category: "Cosmetic & Orthodontics",
        duration: 120,
        isActive: true,
      },
      {
        id: "metal-braces",
        name: "Traditional Metal Braces",
        price: "₱35,000 – ₱80,000+",
        description: "Classic metal braces for teeth alignment",
        category: "Cosmetic & Orthodontics",
        duration: 30,
        isActive: true,
      },
      {
        id: "ceramic-braces",
        name: "Ceramic / Clear Braces",
        price: "₱100,000 – ₱200,000+",
        description: "Aesthetic clear or tooth-colored braces",
        category: "Cosmetic & Orthodontics",
        duration: 30,
        isActive: true,
      },
    ],
  },
];

// Flatten all services for easier access
export const allServices = serviceCategories.flatMap(category =>
  category.services.map(service => ({
    ...service,
    categoryTitle: category.title,
    badge: category.badge,
  }))
);