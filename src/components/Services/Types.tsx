export interface Package {
    name: string;
    price: string;
    features: string;
}

export interface Location {
    address: string;
    city: string;
    district: string;
    province: string;
    country: string;
}

export interface Review {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Service {
    id: string;
    serviceName: string;
    category: string;
    description: string;
    capacity: string;
    rating: number;
    totalReviews: number;
    bookingCount: number;
    packages: Package[];
    location: Location;
    photos: string[];
    reviews: Review[];
    isActive: boolean;
    createdDate: string;
}