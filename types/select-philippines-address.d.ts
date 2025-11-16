declare module "select-philippines-address" {
  export interface Region {
    id: number;
    psgc_code: string;
    region_name: string;
    region_code: string;
  }

  export interface Province {
    id: number;
    psgc_code: string;
    prov_name: string;
    prov_code: string;
    region_code: string;
  }

  export interface City {
    id: number;
    psgc_code: string;
    city_name: string;
    city_code: string;
    prov_code: string;
  }

  export interface Barangay {
    id: number;
    psgc_code: string;
    brgy_name: string;
    brgy_code: string;
    city_code: string;
  }

  export function regions(): Promise<Region[]>;
  export function regionByCode(code: string): Promise<Region | undefined>;
  export function provinces(): Promise<Province[]>;
  export function provincesByCode(code: string): Promise<Province[]>;
  export function provinceByName(name: string): Promise<Province | undefined>;
  export function cities(): Promise<City[]>;
  export function barangays(): Promise<Barangay[]>;
}
