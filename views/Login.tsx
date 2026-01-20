
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Eye, EyeOff, Lock, User, Building2, ChevronRight, XCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

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
    // Fallback config if no specific config for emplacement exists
    return configs[selectedEmplacement] || {
      slogan: "Innovative Solutions, Comprehensive Logistics Solutions.",
      logo: undefined,
      loginImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
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
      setError('Credenciales incorrectas');
      return;
    }

    if (foundUser.role !== 'ADMIN' && !selectedEmplacement) {
      setError('Debe seleccionar una sucursal.');
      return;
    }

    login({ ...foundUser, location: selectedEmplacement || foundUser.location });
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* SECCIÓN IZQUIERDA - IMAGEN Y BRANDING (LOGO PERMANENTE) */}
      <div className="relative w-1/2 hidden lg:flex flex-col justify-center items-center overflow-hidden bg-slate-900 relative">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-slate-900">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        {/* LOGO ZERO HARDCODED */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 scale-125">
            <div className="relative w-64 h-64 border-[6px] border-slate-700/50 rounded-full flex items-center justify-center bg-slate-800/30 backdrop-blur-sm shadow-2xl">
                {/* Inner Ring */}
                <div className="absolute inset-2 border-2 border-slate-600/30 rounded-full border-dashed animate-spin-slow"></div>
                
                {/* Tech Accents */}
                <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                <div className="absolute -left-1 bottom-1/3 w-2 h-2 bg-slate-500 rounded-full"></div>

                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-7xl font-black text-white tracking-tighter italic" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        ZERO
                    </h1>
                    <div className="h-1 w-24 bg-blue-600 my-2 rounded-full"></div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                        INNOVATIVE SOLUTIONS
                    </p>
                </div>
            </div>
            
            <div className="mt-12 text-center max-w-md">
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                    {activeConfig.slogan}
                </p>
            </div>
        </div>

        {/* Footer Brand */}
        <div className="absolute bottom-8 text-slate-600 text-xs font-mono uppercase tracking-widest">
            System V2.5.0 • Authorized Access Only
        </div>
      </div>

      {/* SECCIÓN DERECHA - FORMULARIO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-[420px] space-y-8">
          
          <header>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-slate-500 text-sm">
              Ingrese sus credenciales para continuar
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Usuario */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                 <User size={20} strokeWidth={1.5} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Nombre de usuario"
                required
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                     <Lock size={20} strokeWidth={1.5} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <div className="flex justify-end">
                    <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        ¿Olvidó su contraseña?
                    </button>
                </div>
            </div>

            {/* Selector de Sucursal */}
            <div 
              ref={selectRef}
              className={`transition-all duration-500 ease-in-out ${
                isAdminMode 
                  ? 'max-h-0 opacity-0 overflow-hidden' 
                  : 'max-h-32 opacity-100'
              }`}
            >
                <label className="block text-sm font-bold text-slate-800 mb-2">
                    Seleccionar Sucursal <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                     <Building2 size={20} strokeWidth={1.5} />
                  </div>
                  <div 
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className={`w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-lg text-sm cursor-pointer flex items-center justify-between outline-none ${isSelectOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                  >
                    <span className={selectedEmplacement ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {selectedEmplacement || "Seleccionar Sucursal"}
                    </span>
                    <ChevronDown size={16} className={`absolute right-4 text-slate-400 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isSelectOpen && (
                    <div className="absolute top-[105%] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                      <div className="max-h-48 overflow-y-auto">
                        {emplacements.map(emp => (
                          <div 
                            key={emp}
                            onClick={() => { setSelectedEmplacement(emp); setIsSelectOpen(false); }}
                            className={`px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center ${selectedEmplacement === emp ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600'}`}
                          >
                            {emp}
                            {selectedEmplacement === emp && <CheckCircle2 size={14} />}
                          </div>
                        ))}
                         {emplacements.length === 0 && (
                             <div className="px-4 py-3 text-xs text-slate-400 italic">No hay sucursales disponibles</div>
                         )}
                      </div>
                    </div>
                  )}
                </div>
            </div>

            {error && (
               <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium flex items-center animate-in slide-in-from-top-2">
                  <XCircle size={16} className="mr-2 flex-shrink-0" />
                  {error}
               </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center mt-4"
            >
              Ingresar al Sistema 
              <ChevronRight size={18} className="ml-2" strokeWidth={2.5} />
            </button>

          </form>

          <footer className="pt-8 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">© 2026 ZERO. Todos los derechos reservados.</p>
              <p className="text-xs text-slate-400">Versión 2.5.0 Enterprise</p>
          </footer>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
};
