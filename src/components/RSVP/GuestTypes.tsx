export type GuestStatus = 'invited' | 'confirmed' | 'declined' | 'pending';

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  side: 'bride' | 'groom' | 'other';
  status: GuestStatus;
  dietary: string;
  notes: string;
  plusOnes: number;
  createdAt: string;
}

export const GUEST_STATUS_OPTIONS: { value: GuestStatus; label: string }[] = [
  { value: 'invited', label: 'Invited' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'declined', label: 'Declined' },
  { value: 'pending', label: 'Pending' },
];