
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Eye, EyeOff, Lock, User, ShieldCheck, MapPin, ArrowRight, XCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block";
const inputClass = "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-300 text-sm font-medium shadow-sm";
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

  // Close custom select when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic branding based on selection
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
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img 
          src={activeConfig.loginImage || "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop"} 
          alt="Logistics Operations" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] contrast-[1.2] transition-all duration-700"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-24 w-full h-full">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            {activeConfig.logo && (
              <div className="mb-12">
                 <img src={activeConfig.logo} alt="Brand Logo" className="h-32 w-auto object-contain filter drop-shadow-2xl" />
              </div>
            )}
            <h1 className="text-7xl font-black text-white tracking-tighter italic leading-[0.9] uppercase">
              {appName.split(' ')[0]} <br/> <span className="text-blue-500">{appName.split(' ').slice(1).join(' ') || 'WMS'}</span>
            </h1>
            <div className="w-16 h-1.5 bg-blue-500 mt-8 rounded-full shadow-lg shadow-blue-500/20"></div>
          </div>
          
          <div className="max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <p className="text-white/80 text-xl font-light leading-relaxed tracking-wide">
              {activeConfig.slogan}
            </p>
            <div className="mt-10 flex items-center space-x-6 text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">
              <span className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span> Secure Node</span>
              <span>Encrypted V2</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-12 lg:p-24 bg-white relative">
        <div className="w-full max-sm px-4">
          <header className="mb-14">
            <h2 
              style={{ fontFamily: 'Arial, sans-serif', fontSize: '19px', fontWeight: 700, fontStyle: 'normal' }}
              className="text-slate-900 tracking-widest uppercase leading-none"
            >
              INICIO DE SESIÓN
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-3 border-l-2 border-slate-100 pl-4 ml-1">Ingreso de las credenciales para inicio de sesión</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-7">
            
            <div className="space-y-1.5">
              <label className={labelClass}>Usuario</label>
              <div className="relative group">
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

            <div className="space-y-1.5">
              <label className={labelClass}>Contraseña</label>
              <div className="relative group">
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div 
              className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAdminMode ? 'max-h-0 opacity-0 mb-0 scale-95 pointer-events-none' : 'max-h-40 opacity-100 mb-8 scale-100'}`}
            >
              <div className="space-y-1.5 pt-2" ref={selectRef}>
                <label className={labelClass}>Emplazamiento</label>
                <div className="relative group">
                  <MapPin className={iconClass} size={18} />
                  
                  {/* Custom Styled Select Trigger */}
                  <div 
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className={`${inputClass} cursor-pointer flex items-center justify-between group select-none ${isSelectOpen ? 'ring-4 ring-blue-500/5 bg-white border-blue-500' : ''}`}
                  >
                    <span className={selectedEmplacement ? 'text-slate-700 font-bold' : 'text-slate-300'}>
                      {selectedEmplacement || "Seleccione Ubicación..."}
                    </span>
                    <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ${isSelectOpen ? 'rotate-180 text-blue-500' : ''}`} />
                  </div>

                  {/* Custom Styled Select List */}
                  {isSelectOpen && (
                    <div className="absolute top-[110%] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="max-h-60 overflow-y-auto">
                        <div 
                          onClick={() => { setSelectedEmplacement(''); setIsSelectOpen(false); }}
                          className="px-6 py-4 text-sm text-slate-300 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50"
                        >
                          Seleccione Ubicación...
                        </div>
                        {emplacements.map(emp => (
                          <div 
                            key={emp}
                            onClick={() => { setSelectedEmplacement(emp); setIsSelectOpen(false); }}
                            className={`px-6 py-4 text-sm font-bold flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${selectedEmplacement === emp ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                          >
                            <span>{emp}</span>
                            {selectedEmplacement === emp && <CheckCircle2 size={16} className="text-blue-600" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
               <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center animate-in slide-in-from-top-2">
                  <XCircle size={14} className="mr-3 flex-shrink-0" />
                  {error}
               </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-lg font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center group overflow-hidden relative"
            >
              <span className="relative z-10">Ingreso al sistema</span>
              <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
          </form>

          <footer className="mt-20 flex items-center justify-between border-t border-slate-100 pt-10">
             <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Network Active</span>
             </div>
             <span className="text-[9px] font-bold text-slate-200 uppercase tracking-[0.2em]">© 2024 ZERO Innovative Solutions</span>
          </footer>
        </div>
      </div>
    </div>
  );
};
