export interface Guest {
  id: number;
  name: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  childCount: number;
  alcohol: 'yes' | 'no' | 'unknown';
  side: 'bride' | 'groom' | 'other';
  status: 'invited' | 'accepted' | 'declined' | 'pending';
  dietary: string;
  notes: string;
  plusOnes: number;
  createdAt: string;
}
