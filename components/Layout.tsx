
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { MODULES } from '../constants';
import { 
  LogOut, X, RefreshCw,
  Bell, AlertTriangle, Info, CheckCircle,
  Search, Sun, Clock, ChevronDown, CloudRain, Cloud, CloudLightning,
  User as UserIcon, Edit2, ShieldCheck,
  ChevronRight, MapPin, Terminal, Activity, Download
} from 'lucide-react';

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
       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Módulo de Perfil</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
              </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-[#0B1120] rounded-2xl flex items-center justify-center text-[#00AEEF] relative group cursor-pointer overflow-hidden border-2 border-slate-100">
                      {user?.photo ? (
                          <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                          <UserIcon size={40} />
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-black uppercase tracking-widest">
                          Cambiar
                      </div>
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del Operador</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
              </div>

              <div className="pt-4 flex gap-3">
                  <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-[#00AEEF] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all">Actualizar</button>
              </div>
          </form>
       </div>
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, activeModule, setActiveModule }) => {
  const { 
    user, logout, appName, notifications, currentConfig
  } = useApp();
  
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{temp: number, code: number} | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(true); // Simulamos actualización disponible
  const [isUpdating, setIsUpdating] = useState(false);
  
  const sidebarRef = useRef<HTMLElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const fetchWeather = async (lat: number, lon: number) => {
       try {
         const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
         const data = await res.json();
         setWeather({ temp: data.current_weather.temperature, code: data.current_weather.weathercode });
       } catch (e) {
         setWeather({ temp: 22, code: 1 });
       }
    };
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(-33.4489, -70.6693)
      );
    } else {
      fetchWeather(-33.4489, -70.6693);
    }
    return () => clearInterval(timer);
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
        window.location.reload();
    }, 2000);
  };

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

  return (
    <div className="h-[100dvh] flex overflow-hidden bg-slate-50 font-sans relative">
      
      {currentConfig.logo && (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.015] pointer-events-none overflow-hidden p-32">
          <img src={currentConfig.logo} alt="Watermark" className="w-full h-full object-contain filter grayscale invert" />
        </div>
      )}

      {/* SIDEBAR - INDUSTRIAL ICONOGRAPHY REDESIGN */}
      <aside 
        ref={sidebarRef}
        className={`
           transition-all duration-300 ease-out flex-col z-50 flex-shrink-0 bg-[#0B1120] text-slate-300 border-r border-slate-800/50
           hidden lg:flex ${isSidebarOpen ? 'w-[260px]' : 'w-[80px]'} h-full
        `}
      >
        <div className={`h-24 flex items-center flex-shrink-0 relative ${isSidebarOpen ? 'px-8' : 'justify-center'}`}>
          <div className={`flex items-center w-full overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
             {isSidebarOpen ? (
                <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                   <h1 className="text-xl font-black text-white italic tracking-tighter leading-none">ZERO <span className="text-[#00AEEF]">SYSTEM</span></h1>
                   <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">Innovative Solutions</p>
                </div>
             ) : (
                <div className="w-10 h-10 rounded-xl border-2 border-[#00AEEF]/30 bg-[#00AEEF]/5 flex items-center justify-center animate-pulse">
                    <span className="text-[12px] font-black text-white">Z</span>
                </div>
             )}
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#00AEEF] border border-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-400 transition-all z-20 shadow-[0_0_10px_rgba(0,174,239,0.5)] ${isSidebarOpen ? '' : 'rotate-180'}`}
          >
             <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
          {isSidebarOpen && (
            <div className="px-4 mb-6">
                <p className="text-[9px] font-black text-[#00AEEF] uppercase tracking-[0.3em] mb-1">Terminal Operativo</p>
                <div className="h-[2px] w-8 bg-[#00AEEF]/30 rounded-full"></div>
            </div>
          )}
          
          {MODULES.map((module) => {
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`
                  group relative flex items-center w-full rounded-xl transition-all duration-200 ease-out mb-1
                  ${isSidebarOpen ? 'px-4 py-3' : 'justify-center py-4 px-2'}
                  ${isActive 
                    ? 'bg-[#00AEEF]/10 text-white shadow-inner' 
                    : 'text-slate-500 hover:text-slate-100 hover:bg-white/5'}
                `}
              >
                <div className={`
                    flex-shrink-0 transition-all duration-300 
                    ${isActive ? 'text-[#00AEEF] scale-110' : 'group-hover:text-slate-300 group-hover:scale-105'}
                    ${isSidebarOpen ? 'mr-4' : 'mr-0'}
                `}>
                    <module.icon size={isSidebarOpen ? 18 : 22} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                
                {isSidebarOpen && (
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] truncate transition-all ${isActive ? 'translate-x-1 opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {module.label}
                  </span>
                )}

                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00AEEF] rounded-r-full shadow-[2px_0_10px_rgba(0,174,239,0.8)] animate-in slide-in-from-left-full"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800/50 bg-[#0F1623]">
          <button onClick={logout} className={`w-full flex items-center rounded-xl transition-all duration-200 group border border-transparent ${isSidebarOpen ? 'px-4 py-3 hover:bg-red-500/10' : 'justify-center py-4'}`}>
            <div className={`transition-transform duration-300 group-hover:rotate-12 ${isSidebarOpen ? 'mr-4' : 'mr-0'}`}>
                <LogOut size={isSidebarOpen ? 18 : 22} className="text-slate-500 group-hover:text-red-500" />
            </div>
            {isSidebarOpen && (
                <div className="text-left w-full">
                    <p className="text-[10px] font-black text-slate-500 group-hover:text-red-400 transition-colors uppercase tracking-widest">Cerrar Sesión</p>
                </div>
            )}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex justify-between items-center px-4 md:px-8 z-20 shadow-sm flex-shrink-0">
          
          <div className="flex items-center space-x-3 md:space-x-4">
             <div className="flex flex-col">
               <h2 className="text-sm md:text-lg font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                 {getGreeting()}, {user?.name.split(' ')[0]}
               </h2>
               <div className="flex items-center mt-0.5 md:mt-1 text-slate-500">
                  <Activity size={10} className="mr-1.5 text-[#00AEEF] animate-pulse" />
                  <span className="text-[9px] md:text-xs font-black uppercase tracking-widest truncate">
                      NODO: {user?.location || 'Central'}
                  </span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-6">
             {/* BOTÓN DE ACTUALIZACIÓN - DIDÁCTICO INDUSTRIAL */}
             {updateAvailable && (
                <button 
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className={`hidden md:flex items-center space-x-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl transition-all hover:bg-amber-100 group shadow-sm active:scale-95 ${isUpdating ? 'animate-pulse opacity-50' : ''}`}
                >
                   <div className={`p-1.5 bg-amber-500 rounded-lg text-white ${isUpdating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
                      <RefreshCw size={14} />
                   </div>
                   <div className="text-left">
                      <p className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Cambios Pendientes</p>
                      <p className="text-[8px] font-bold text-amber-600 uppercase mt-0.5">Actualizar Sistema</p>
                   </div>
                </button>
             )}

             <div className="hidden lg:flex items-center bg-slate-50 rounded-2xl px-5 py-2.5 border border-slate-100 shadow-sm">
                <div className="flex items-center pr-5 border-r border-slate-200">
                   {getWeatherIcon(weather?.code || 0)}
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 leading-none">{weather ? weather.temp : '--'}°</span>
                      <span className="text-[0.65rem] text-slate-400 font-bold uppercase">Clima</span>
                   </div>
                </div>
                <div className="flex items-center pl-5 w-32 justify-center">
                   <Clock size={18} className="text-[#00AEEF] mr-3 flex-shrink-0" />
                   <span className="text-sm font-black text-slate-700 tracking-wide tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                </div>
             </div>

             <div className="relative" ref={notifRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 bg-slate-50 text-slate-400 hover:text-[#00AEEF] rounded-xl transition-all active:scale-95 border border-slate-100 shadow-inner">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>
             </div>

             <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

             <div className="relative" ref={profileRef}>
                <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center cursor-pointer group p-1 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="h-8 w-8 md:h-10 md:w-10 bg-[#0B1120] rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm mr-2 md:mr-3 relative flex-shrink-0 transition-transform group-hover:scale-105">
                       {user?.photo ? <img src={user.photo} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#00AEEF] font-black text-sm">{user?.name.charAt(0)}</div>}
                    </div>
                    <div className="hidden md:flex flex-col items-start mr-2">
                       <span className="text-xs font-black text-slate-800 leading-none uppercase tracking-tight">{user?.name}</span>
                       <span className="text-[0.6rem] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user?.role === 'ADMIN' ? 'Administrator' : 'Operator'}</span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-300 hidden md:block ${showProfileMenu ? 'rotate-180' : ''}`} />
                </div>
                {showProfileMenu && (
                    <div className="absolute right-0 top-[120%] w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50"><p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{user?.name}</p></div>
                        <div className="p-2">
                            <button onClick={() => { setShowEditProfile(true); setShowProfileMenu(false); }} className="w-full flex items-center px-4 py-2.5 text-[10px] font-black text-slate-600 hover:bg-blue-50 hover:text-[#00AEEF] rounded-lg transition-colors mb-1 uppercase tracking-widest"><Edit2 size={14} className="mr-2" />Editar Perfil</button>
                            <button onClick={logout} className="w-full flex items-center px-4 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-widest"><LogOut size={14} className="mr-2" />Cerrar Sesión</button>
                        </div>
                    </div>
                )}
             </div>
          </div>
        </header>

        {isUpdating && (
            <div className="absolute inset-x-0 top-0 h-1 bg-slate-100 z-[100]">
                <div className="h-full bg-[#00AEEF] animate-progress"></div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#0B1120] text-white px-4 py-2 rounded-full shadow-2xl flex items-center space-x-3 border border-[#00AEEF]/30">
                    <Terminal size={12} className="text-[#00AEEF] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando Binarios v2.5.1...</span>
                </div>
            </div>
        )}

        <main className="flex-1 overflow-hidden bg-transparent relative z-10">
          <div className="w-full h-full relative">
             {children}
          </div>
        </main>
      </div>

      {showEditProfile && <ProfileEditModal onClose={() => setShowEditProfile(false)} />}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        .animate-progress {
            animation: progress 2s linear forwards;
        }
      `}} />
    </div>
  );
};
