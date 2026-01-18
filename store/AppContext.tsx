import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Vehicle, StockItem, GateTransaction, TransactionItem, Notification } from '../types';

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
  
  // UI Settings
  appName: string;
  setAppName: (n: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);
  const [appName, setAppName] = useState("Sistema de Gestión");

  // Initial Data: Clean for Production Use
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin', rut: '1-9', password: 'admin', role: 'ADMIN', location: 'Central' }
  ]);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Clean fleet
  const [stock, setStock] = useState<StockItem[]>([]); // Clean stock
  
  const [transactions, setTransactions] = useState<GateTransaction[]>([]);
  
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
    
    // AUTOMATIC NOTIFICATION LOGIC
    // Threshold defined as 20 units
    if (item.quantity < 20) {
      const newNotif: Notification = {
        id: Date.now(),
        title: 'Stock Crítico Detectado',
        message: `El ítem ${item.name} (${item.code}) se ha registrado con bajo stock: ${item.quantity} unidades.`,
        type: 'WARNING',
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    } else {
       // Success notification for large entries
       if (item.quantity > 100) {
          const newNotif: Notification = {
            id: Date.now(),
            title: 'Ingreso Masivo',
            message: `Se han ingresado ${item.quantity} unidades de ${item.name}.`,
            type: 'SUCCESS',
            timestamp: new Date(),
            read: false
          };
          setNotifications(prev => [newNotif, ...prev]);
       }
    }
  };

  const updateStockLocation = (id: string, newLocation: string) => {
    setStock(prev => prev.map(item => item.id === id ? { ...item, location: newLocation, lastUpdated: new Date().toISOString() } : item));
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      welcomeMessageShown, setWelcomeMessageShown,
      users, vehicles, stock, transactions, notifications,
      addVehicle, updateVehicle, createTransaction, updateTransaction, addUser,
      addStockItem, updateStockLocation,
      markNotificationRead, clearNotifications,
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