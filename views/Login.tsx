import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Eye, EyeOff, Lock, User, KeyRound, ArrowRight } from 'lucide-react';

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
      {/* Abstract Corporate Background Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-purple-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden m-4 border border-slate-100 z-10">
        
        {/* Left Side: Brand/Visual */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-corporate-blue/20 to-corporate-purple/20 pointer-events-none"></div>
           <div className="relative z-10">
              <div className="mb-6 h-12 w-12 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                 <div className="w-6 h-6 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full"></div>
              </div>
              <h1 className="text-4xl font-bold mb-4 tracking-tight">Plataforma Integral de Gestión</h1>
              <p className="text-slate-400 text-lg leading-relaxed">Control de stock, logística y operaciones en tiempo real con estándares industriales.</p>
           </div>
           
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400"></div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Bienvenido</h2>
            <p className="text-slate-500">Ingrese sus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Usuario</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm font-medium"
                  placeholder="ID de usuario"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Contraseña</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm font-medium"
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
                 <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
            </div>

            {error && (
               <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium flex items-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  {error}
               </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-lg font-semibold shadow-lg shadow-slate-200 transition-all duration-200 flex items-center justify-center group"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in duration-200 border border-slate-100">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <KeyRound size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recuperación de Cuenta</h3>
              <p className="text-slate-500 text-sm mt-2">Por protocolos de seguridad, contacte al administrador de IT para restablecer su acceso.</p>
            </div>
            <button
              onClick={() => setShowForgot(false)}
              className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};