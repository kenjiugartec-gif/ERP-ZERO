
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { 
  LogOut, Menu, X, 
  LayoutDashboard, Package, Truck, 
  DoorOpen, ArrowLeftRight, History, 
  ClipboardCheck, MapPin, Car, 
  Users, Settings, FileText, Bell, AlertTriangle, Info, CheckCircle,
  Trash2, Search, Sun, Clock, ChevronDown
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
        <header className="h-20 bg-white border-b border-slate-200 flex justify-between items-center px-8 z-20 shadow-sm flex-shrink-0">
          
          {/* Left Side: Greeting & Location */}
          <div className="flex flex-col">
             <h2 className="text-lg font-bold text-slate-900 leading-tight">
               {getGreeting()}, {user?.name}
             </h2>
             <div className="flex items-center mt-1 text-slate-500">
                <MapPin size={12} className="mr-1.5 text-blue-500" />
                <span className="text-[11px] font-medium">{user?.location || 'Ubicación General'}</span>
             </div>
          </div>
          
          {/* Right Side: Widgets & Profile */}
          <div className="flex items-center space-x-6">
             
             {/* Weather & Time Widget */}
             <div className="hidden lg:flex items-center bg-slate-50 rounded-2xl px-5 py-2.5 border border-slate-100 shadow-sm">
                <div className="flex items-center pr-5 border-r border-slate-200">
                   <Sun size={18} className="text-amber-500 mr-3" />
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 leading-none">33°</span>
                      <span className="text-[10px] text-slate-400 font-bold">Santiago</span>
                   </div>
                </div>
                <div className="flex items-center pl-5">
                   <Clock size={18} className="text-blue-500 mr-3" />
                   <span className="text-sm font-bold text-slate-700 font-mono tracking-wide">
                      {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                </div>
             </div>

             {/* Search Bar */}
             <div className="hidden md:flex relative w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="Buscar..." 
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                 />
             </div>

             {/* Notifications */}
             <div className="relative" ref={notifRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell size={22} />
                    {unreadCount > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
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

             <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

             {/* User Profile */}
             <div className="flex items-center cursor-pointer group">
                <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm mr-3">
                   {/* Placeholder avatar or initial */}
                   <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name.charAt(0)}
                   </div>
                </div>
                <div className="hidden md:flex flex-col items-start mr-2">
                   <span className="text-sm font-bold text-slate-800 leading-none">{user?.name}</span>
                   <span className="text-[10px] font-medium text-slate-400 mt-1">{user?.role === 'ADMIN' ? 'Admin' : 'Operador'}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
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
