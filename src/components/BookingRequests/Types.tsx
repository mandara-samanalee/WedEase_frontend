export interface BookingRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerImage?: string | null;
  serviceName: string;
  serviceType: string;
  eventLocation: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  guestCount?: number;
  createdAt: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  packages?: Array<{
    id: number;
    packageName: string;
    price: number;
    features: string;
    serviceId: string;
  }>;
  photos?: string[];
}