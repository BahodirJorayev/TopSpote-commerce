export interface Listing {
  id?: string;
  title: string;
  category: string;
  category_name: string;
  daily_price: number;
  hourly_price: number;
  owner_name: string;
  phone: string;
  address: string;
  lat: number | null;
  lng: number | null;
  description: string;
  image_url: string;
  receipt_url: string;
  tariff: 'standard' | 'vip' | 'top';
  status: 'pending' | 'approved';
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Vertical {
  id: string;
  name: string;
  icon: string;
  categories: Category[];
}

export type WizardStep = 1 | 2 | 3 | 4;
