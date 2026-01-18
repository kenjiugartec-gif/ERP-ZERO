
export type UserRole = 'ADMIN' | 'OPERATOR' | 'DRIVER';

export interface User {
  id: string;
  name: string;
  rut: string;
  password?: string;
  role: string;
  location: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  timestamp: Date;
  read: boolean;
}

export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: 'ACTIVO' | 'INSUMO';
  quantity: number;
  location: string; // Ubicación editable
  supplier?: string; // Proveedor/Cliente
  receptionBranch?: string; // Sucursal de recepción
  lastUpdated: string;
}

export interface Vehicle {
  plate: string;
  type: string;
  brand: string;
  model: string;
  km: number;
  commune: string;
  location: string;
  driver: string;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE';
}

export interface TransactionItem {
  name: string; // e.g., "Cilindro 10m3"
  quantity: number;
  type: 'ACTIVO' | 'INSUMO';
  details?: string; // e.g., Regulator type "0-2"
}

export interface GateTransaction {
  id: string;
  plate: string;
  driver: string;
  status: 'PENDING_EXIT' | 'EXIT_AUTHORIZED' | 'IN_ROUTE' | 'PENDING_ENTRY' | 'ENTRY_AUTHORIZED' | 'COMPLETED';
  exitTime?: string;
  entryTime?: string;
  exitItems_ES: TransactionItem[]; // Items registered by E/S at exit
  exitItems_Gate: TransactionItem[]; // Items verified by Gate at exit (if applicable, or assumed same)
  entryItems_ES: TransactionItem[]; // Items registered by E/S at entry
  entryItems_Gate: TransactionItem[]; // Items verified by Gate at entry
  user_ES_Out?: string;
  user_Gate_Out?: string;
  user_Gate_In?: string;
  user_ES_In?: string;
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