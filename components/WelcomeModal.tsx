
import React, { useEffect, useState } from 'react';
import { useApp } from '../store/AppContext';

export const WelcomeModal: React.FC = () => {
  const { user, welcomeMessageShown, setWelcomeMessageShown } = useApp();
  const [greeting, setGreeting] = useState('');
  const [visible, setVisible] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (user && !welcomeMessageShown) {
      const hours = new Date().getHours();
      let text = '';
      if (hours >= 5 && hours < 12) {
        text = 'Buenos días';
      } else if (hours >= 12 && hours < 20) {
        text = 'Buenas tardes';
      } else {
        text = 'Buenas noches';
      }
      setGreeting(text);

      // Entrada suave del contenido
      const showTimer = setTimeout(() => setContentVisible(true), 200);

      // Salida de la pantalla completa
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setWelcomeMessageShown(true), 800); 
      }, 3500);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [user, welcomeMessageShown, setWelcomeMessageShown]);

  if (!user || welcomeMessageShown) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div 
        className={`relative z-10 text-center px-6 transition-all duration-1000 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="space-y-4">
          <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.3em] mb-4">
            Acceso Autorizado
          </p>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-tight">
            <span className="force-bold">{greeting}</span>, <br className="md:hidden" /> 
            Bienvenido {user.name} <span className="inline-block animate-bounce-subtle">😉</span>
          </h1>
          
          <div className="pt-12 flex flex-col items-center">
             <div className="h-[1px] w-12 bg-slate-800 mb-6"></div>
             <p className="text-slate-500 text-sm font-light tracking-widest animate-pulse">
               INICIANDO SISTEMA OPERATIVO
             </p>
          </div>
        </div>
      </div>

      {/* Industrial Detail Layer */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-slate-900 pt-6 opacity-20 hidden md:flex">
          <div className="text-[10px] text-slate-500 font-mono space-y-1">
              <p>USER_ID: {user.id}</p>
              <p>NODE_AUTH: SUCCESS</p>
          </div>
          <div className="text-[10px] text-slate-500 font-mono text-right">
              <p>EST: {new Date().toLocaleDateString()}</p>
              <p>SECURE_LOGIN_V2</p>
          </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-5px) rotate(5deg); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};
