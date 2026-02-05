
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { MODULES } from '../constants';
import { 
  LogOut, X, 
  Bell, Sun, Clock, ChevronDown, CloudRain, Cloud, CloudLightning,
  User as UserIcon, Edit2, ChevronRight, Activity, Cpu, RefreshCw, Wifi, MapPin
} from 'lucide-react';

export const Layout: React.FC<{children: React.ReactNode, activeModule: string, setActiveModule: (m: string) => void}> = ({ children, activeModule, setActiveModule }) => {
  const { user, logout, currentConfig } = useApp();
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{temp: number, code: number} | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const lastEtagRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        if (data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode
          });
        }
      } catch (e) {
        fetchWeather(-33.4489, -70.6693);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetchWeather(p.coords.latitude, p.coords.longitude),
        () => fetchWeather(-33.4489, -70.6693)
      );
    } else {
        fetchWeather(-33.4489, -70.6693);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    const checkForUpdates = async () => {
      if (document.hidden) return;
      setIsCheckingUpdate(true);
      try {
        const response = await fetch('/', { method: 'HEAD', cache: 'no-store' });
        const newEtag = response.headers.get('ETag') || response.headers.get('Last-Modified');
        if (lastEtagRef.current && newEtag && newEtag !== lastEtagRef.current) {
            window.location.reload();
        }
        if (newEtag) lastEtagRef.current = newEtag;
      } catch (err) {
      } finally {
        setIsCheckingUpdate(false);
      }
    };
    checkForUpdates();
    const intervalId = setInterval(checkForUpdates, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const getGreeting = () => {
    const hours = time.getHours();
    if (hours < 12) return 'BUENOS DÍAS';
    if (hours < 19) return 'BUENAS TARDES';
    return 'BUENAS NOCHES';
  };

  const getWeatherIcon = (code: number) => {
    if (code >= 95) return <CloudLightning size={14} className="text-purple-500 mr-2 animate-pulse" />;
    if (code >= 51) return <CloudRain size={14} className="text-blue-500 mr-2 animate-bounce" />;
    if (code >= 1) return <Cloud size={14} className="text-slate-400 mr-2" />;
    return <Sun size={14} className="text-amber-500 mr-2 animate-spin-slow" />;
  };

  const handleModuleClick = (id: string) => {
    setActiveModule(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-[100dvh] flex overflow-hidden font-sans relative bg-slate-100">
      
      {currentConfig.bgImage && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <img src={currentConfig.bgImage} alt="Bg" className="w-full h-full object-cover opacity-20 filter blur-sm grayscale-[0.3]"/>
          <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[2px]"></div>
        </div>
      )}

      {/* 3D Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex-col z-50 flex-shrink-0 bg-[#0F172A] text-slate-400 border-r border-slate-800/50 hidden lg:flex ${isSidebarOpen ? 'w-[280px]' : 'w-[88px]'} h-full shadow-[20px_0_40px_-15px_rgba(0,0,0,0.3)] relative overflow-visible`}
      >
        <div className={`h-20 flex items-center flex-shrink-0 relative ${isSidebarOpen ? 'px-8' : 'justify-center'}`}>
          <div className="flex items-center w-full overflow-hidden transition-all duration-300">
             {isSidebarOpen ? (
                <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                   <h1 className="text-2xl text-white font-black tracking-tighter uppercase leading-none italic shadow-sm">ZERO<span className="text-blue-500">.</span></h1>
                   <p className="text-[7px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1.5">Industrial Core</p>
                </div>
             ) : (
                <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 text-sm font-black shadow-inner animate-pulse">Z</div>
             )}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white hover:bg-blue-500 transition-all z-20 shadow-[0_5px_15px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-90 ${isSidebarOpen ? '' : 'rotate-180'}`}><ChevronRight size={14} strokeWidth={3} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-hide">
          {MODULES.map((module) => (
            <button key={module.id} onClick={() => handleModuleClick(module.id)} className={`group relative flex items-center w-full rounded-2xl transition-all duration-300 mb-1 ${isSidebarOpen ? 'px-5 py-3.5' : 'justify-center py-5 px-2'} ${activeModule === module.id ? 'bg-white/5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/5' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'}`}>
              <div className={`flex-shrink-0 transition-all duration-300 ${activeModule === module.id ? 'text-blue-500 scale-125 translate-z-10 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 'group-hover:text-slate-300 group-hover:scale-110'} ${isSidebarOpen ? 'mr-5' : 'mr-0'}`}><module.icon size={isSidebarOpen ? 18 : 22} /></div>
              {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate">{module.label}</span>}
              {activeModule === module.id && <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-8 bg-blue-500 rounded-l-full shadow-[0_0_20px_#3B82F6] animate-pulse"></div>}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800/50 bg-[#0B1120]">
          <button onClick={logout} className={`w-full flex items-center rounded-2xl transition-all duration-300 group border border-transparent ${isSidebarOpen ? 'px-5 py-4 hover:bg-red-500/10 hover:border-red-500/20' : 'justify-center py-5'}`}>
            <LogOut size={isSidebarOpen ? 18 : 22} className={`text-slate-600 group-hover:text-red-500 transition-colors ${isSidebarOpen ? 'mr-5' : ''}`} />
            {isSidebarOpen && <p className="text-[10px] font-black text-slate-500 group-hover:text-red-400 uppercase tracking-widest">Desconectar</p>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-transparent">
        {/* LINEAR 3D HEADER */}
        <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 flex justify-between items-center px-4 md:px-10 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex-shrink-0">
          <div className="flex items-center space-x-6 overflow-hidden">
             <div className="flex items-center space-x-4 text-slate-900 uppercase">
               <h2 className="text-[12px] md:text-[15px] font-black tracking-tight whitespace-nowrap drop-shadow-sm">
                 {getGreeting()}, <span className="text-blue-600">{user?.name.split(' ')[0]}</span>
               </h2>
               <div className="h-5 w-[1px] bg-slate-200 hidden md:block"></div>
               <div className="hidden md:flex items-center text-slate-400 whitespace-nowrap bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
                  <Activity size={14} className="mr-3 text-blue-500 animate-pulse shrink-0" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                    NODO: <span className="text-slate-800">{user?.location || 'CENTRAL'}</span> <span className="opacity-30 font-bold mx-2">|</span> {user?.commune || 'CL'}
                  </span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-8">
             {/* 3D WIDGETS */}
             <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center whitespace-nowrap hover:scale-105 transition-transform cursor-help group">
                   <div className="p-2 bg-slate-50 rounded-xl mr-3 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                      {getWeatherIcon(weather?.code || 0)}
                   </div>
                   <span className="text-[11px] font-black text-slate-800 tracking-tighter uppercase">
                      {weather ? `${weather.temp}°` : '--°'}
                   </span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <div className="flex items-center whitespace-nowrap hover:scale-105 transition-transform group">
                   <div className="p-2 bg-slate-50 rounded-xl mr-3 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg transition-all duration-300">
                      <Clock size={14} className="shrink-0" />
                   </div>
                   <span className="text-[11px] font-black text-slate-800 tracking-widest tabular-nums uppercase">
                      {time.toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit', second: '2-digit'})} {time.getHours() >= 12 ? 'PM' : 'AM'}
                   </span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <div className="flex items-center whitespace-nowrap bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
                    <div className={`w-2 h-2 rounded-full mr-3 ${isCheckingUpdate ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]'}`}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {isCheckingUpdate ? 'SYNC' : 'ONLINE'}
                    </span>
                </div>
             </div>

             <div className="relative">
                <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center cursor-pointer group p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
                    <div className="h-10 w-10 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-lg mr-4 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
                       <span className="text-blue-500 text-sm font-black">{user?.name.charAt(0)}</span>
                    </div>
                    <div className="hidden xl:flex flex-col items-start leading-none space-y-1">
                       <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{user?.name}</span>
                       <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{user?.role === 'ADMIN' ? 'ADMINISTRADOR' : 'OPERADOR'}</span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 ml-4 transition-transform duration-300 ${showProfileMenu ? 'rotate-180 text-blue-600' : ''}`} />
                </div>
                {showProfileMenu && (
                    <div className="absolute right-0 top-[130%] w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-4 duration-300">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{user?.name}</p>
                        </div>
                        <div className="p-3">
                            <button className="w-full flex items-center px-5 py-3.5 text-[10px] font-black text-slate-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all mb-1 uppercase tracking-widest group"><Edit2 size={14} className="mr-3 group-hover:scale-110" />Perfil</button>
                            <button onClick={() => window.location.reload()} className="w-full flex items-center px-5 py-3.5 text-[10px] font-black text-slate-600 hover:bg-amber-500 hover:text-white rounded-2xl transition-all mb-1 uppercase tracking-widest group"><RefreshCw size={14} className="mr-3 group-hover:rotate-180 duration-500" />Actualizar</button>
                            <button onClick={logout} className="w-full flex items-center px-5 py-3.5 text-[10px] font-black text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all uppercase tracking-widest group"><LogOut size={14} className="mr-3 group-hover:translate-x-1" />Salir</button>
                        </div>
                    </div>
                )}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative z-10">
          <div className="w-full h-full relative">{children}</div>
        </main>
      </div>
    </div>
  );
};
