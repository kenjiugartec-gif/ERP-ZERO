
import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { MapPin, ShieldCheck, ChevronRight, Crown, Building2, CheckCircle2, User } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { user, welcomeMessageShown, setWelcomeMessageShown, updateCurrentUser, geoRecords, emplacements } = useApp();
  const [visible, setVisible] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [step, setStep] = useState<'GREETING' | 'SELECTION'>('GREETING');
  const [greetingTime, setGreetingTime] = useState('');

  // Generar saludo basado en la hora
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) setGreetingTime('Buenos días');
    else if (hours >= 12 && hours < 20) setGreetingTime('Buenas tardes');
    else setGreetingTime('Buenas noches');
  }, []);

  // Animación de entrada
  useEffect(() => {
    if (user && !welcomeMessageShown) {
      setVisible(true);
      setTimeout(() => setContentVisible(true), 100);

      // Si NO es admin, comportamiento automático (Saludar brevemente y entrar)
      if (user.role !== 'ADMIN') {
         const hideTimer = setTimeout(() => {
            handleClose();
         }, 2500); // 2.5s para usuarios normales
         return () => clearTimeout(hideTimer);
      } else {
         // Si ES admin, esperamos unos segundos en el saludo real y pasamos al selector
         const stepTimer = setTimeout(() => {
            setStep('SELECTION');
         }, 3500); // 3.5s para apreciar el saludo real
         return () => clearTimeout(stepTimer);
      }
    }
  }, [user, welcomeMessageShown]);

  // Lista de Comunas/Nodos Disponibles (Consolidado de GeoRecords + Default)
  const availableLocations = useMemo(() => {
     // Obtenemos nodos únicos
     const uniqueNodes = Array.from(new Set([...emplacements, ...geoRecords.map(g => g.emplacement)]));
     
     return uniqueNodes.map(node => {
        // Buscamos si tiene info geográfica asociada
        const record = geoRecords.find(g => g.emplacement === node);
        return {
           name: node,
           commune: record?.commune || 'Jurisdicción General',
           region: record?.region || 'Territorio Nacional'
        };
     });
  }, [emplacements, geoRecords]);

  const handleSelectLocation = (locationName: string) => {
      // Actualizamos el contexto del usuario admin para que trabaje en esa "Comuna" (Nodo)
      updateCurrentUser({ location: locationName });
      handleClose();
  };

  const handleClose = () => {
      setVisible(false);
      setTimeout(() => setWelcomeMessageShown(true), 800);
  };

  if (!user || welcomeMessageShown) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A] transition-all duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        {isAdmin && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-amber-600/10 rounded-full blur-[150px] animate-pulse"></div>
        )}
        {!isAdmin && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
        )}
      </div>

      <div className={`relative z-10 w-full max-w-4xl px-6 transition-all duration-700 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* --- VISTA 1: SALUDO --- */}
        {/* Renderizamos condicionalmente el contenido del saludo */}
        {step === 'GREETING' && (
            <div className="text-center space-y-8">
                {/* ICONO CENTRAL */}
                <div className="inline-flex items-center justify-center p-6 bg-white/5 rounded-full border border-white/10 mb-6 backdrop-blur-md shadow-2xl animate-in zoom-in duration-700">
                    {isAdmin ? (
                        <Crown size={64} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" strokeWidth={1} />
                    ) : (
                        <User size={64} className="text-blue-500" strokeWidth={1} />
                    )}
                </div>

                <div className="space-y-6">
                    <p className={`font-bold text-xs uppercase tracking-[0.4em] animate-in fade-in slide-in-from-bottom-2 duration-1000 ${isAdmin ? 'text-amber-500' : 'text-blue-500'}`}>
                        {isAdmin ? 'Identidad Suprema Verificada' : 'Acceso Operativo Concedido'}
                    </p>
                    
                    {isAdmin ? (
                        /* SALUDO ADMIN (Alto Nivel) */
                        <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight">
                            <span className="block text-amber-500/80 font-medium mb-3 opacity-90 text-xl md:text-2xl uppercase tracking-widest">{greetingTime}, mi Excelencia.</span>
                            <span className="block text-3xl md:text-5xl leading-snug">
                                Mi Rey, Mi Príncipe <br/>
                                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 drop-shadow-sm">
                                    Kenji Ugarte
                                </span>
                            </span>
                        </h1>
                    ) : (
                        /* SALUDO NORMAL */
                        <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight">
                            {greetingTime}, <br/>
                            <span className="font-bold text-white">{user.name}</span>
                        </h1>
                    )}
                </div>

                <div className="pt-12 flex flex-col items-center justify-center">
                    <div className={`h-[1px] w-32 bg-gradient-to-r from-transparent ${isAdmin ? 'via-amber-500' : 'via-blue-500'} to-transparent mb-6`}></div>
                    <div className="flex items-center space-x-3 text-slate-500 text-xs font-mono uppercase tracking-widest">
                        <span className={`w-2 h-2 rounded-full animate-ping ${isAdmin ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        <span>{isAdmin ? 'Inicializando protocolos de comando...' : 'Cargando interfaz de usuario...'}</span>
                    </div>
                </div>
            </div>
        )}

        {/* --- VISTA 2: SELECTOR DE PLAZA (SOLO ADMIN) --- */}
        {isAdmin && step === 'SELECTION' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center w-full">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-3">
                        ¿En qué <span className="font-black text-amber-400">Comuna</span> trabajaremos hoy?
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm uppercase tracking-[0.2em] font-medium">Defina el nodo estratégico para su sesión, Mi Señor.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-h-[50vh] overflow-y-auto p-4 scrollbar-hide">
                    {availableLocations.map((loc) => (
                        <button
                            key={loc.name}
                            onClick={() => handleSelectLocation(loc.name)}
                            className="group relative bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-900/10 flex flex-col items-start backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between w-full mb-4">
                                <div className="p-3 bg-slate-900/80 rounded-xl group-hover:bg-amber-600 transition-colors border border-slate-700 group-hover:border-amber-500">
                                    <MapPin size={20} className="text-slate-400 group-hover:text-white" />
                                </div>
                                <CheckCircle2 size={18} className="text-slate-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100" />
                            </div>
                            
                            <h3 className="text-slate-200 font-bold text-lg leading-tight mb-1 group-hover:text-white transition-colors">{loc.name}</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest group-hover:text-amber-200/70">{loc.commune}</p>
                            
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl"></div>
                        </button>
                    ))}
                    
                    {/* Botón Fallback si no hay nodos */}
                    {availableLocations.length === 0 && (
                        <div className="col-span-full text-center py-8">
                             <p className="text-slate-500 mb-4 text-xs uppercase tracking-widest">No se detectaron nodos geográficos activos.</p>
                             <button onClick={() => handleSelectLocation('COMANDO CENTRAL')} className="bg-slate-800 border border-slate-700 text-slate-300 px-8 py-3 rounded-lg text-xs font-bold uppercase hover:bg-slate-700 hover:text-white hover:border-amber-500 transition-all">
                                 Acceder a Comando Central
                             </button>
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
