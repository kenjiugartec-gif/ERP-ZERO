
export type UserRole = string; // Changed to string to support dynamic roles

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, string[]>; // ModuleID -> [Actions]
  isSystem?: boolean; // To protect ADMIN, etc.
}

export interface AppConfig {
  logo?: string;
  loginImage?: string;
  bgImage?: string;
  bgOpacity: number;
  bgBlur: number;
  bgFit: 'cover' | 'contain' | 'auto';
  slogan: string;
  fontFamily: string;
  fontSize: number; // en px
  lineHeight: number; // multiplicador
  primaryColor: string;
  disableBold: boolean;
}

export interface User {
  id: string;
  name: string;
  rut: string;
  password?: string;
  role: string;
  location: string;
  commune?: string;
  email?: string;     // Added for persistence
  username?: string;  // Added for persistence
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  timestamp: Date;
  read: boolean;
}

export interface GeoLocationRecord {
  id: string;
  region: string;
  commune: string;
  emplacement: string;
  timestamp: string;
}

export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: 'ACTIVO' | 'INSUMO';
  quantity: number;
  location: string;
  supplier?: string; 
  receptionBranch?: string; 
  lastUpdated: string;
}

export interface Vehicle {
  plate: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  commune: string;
  location: string;
  driver: string;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE';
}

export interface TransactionItem {
  name: string;
  quantity: number;
  type: 'ACTIVO' | 'INSUMO';
  details?: string;
}

export interface GateTransaction {
  id: string;
  plate: string;
  driver: string;
  location: string; // Added to track which emplacement owns this transaction
  status: 'PENDING_EXIT' | 'EXIT_AUTHORIZED' | 'IN_ROUTE' | 'PENDING_ENTRY' | 'ENTRY_AUTHORIZED' | 'COMPLETED';
  exitTime?: string;
  entryTime?: string;
  exitItems_ES: TransactionItem[];
  exitItems_Gate: TransactionItem[];
  entryItems_ES: TransactionItem[];
  entryItems_Gate: TransactionItem[];
  user_ES_Out?: string;
  user_Gate_Out?: string;
  user_Gate_In?: string;
  user_ES_In?: string;
}

// New Interface for Document Control
export interface ReceptionDocument {
  id: string;
  guideNumber: string;
  container: string;
  client: string;
  ship: string;
  voyage: string;
  bl: string;
  shippingLine: string;
  grossWeight: string;
  condition: 'DIRECTO' | 'INDIRECTO';
  location: string;
  timestamp: string;
}

// New Interface for Mobile Control
export interface MobileInspection {
  id: string;
  plate: string;
  driver: string;
  status: 'LIMPIO' | 'PRESENTABLE' | 'SUCIO';
  photos: {
    frontal: string;
    trasera: string;
    latIzq: string;
    latDer: string;
    interiorDelantero: string; // Updated: Split interior
    interiorTrasero: string;   // Updated: Split interior
    pickup: string;
  };
  details: string;
  timestamp: string;
  location: string;
  user: string;
}

export const ASSET_TYPES = [
  "Cilindro 10m3",
  "Cilindro 1m3",
  "Liberator",
  "Mochila",
  "Concentrador",
  "Regulador"
];

export const REGULATOR_TYPES = ["0-2", "0-3", "0-6", "0-15"];

export const SUPPLY_TYPES = [
  "Agua",
  "Naricera Adulto",
  "Naricera Infantil",
  "Naricera Pediátrica",
  "Extensión de 7mts",
  "Extensión de 2mts",
  "Carro tipo E",
  "Mangueras Cortas",
  "Vasos Humidificadores"
];
