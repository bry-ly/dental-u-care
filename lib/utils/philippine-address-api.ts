/**
 * Philippine Address API Utility
 * Based on: https://documenter.getpostman.com/view/12270232/TVmFmLrt
 */

const API_BASE_URL = "https://psgc.gitlab.io/api";

export interface Region {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  name: string;
  regionCode: string;
}

export interface City {
  code: string;
  name: string;
  provinceCode: string;
  regionCode: string;
}

export interface Barangay {
  code: string;
  name: string;
  cityCode?: string;
  municipalityCode?: string;
}

interface ApiRegionItem {
  code: string;
  name: string;
}

interface ApiProvinceItem {
  code: string;
  name: string;
  regionCode: string;
}

interface ApiCityItem {
  code: string;
  name: string;
  provinceCode: string;
  regionCode: string;
}

interface ApiBarangayItem {
  code: string;
  name: string;
  cityCode?: string;
  municipalityCode?: string;
}

/**
 * Fetch all regions
 */
export async function fetchRegions(): Promise<Region[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/regions`);
    if (!response.ok) {
      throw new Error("Failed to fetch regions");
    }
    const data = (await response.json()) as ApiRegionItem[];
    return data.map((item) => ({
      code: item.code,
      name: item.name,
    }));
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
}

/**
 * Fetch provinces by region code
 */
export async function fetchProvinces(regionCode?: string): Promise<Province[]> {
  try {
    const url = regionCode
      ? `${API_BASE_URL}/regions/${regionCode}/provinces`
      : `${API_BASE_URL}/provinces`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch provinces");
    }
    const data = (await response.json()) as ApiProvinceItem[];
    return data.map((item) => ({
      code: item.code,
      name: item.name,
      regionCode: item.regionCode,
    }));
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
}

/**
 * Fetch cities/municipalities by province code
 */
export async function fetchCities(provinceCode?: string): Promise<City[]> {
  try {
    const url = provinceCode
      ? `${API_BASE_URL}/provinces/${provinceCode}/cities-municipalities`
      : `${API_BASE_URL}/cities-municipalities`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }
    const data = (await response.json()) as ApiCityItem[];
    return data.map((item) => ({
      code: item.code,
      name: item.name,
      provinceCode: item.provinceCode,
      regionCode: item.regionCode,
    }));
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
}

/**
 * Fetch barangays by city/municipality code
 */
export async function fetchBarangays(
  cityCode?: string
): Promise<Barangay[]> {
  try {
    const url = cityCode
      ? `${API_BASE_URL}/cities-municipalities/${cityCode}/barangays`
      : `${API_BASE_URL}/barangays`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch barangays");
    }
    const data = (await response.json()) as ApiBarangayItem[];
    return data.map((item) => ({
      code: item.code,
      name: item.name,
      cityCode: item.cityCode || item.municipalityCode,
      municipalityCode: item.municipalityCode,
    }));
  } catch (error) {
    console.error("Error fetching barangays:", error);
    throw error;
  }
}

/**
 * Find Palawan province
 */
export async function findPalawanProvince(): Promise<Province | null> {
  try {
    const provinces = await fetchProvinces();
    const palawan = provinces.find(
      (p) => p.name.toLowerCase().includes("palawan")
    );
    return palawan || null;
  } catch (error) {
    console.error("Error finding Palawan province:", error);
    return null;
  }
}

/**
 * Fetch all cities and municipalities in Palawan
 */
export async function fetchPalawanCities(): Promise<City[]> {
  try {
    const palawan = await findPalawanProvince();
    if (!palawan) {
      console.error("Palawan province not found");
      return [];
    }
    return await fetchCities(palawan.code);
  } catch (error) {
    console.error("Error fetching Palawan cities:", error);
    return [];
  }
}

