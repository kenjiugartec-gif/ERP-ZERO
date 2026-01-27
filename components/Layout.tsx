
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { MODULES } from '../constants';
import { 
  LogOut, X, 
  Bell, Sun, Clock, ChevronDown, CloudRain, Cloud, CloudLightning,
  User as UserIcon, Edit2, ChevronRight, Activity, Cpu, RefreshCw, Wifi
} from 'lucide-react';

export const Layout: React.FC<{children: React.ReactNode, activeModule: string, setActiveModule: (m: string) => void}> = ({ children, activeModule, setActiveModule }) => {
  const { user, logout, currentConfig } = useApp();
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{temp: number, code: number} | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Inicialmente colapsada para enfocarse en datos
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const lastEtagRef = useRef<string | null>(null);

  // Reloj persistente
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Clima: GPS con Fallback Silencioso (Reparado)
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        // Usamos Open-Meteo para datos en tiempo real gratuitos por coordenadas
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        if (data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode
          });
        }
      } catch (e) {
        console.error("Error al conectar con servicio meteorológico:", e);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Éxito: Usar coordenadas reales
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Error/Denegado: Fallback silencioso a Santiago (Capital)
          // No mostramos alerta para mantener la interfaz limpia ("Profesional")
          fetchWeather(-33.4489, -70.6693);
        }
      );
    } else {
        // Navegador no soporta GPS: Default Santiago
        fetchWeather(-33.4489, -70.6693);
    }
  }, []);

  // Detector de clics fuera de la barra lateral (Auto-colapso)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si la barra está abierta y el clic no fue dentro de la barra
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  // SISTEMA DE AUTO-ACTUALIZACIÓN (Version Watcher)
  // Consulta los encabezados del servidor cada 60s para detectar nuevos despliegues
  useEffect(() => {
    const checkForUpdates = async () => {
      if (document.hidden) return; // No verificar si la tab está oculta
      
      setIsCheckingUpdate(true);
      try {
        // Solicitamos solo los headers del index.html para ser eficientes
        const response = await fetch('/', { 
            method: 'HEAD', 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' } 
        });
        
        const newEtag = response.headers.get('ETag') || response.headers.get('Last-Modified');
        
        if (lastEtagRef.current && newEtag && newEtag !== lastEtagRef.current) {
            console.log("Nueva versión detectada en hosting. Actualizando...");
            window.location.reload();
        }
        
        if (newEtag) lastEtagRef.current = newEtag;
      } catch (err) {
        console.warn("Error verificando actualizaciones:", err);
      } finally {
        setIsCheckingUpdate(false);
      }
    };

    // Verificar inmediatamente al montar
    checkForUpdates();

    // Verificar cada 60 segundos
    const intervalId = setInterval(checkForUpdates, 60000);
    
    // Verificar cuando la app vuelve a primer plano (Móvil)
    const handleVisibilityChange = () => {
        if (!document.hidden) checkForUpdates();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        clearInterval(intervalId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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

  const handleModuleClick = (id: string) => {
    setActiveModule(id);
    setIsSidebarOpen(true); // Auto-despliegue al hacer clic en un módulo
  };

  return (
    <div className="h-[100dvh] flex overflow-hidden font-sans relative bg-slate-50">
      
      {/* Fondo de Pantalla Global Persistente */}
      {currentConfig.bgImage && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <img 
            src={currentConfig.bgImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20 filter blur-sm grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar con Referencia y Comportamiento Dinámico */}
      <aside 
        ref={sidebarRef}
        className={`transition-all duration-300 ease-out flex-col z-50 flex-shrink-0 bg-[#0B1120] text-slate-300 border-r border-slate-200/50 hidden lg:flex ${isSidebarOpen ? 'w-[260px]' : 'w-[80px]'} h-full shadow-2xl relative`}
      >
        <div className={`h-24 flex items-center flex-shrink-0 relative ${isSidebarOpen ? 'px-8' : 'justify-center'}`}>
          <div className="flex items-center w-full overflow-hidden transition-all duration-300">
             {isSidebarOpen ? (
                <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                   <h1 className="text-2xl text-white font-black tracking-tighter uppercase leading-none">ZERO</h1>
                   <p className="text-[7px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Innovative Solutions</p>
                </div>
             ) : (
                <div className="w-10 h-10 border border-[#00AEEF]/20 rounded-lg flex items-center justify-center text-[#00AEEF] text-xs font-black">Z</div>
             )}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#00AEEF] border border-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-400 transition-all z-20 shadow-lg ${isSidebarOpen ? '' : 'rotate-180'}`}><ChevronRight size={14} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
          {MODULES.map((module) => (
            <button 
              key={module.id} 
              onClick={() => handleModuleClick(module.id)} 
              className={`group relative flex items-center w-full rounded-xl transition-all duration-200 mb-1 ${isSidebarOpen ? 'px-4 py-3' : 'justify-center py-4 px-2'} ${activeModule === module.id ? 'bg-[#00AEEF]/10 text-white shadow-inner' : 'text-slate-500 hover:text-slate-100 hover:bg-white/5'}`}
            >
              <div className={`flex-shrink-0 transition-all ${activeModule === module.id ? 'text-[#00AEEF] scale-110' : 'group-hover:text-slate-300'} ${isSidebarOpen ? 'mr-4' : 'mr-0'}`}><module.icon size={isSidebarOpen ? 18 : 22} /></div>
              {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.15em] truncate">{module.label}</span>}
              {activeModule === module.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00AEEF] rounded-r-full shadow-[0_0_10px_#00AEEF]"></div>}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/50 bg-[#0F1623]">
          <button onClick={logout} className={`w-full flex items-center rounded-xl transition-all duration-200 group border border-transparent ${isSidebarOpen ? 'px-4 py-3 hover:bg-red-500/10' : 'justify-center py-4'}`}>
            <LogOut size={isSidebarOpen ? 18 : 22} className={`text-slate-500 group-hover:text-red-500 ${isSidebarOpen ? 'mr-4' : ''}`} />
            {isSidebarOpen && <p className="text-[10px] font-black text-slate-500 group-hover:text-red-400 uppercase tracking-widest">Cerrar Sesión</p>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-transparent">
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-4 md:px-8 z-20 shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-4">
             <div className="flex flex-col">
               <h2 className="text-sm md:text-lg text-slate-900 leading-tight uppercase tracking-tighter">
                 <span className="font-black text-slate-950 force-bold">{getGreeting()}</span>, {user?.name.split(' ')[0]}
               </h2>
               <div className="flex items-center mt-1 text-slate-500">
                  <Activity size={10} className="mr-1.5 text-[#00AEEF] animate-pulse" />
                  <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest truncate">NODO: {user?.location || 'COMANDO CENTRAL'} <span className="opacity-60 ml-1">| CENTRAL</span></span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-6">
             <div className="hidden lg:flex items-center bg-white rounded-2xl px-5 py-2.5 border border-slate-200 shadow-sm h-14">
                <div className="flex items-center pr-5 border-r border-slate-100">
                   {getWeatherIcon(weather?.code || 0)}
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 leading-none">{weather ? `${weather.temp}°` : '--°'}</span>
                      <span className="text-[0.65rem] font-bold text-slate-400 uppercase">Clima Real</span>
                   </div>
                </div>
                <div className="flex items-center pl-5 w-44 justify-center border-r border-slate-100 pr-5 mr-5">
                   <Clock size={18} className="text-[#00AEEF] mr-3 flex-shrink-0" />
                   <span className="text-sm font-bold text-slate-700 tracking-wide tabular-nums">
                      {time.toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                   </span>
                </div>
                {/* Indicador de Conexión / Versión */}
                <div className="flex items-center" title="Estado de Sincronización">
                    <div className={`w-2 h-2 rounded-full mr-2 ${isCheckingUpdate ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {isCheckingUpdate ? 'SYNC...' : 'ONLINE'}
                    </span>
                </div>
             </div>

             <div className="relative">
                <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center cursor-pointer group p-1 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="h-8 w-8 md:h-10 md:w-10 bg-white rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm mr-2 md:mr-3 relative flex-shrink-0">
                       <div className="w-full h-full flex items-center justify-center text-[#00AEEF] text-sm font-black">{user?.name.charAt(0)}</div>
                    </div>
                    <div className="hidden md:flex flex-col items-start mr-2">
                       <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{user?.name}</span>
                       <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">{user?.role === 'ADMIN' ? 'Administrador' : 'Operador'}</span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </div>
                {showProfileMenu && (
                    <div className="absolute right-0 top-[120%] w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50"><p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{user?.name}</p></div>
                        <div className="p-2">
                            <button className="w-full flex items-center px-4 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-[#00AEEF] rounded-lg transition-colors mb-1 uppercase tracking-widest"><Edit2 size={14} className="mr-2" />Editar Perfil</button>
                            {/* Botón manual de actualización por si el auto-check falla */}
                            <button onClick={() => window.location.reload()} className="w-full flex items-center px-4 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors mb-1 uppercase tracking-widest"><RefreshCw size={14} className="mr-2" />Forzar Actualización</button>
                            <button onClick={logout} className="w-full flex items-center px-4 py-2.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-widest"><LogOut size={14} className="mr-2" />Cerrar Sesión</button>
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
