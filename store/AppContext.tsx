
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Vehicle, StockItem, GateTransaction, TransactionItem, Notification, GeoLocationRecord } from '../types';
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);
  const [appName, setAppName] = useState("ZERO WMS");

  // Initial Data
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

  const login = (u: User) => {
    setUser(u);
    setWelcomeMessageShown(false);
  };

  const logout = () => {
    setUser(null);
    setWelcomeMessageShown(false);
  };

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
