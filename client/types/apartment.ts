export interface Apartment {
  id: number;
  project: string;
  unit_name: string;
  unit_number: string;
  price: number;
  area: number;
  city: string;
  description?: string;
  status: 'available' | 'sold' | 'reserved';
  created_at: string;
  updated_at: string;
}

export interface ApartmentsMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ApartmentsListResponse {
  data: Apartment[];
  meta: ApartmentsMeta;
}

export interface ApartmentSingleResponse {
  data: Apartment;
}

export interface CreateApartmentInput {
  project: string;
  unit_name: string;
  unit_number: string;
  price: number;
  area: number;
  city: string;
  description?: string;
  status?: 'available' | 'sold' | 'reserved';
}
