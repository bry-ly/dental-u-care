export interface Doctor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

export const doctors: Doctor[] = [
  {
    id: "doctor-1",
    name: "Kath Estrada",
    role: "Chief Dentist & Orthodontist",
    avatar: "/kath.jpg",
  },
  {
    id: "doctor-2",
    name: "Clyrelle Jade Cervantes",
    role: "Cosmetic Dentistry Specialist",
    avatar: "/cervs.jpg",
  },
  {
    id: "doctor-3",
    name: "Von Vryan Arguelles",
    role: "Oral Surgeon",
    avatar: "/von.jpg",
  },
  {
    id: "doctor-4",
    name: "Dexter Cabanag",
    role: "Periodontist",
    avatar: "/dexter.jpg",
  },
];
