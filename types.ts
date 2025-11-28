export interface CategoryConfig {
  id: string;
  label: string;
  silhouetteImage: string;
  sizes: string[];
  measurements: string[]; // e.g., "Göğüs", "Bel"
  fabricProperties: string[]; // e.g., "Kumaş İçeriği", "Esneklik"
}

export interface AppConfig {
  brandName: string;
  categories: CategoryConfig[];
}

// State Interfaces
export interface MeasurementValues {
  [size: string]: {
    [measurement: string]: string;
  };
}

export interface FabricValues {
  [property: string]: string;
}

export interface FormState {
  logo: string | null; // Base64 data string for the logo
  modelCode: string; // Product Model Code
  brandName: string; // Editable brand name
  websiteUrl: string; // Editable website url
  selectedCategoryId: string;
  selectedSizes: string[];
  measurements: MeasurementValues;
  fabricValues: FabricValues;
  canvasFormat: 'portrait' | 'landscape'; // New field for format selection
}