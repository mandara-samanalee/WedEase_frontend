export interface Guest {
  id: number;
  guestName: string;
  phone: string;
  Gender: 'Male' | 'Female' | 'Other';
  childCount: number;
  alcoholPref: 'yes' | 'no' | 'unknown';
  mealPref: string;
  plus: number;
  side: 'Bride' | 'Groom' | 'Other';
  responseStatus: 'PRELISTED' | 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'PENDING';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

