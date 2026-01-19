
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Vehicle, StockItem, GateTransaction, Notification, GeoLocationRecord, AppConfig } from '../types';
import { EMPLACEMENTS as INITIAL_EMPLACEMENTS } from '../constants';

interface AppContextType {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  welcomeMessageShown: boolean;
  setWelcomeMessageShown: (shown: boolean) => void;
  
  // Data Stores
  users: User[];
  vehicles: Vehicle[];
  stock: StockItem[];
  transactions: GateTransaction[];
  notifications: Notification[];
  geoRecords: GeoLocationRecord[];
  emplacements: string[];
  
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
  addStockItem: (item: StockItem) => void;
  updateStockLocation: (id: string, newLocation: string) => void;
  markNotificationRead: (id: number) => void;
  clearNotifications: () => void;
  addGeoRecord: (record: GeoLocationRecord) => void;
  deleteGeoRecord: (id: string) => void;
  addEmplacement: (name: string) => void;
  
  // UI Settings
  appName: string;
  setAppName: (n: string) => void;
}

const DEFAULT_CONFIG: AppConfig = {
  slogan: "Innovative solutions for technical logistics and industrial management.",
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);
  const [appName, setAppName] = useState("ZERO WMS");

  // Multi-tenant styling config
  const [configs, setConfigs] = useState<Record<string, AppConfig>>({});

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin', rut: '1-9', password: '174545219', role: 'ADMIN', location: 'Central' }
  ]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); 
  const [stock, setStock] = useState<StockItem[]>([]); 
  const [transactions, setTransactions] = useState<GateTransaction[]>([]);
  const [geoRecords, setGeoRecords] = useState<GeoLocationRecord[]>([]);
  const [emplacements, setEmplacements] = useState<string[]>(INITIAL_EMPLACEMENTS);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Sistema Iniciado', message: 'Plataforma lista para operar.', type: 'INFO', timestamp: new Date(), read: false }
  ]);

  // Timers for auto-logout
  const inactivityTimer = useRef<number | null>(null);
  const visibilityTimer = useRef<number | null>(null);

  const login = (u: User) => {
    setUser(u);
    setWelcomeMessageShown(false);
  };

  const logout = () => {
    setUser(null);
    setWelcomeMessageShown(false);
    if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
    if (visibilityTimer.current) window.clearTimeout(visibilityTimer.current);
  };

  // Logic for Auto-Logout
  useEffect(() => {
    if (!user) return;

    const INACTIVITY_LIMIT = 4 * 60 * 1000; // 4 minutes
    const MOBILE_VISIBILITY_LIMIT = 2 * 60 * 1000; // 2 minutes
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const resetInactivityTimer = () => {
      if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
      inactivityTimer.current = window.setTimeout(() => {
        console.warn("Cierre de sesión por inactividad (4 min)");
        logout();
      }, INACTIVITY_LIMIT);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (isMobile) {
          // Si es móvil y se oculta (o apaga pantalla), logout en 2 minutos
          visibilityTimer.current = window.setTimeout(() => {
            console.warn("Cierre de sesión automático (Móvil - 2 min oculto)");
            logout();
          }, MOBILE_VISIBILITY_LIMIT);
        }
      } else {
        // Si vuelve antes de los 2 minutos, cancelamos el timer de visibilidad
        if (visibilityTimer.current) {
          window.clearTimeout(visibilityTimer.current);
          visibilityTimer.current = null;
        }
      }
    };

    // Listeners for activity
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Listener for visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial timer start
    resetInactivityTimer();

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
      if (visibilityTimer.current) window.clearTimeout(visibilityTimer.current);
    };
  }, [user]);

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

  const addStockItem = (item: StockItem) => {
    setStock(prev => [...prev, item]);
    if (item.quantity < 20) {
      const newNotif: Notification = {
        id: Date.now(),
        title: 'Stock Crítico Detectado',
        message: `El ítem ${item.name} (${item.code}) se ha registrado con bajo stock.`,
        type: 'WARNING',
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const updateStockLocation = (id: string, newLocation: string) => {
    setStock(prev => prev.map(item => item.id === id ? { ...item, location: newLocation, lastUpdated: new Date().toISOString() } : item));
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => setNotifications([]);

  const addGeoRecord = (record: GeoLocationRecord) => setGeoRecords([record, ...geoRecords]);
  const deleteGeoRecord = (id: string) => setGeoRecords(geoRecords.filter(r => r.id !== id));
  
  const addEmplacement = (name: string) => {
    if (!emplacements.includes(name)) {
      setEmplacements([...emplacements, name]);
    }
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      welcomeMessageShown, setWelcomeMessageShown,
      users, vehicles, stock, transactions, notifications, geoRecords, emplacements,
      configs, updateConfig, currentConfig,
      addVehicle, updateVehicle, createTransaction, updateTransaction, addUser,
      addStockItem, updateStockLocation,
      markNotificationRead, clearNotifications,
      addGeoRecord, deleteGeoRecord, addEmplacement,
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
