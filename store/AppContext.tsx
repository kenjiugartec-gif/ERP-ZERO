
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { User, Vehicle, StockItem, GateTransaction, Notification, GeoLocationRecord, AppConfig, Role, ReceptionDocument, MobileInspection } from '../types';
import { EMPLACEMENTS as INITIAL_EMPLACEMENTS, MODULES } from '../constants';

interface AppContextType {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  updateCurrentUser: (data: Partial<User>) => void;
  welcomeMessageShown: boolean;
  setWelcomeMessageShown: (shown: boolean) => void;
  
  // Data Stores
  users: User[];
  roles: Role[];
  vehicles: Vehicle[];
  stock: StockItem[];
  transactions: GateTransaction[];
  notifications: Notification[];
  geoRecords: GeoLocationRecord[];
  emplacements: string[];
  documents: ReceptionDocument[]; 
  mobileInspections: MobileInspection[];
  
  // App Config per Emplacement
  configs: Record<string, AppConfig>;
  updateConfig: (emplacement: string, config: Partial<AppConfig>) => void;
  currentConfig: AppConfig;

  // Actions
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (plate: string, v: Partial<Vehicle>) => void;
  createTransaction: (t: GateTransaction) => void;
  updateTransaction: (id: string, t: Partial<GateTransaction>) => void;
  addUser: (u: User) => void;
  editUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addRole: (r: Role) => void;
  updateRole: (id: string, r: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addStockItem: (item: StockItem) => void;
  updateStockLocation: (id: string, newLocation: string) => void;
  markNotificationRead: (id: number) => void;
  clearNotifications: () => void;
  addGeoRecord: (record: GeoLocationRecord) => void;
  deleteGeoRecord: (id: string) => void;
  addEmplacement: (name: string) => void;
  addDocument: (doc: ReceptionDocument) => void; 
  addMobileInspection: (insp: MobileInspection) => void;
  
  // UI Settings
  appName: string;
  setAppName: (n: string) => void;
}

const DEFAULT_CONFIG: AppConfig = {
  slogan: "Innovative Solutions, Comprehensive Logistics Solutions.",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14, 
  lineHeight: 1.5,
  primaryColor: "#2563eb",
  logo: undefined,
  loginImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop",
  bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
  bgOpacity: 20,
  bgBlur: 0,
  bgFit: 'cover',
  disableBold: false
};

// --- PERSISTENCE HOOK (Local Storage - Persists after close) ---
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}

// --- SESSION HOOK (Session Storage - Clears on tab close) ---
function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  return [storedValue, setValue] as const;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // CRITICAL: User is stored in SessionStorage. Closing tab = Logout.
  const [user, setUser] = useSessionStorage<User | null>("zero_wms_current_user", null);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);
  
  // Persisted Settings & Data (These remain across sessions)
  const [appName, setAppName] = useLocalStorage("zero_wms_appname", "ZERO WMS");
  const [configs, setConfigs] = useLocalStorage<Record<string, AppConfig>>("zero_wms_configs", {});

  const initialRoles: Role[] = [
    { id: 'ADMIN', name: 'Administrador', description: 'Acceso total al sistema', permissions: {}, isSystem: true },
    { id: 'EMBASE_CONTROL', name: 'Control de Embase', description: 'Gestión específica de embase', permissions: {}, isSystem: true },
  ];

  const [users, setUsers] = useLocalStorage<User[]>("zero_wms_users", [
    { id: '1', name: 'Admin', rut: '1-9', password: '174545219', role: 'ADMIN', location: 'Central' }
  ]);
  const [roles, setRoles] = useLocalStorage<Role[]>("zero_wms_roles", initialRoles);

  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>("zero_wms_vehicles", []); 
  const [stock, setStock] = useLocalStorage<StockItem[]>("zero_wms_stock", []); 
  const [transactions, setTransactions] = useLocalStorage<GateTransaction[]>("zero_wms_transactions", []);
  const [geoRecords, setGeoRecords] = useLocalStorage<GeoLocationRecord[]>("zero_wms_georecords", []);
  const [emplacements, setEmplacements] = useLocalStorage<string[]>("zero_wms_emplacements", INITIAL_EMPLACEMENTS);
  const [documents, setDocuments] = useLocalStorage<ReceptionDocument[]>("zero_wms_documents", []);
  const [mobileInspections, setMobileInspections] = useLocalStorage<MobileInspection[]>("zero_wms_mobile_inspections", []);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Sistema Iniciado', message: 'Plataforma lista para operar.', type: 'INFO', timestamp: new Date(), read: false }
  ]);

  // Timers
  const visibilityTimer = useRef<number | null>(null);

  const login = (u: User) => {
    setUser(u);
    setWelcomeMessageShown(false);
  };

  const logout = useCallback(() => {
    setUser(null);
    setWelcomeMessageShown(false);
    if (visibilityTimer.current) {
        window.clearTimeout(visibilityTimer.current);
        visibilityTimer.current = null;
    }
  }, [setUser]);

  const updateCurrentUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...data } : u));
    }
  };

  // --- SECURITY LOGIC: 4 MINUTE TIMEOUT ON MINIMIZE/BACKGROUND ---
  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.hidden) {
            // User minimized window or switched tabs. Start 4 minute timer.
            // 4 minutes * 60 seconds * 1000 ms
            const TIMEOUT_DURATION = 4 * 60 * 1000; 
            
            visibilityTimer.current = window.setTimeout(() => {
                console.log("Sesión cerrada por inactividad en segundo plano (4 min).");
                logout();
            }, TIMEOUT_DURATION);
        } else {
            // User returned to the tab. Clear the timer if it hasn't fired yet.
            if (visibilityTimer.current) {
                window.clearTimeout(visibilityTimer.current);
                visibilityTimer.current = null;
            }
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (visibilityTimer.current) window.clearTimeout(visibilityTimer.current);
    };
  }, [logout]);


  const updateConfig = (emplacement: string, partial: Partial<AppConfig>) => {
    setConfigs(prev => ({
      ...prev,
      [emplacement]: { ...(prev[emplacement] || DEFAULT_CONFIG), ...partial }
    }));
  };

  const currentConfig = user ? (configs[user.location] || DEFAULT_CONFIG) : DEFAULT_CONFIG;

  const addVehicle = (v: Vehicle) => setVehicles([...vehicles, v]);
  const updateVehicle = (plate: string, v: Partial<Vehicle>) => {
    setVehicles(vehicles.map(veh => veh.plate === plate ? { ...veh, ...v } : veh));
  };

  const createTransaction = (t: GateTransaction) => setTransactions([...transactions, t]);
  const updateTransaction = (id: string, t: Partial<GateTransaction>) => {
    setTransactions(transactions.map(tr => tr.id === id ? { ...tr, ...t } : tr));
  };
  
  const addUser = (u: User) => setUsers([...users, u]);
  
  const editUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (user && user.id === id) {
        updateCurrentUser(data);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };
  
  const addRole = (r: Role) => setRoles([...roles, r]);
  const updateRole = (id: string, updated: Partial<Role>) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };
  const deleteRole = (id: string) => setRoles(roles.filter(r => r.id !== id));

  const addStockItem = (item: StockItem) => setStock(prev => [...prev, item]);
  const updateStockLocation = (id: string, newLocation: string) => {
    setStock(prev => prev.map(item => item.id === id ? { ...item, location: newLocation, lastUpdated: new Date().toISOString() } : item));
  };

  const markNotificationRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearNotifications = () => setNotifications([]);

  const addGeoRecord = (record: GeoLocationRecord) => setGeoRecords([record, ...geoRecords]);
  const deleteGeoRecord = (id: string) => setGeoRecords(geoRecords.filter(r => r.id !== id));
  
  const addEmplacement = (name: string) => {
    if (!emplacements.includes(name)) setEmplacements([...emplacements, name]);
  };

  const addDocument = (doc: ReceptionDocument) => setDocuments([doc, ...documents]);
  const addMobileInspection = (insp: MobileInspection) => setMobileInspections([insp, ...mobileInspections]);

  return (
    <AppContext.Provider value={{
      user, login, logout, updateCurrentUser,
      welcomeMessageShown, setWelcomeMessageShown,
      users, roles, vehicles, stock, transactions, notifications, geoRecords, emplacements, documents, mobileInspections,
      configs, updateConfig, currentConfig,
      addVehicle, updateVehicle, createTransaction, updateTransaction, 
      addUser, editUser, deleteUser, 
      addRole, updateRole, deleteRole,
      addStockItem, updateStockLocation,
      markNotificationRead, clearNotifications,
      addGeoRecord, deleteGeoRecord, addEmplacement, addDocument, addMobileInspection,
      appName, setAppName
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
