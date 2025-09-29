export interface BookingRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  serviceName: string;
  serviceType: string;
  bookingDate?: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  totalAmount: number;
  status: "pending" | "accepted" | "declined";
  specialRequests?: string;
  guestCount?: number;
  createdAt: string;
}