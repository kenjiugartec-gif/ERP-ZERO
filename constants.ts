
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
  "COMANDO CENTRAL"
];

export const CAR_MODELS: Record<string, string[]> = {
  "Chevrolet": ["Sail", "Onix", "Prisma", "Tracker", "Groove", "Captiva", "Silverado", "Colorado", "D-Max", "N400", "Tahoe", "Suburban", "Blazer", "Equinox", "Traverse", "Camaro", "Corvette", "Spark", "Spin", "Orlando", "Cruze", "Sonic"],
  "Toyota": ["Yaris", "Corolla", "Hilux", "RAV4", "Fortuner", "4Runner", "Raize", "Urban Cruiser", "Corolla Cross", "Land Cruiser", "Prado", "Tundra", "Tacoma", "Sequoia", "Sienna", "Prius", "C-HR", "Camry", "Supra", "GR Yaris", "Hiace"],
  "Hyundai": ["Accent", "Grand i10", "Creta", "Tucson", "Santa Fe", "Porter", "H-1", "Elantra", "Sonata", "Venue", "Palisade", "Staria", "Kona", "Ioniq", "Veloster", "Verna", "Atos", "Getz", "Matrix", "Terracan", "Galloper"],
  "Kia": ["Morning", "Soluto", "Rio 4", "Rio 5", "Cerato", "Sonet", "Seltos", "Sportage", "Sorrento", "Frontier", "Carnival", "Carens", "Mohave", "Niro", "Soul", "K2700", "K3000", "Optima", "Stinger", "Quoris"],
  "Suzuki": ["Swift", "Baleno", "Dzire", "S-Presso", "Alto", "Celerio", "Vitara", "Grand Vitara", "Jimny", "Ertiga", "XL7", "Ignis", "Ciaz", "APV", "Carry", "Nomade", "SX4", "Kizashi", "Maruti", "Samurai"],
  "Nissan": ["Versa", "Sentra", "Kicks", "Qashqai", "X-Trail", "Navara", "NP300", "Pathfinder", "Murano", "Leaf", "March", "V-Drive", "Terrano", "Tiida", "Juke", "370Z", "GT-R", "Patrol", "Armada", "Titan"],
  "Peugeot": ["208", "2008", "3008", "5008", "Partner", "Rifter", "Landtrek", "301", "308", "408", "508", "Traveller", "Expert", "Boxer", "Bipper", "107", "206", "207", "RCZ", "407"],
  "Ford": ["Ranger", "F-150", "Territory", "Explorer", "Edge", "Escape", "Maverick", "Bronco", "Mustang", "Transit", "EcoSport", "Expedition", "Raptor", "Focus", "Fiesta", "Fusion", "Cargo", "F-250", "F-350", "Courier"],
  "Mazda": ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-50", "CX-60", "CX-9", "CX-90", "BT-50", "MX-5", "RX-8", "Tribute", "Demio", "Artis", "323", "B-Series"],
  "Mitsubishi": ["L200", "Montero Sport", "Outlander", "Xpander", "Eclipse Cross", "ASX", "Mirage", "Attrage", "Montero", "L300", "Canter", "Fuso", "Galant", "Lancer", "Nativa", "Space Wagon", "Pajero"],
  "MG": ["MG3", "MG ZS", "MG ZX", "MG RX5", "MG HS", "MG GT", "MG ONE", "MG 5", "MG 6", "Marvel R", "MG 4", "ZS EV"],
  "Chery": ["Tiggo 2", "Tiggo 2 Pro", "Tiggo 3", "Tiggo 7 Pro", "Tiggo 8", "Tiggo 8 Pro", "Arrizo 5", "Arrizo 6", "Grand Tiggo", "IQ", "Face", "Skin", "Fulwin"],
  "Volkswagen": ["Gol", "Polo", "Virtus", "T-Cross", "Nivus", "Taos", "Tiguan", "Atlas", "Teramont", "Saveiro", "Amarok", "Transporter", "Crafter", "Vento", "Jetta", "Passat", "Golf", "Bora", "Beetle", "Touareg"],
  "Citroen": ["C3", "C3 Aircross", "C4", "C4 Cactus", "C5 Aircross", "C-Elysee", "Berlingo", "Jumpy", "Jumper", "C1", "C2", "C5", "Xsara", "Picasso", "Nemo", "Saxo"],
  "Maxus": ["T60", "T90", "G10", "V80", "V90", "Deliver 9", "Euniq 6", "D60", "D90"],
  "Great Wall": ["Poer", "Wingle 5", "Wingle 7", "Haval H6", "Haval Jolion", "Haval Dargo", "Haval H2", "Voleex", "Deer", "Socool"],
  "JAC": ["T6", "T8", "T8 Pro", "JS2", "JS3", "JS4", "JS6", "JS8", "Refine", "Sunray", "X200", "Urban", "J2", "J3", "J4", "J5", "S2", "S3", "S5"],
  "Changan": ["CS15", "CS35 Plus", "CS55 Plus", "UNI-T", "UNI-K", "CX70", "Hunter", "Alsvin", "Raeton", "Benni", "CV1"],
  "Subaru": ["All New XV", "Crosstrek", "Forester", "Outback", "Evoltis", "Impreza", "WRX", "Legacy", "Tribeca", "Baja", "Vivio"],
  "Honda": ["Pilot", "CR-V", "HR-V", "WR-V", "ZR-V", "City", "Civic", "Accord", "Ridgeline", "Odyssey", "Fit", "Jazz"],
  "Renault": ["Kwid", "Clio", "Megane", "Captur", "Arkana", "Koleos", "Oroch", "Alaskan", "Master", "Kangoo", "Dokker", "Symbol", "Duster", "Sandero", "Logan", "Laguna", "Fluence"],
  "Jeep": ["Renegade", "Compass", "Commander", "Grand Cherokee", "Wrangler", "Gladiator", "Cherokee", "Patriot"],
  "Ram": ["700", "1000", "1500", "2500", "Ram V700"],
  "SsangYong": ["Musso", "Grand Musso", "Rexton", "Torres", "Korando", "Tivoli", "Stavic", "Actyon", "Kyron"],
  "Volvo": ["XC40", "XC60", "XC90", "C40", "S60", "S90", "V60", "V40", "C30"],
  "BMW": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 7", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "M2", "M3", "M4", "Z4", "iX", "i4"],
  "Mercedes-Benz": ["Clase A", "Clase C", "Clase E", "Clase S", "GLA", "GLB", "GLC", "GLE", "GLS", "Clase G", "Vito", "Sprinter", "X-Class", "CLA", "CLS", "AMG GT"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  "Fiat": ["Mobi", "Argo", "Cronos", "Pulse", "Fastback", "500", "Ducato", "Fiorino", "Strada", "Uno", "Palio", "Punto", "Grande Punto", "Linea", "Bravo", "Fullback"],
  "Opel": ["Corsa", "Mokka", "Grandland", "Combo", "Vivaro", "Astra", "Insignia", "Adam", "Crossland"],
  "Dongfeng": ["AX7", "SX5", "SX6", "T5 Evo", "Rich 6"],
  "Mahindra": ["Pik Up", "XUV500", "XUV300", "Scorpio", "KUV100", "Genio"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
  "Mini": ["Cooper", "Clubman", "Countryman", "Cabrio"],
  "Porsche": ["911", "718", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Lexus": ["UX", "NX", "RX", "LX", "ES", "LS", "IS", "RC", "LC"],
  "Jetour": ["X70", "X70 Plus", "Dashing"],
  "Geely": ["Coolray", "Azkarra", "Geometry C"],
  "BYD": ["Han", "Tang", "Yuan Plus", "Song Plus", "Dolphin", "Seal"],
  "GAC Motor": ["GS3", "GS4", "GA4", "GN6"],
  "Hino": ["Serie 300", "Serie 500", "Serie 700", "Dutro"],
  "Foton": ["Midi", "Tunland", "Terracota", "Aumark", "Auman"],
  "JMC": ["Vigus", "Vigus Plus", "Vigus Pro", "Touring", "Carrying", "Conquer"],
  "DFSK": ["500", "560", "580", "Cargo Van", "Truck"]
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
