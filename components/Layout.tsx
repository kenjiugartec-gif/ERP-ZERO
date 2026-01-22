
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { MODULES } from '../constants';
import { 
  LogOut, Menu, X, 
  LayoutDashboard, Package, Truck, 
  DoorOpen, ArrowLeftRight, History, 
  ClipboardCheck, MapPin, Car, 
  Users, Settings, FileText, Bell, AlertTriangle, Info, CheckCircle,
  Trash2, Search, Sun, Clock, ChevronDown, CloudRain, Cloud, CloudLightning,
  User as UserIcon, Edit2, Camera, Box, FileSpreadsheet, Download, ShieldCheck,
  ChevronRight
} from 'lucide-react';

// --- TYPES FOR SEARCH ---
type SearchResultType = 'VEHICLE' | 'STOCK' | 'TRANSACTION' | 'USER';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: SearchResultType;
  meta?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  activeModule: string;
  setActiveModule: (m: string) => void;
}

const ProfileEditModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, updateCurrentUser } = useApp();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    newPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
        updateCurrentUser({ name: formData.name });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Editar Perfil</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
              </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 relative group cursor-pointer overflow-hidden">
                      {user?.photo ? (
                          <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                          <UserIcon size={40} />
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                          Cambiar
                      </div>
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                  />
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2">
                 <p className="text-xs font-bold text-slate-800 mb-3">Seguridad</p>
                 <div className="space-y-3">
                     <input 
                        type="password" 
                        placeholder="Contraseña Actual"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500"
                      />
                      <input 
                        type="password" 
                        placeholder="Nueva Contraseña"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500"
                      />
                 </div>
              </div>

              <div className="pt-4 flex gap-3">
                  <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20">Guardar Cambios</button>
              </div>
          </form>
       </div>
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, activeModule, setActiveModule }) => {
  const { 
    user, logout, appName, notifications, markNotificationRead, clearNotifications, currentConfig, updateCurrentUser,
    vehicles, stock, transactions, users
  } = useApp();
  
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{temp: number, code: number} | null>(null);
  
  // Responsive sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle Resize for Responsive Layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Capture PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  // --- CLOCK & WEATHER ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Fetch Weather Real (Open-Meteo API - Free, No Key)
    const fetchWeather = async (lat: number, lon: number) => {
       try {
         const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
         const data = await res.json();
         setWeather({ temp: data.current_weather.temperature, code: data.current_weather.weathercode });
       } catch (e) {
         console.error("Error fetching weather", e);
         setWeather({ temp: 22, code: 1 }); // Fallback
       }
    };

    // Default to Santiago or try Geo
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(-33.4489, -70.6693) // Santiago Fallback
      );
    } else {
      fetchWeather(-33.4489, -70.6693);
    }

    return () => clearInterval(timer);
  }, []);

  // --- CLICK OUTSIDE HANDLERS ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfileMenu(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowSearchResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- SEARCH LOGIC ---
  useEffect(() => {
     if (searchQuery.length < 2) {
       setSearchResults([]);
       setShowSearchResults(false);
       return;
     }

     const query = searchQuery.toLowerCase();
     const results: SearchResult[] = [];
     const isAdmin = user?.role === 'ADMIN';

     // 1. Search Vehicles
     vehicles.forEach(v => {
       if (isAdmin || v.location === user?.location) {
         if (v.plate.toLowerCase().includes(query) || v.model.toLowerCase().includes(query) || v.driver.toLowerCase().includes(query)) {
           results.push({
             id: v.plate,
             title: v.plate,
             subtitle: `${v.brand} ${v.model} - ${v.driver}`,
             type: 'VEHICLE',
             meta: v.status
           });
         }
       }
     });

     // 2. Search Stock
     stock.forEach(s => {
       if (isAdmin || s.location === user?.location) {
         if (s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)) {
           results.push({
             id: s.id,
             title: s.name,
             subtitle: `SKU: ${s.code} | Cant: ${s.quantity}`,
             type: 'STOCK',
             meta: s.location
           });
         }
       }
     });

     // 3. Search Transactions
     transactions.forEach(t => {
        if (t.plate.toLowerCase().includes(query) || t.id.includes(query)) {
           results.push({
              id: t.id,
              title: `Transacción: ${t.plate}`,
              subtitle: t.status,
              type: 'TRANSACTION',
              meta: new Date(t.entryTime || t.exitTime || '').toLocaleDateString()
           });
        }
     });

     // 4. Search Users
     if (isAdmin) {
       users.forEach(u => {
         if (u.name.toLowerCase().includes(query) || u.rut.includes(query)) {
           results.push({
             id: u.id,
             title: u.name,
             subtitle: u.role,
             type: 'USER',
             meta: u.location
           });
         }
       });
     }

     setSearchResults(results.slice(0, 8)); // Limit to 8 results
     setShowSearchResults(true);

  }, [searchQuery, vehicles, stock, transactions, users, user]);

  const getGreeting = () => {
    const hours = time.getHours();
    if (hours < 12) return 'Buenos días';
    if (hours < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getWeatherIcon = (code: number) => {
      if (code >= 95) return <CloudLightning size={18} className="text-purple-500 mr-3" />;
      if (code >= 51) return <CloudRain size={18} className="text-blue-500 mr-3" />;
      if (code >= 1) return <Cloud size={18} className="text-slate-400 mr-3" />;
      return <Sun size={18} className="text-amber-500 mr-3" />;
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
    // Updated: h-screen to h-[100dvh] for mobile browsers
    <div className="h-[100dvh] flex overflow-hidden bg-slate-50 font-sans relative">
      
      {/* BACKGROUND WATERMARK LOGO */}
      {currentConfig.logo && (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.015] pointer-events-none overflow-hidden p-32">
          <img src={currentConfig.logo} alt="Watermark" className="w-full h-full object-contain filter grayscale invert" />
        </div>
      )}

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobile && isSidebarOpen && (
         <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside 
        className={`
           transition-all duration-300 ease-out flex flex-col z-50 flex-shrink-0 bg-[#0B1120] text-slate-300 border-r border-slate-800/50
           ${isMobile 
              ? `fixed top-0 left-0 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} h-[100dvh] shadow-2xl` 
              : `relative ${isSidebarOpen ? 'w-[280px]' : 'w-[88px]'} h-full`
           }
        `}
      >
        {/* HEADER SIDEBAR */}
        <div className={`h-24 flex items-center flex-shrink-0 relative ${isSidebarOpen ? 'px-6' : 'justify-center'}`}>
          <div className="flex items-center space-x-3 overflow-hidden">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
                <ShieldCheck size={22} strokeWidth={2} />
             </div>
             {isSidebarOpen && (
                <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
                   <h1 className="text-lg font-black text-white italic tracking-tighter leading-none">ZERO<span className="text-blue-500">WMS</span></h1>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Terminal Seguro</p>
                </div>
             )}
          </div>
          
          {/* Collapse Toggle (Desktop) */}
          {!isMobile && (
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className={`absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all z-20 shadow-sm ${isSidebarOpen ? '' : 'rotate-180'}`}
             >
                <ChevronRight size={14} />
             </button>
          )}

          {/* Close Toggle (Mobile) */}
          {isMobile && (
             <button onClick={() => setIsSidebarOpen(false)} className="absolute top-6 right-4 text-slate-500 p-2">
               <X size={24} />
             </button>
          )}
        </div>
        
        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide">
          {isSidebarOpen && (
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 animate-in fade-in duration-500">
              Panel Operativo
            </p>
          )}
          
          {MODULES.map((module) => {
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => { setActiveModule(module.id); if(isMobile) setIsSidebarOpen(false); }}
                className={`
                  group relative flex items-center w-full rounded-xl transition-all duration-300 ease-out
                  ${isSidebarOpen ? 'px-3.5 py-3' : 'justify-center py-3.5 px-2'}
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}
                `}
                title={!isSidebarOpen ? module.label : undefined}
              >
                <div className={`relative flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                   <module.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                   {isActive && !isSidebarOpen && (
                      <span className="absolute -right-1 -top-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                   )}
                </div>

                {isSidebarOpen && (
                  <span className={`ml-4 text-sm font-medium tracking-wide truncate transition-all ${isActive ? 'font-bold' : ''}`}>
                    {module.label}
                  </span>
                )}
                
                {/* Active Indicator Line (Left) - Only when open */}
                {isActive && isSidebarOpen && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white/30 rounded-r-full blur-[1px]"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0F1623]">
          {deferredPrompt && isSidebarOpen && (
             <button 
               onClick={handleInstallClick}
               className="w-full mb-3 flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all shadow-lg animate-pulse"
             >
               <ShieldCheck size={16} className="mr-2"/>
               <span className="font-bold text-[10px] uppercase tracking-wider">Instalar App</span>
             </button>
          )}
          
          <button 
            onClick={logout}
            className={`
               w-full flex items-center rounded-xl transition-all duration-200 group border border-transparent
               ${isSidebarOpen ? 'px-3 py-3 hover:bg-red-500/10 hover:border-red-500/20' : 'justify-center py-3 hover:bg-red-500/10'}
            `}
            title={!isSidebarOpen ? "Cerrar Sesión" : undefined}
          >
            <LogOut size={20} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            {isSidebarOpen && (
                <div className="ml-3 text-left">
                    <p className="text-xs font-bold text-slate-300 group-hover:text-red-400 transition-colors">Cerrar Sesión</p>
                    <p className="text-[9px] text-slate-600">Finalizar turno seguro</p>
                </div>
            )}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex justify-between items-center px-4 md:px-8 z-20 shadow-sm flex-shrink-0">
          
          <div className="flex items-center space-x-3 md:space-x-4">
             {/* Mobile Menu Button */}
             {isMobile && (
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
                   <Menu size={24} />
                </button>
             )}

             {/* Left Side: Greeting & Location */}
             <div className="flex flex-col">
               <h2 className="text-sm md:text-lg font-bold text-slate-900 leading-tight">
                 {getGreeting()}, {user?.name.split(' ')[0]}
               </h2>
               <div className="flex items-center mt-0.5 md:mt-1 text-slate-500">
                  <MapPin size={12} className="mr-1.5 text-blue-500" />
                  <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide truncate max-w-[120px] md:max-w-none">
                      {user?.role === 'ADMIN' ? 'Comando Central' : (user?.location || 'Ubicación General')}
                  </span>
               </div>
             </div>
          </div>
          
          {/* Right Side: Widgets & Profile */}
          <div className="flex items-center space-x-2 md:space-x-6">
             
             {/* Weather & Time Widget (Hidden on Mobile) */}
             <div className="hidden lg:flex items-center bg-slate-50 rounded-2xl px-5 py-2.5 border border-slate-100 shadow-sm">
                <div className="flex items-center pr-5 border-r border-slate-200">
                   {getWeatherIcon(weather?.code || 0)}
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 leading-none">{weather ? weather.temp : '--'}°</span>
                      <span className="text-[0.65rem] text-slate-400 font-bold">Tiempo Real</span>
                   </div>
                </div>
                <div className="flex items-center pl-5 w-32 justify-center">
                   <Clock size={18} className="text-blue-500 mr-3 flex-shrink-0" />
                   <span className="text-sm font-bold text-slate-700 tracking-wide tabular-nums w-[4.5rem] inline-block text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                   </span>
                </div>
             </div>

             {/* Intelligent Search Bar (Hidden on Mobile) */}
             <div className="hidden md:flex relative w-80" ref={searchRef}>
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onFocus={() => { if(searchResults.length > 0) setShowSearchResults(true); }}
                   placeholder="Buscar vehículos, stock, docs..." 
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400"
                 />
                 
                 {/* Search Results Dropdown */}
                 {showSearchResults && (
                    <div className="absolute top-[120%] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in zoom-in-95 duration-200">
                        {/* ... (Search results logic remains same) ... */}
                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                            <span>Resultados</span>
                            <span>{searchResults.length} encontrados</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {searchResults.map((res) => (
                                <div key={`${res.type}-${res.id}`} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center group">
                                    <div className={`p-2 rounded-lg mr-3 ${
                                        res.type === 'VEHICLE' ? 'bg-orange-50 text-orange-600' :
                                        res.type === 'STOCK' ? 'bg-blue-50 text-blue-600' :
                                        res.type === 'USER' ? 'bg-purple-50 text-purple-600' :
                                        'bg-teal-50 text-teal-600'
                                    }`}>
                                        {res.type === 'VEHICLE' && <Car size={16} />}
                                        {res.type === 'STOCK' && <Box size={16} />}
                                        {res.type === 'USER' && <Users size={16} />}
                                        {res.type === 'TRANSACTION' && <FileSpreadsheet size={16} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{res.title}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{res.subtitle}</div>
                                    </div>
                                    {res.meta && <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">{res.meta}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
             </div>

             {/* Notifications */}
             <div className="relative" ref={notifRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell size={22} />
                    {unreadCount > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
                </button>
                {showNotifications && (
                    <div className="absolute right-0 mt-4 w-72 md:w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                         <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                             <h3 className="text-[0.65rem] font-black text-slate-800 uppercase tracking-widest">Notificaciones</h3>
                             <button onClick={clearNotifications} className="text-[0.65rem] font-bold text-slate-400 hover:text-red-500 flex items-center uppercase tracking-widest transition-colors">
                                 <Trash2 size={12} className="mr-2" /> Limpiar
                             </button>
                         </div>
                         <div className="max-h-80 overflow-y-auto">
                             {notifications.length === 0 ? (
                                 <div className="p-12 text-center text-slate-400 text-[0.65rem] font-bold uppercase tracking-widest leading-relaxed">Sin alertas pendientes.</div>
                             ) : (
                                 notifications.map(n => (
                                     <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-5 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                         <div className="flex items-start">
                                             <div className="mt-1 mr-4 flex-shrink-0">{getNotifIcon(n.type)}</div>
                                             <div className="flex-1 min-w-0">
                                                 <p className={`text-xs truncate ${!n.read ? 'font-black text-slate-900' : 'font-bold text-slate-500 uppercase tracking-tight'}`}>{n.title}</p>
                                                 <p className="text-[0.65rem] text-slate-500 mt-1.5 leading-relaxed">{n.message}</p>
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

             {/* User Profile & Dropdown */}
             <div className="relative" ref={profileRef}>
                <div 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center cursor-pointer group p-1 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    <div className="h-8 w-8 md:h-10 md:w-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm mr-2 md:mr-3 relative flex-shrink-0">
                       {user?.photo ? (
                           <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                           <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                              {user?.name.charAt(0)}
                           </div>
                       )}
                    </div>
                    <div className="hidden md:flex flex-col items-start mr-2">
                       <span className="text-sm font-bold text-slate-800 leading-none">{user?.name}</span>
                       <span className="text-[0.65rem] font-medium text-slate-400 mt-1">{user?.role === 'ADMIN' ? 'Admin' : 'Operador'}</span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-300 hidden md:block ${showProfileMenu ? 'rotate-180' : ''}`} />
                </div>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                    <div className="absolute right-0 top-[120%] w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                        {/* ... Dropdown content same as before ... */}
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                            <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user?.location}</p>
                        </div>
                        <div className="p-2">
                            {deferredPrompt && (
                               <button 
                                 onClick={() => { handleInstallClick(); setShowProfileMenu(false); }}
                                 className="w-full flex items-center px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mb-1"
                               >
                                 <ShieldCheck size={14} className="mr-2" />
                                 Instalar App
                               </button>
                            )}
                            <button 
                                onClick={() => { setShowEditProfile(true); setShowProfileMenu(false); }}
                                className="w-full flex items-center px-3 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors mb-1"
                            >
                                <Edit2 size={14} className="mr-2" />
                                Editar Perfil
                            </button>
                            {user?.role === 'ADMIN' && (
                                <button 
                                    onClick={() => { setActiveModule('settings'); setShowProfileMenu(false); }}
                                    className="w-full flex items-center px-3 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                >
                                    <Settings size={14} className="mr-2" />
                                    Ajustes Sistema
                                </button>
                            )}
                            <div className="h-[1px] bg-slate-100 my-1"></div>
                            <button 
                                onClick={logout}
                                className="w-full flex items-center px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut size={14} className="mr-2" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}
             </div>

          </div>
        </header>

        {/* Change: overflow-hidden on main to ensure views fit exactly within boundaries */}
        <main className="flex-1 overflow-hidden bg-transparent relative z-10">
          <div className="w-full h-full relative">
             {children}
          </div>
        </main>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditProfile && (
          <ProfileEditModal onClose={() => setShowEditProfile(false)} />
      )}

    </div>
  );
};
