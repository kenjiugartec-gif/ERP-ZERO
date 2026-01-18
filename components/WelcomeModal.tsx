import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Layers, ShieldCheck, Box, Hexagon } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { user, welcomeMessageShown, setWelcomeMessageShown } = useApp();
  const [greeting, setGreeting] = useState('');
  const [visible, setVisible] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // 3D Tilt Logic State
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && !welcomeMessageShown) {
      const hours = new Date().getHours();
      let text = '';
      if (hours < 12) {
        text = 'Buenos días';
      } else if (hours < 19) {
        text = 'Buenas tardes';
      } else {
        text = 'Buenas noches';
      }
      setGreeting(`${text}, ${user.name}`);

      // Loading steps animation
      const step1 = setTimeout(() => setLoadingStep(1), 1000);
      const step2 = setTimeout(() => setLoadingStep(2), 2500);

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setWelcomeMessageShown(true), 700); 
      }, 4500);

      return () => {
        clearTimeout(timer);
        clearTimeout(step1);
        clearTimeout(step2);
      };
    }
  }, [user, welcomeMessageShown, setWelcomeMessageShown]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (divide by factor to dampen effect)
    const rotateX = ((y - centerY) / 25) * -1; // Invert Y for correct tilt
    const rotateY = (x - centerX) / 25;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 }); // Reset to flat
  };

  if (!user || welcomeMessageShown) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Interactive Card */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${visible ? 1 : 0.9})`,
            transition: 'transform 0.1s ease-out, opacity 0.5s ease'
        }}
        className={`
          relative bg-white w-full max-w-3xl rounded-3xl 
          shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] 
          border border-slate-200 overflow-hidden
          flex flex-col items-center justify-center p-12 md:p-16 text-center
          ${visible ? 'opacity-100' : 'opacity-0 translate-y-10'}
        `}
      >
        {/* Industrial Grid Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        {/* Subtle Gradient Glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* 3D Icon Layer */}
        <div className="relative mb-10 z-10 transform translate-z-10 transition-transform duration-500"
             style={{ transform: `translateZ(40px)` }}>
            <div className="relative w-24 h-24 flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl shadow-xl transform rotate-6 border border-slate-600"></div>
                 <div className="absolute inset-0 bg-white rounded-2xl shadow-inner border border-slate-100 transform -rotate-3 flex items-center justify-center">
                     <Hexagon size={48} className="text-slate-900" strokeWidth={1.5} />
                 </div>
                 <div className="absolute -right-4 -bottom-2 bg-blue-600 text-white p-2 rounded-lg shadow-lg border border-white">
                     <Layers size={20} />
                 </div>
            </div>
        </div>

        {/* Main Typography */}
        <div className="relative z-10 space-y-6" style={{ transform: `translateZ(20px)` }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900">
              {greeting}
            </h1>
            
            <div className="flex flex-col items-center space-y-2">
                <div className="h-1 w-16 bg-blue-600 rounded-full"></div>
                <p className="text-2xl md:text-3xl text-slate-600 font-light tracking-wide pt-2">
                  Nos alegra volverte a ver.
                </p>
            </div>
        </div>

        {/* Industrial Loading Bar */}
        <div className="relative z-10 mt-16 w-full max-w-md" style={{ transform: `translateZ(10px)` }}>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                <span className={loadingStep >= 0 ? 'text-blue-600 transition-colors' : ''}>1. Conectando</span>
                <span className={loadingStep >= 1 ? 'text-blue-600 transition-colors' : ''}>2. Verificando</span>
                <span className={loadingStep >= 2 ? 'text-blue-600 transition-colors' : ''}>3. Iniciando</span>
            </div>
            
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner relative">
                 {/* Progress Fill */}
                <div className="absolute inset-y-0 left-0 bg-slate-900 transition-all duration-1000 ease-out"
                     style={{ width: loadingStep === 0 ? '30%' : loadingStep === 1 ? '70%' : '100%' }}>
                     <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>
            
            <p className="mt-3 text-xs text-slate-400 font-mono">
                {loadingStep === 0 && "Estableciendo conexión segura..."}
                {loadingStep === 1 && "Sincronizando inventario en tiempo real..."}
                {loadingStep === 2 && "Entorno listo. Bienvenido."}
            </p>
        </div>

      </div>
    </div>
  );
};