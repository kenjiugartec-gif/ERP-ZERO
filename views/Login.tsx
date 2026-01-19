
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Eye, EyeOff, Lock, User, MapPin, ArrowRight, XCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block";
const inputClass = "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-300 text-sm font-semibold shadow-sm";
const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300";

export const Login: React.FC = () => {
  const { login, users, emplacements, configs, appName } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedEmplacement, setSelectedEmplacement] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeConfig = useMemo(() => {
    return configs[selectedEmplacement] || {
      slogan: "Innovative solutions for technical logistics and industrial management.",
      logo: undefined,
      loginImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop"
    };
  }, [selectedEmplacement, configs]);

  useEffect(() => {
    if (username.toLowerCase() === 'admin') {
      setIsAdminMode(true);
      setSelectedEmplacement(''); 
    } else {
      setIsAdminMode(false);
    }
  }, [username]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.name === username && u.password === password);
    
    if (!foundUser) {
      setError('Error de protocolo: Credenciales no reconocidas.');
      return;
    }

    if (foundUser.role !== 'ADMIN' && !selectedEmplacement) {
      setError('Selección de emplazamiento obligatoria para este rango.');
      return;
    }

    login({ ...foundUser, location: selectedEmplacement || foundUser.location });
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden font-sans">
      {/* SECCIÓN VISUAL IZQUIERDA */}
      <div className="relative w-1/2 hidden lg:block overflow-hidden">
        <img 
          src={activeConfig.loginImage} 
          alt="Logistics Operations" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-20 h-full">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <h1 className="text-7xl font-black text-white tracking-tighter italic leading-[0.9] uppercase">
              {appName.split(' ')[0]} <br/> 
              <span className="text-blue-500">{appName.split(' ').slice(1).join(' ') || 'WMS'}</span>
            </h1>
            <div className="w-16 h-1.5 bg-blue-500 mt-8 rounded-full shadow-lg"></div>
          </div>
          
          <div className="max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <p className="text-white/80 text-xl font-light leading-relaxed tracking-wide">
              {activeConfig.slogan}
            </p>
            <div className="mt-10 flex items-center space-x-6 text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">
              <span className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span> SECURE NODE</span>
              <span>ENCRYPTED V2</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN FORMULARIO DERECHA */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          <header className="mb-14">
            <h2 className="text-2xl font-black text-slate-900 tracking-widest uppercase leading-none">
              INICIO DE SESIÓN
            </h2>
            <div className="flex items-center mt-3 border-l-2 border-slate-100 pl-4">
              <p className="text-slate-400 text-sm font-medium">Ingreso de las credenciales para inicio de sesión</p>
            </div>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-1.5 group">
              <label className={labelClass}>Usuario</label>
              <div className="relative">
                <User className={iconClass} size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="Usuario / ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className={labelClass}>Contraseña</label>
              <div className="relative">
                <Lock className={iconClass} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div 
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAdminMode ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-32 opacity-100'}`}
            >
              <div className="space-y-1.5 pt-2" ref={selectRef}>
                <label className={labelClass}>Emplazamiento</label>
                <div className="relative">
                  <MapPin className={iconClass} size={18} />
                  <div 
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className={`${inputClass} cursor-pointer flex items-center justify-between select-none ${isSelectOpen ? 'ring-4 ring-blue-500/5 bg-white border-blue-500' : ''}`}
                  >
                    <span className={selectedEmplacement ? 'text-slate-700 font-bold' : 'text-slate-300 truncate'}>
                      {selectedEmplacement || "Seleccione Ubicación..."}
                    </span>
                    <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 flex-shrink-0 ${isSelectOpen ? 'rotate-180 text-blue-500' : ''}`} />
                  </div>

                  {isSelectOpen && (
                    <div className="absolute top-[110%] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="max-h-48 overflow-y-auto">
                        <div 
                          onClick={() => { setSelectedEmplacement(''); setIsSelectOpen(false); }}
                          className="px-6 py-3 text-xs text-slate-300 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                        >
                          Seleccione Ubicación...
                        </div>
                        {emplacements.map(emp => (
                          <div 
                            key={emp}
                            onClick={() => { setSelectedEmplacement(emp); setIsSelectOpen(false); }}
                            className={`px-6 py-3 text-xs font-bold flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${selectedEmplacement === emp ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                          >
                            <span>{emp}</span>
                            {selectedEmplacement === emp && <CheckCircle2 size={14} className="text-blue-600" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
               <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center animate-in slide-in-from-top-2">
                  <XCircle size={14} className="mr-3 flex-shrink-0" />
                  {error}
               </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center group"
            >
              <span>Ingreso al sistema</span>
              <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <footer className="mt-20 flex items-center justify-between border-t border-slate-100 pt-8">
             <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">NETWORK ACTIVE</span>
             </div>
             <span className="text-[9px] font-bold text-slate-200 uppercase tracking-[0.2em]">© 2024 ZERO INNOVATIVE SOLUTIONS</span>
          </footer>
        </div>
      </div>
    </div>
  );
};
