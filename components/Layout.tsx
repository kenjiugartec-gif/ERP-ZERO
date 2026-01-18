
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { 
  CloudSun, LogOut, Menu, X, 
  LayoutDashboard, Package, Truck, 
  DoorOpen, ArrowLeftRight, History, 
  ClipboardCheck, MapPin, Car, 
  Users, Settings, FileText, Bell, XCircle, AlertTriangle, Info, CheckCircle,
  Trash2
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeModule: string;
  setActiveModule: (m: string) => void;
}

const MODULES = [
  { id: 'dashboard', label: 'Informe General', icon: LayoutDashboard },
  { id: 'stock', label: 'Gestión Almacenaje', icon: Package },
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

export const Layout: React.FC<LayoutProps> = ({ children, activeModule, setActiveModule }) => {
  const { user, logout, appName, notifications, markNotificationRead, clearNotifications, currentConfig } = useApp();
  const [time, setTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getGreeting = () => {
    const hours = time.getHours();
    if (hours < 12) return 'Buenos días';
    if (hours < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getNotifIcon = (type: string) => {
      switch(type) {
          case 'WARNING': return <AlertTriangle size={16} className="text-amber-500" />;
          case 'ERROR': return <X size={16} className="text-red-500" />;
          case 'SUCCESS': return <CheckCircle size={16} className="text-green-500" />;
          default: return <Info size={16} className="text-blue-500" />;
      }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 font-sans relative">
      
      {/* BACKGROUND WATERMARK LOGO */}
      {currentConfig.logo && (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.015] pointer-events-none overflow-hidden p-32">
          <img src={currentConfig.logo} alt="Watermark" className="w-full h-full object-contain filter grayscale invert" />
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-24'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col z-30 shadow-xl flex-shrink-0 relative`}
      >
        <div className="h-32 flex items-center justify-between px-4 bg-slate-950 border-b border-slate-800">
           {isSidebarOpen ? (
             <div className="flex items-center space-x-3 overflow-hidden">
               {currentConfig.logo ? (
                 <div className="bg-white/5 p-1 rounded-2xl flex items-center justify-center w-20 h-20 flex-shrink-0 overflow-hidden">
                   <img src={currentConfig.logo} alt="App Logo" className="w-full h-full object-contain" />
                 </div>
               ) : (
                 <div className="w-12 h-12 bg-blue-500 rounded-full flex-shrink-0"></div>
               )}
               <div className="flex flex-col min-w-0">
                 <span className="font-black text-sm text-white tracking-widest truncate uppercase leading-none">ZERO WMS</span>
                 <div className="w-6 h-0.5 bg-blue-500 mt-2 rounded-full"></div>
               </div>
             </div>
           ) : (
             <div className="w-full flex justify-center">
                {currentConfig.logo ? (
                  <img src={currentConfig.logo} alt="App Logo" className="h-16 w-16 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                )}
             </div>
           )}
           {isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors flex-shrink-0">
                <X size={18} />
              </button>
           )}
        </div>

        {!isSidebarOpen && (
           <div className="flex justify-center py-4 border-b border-slate-800/50">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 hover:bg-blue-600 rounded-xl text-white transition-all">
                 <Menu size={20} />
              </button>
           </div>
        )}
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <p className={`px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ${!isSidebarOpen && 'text-center'}`}>
            {isSidebarOpen ? 'Panel Operativo' : '·'}
          </p>
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-200 group relative
                ${activeModule === module.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <module.icon size={18} className={`${activeModule === module.id ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors flex-shrink-0`} />
              {isSidebarOpen && <span className="ml-3 font-bold text-[11px] uppercase tracking-tight truncate">{module.label}</span>}
              {!isSidebarOpen && activeModule === module.id && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button 
            onClick={logout}
            className="w-full flex items-center p-3 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-xl transition-colors"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-bold text-[10px] uppercase tracking-widest truncate">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 z-20 shadow-sm flex-shrink-0">
          <div className="flex items-center">
             <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                {currentConfig.logo && <img src={currentConfig.logo} className="h-7 w-auto object-contain" />}
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{user?.location}</span>
             </div>
             <span className="text-slate-200 mx-3">/</span>
             <h2 className="text-xs font-black text-slate-800 tracking-widest uppercase">
              {activeModule ? MODULES.find(m => m.id === activeModule)?.label : 'Escritorio'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-slate-700 text-xs font-bold leading-none">{getGreeting()}, <span className="text-slate-900">{user?.name}</span></span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">{user?.role}</span>
             </div>

             <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

             <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                   <p className="text-[9px] font-black text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 tracking-widest">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}</p>
                </div>
                
                <div className="relative" ref={notifRef}>
                    <button onClick={() => setShowNotifications(!showNotifications)} className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}>
                        <Bell size={18} />
                        {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                             <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                                 <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Notificaciones</h3>
                                 <button onClick={clearNotifications} className="text-[9px] font-bold text-slate-400 hover:text-red-500 flex items-center uppercase tracking-widest">
                                     <Trash2 size={12} className="mr-1" /> Limpiar
                                 </button>
                             </div>
                             <div className="max-h-64 overflow-y-auto">
                                 {notifications.length === 0 ? (
                                     <div className="p-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">Sin alertas pendientes.</div>
                                 ) : (
                                     notifications.map(n => (
                                         <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                             <div className="flex items-start">
                                                 <div className="mt-0.5 mr-3 flex-shrink-0">{getNotifIcon(n.type)}</div>
                                                 <div className="flex-1">
                                                     <p className={`text-[11px] ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600 uppercase tracking-tight'}`}>{n.title}</p>
                                                     <p className="text-[10px] text-slate-500 mt-1 leading-snug">{n.message}</p>
                                                 </div>
                                                 {!n.read && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>}
                                             </div>
                                         </div>
                                     ))
                                 )}
                             </div>
                        </div>
                    )}
                </div>

                <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md border border-slate-700 font-bold text-xs">
                  {user?.name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-0 bg-transparent relative z-10">
          <div className="w-full h-full relative">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};
