import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { 
  CloudSun, User, LogOut, Menu, X, 
  LayoutDashboard, Package, Truck, 
  DoorOpen, ArrowLeftRight, History, 
  ClipboardCheck, MapPin, Car, 
  Users, Settings, FileText, Bell, Check, Trash2, AlertTriangle, Info, CheckCircle
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
  const { user, logout, appName, notifications, markNotificationRead, clearNotifications } = useApp();
  const [time, setTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
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
    <div className="h-screen flex overflow-hidden bg-slate-50 font-sans">
      
      {/* Sidebar - Adjusted width to w-56 (approx 224px) to fit text tightly */}
      <aside 
        className={`${isSidebarOpen ? 'w-56' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col z-30 shadow-xl flex-shrink-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 bg-slate-950 border-b border-slate-800">
           {isSidebarOpen && (
             <div className="flex items-center space-x-2 overflow-hidden">
               <div className="w-6 h-6 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-md flex-shrink-0"></div>
               <span className="font-bold text-lg text-white tracking-tight truncate">{appName}</span>
             </div>
           )}
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors flex-shrink-0">
             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <p className={`px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ${!isSidebarOpen && 'text-center'}`}>
            {isSidebarOpen ? 'Módulos' : 'Menú'}
          </p>
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group relative
                ${activeModule === module.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <module.icon size={20} className={`${activeModule === module.id ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors flex-shrink-0`} />
              {isSidebarOpen && <span className="ml-3 font-medium text-sm truncate">{module.label}</span>}
              
              {/* Active Indicator Strip */}
              {!isSidebarOpen && activeModule === module.id && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button 
            onClick={logout}
            className="w-full flex items-center p-2.5 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-medium text-sm truncate">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 z-20 shadow-sm flex-shrink-0">
          <div className="flex items-center">
             <span className="text-slate-400 mr-2 text-sm font-medium">Portal</span>
             <span className="text-slate-300 mx-2">/</span>
             <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {activeModule ? MODULES.find(m => m.id === activeModule)?.label : 'Escritorio'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-slate-700 text-sm font-medium">{getGreeting()}, <span className="text-slate-900 font-bold">{user?.name}</span></span>
                <span className="text-xs text-slate-500 flex items-center">
                   <CloudSun size={12} className="mr-1 text-teal-600" /> 
                   Santiago, 24°C
                </span>
             </div>

             <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

             <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                   <p className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}</p>
                </div>
                
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                        )}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                             <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
                                 <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Notificaciones</h3>
                                 <button onClick={clearNotifications} className="text-xs text-slate-400 hover:text-red-500 flex items-center">
                                     <Trash2 size={12} className="mr-1" /> Limpiar
                                 </button>
                             </div>
                             <div className="max-h-64 overflow-y-auto">
                                 {notifications.length === 0 ? (
                                     <div className="p-6 text-center text-slate-400 text-xs">
                                         Sin notificaciones nuevas.
                                     </div>
                                 ) : (
                                     notifications.map(n => (
                                         <div 
                                            key={n.id} 
                                            onClick={() => markNotificationRead(n.id)}
                                            className={`p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                                         >
                                             <div className="flex items-start">
                                                 <div className="mt-0.5 mr-3 flex-shrink-0">
                                                     {getNotifIcon(n.type)}
                                                 </div>
                                                 <div>
                                                     <p className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.title}</p>
                                                     <p className="text-xs text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                                                     <p className="text-[10px] text-slate-400 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                                                 </div>
                                                 {!n.read && <div className="ml-auto w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>}
                                             </div>
                                         </div>
                                     ))
                                 )}
                             </div>
                        </div>
                    )}
                </div>

                <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-md border border-slate-700">
                  <span className="font-bold text-sm">{user?.name.charAt(0)}</span>
                </div>
             </div>
          </div>
        </header>

        {/* Scrollable Content Area - Removed padding p-6 to allow full-screen modals */}
        <main className="flex-1 overflow-y-auto p-0 bg-slate-50 relative">
          <div className="w-full h-full relative">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};