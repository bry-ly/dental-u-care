export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: string;
  category: string;
  isActive: boolean;
}

export interface Dentist {
  id: string;
  name: string;
  specialization: string | null;
  image: string | null;
}
