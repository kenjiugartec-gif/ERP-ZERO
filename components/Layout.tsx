
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { 
  CloudSun, LogOut, Menu, X, 
  LayoutDashboard, Package, Truck, 
  DoorOpen, ArrowLeftRight, History, 
  ClipboardCheck, MapPin, Car, 
  Users, Settings, FileText, Bell, XCircle, AlertTriangle, Info, CheckCircle,
  Trash2, Layers
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
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col z-30 shadow-xl flex-shrink-0 relative`}
      >
        {/* Cabecera con nombre de App y botón de colapso */}
        <div className={`h-20 flex items-center bg-slate-950/50 border-b border-slate-800/50 ${isSidebarOpen ? 'justify-between px-6' : 'justify-center px-0'}`}>
          {isSidebarOpen && (
            <div className="flex items-center animate-in fade-in slide-in-from-left-2 duration-500">
               <span className="text-[13px] font-black text-white tracking-[0.3em] uppercase italic opacity-90">
                 {appName}
               </span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`p-2.5 rounded-xl transition-all duration-200 ${isSidebarOpen ? 'hover:bg-slate-800 text-slate-500 hover:text-white' : 'bg-slate-800/80 text-white hover:bg-blue-600'}`}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar flex flex-col items-center">
          {isSidebarOpen && (
            <p className="w-full px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 animate-in fade-in duration-300">
              Panel Operativo
            </p>
          )}
          
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              title={!isSidebarOpen ? module.label : undefined}
              className={`w-full flex items-center rounded-2xl transition-all duration-300 group relative
                ${isSidebarOpen ? 'p-3.5' : 'p-3 justify-center'}
                ${activeModule === module.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' 
                  : 'text-slate-500 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <module.icon size={18} className={`${activeModule === module.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors flex-shrink-0`} />
              {isSidebarOpen && (
                <span className="ml-4 font-bold text-[11px] uppercase tracking-wider truncate animate-in fade-in duration-300">
                  {module.label}
                </span>
              )}
              {!isSidebarOpen && activeModule === module.id && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className={`p-4 bg-slate-950/40 border-t border-slate-800/50 flex flex-col items-center`}>
          <button 
            onClick={logout}
            className={`w-full flex items-center text-slate-500 hover:bg-red-950/30 hover:text-red-400 rounded-2xl transition-all duration-300 ${isSidebarOpen ? 'p-3.5' : 'p-3 justify-center'}`}
            title={!isSidebarOpen ? "Cerrar Sesión" : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isSidebarOpen && <span className="ml-4 font-bold text-[10px] uppercase tracking-[0.2em] truncate">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 z-20 shadow-sm flex-shrink-0">
          <div className="flex items-center">
             <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <Layers size={14} className="text-blue-600" />
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{user?.location}</span>
             </div>
             <span className="text-slate-200 mx-4">/</span>
             <h2 className="text-[11px] font-black text-slate-800 tracking-[0.2em] uppercase">
              {activeModule ? MODULES.find(m => m.id === activeModule)?.label : 'Escritorio'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-8">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-slate-700 text-xs font-bold leading-none">{getGreeting()}, <span className="text-slate-900">{user?.name}</span></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{user?.role}</span>
             </div>

             <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

             <div className="flex items-center space-x-5">
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] font-black text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 tracking-widest tabular-nums shadow-sm">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}</p>
                </div>
                
                <div className="relative" ref={notifRef}>
                    <button onClick={() => setShowNotifications(!showNotifications)} className={`relative p-2.5 rounded-full transition-all duration-300 ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-500'}`}>
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Notificaciones</h3>
                                 <button onClick={clearNotifications} className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center uppercase tracking-widest transition-colors">
                                     <Trash2 size={12} className="mr-2" /> Limpiar
                                 </button>
                             </div>
                             <div className="max-h-80 overflow-y-auto">
                                 {notifications.length === 0 ? (
                                     <div className="p-12 text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed">Sin alertas pendientes en el sistema central.</div>
                                 ) : (
                                     notifications.map(n => (
                                         <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-5 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                             <div className="flex items-start">
                                                 <div className="mt-1 mr-4 flex-shrink-0">{getNotifIcon(n.type)}</div>
                                                 <div className="flex-1 min-w-0">
                                                     <p className={`text-xs truncate ${!n.read ? 'font-black text-slate-900' : 'font-bold text-slate-500 uppercase tracking-tight'}`}>{n.title}</p>
                                                     <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{n.message}</p>
                                                 </div>
                                                 {!n.read && <div className="ml-4 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>}
                                             </div>
                                         </div>
                                     ))
                                 )}
                             </div>
                        </div>
                    )}
                </div>

                <div className="h-10 w-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl border border-slate-700 font-bold text-sm tracking-tighter hover:bg-slate-800 transition-colors cursor-pointer">
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
