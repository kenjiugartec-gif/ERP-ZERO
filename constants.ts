
import { 
  LayoutDashboard, Package, Truck, 
  DoorOpen, ArrowLeftRight, History, 
  ClipboardCheck, MapPin, Car, 
  Users, Settings, FileText, Container, FileCheck, ArrowDownToLine,
  Activity, BarChart3, Smartphone, FileClock
} from 'lucide-react';

export const CHILE_GEO_DATA = [
  {
    region: "Metropolitana",
    communes: ["CENTRAL", "Santiago", "Pudahuel", "Quilicura", "Renca", "Maipú"]
  },
  {
    region: "Arica y Parinacota",
    communes: ["Arica", "Camarones", "Putre", "General Lagos"]
  }
];

export const EMPLACEMENTS = [
  "COMANDO CENTRAL",
  "Planta Productiva Renca",
  "Base Operativa Antofagasta",
  "Terminal Logístico Valparaíso",
  "Centro Regional Concepción",
  "Faena Minera Escondida",
  "Bodega Central Quilicura",
  "Sucursal Puerto Montt",
  "Depósito Franco Iquique",
  "Centro de Transferencia Temuco"
];

export const CAR_MODELS: Record<string, string[]> = {
  "Toyota": ["Hilux", "Yaris", "Corolla", "RAV4"],
  "Chevrolet": ["Silverado", "Colorado", "D-Max"],
  "Hyundai": ["H-1", "Porter", "Tucson"],
  "Kia": ["Frontier", "Rio", "Soluto"],
  "Nissan": ["Navara", "NP300", "Versa"]
};

export const CAR_BRANDS = Object.keys(CAR_MODELS).sort();

export const MODULES = [
  { id: 'dashboard', label: 'Informe General', icon: LayoutDashboard },
  { id: 'gate_in', label: 'Gate In', icon: ArrowDownToLine },
  { id: 'behavior', label: 'Comportamiento', icon: BarChart3 }, 
  { id: 'mobile_control', label: 'Control Móvil', icon: Smartphone },
  { id: 'documents', label: 'Control Documental', icon: FileCheck },
  { id: 'baroti', label: 'Baroti', icon: Container },
  { id: 'stock', label: 'Almacenamiento', icon: Package }, 
  { id: 'reception', label: 'Recepción', icon: ClipboardCheck },
  { id: 'dispatch', label: 'Despacho', icon: Truck },
  { id: 'gate', label: 'Control Puerta', icon: DoorOpen },
  { id: 'io', label: 'Control E/S', icon: ArrowLeftRight },
  { id: 'mobile_history', label: 'Histórico Móvil', icon: FileClock },
  { id: 'history', label: 'Historial', icon: History },
  { id: 'sales', label: 'Control VTA', icon: FileText },
  { id: 'communes', label: 'Geografía', icon: MapPin },
  { id: 'fleet', label: 'Flota', icon: Car },
  { id: 'users', label: 'Usuarios y Roles', icon: Users },
  { id: 'settings', label: 'Configuración', icon: Settings },
];
