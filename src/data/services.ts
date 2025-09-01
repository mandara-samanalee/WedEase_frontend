export interface Service {
    id: number;
    title: string;
    rating: number;
    reviewCount: number;
    provider: string;
    image?: string;
    description: string;
    category: string;
    price?: number;
    location?: string;
    duration?: string;
    capacity?: number;
    gallery?: string[];
    contactDetails: {
        phone?: string;
        email?: string;
        website?: string;
    };
    includes?: string[];
    notes?: string;
}

export const SERVICES: Service[] = [
    {
        id: 1,
        title: "Premium Wedding Catering",
        rating: 4.8,
        reviewCount: 45,
        provider: "Elite Catering Co",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&auto=format",
        description: "Exquisite culinary experiences for your special day with traditional Sri Lankan and international cuisine.",
        category: "Catering",
        price: 250000,
        location: "Colombo",
        duration: "Full day",
        capacity: 200,
        contactDetails: {
            phone: "+94676766767",
            email: "info@elitecatering.lk",
            website: "https://elitecatering.lk"
        },
        includes: ["Custom curated menu", "Serving staff", "Buffet & live stations"],
        gallery: [
            "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format",
            "https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=800&auto=format"
        ],
        notes: "50% advance required."
    },
    {
        id: 2,
        title: "Traditional Poruwa Setup",
        rating: 4.7,
        reviewCount: 28,
        provider: "Heritage Weddings",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format",
        description: "Authentic Poruwa ceremony setup with traditional decorations and arrangements.",
        category: "Poruwa",
        price: 180000,
        location: "Kandy",
        duration: "Setup + Ceremony",
        capacity: 100,
        contactDetails: {
            phone: "+94676897891",
            email: "contact@heritageweddings.lk"
        }
    },
    {
        id: 3,
        title: "Professional Wedding Photography",
        rating: 4.9,
        reviewCount: 67,
        provider: "Capture Moments Studio",
        image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&auto=format",
        description: "Award-winning wedding photography and videography services capturing every precious moment.",
        category: "Photography & Videography",
        price: 300000,
        location: "Islandwide",
        duration: "Full day",
        capacity: 1,
        contactDetails: {
            phone: "+94678999909",
            email: "bookings@capturemoments.lk",
            website: "https://capturemoments.lk"
        }
    },
    {
        id: 4,
        title: "Elegant Wedding Decorations",
        rating: 4.5,
        reviewCount: 32,
        provider: "Dream Decor Events",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format",
        description: "Stunning floral and thematic decorations to transform your venue into a dream setting.",
        category: "Decorations",
        price: 150000,
        location: "Colombo",
        duration: "Full day",
        capacity: 150,
        contactDetails: {
            phone: "+94771234567",
            email: "info@dreamdecor.lk",
            website: "https://dreamdecor.lk"
        },
        includes: ["Floral arrangements", "Lighting", "Themed backdrops"]
    },
    {
        id: 5,
        title: "Live Wedding Band",
        rating: 4.6,
        reviewCount: 41,
        provider: "Harmony Music Group",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format",
        description: "Professional live music performance with traditional and modern songs for your reception.",
        category: "Music & Entertainment",
        price: 120000,
        location: "Galle",
        duration: "4 hours",
        capacity: 200,
        contactDetails: {
            phone: "+94772345678",
            email: "bookings@harmonymusic.lk"
        },
        includes: ["Live band", "Sound system", "Song requests"]
    },
    {
        id: 6,
        title: "Luxury Wedding Car Service",
        rating: 4.4,
        reviewCount: 25,
        provider: "Royal Rides Lanka",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format",
        description: "Elegant vehicle fleet for your wedding day, including limousines and classic cars.",
        category: "Transportation",
        price: 80000,
        location: "Islandwide",
        duration: "Full day",
        capacity: 10,
        contactDetails: {
            phone: "+94773456789",
            email: "info@royalrides.lk",
            website: "https://royalrides.lk"
        },
        includes: ["Luxury vehicles", "Chauffeur", "Decorated cars"]
    },
    {
        id: 7,
        title: "Floral Bouquet Arrangements",
        rating: 4.3,
        reviewCount: 19,
        provider: "Bloom & Blossom",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format", 
        description: "Beautiful floral designs including bouquets, centerpieces, and bridal accessories.",
        category: "Floral Arrangements",
        price: 50000,
        location: "Kandy",
        duration: "Setup",
        capacity: 50,
        contactDetails: {
            phone: "+94774567890",
            email: "orders@bloomblossom.lk"
        },
        includes: ["Bouquets", "Centerpieces", "Bridal accessories"]
    },
    {
        id: 8,
        title: "Comprehensive Wedding Planning",
        rating: 5.0,
        reviewCount: 55,
        provider: "Perfect Day Planners",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&auto=format",
        description: "Full-service wedding planning to handle every detail from start to finish.",
        category: "Wedding Planning",
        price: 400000,
        location: "Islandwide",
        duration: "6 months",
        capacity: 300,
        contactDetails: {
            phone: "+94775678901",
            email: "planning@perfectday.lk",
            website: "https://perfectday.lk"
        },
        includes: ["Vendor coordination", "Timeline management", "Budget planning"]
    },
    {
        id: 9,
        title: "Traditional Sri Lankan Cuisine",
        rating: 4.2,
        reviewCount: 38,
        provider: "Island Flavors Catering",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format",
        description: "Authentic Sri Lankan dishes with a modern twist for your wedding feast.",
        category: "Catering",
        price: 200000,
        location: "Galle",
        duration: "Full day",
        capacity: 150,
        contactDetails: {
            phone: "+94776789012",
            email: "info@islandflavors.lk"
        },
        includes: ["Traditional menu", "Vegetarian options", "Desserts"]
    },
    {
        id: 10,
        title: "Outdoor Wedding Photography",
        rating: 4.7,
        reviewCount: 42,
        provider: "Nature Shots Studio",
        image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&auto=format",
        description: "Specialized in capturing natural beauty and outdoor wedding moments.",
        category: "Photography & Videography",
        price: 250000,
        location: "Kandy",
        duration: "Full day",
        capacity: 1,
        contactDetails: {
            phone: "+94777890123",
            email: "contact@natureshots.lk",
            website: "https://natureshots.lk"
        }
    },
    {
        id: 11,
        title: "DJ and Sound System",
        rating: 3.8,
        reviewCount: 22,
        provider: "Beat Masters Entertainment",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format", 
        description: "High-energy DJ services with professional sound equipment for your reception.",
        category: "Music & Entertainment",
        price: 100000,
        location: "Colombo",
        duration: "6 hours",
        capacity: 250,
        contactDetails: {
            phone: "+94778901234",
            email: "book@beatmasters.lk"
        },
        includes: ["DJ performance", "Sound system", "Lighting effects"]
    }
];

export const getServiceById = (id: number) => SERVICES.find(s => s.id === id);