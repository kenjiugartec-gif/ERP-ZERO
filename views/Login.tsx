
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Eye, EyeOff, Lock, User, Building2, ChevronRight, XCircle, ChevronDown, CheckCircle2, Maximize2, X, Image as ImageIcon } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, users, emplacements, configs, currentConfig } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedEmplacement, setSelectedEmplacement] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
  // State for Image Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  // Usamos currentConfig para el fondo si el usuario ya ha configurado uno en el sistema.
  const activeConfig = useMemo(() => {
    const local = configs[selectedEmplacement];
    return {
      slogan: local?.slogan || currentConfig.slogan || "Innovative Solutions, Comprehensive Logistics Solutions.",
      loginImage: local?.loginImage || currentConfig.loginImage || currentConfig.bgImage || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
    };
  }, [selectedEmplacement, configs, currentConfig]);

  useEffect(() => {
    if (username === 'Admin') {
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
      setError('Credenciales de acceso no válidas');
      return;
    }

    if (foundUser.role !== 'ADMIN' && !selectedEmplacement) {
      setError('Debe seleccionar un nodo operativo.');
      return;
    }

    login({ ...foundUser, location: selectedEmplacement || foundUser.location });
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden relative">
      
      {/* LEFT PANEL (VISUAL) */}
      <div className="relative w-1/2 hidden lg:flex flex-col justify-center items-center overflow-hidden bg-slate-900">
        
        {/* Expand Button */}
        <button 
            onClick={() => setIsPreviewOpen(true)}
            className="absolute top-8 left-8 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all group border border-white/5 shadow-xl"
            title="Ver Imagen Completa"
        >
            <Maximize2 size={20} className="group-hover:scale-110 transition-transform opacity-70 group-hover:opacity-100" />
        </button>

        <div className="absolute inset-0 z-0">
            {activeConfig.loginImage ? (
                <img 
                    src={activeConfig.loginImage} 
                    className="w-full h-full object-cover filter grayscale-[0.4] brightness-[0.3] transition-all duration-700 hover:scale-105"
                    alt="Background"
                />
            ) : (
                <div className="absolute inset-0 bg-slate-900"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-12 scale-110">
            <div className="relative w-64 h-64 border border-slate-700/50 rounded-full flex items-center justify-center bg-slate-800/30 backdrop-blur-sm shadow-2xl">
                <div className="absolute inset-2 border border-slate-600/30 rounded-full border-dashed animate-spin-slow"></div>
                <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                <div className="absolute -left-1 bottom-1/3 w-2 h-2 bg-slate-50 rounded-full"></div>

                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-6xl text-white font-normal tracking-tighter" style={{ fontFamily: 'Montserrat, sans-serif' }}>ZERO</h1>
                    <div className="h-px w-24 bg-blue-600 my-4 opacity-50"></div>
                    <p className="text-[10px] text-slate-300 font-normal uppercase tracking-[0.4em]">INNOVATIVE SOLUTIONS</p>
                </div>
            </div>
            
            <div className="mt-12 text-center max-w-md">
                <p className="text-slate-200 text-lg leading-relaxed font-light uppercase tracking-widest italic opacity-80">
                    {activeConfig.slogan}
                </p>
            </div>
        </div>

        <div className="absolute bottom-8 text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em] z-10 opacity-40">
            Sistema V2.5.0 • Nodo Maestro: COMANDO CENTRAL
        </div>
      </div>

      {/* RIGHT PANEL (FORM) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-[420px] space-y-12 animate-in fade-in duration-500">
          <header className="space-y-3">
            <h2 className="text-4xl font-normal text-slate-900 uppercase tracking-tight leading-none">Iniciar Sesión</h2>
            <p className="text-slate-400 text-[11px] font-normal uppercase tracking-[0.3em] opacity-60 border-l-2 border-blue-500 pl-4">Terminal de Acceso Seguro</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><User size={20} strokeWidth={1} /></div>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-normal text-slate-700 placeholder:text-slate-300 outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm" placeholder="ID de Usuario (Admin)" required />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Lock size={20} strokeWidth={1} /></div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-normal text-slate-700 placeholder:text-slate-300 outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm" placeholder="Contraseña Maestra" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors">{showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}</button>
                </div>
            </div>

            <div ref={selectRef} className={`transition-all duration-500 ${isAdminMode ? 'max-h-0 opacity-0 overflow-hidden scale-95' : 'max-h-48 opacity-100 scale-100'}`}>
                <label className="block text-[10px] font-normal text-slate-400 uppercase tracking-widest mb-3 ml-1">Seleccionar Nodo Operativo <span className="text-blue-400">*</span></label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Building2 size={20} strokeWidth={1} /></div>
                  <div onClick={() => !isAdminMode && setIsSelectOpen(!isSelectOpen)} className={`w-full pl-12 pr-10 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-normal cursor-pointer flex items-center justify-between outline-none transition-all shadow-sm ${isSelectOpen ? 'border-blue-400 bg-white ring-4 ring-blue-500/5' : ''}`}>
                    <span className={selectedEmplacement ? 'text-slate-700 uppercase tracking-wider' : 'text-slate-300'}>{selectedEmplacement || "Elegir Emplazamiento"}</span>
                    <ChevronDown size={16} className={`absolute right-4 text-slate-300 transition-transform duration-300 ${isSelectOpen ? 'rotate-180 text-blue-500' : ''}`} />
                  </div>
                  {isSelectOpen && (
                    <div className="absolute top-[105%] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="max-h-48 overflow-y-auto">
                        {emplacements.map(emp => (
                          <div key={emp} onClick={() => { setSelectedEmplacement(emp); setIsSelectOpen(false); }} className={`px-5 py-4 text-xs font-normal uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center ${selectedEmplacement === emp ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}>
                            {emp} {selectedEmplacement === emp && <CheckCircle2 size={14} strokeWidth={1.5} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-normal uppercase tracking-[0.1em] flex items-center animate-in slide-in-from-top-2"><XCircle size={16} className="mr-3 flex-shrink-0" /> {error}</div>}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl text-[11px] font-normal uppercase tracking-[0.4em] transition-all active:scale-[0.98] flex items-center justify-center mt-8 shadow-2xl shadow-blue-500/20">
                Ingresar al Sistema 
                <ChevronRight size={18} className="ml-3" strokeWidth={1} />
            </button>
          </form>

          <footer className="pt-12 text-center border-t border-slate-50">
              <p className="text-[9px] text-slate-300 font-normal uppercase tracking-[0.4em] italic">Protocolo de Seguridad V2.5.0 • Nodo Certificado</p>
          </footer>
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {isPreviewOpen && activeConfig.loginImage && (
          <div 
            className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300"
            onClick={() => setIsPreviewOpen(false)}
          >
              {/* Toolbar */}
              <div className="h-20 flex items-center justify-between px-6 md:px-10 flex-shrink-0 border-b border-white/5 bg-slate-900/50">
                  <div className="flex items-center space-x-3">
                      <div className="bg-white/10 p-2 rounded-lg text-white">
                          <ImageIcon size={20} />
                      </div>
                      <div>
                          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Visualización de Activo</h3>
                          <p className="text-slate-400 text-[10px] uppercase tracking-widest">Fondo de Pantalla (Raw Data)</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  >
                      <X size={24} />
                  </button>
              </div>

              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
                  <img 
                    src={activeConfig.loginImage} 
                    alt="Full Preview" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()} 
                  />
              </div>

              {/* Footer */}
              <div className="h-16 flex items-center justify-center flex-shrink-0">
                  <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-mono">Presione ESC o haga clic fuera para cerrar</p>
              </div>
          </div>
      )}

    </div>
  );
};
