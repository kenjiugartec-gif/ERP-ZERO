
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
      
      {/* SECCIÓN IMAGEN IZQUIERDA */}
      <div className="relative w-1/2 hidden lg:block overflow-hidden bg-slate-900">
        <img 
          src={activeConfig.loginImage} 
          alt="Login Cover" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-20 h-full text-white">
           <h1 className="text-5xl font-bold mb-4">{appName}</h1>
           <p className="text-xl text-slate-300 font-light">{activeConfig.slogan}</p>
        </div>
      </div>

      {/* SECCIÓN FORMULARIO DERECHA - REDISEÑADO SEGÚN IMAGEN */}
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
    </div>
  );
};
