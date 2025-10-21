export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

export interface Dentist {
  id: string;
  name: string;
  specialization: string | null;
  image: string | null;
}
