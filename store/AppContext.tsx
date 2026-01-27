
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { User, Vehicle, StockItem, GateTransaction, Notification, GeoLocationRecord, AppConfig, Role, ReceptionDocument, MobileInspection } from '../types';
import { EMPLACEMENTS as INITIAL_EMPLACEMENTS } from '../constants';

interface AppContextType {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  updateCurrentUser: (data: Partial<User>) => void;
  welcomeMessageShown: boolean;
  setWelcomeMessageShown: (shown: boolean) => void;
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
  configs: Record<string, AppConfig>;
  updateConfig: (emplacement: string, config: Partial<AppConfig>) => void;
  currentConfig: AppConfig;
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
  appName: string;
  setAppName: (n: string) => void;
}

const DEFAULT_CONFIG: AppConfig = {
  slogan: "Innovative Solutions, Comprehensive Logistics Solutions.",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14, 
  lineHeight: 1.5,
  primaryColor: "#2563eb",
  logo: '/logisnova_logo.svg',
  loginImage: undefined,
  bgImage: undefined,
  bgOpacity: 50,
  bgBlur: 0,
  bgFit: 'cover',
  disableBold: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("zero_wms_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);
  const [appName, setAppName] = useState(() => localStorage.getItem("zero_wms_appname") || "ZERO");
  const [configs, setConfigs] = useState<Record<string, AppConfig>>(() => {
    const saved = localStorage.getItem("zero_wms_configs");
    return saved ? JSON.parse(saved) : {};
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("zero_wms_users");
    const defaultAdmin: User = { 
      id: 'admin_master', 
      name: 'Admin', 
      rut: '1-9', 
      password: '174545219', 
      role: 'ADMIN', 
      location: 'COMANDO CENTRAL', 
      commune: 'CENTRAL',
      username: 'Admin'
    };

    if (saved) {
      const parsed = JSON.parse(saved) as User[];
      const others = parsed.filter(u => u.name !== 'Admin');
      return [defaultAdmin, ...others];
    }
    return [defaultAdmin];
  });

  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem("zero_wms_roles");
    return saved ? JSON.parse(saved) : [
      { id: 'ADMIN', name: 'Administrador', description: 'Acceso total', permissions: {}, isSystem: true }
    ];
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [transactions, setTransactions] = useState<GateTransaction[]>([]);
  const [geoRecords, setGeoRecords] = useState<GeoLocationRecord[]>([]);
  const [emplacements, setEmplacements] = useState<string[]>(INITIAL_EMPLACEMENTS);
  const [documents, setDocuments] = useState<ReceptionDocument[]>([]);
  const [mobileInspections, setMobileInspections] = useState<MobileInspection[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const inactivityTimer = useRef<number | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("zero_wms_current_user");
    setWelcomeMessageShown(false);
    if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
    inactivityTimer.current = window.setTimeout(() => {
      logout();
    }, 4 * 60 * 1000);
  }, [logout]);

  useEffect(() => {
    if (!user) return;
    const handleVisibilityChange = () => { if (document.hidden) logout(); };
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const onActivity = () => resetInactivityTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    activityEvents.forEach(evt => document.addEventListener(evt, onActivity));
    resetInactivityTimer();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      activityEvents.forEach(evt => document.removeEventListener(evt, onActivity));
      if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
    };
  }, [user, logout, resetInactivityTimer]);

  const login = (u: User) => {
    setUser(u);
    sessionStorage.setItem("zero_wms_current_user", JSON.stringify(u));
    setWelcomeMessageShown(false);
  };

  const updateCurrentUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      sessionStorage.setItem("zero_wms_current_user", JSON.stringify(updated));
    }
  };

  const updateConfig = (emp: string, partial: Partial<AppConfig>) => {
    setConfigs(prev => {
      const updated = { ...prev, [emp]: { ...(prev[emp] || DEFAULT_CONFIG), ...partial } };
      localStorage.setItem("zero_wms_configs", JSON.stringify(updated));
      return updated;
    });
  };

  const currentConfig = user ? (configs[user.location] || configs['COMANDO CENTRAL'] || DEFAULT_CONFIG) : (configs['COMANDO CENTRAL'] || DEFAULT_CONFIG);

  useEffect(() => {
    localStorage.setItem("zero_wms_users", JSON.stringify(users));
    localStorage.setItem("zero_wms_roles", JSON.stringify(roles));
    localStorage.setItem("zero_wms_appname", appName);
  }, [users, roles, appName]);

  const addVehicle = (v: Vehicle) => setVehicles(prev => [...prev, v]);
  const updateVehicle = (plate: string, v: Partial<Vehicle>) => setVehicles(prev => prev.map(veh => veh.plate === plate ? { ...veh, ...v } : veh));
  const createTransaction = (t: GateTransaction) => setTransactions(prev => [...prev, t]);
  const updateTransaction = (id: string, t: Partial<GateTransaction>) => setTransactions(prev => prev.map(tr => tr.id === id ? { ...tr, ...t } : tr));
  const addUser = (u: User) => setUsers(prev => [...prev, u]);
  const editUser = (id: string, data: Partial<User>) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  const addRole = (r: Role) => setRoles(prev => [...prev, r]);
  const updateRole = (id: string, r: Partial<Role>) => setRoles(prev => prev.map(role => role.id === id ? { ...role, ...r } : role));
  const deleteRole = (id: string) => setRoles(prev => prev.filter(r => r.id !== id));
  const addStockItem = (item: StockItem) => setStock(prev => [...prev, item]);
  const updateStockLocation = (id: string, loc: string) => setStock(prev => prev.map(i => i.id === id ? { ...i, location: loc } : i));
  const markNotificationRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearNotifications = () => setNotifications([]);
  const addGeoRecord = (r: GeoLocationRecord) => setGeoRecords(prev => [...prev, r]);
  const deleteGeoRecord = (id: string) => setGeoRecords(prev => prev.filter(r => r.id !== id));
  const addEmplacement = (n: string) => setEmplacements(prev => prev.includes(n) ? prev : [...prev, n]);
  const addDocument = (d: ReceptionDocument) => setDocuments(prev => [...prev, d]);
  const addMobileInspection = (i: MobileInspection) => setMobileInspections(prev => [...prev, i]);

  return (
    <AppContext.Provider value={{
      user, login, logout, updateCurrentUser, welcomeMessageShown, setWelcomeMessageShown,
      users, roles, vehicles, stock, transactions, notifications, geoRecords, emplacements, documents, mobileInspections,
      configs, updateConfig, currentConfig, addVehicle, updateVehicle, createTransaction, updateTransaction,
      addUser, editUser, deleteUser, addRole, updateRole, deleteRole,
      addStockItem, updateStockLocation, markNotificationRead, clearNotifications,
      addGeoRecord, deleteGeoRecord, addEmplacement, addDocument, addMobileInspection, appName, setAppName
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
