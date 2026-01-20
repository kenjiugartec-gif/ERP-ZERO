
import { 
  LayoutDashboard, Package, Truck, 
  DoorOpen, ArrowLeftRight, History, 
  ClipboardCheck, MapPin, Car, 
  Users, Settings, FileText, Container, FileCheck, ArrowDownToLine
} from 'lucide-react';

export const CHILE_GEO_DATA = [
  {
    region: "Arica y Parinacota",
    communes: ["Arica", "Camarones", "Putre", "General Lagos"]
  },
  {
    region: "Tarapacá",
    communes: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
  },
  {
    region: "Antofagasta",
    communes: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
  },
  {
    region: "Atacama",
    communes: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
  },
  {
    region: "Coquimbo",
    communes: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
  },
  {
    region: "Valparaíso",
    communes: ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
  },
  {
    region: "Región Metropolitana de Santiago",
    communes: ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor", "Colina", "Lampa", "Tiltil"]
  },
  {
    region: "Libertador General Bernardo O'Higgins",
    communes: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
  },
  {
    region: "Maule",
    communes: ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
  },
  {
    region: "Ñuble",
    communes: ["Chillán", "Chillán Viejo", "Coihueco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Treguaco", "San Carlos", "Cocharcas", "Ñiquén", "San Fabián", "San Nicolás"]
  },
  {
    region: "Biobío",
    communes: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
  },
  {
    region: "La Araucanía",
    communes: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
  },
  {
    region: "Los Ríos",
    communes: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
  },
  {
    region: "Los Lagos",
    communes: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
  },
  {
    region: "Aysén del General Carlos Ibáñez del Campo",
    communes: ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
  },
  {
    region: "Magallanes y de la Antártica Chilena",
    communes: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
  }
];

export const EMPLACEMENTS = [];

export const CAR_MODELS: Record<string, string[]> = {
  "Toyota": ["Hilux", "Yaris", "Corolla", "RAV4", "Fortuner", "4Runner", "Land Cruiser", "Urban Cruiser", "Prius", "Rush"],
  "Chevrolet": ["Silverado", "Colorado", "D-Max", "N400", "Sail", "Groove", "Tracker", "Captiva", "Tahoe", "Suburban", "Blazer"],
  "Hyundai": ["H-1", "Porter", "Tucson", "Santa Fe", "Accent", "Grand i10", "Creta", "Staria", "Elantra", "Palisade", "Venue"],
  "Kia": ["Frontier", "Rio", "Soluto", "Sportage", "Sorento", "Morning", "Sonet", "Seltos", "Carnival", "Cerato"],
  "Nissan": ["Navara", "NP300", "Versa", "Kicks", "X-Trail", "Qashqai", "Terrano", "Pathfinder", "Murano", "Sentra"],
  "Mitsubishi": ["L200", "Katana", "Montero Sport", "Outlander", "ASX", "Xpander", "Eclipse Cross", "Mirage"],
  "Ford": ["Ranger", "F-150", "Transit", "Territory", "Explorer", "Escape", "Maverick", "Bronco", "Mustang"],
  "Peugeot": ["Partner", "Boxer", "Expert", "208", "2008", "3008", "5008", "Landtrek", "Rifter", "Traveller", "308"],
  "Suzuki": ["Swift", "Baleno", "Jimny", "Vitara", "S-Presso", "Dzire", "Ertiga", "Grand Vitara", "Alto", "Celerio"],
  "Maxus": ["T60", "T90", "Deliver 9", "G10", "V80", "E-Deliver 3", "D60", "D90"],
  "MG": ["ZS", "ZX", "HS", "MG3", "MG5", "MG6", "RX5", "One", "GT"],
  "Chery": ["Tiggo 2", "Tiggo 2 Pro", "Tiggo 3", "Tiggo 7 Pro", "Tiggo 8", "Tiggo 8 Pro"],
  "Volkswagen": ["Amarok", "Saveiro", "Gol", "Voyage", "T-Cross", "Taos", "Tiguan", "Crafter", "Transporter", "Polo", "Virtus", "Nivus"],
  "Mercedes-Benz": ["Sprinter", "Vito", "A-Class", "C-Class", "GLC", "GLE", "Actros", "Arocs", "Atego"],
  "Citroën": ["Berlingo", "Jumper", "C3", "C-Elysée", "C4", "C5 Aircross", "Jumpy"],
  "Renault": ["Oroch", "Alaskan", "Kangoo", "Kwid", "Duster", "Symbol", "Master", "Arkana", "Koleos"],
  "JAC": ["T8", "T6", "T8 Pro", "JS2", "JS3", "JS4", "JS6", "Refine", "Sunray", "X200"],
  "Great Wall": ["Poer", "Wingle 5", "Wingle 7", "Poer Plus"],
  "Haval": ["Jolion", "H6", "Dargo"],
  "RAM": ["700", "1000", "1500", "2500", "V700", "V1000", "Rampage"],
  "Opel": ["Combo", "Vivaro", "Corsa", "Mokka", "Crossland", "Grandland"],
  "Changan": ["Hunter", "CS15", "CS35 Plus", "CS55 Plus", "CX70", "Uni-T", "Uni-K"],
  "Foton": ["Terracota", "Midi", "View", "Aumark", "Tunland"],
  "Dongfeng": ["DF6", "Rich 6", "SX5", "T5 Evo"],
  "SsangYong": ["Musso", "Grand Musso", "Rexton", "Korando", "Tivoli", "Torres"],
  "Subaru": ["Forester", "XV", "Crosstrek", "Outback", "Evoltis", "Impreza", "WRX"],
  "Mazda": ["BT-50", "Mazda2", "Mazda3", "CX-3", "CX-30", "CX-5", "CX-50", "CX-60", "CX-9", "CX-90"],
  "Honda": ["Ridgeline", "CR-V", "HR-V", "Pilot", "Civic", "City", "WR-V"],
  "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Commander"],
  "Volvo": ["XC40", "XC60", "XC90", "C40", "FH", "FM", "FMX"],
  "Scania": ["R-Series", "S-Series", "P-Series", "G-Series"],
  "MAN": ["TGX", "TGS", "TGM", "TGL"],
  "Fiat": ["Fiorino", "Strada", "Ducato", "Mobi", "Argo", "Pulse", "Fastback"],
  "Mahindra": ["Pik Up", "XUV 500", "Scorpio"],
  "JMC": ["Vigus", "Vigus Plus", "Conquer", "Carrying"],
  "DFSK": ["C31", "C32", "C35", "500", "580"]
};

export const CAR_BRANDS = Object.keys(CAR_MODELS).sort();

export const MODULES = [
  { id: 'dashboard', label: 'Informe General', icon: LayoutDashboard },
  { id: 'gate_in', label: 'Gate In', icon: ArrowDownToLine },
  { id: 'documents', label: 'Control Documental', icon: FileCheck },
  { id: 'baroti', label: 'Baroti', icon: Container },
  { id: 'stock', label: 'Almacenamiento', icon: Package }, // Changed from Gestión Almacenaje
  { id: 'reception', label: 'Recepción', icon: ClipboardCheck },
  { id: 'dispatch', label: 'Despacho', icon: Truck },
  { id: 'gate', label: 'Control Puerta', icon: DoorOpen },
  { id: 'io', label: 'Control E/S', icon: ArrowLeftRight },
  { id: 'history', label: 'Historial', icon: History },
  { id: 'sales', label: 'Control VTA', icon: FileText },
  { id: 'communes', label: 'Geografía', icon: MapPin },
  { id: 'fleet', label: 'Flota', icon: Car },
  { id: 'users', label: 'Usuarios y Roles', icon: Users },
  { id: 'settings', label: 'Configuración', icon: Settings },
];
