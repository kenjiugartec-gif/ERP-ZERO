
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Eye, EyeOff, Lock, User, KeyRound, ArrowRight } from 'lucide-react';

const inputClass = "w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm font-normal shadow-sm";

export const Login: React.FC = () => {
  const { login, users } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
      login(user);
    } else {
      setError('Credenciales de acceso incorrectas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden m-4 border border-slate-100 z-10">
        <div className="hidden md:flex flex-col justify-center p-16 bg-slate-900 text-white relative">
           <div className="relative z-10">
              <div className="mb-8 h-14 w-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                 <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">ZERO WMS <br/> Logistics</h1>
              <p className="text-slate-400 text-xl font-light">Ecosistema inteligente para la gestión de activos y control de inventarios críticos.</p>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-600"></div>
        </div>

        <div className="p-12 md:p-20 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Iniciar Sesión</h2>
            <p className="text-slate-500 mt-2">Ingrese sus credenciales operativas.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Usuario ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="admin_root"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Clave de Acceso</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
                 <button type="button" onClick={() => setShowForgot(true)} className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors">¿Olvidaste tu contraseña?</button>
            </div>

            {error && (
               <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center animate-shake">
                  {error}
               </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4.5 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center group"
            >
              <span className="uppercase tracking-[0.2em] text-xs">Acceder al Sistema</span>
              <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full border border-slate-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                <KeyRound size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Protocolo IT</h3>
              <p className="text-slate-500 text-sm mt-3">Para restablecer su acceso, contacte al Jefe de Turno o Administrador de Planta.</p>
            </div>
            <button onClick={() => setShowForgot(false)} className="w-full bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all text-xs uppercase tracking-widest">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};
