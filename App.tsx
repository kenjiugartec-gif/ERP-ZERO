
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Login } from './views/Login';
import { Layout } from './components/Layout';
import { WelcomeModal } from './components/WelcomeModal';
import { Dashboard } from './views/Dashboard';
import { GateControl, IOControl } from './views/GateAndIOControl';
import { FleetView, ReceptionView, DispatchView } from './views/Modules';
import { HistoryView, SalesControlView } from './views/HistoryAndSales';
import { StockControl } from './views/StockControl';
import { GeographyView } from './views/GeographyView';
import { UserManagementView } from './views/UserManagementView';
import { SettingsView } from './views/SettingsView';
import { BarotiView } from './views/BarotiView';
import { DocumentControlView } from './views/DocumentControlView';
import { GateInView } from './views/GateInView';
import { BehaviorView } from './views/BehaviorView'; 
import { MobileControlView } from './views/MobileControlView';
import { MobileHistoryView } from './views/MobileHistoryView';
import { X, Minus, Square, Minimize2, Terminal, Sparkles, Box } from 'lucide-react';
import { MODULES } from './constants';

const DynamicStyles: React.FC = () => {
  const { currentConfig } = useApp();
  
  useEffect(() => {
    const styleId = 'dynamic-typography-styles';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    
    styleTag.innerHTML = `
      html {
        font-size: ${currentConfig.fontSize}px !important;
      }
      body, button, input, select, textarea, h1, h2, h3, h4, h5, h6, span, p, div, aside, nav {
        font-family: ${currentConfig.fontFamily} !important;
        line-height: ${currentConfig.lineHeight} !important;
        ${currentConfig.disableBold ? 'font-weight: 400 !important;' : ''}
      }
      
      /* 3D Utility Classes */
      .perspective-1000 { perspective: 1000px; }
      .preserve-3d { transform-style: preserve-3d; }
      
      .btn-3d {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 
          0 10px 20px -10px rgba(0,0,0,0.2),
          inset 0 1px 1px rgba(255,255,255,0.8),
          0 1px 3px rgba(0,0,0,0.05);
      }
      .btn-3d:hover {
        transform: translateY(-8px) rotateX(10deg);
        box-shadow: 
          0 20px 40px -15px rgba(0,0,0,0.3),
          inset 0 1px 2px rgba(255,255,255,0.9);
      }
      .btn-3d:active {
        transform: translateY(2px) scale(0.96);
        box-shadow: 
          inset 0 4px 8px rgba(0,0,0,0.1),
          0 2px 4px rgba(0,0,0,0.05);
      }

      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-10px) rotate(2deg); }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      
      @keyframes icon-3d-pop {
        0% { transform: scale(0.8) translateZ(-50px); opacity: 0; }
        100% { transform: scale(1) translateZ(0); opacity: 1; }
      }
    `;
  }, [currentConfig]);

  return null;
};

const MobileLaunchpad: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
    return (
        <div className="lg:hidden h-full w-full overflow-y-auto p-6 bg-slate-100 pb-32 font-normal perspective-1000">
            <div className="mb-12 mt-8 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="text-4xl text-slate-900 font-black tracking-tighter uppercase leading-none italic">ZERO</h2>
                    </div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.5em] ml-4">Terminal 3D v2.5</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-3xl text-blue-600 shadow-[0_10px_20px_rgba(0,0,0,0.05)] animate-float">
                    <Terminal size={24} strokeWidth={2.5} />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5 preserve-3d">
                {MODULES.map((mod, idx) => (
                    <button 
                        key={mod.id}
                        onClick={() => onSelect(mod.id)}
                        style={{ 
                            animationDelay: `${idx * 60}ms`,
                            animation: 'icon-3d-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both'
                        }}
                        className="btn-3d group relative bg-white border border-slate-200/50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center overflow-hidden"
                    >
                        {/* Decorative 3D elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative mb-4">
                            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white shadow-inner border border-slate-100 group-hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] group-hover:scale-110 group-active:scale-90">
                                <mod.icon size={32} strokeWidth={1.5} />
                            </div>
                            {/* Reflection effect */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200/40 blur-md rounded-full group-hover:bg-blue-600/20 group-hover:w-16 transition-all"></div>
                        </div>
                        
                        <span className="text-[11px] text-slate-800 font-black uppercase tracking-[0.15em] leading-tight mb-1 group-hover:text-blue-700 transition-colors">
                            {mod.label}
                        </span>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                            <span className="text-[7px] text-blue-400 font-bold uppercase tracking-widest">Acesso</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-20 p-10 text-center flex flex-col items-center space-y-4 opacity-30 grayscale group">
                <div className="p-3 bg-white rounded-full shadow-lg border border-slate-200 group-hover:scale-110 transition-transform">
                   <Sparkles size={20} className="text-blue-500" />
                </div>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.8em]">Secure Industrial Node</p>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
  const { user, currentConfig } = useApp();
  const [activeModule, setActiveModule] = useState(''); 
  const [windowState, setWindowState] = useState<'MAXIMIZED' | 'WINDOWED' | 'MINIMIZED'>('MAXIMIZED');

  useEffect(() => {
    if (activeModule) {
        setWindowState('MAXIMIZED');
    }
  }, [activeModule]);

  if (!user) {
    return <Login />;
  }

  const getModuleComponent = (moduleName: string) => {
    switch (moduleName) {
      case 'dashboard': return <Dashboard />;
      case 'behavior': return <BehaviorView />; 
      case 'gate_in': return <GateInView />;
      case 'mobile_control': return <MobileControlView />; 
      case 'documents': return <DocumentControlView />;
      case 'baroti': return <BarotiView />;
      case 'stock': return <StockControl />;
      case 'gate': return <GateControl />;
      case 'io': return <IOControl />;
      case 'fleet': return <FleetView />;
      case 'reception': return <ReceptionView />;
      case 'dispatch': return <DispatchView />;
      case 'mobile_history': return <MobileHistoryView />; 
      case 'history': return <HistoryView />;
      case 'sales': return <SalesControlView />;
      case 'communes': return <GeographyView />;
      case 'users': return <UserManagementView />;
      case 'settings': return <SettingsView />;
      default: return null;
    }
  };

  const handleCloseWindow = () => {
      setActiveModule('');
  };

  const currentModuleData = MODULES.find(m => m.id === activeModule);

  return (
    <>
      <DynamicStyles />
      <WelcomeModal />
      <Layout activeModule={activeModule} setActiveModule={setActiveModule}>
        {activeModule ? (
           <div className={`
                flex flex-col bg-white border-slate-200 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out
                ${windowState === 'MAXIMIZED' ? 'w-full h-full rounded-none border-0' : ''}
                ${windowState === 'WINDOWED' ? 'absolute inset-4 md:inset-8 rounded-[2rem] border z-20 shadow-[0_30px_60px_rgba(0,0,0,0.12)]' : ''}
                ${windowState === 'MINIMIZED' ? 'absolute bottom-0 right-4 w-72 h-auto rounded-t-2xl border border-b-0 z-30 shadow-2xl' : ''}
           `}>
               <div 
                 className={`
                    flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 select-none
                    ${windowState === 'MINIMIZED' ? 'cursor-pointer hover:bg-slate-100' : ''}
                 `}
                 onClick={windowState === 'MINIMIZED' ? () => setWindowState('WINDOWED') : undefined}
               >
                   <div className="flex items-center space-x-3">
                       {currentModuleData && (
                           <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
                               <currentModuleData.icon size={16} />
                           </div>
                       )}
                       <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">
                           {currentModuleData?.label || 'SISTEMA'}
                       </span>
                   </div>

                   <div className="flex items-center space-x-1.5" onClick={e => e.stopPropagation()}>
                       <button onClick={() => setWindowState('MINIMIZED')} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all"><Minus size={14} strokeWidth={3} /></button>
                       {windowState !== 'MINIMIZED' && (
                           <button onClick={() => setWindowState(windowState === 'MAXIMIZED' ? 'WINDOWED' : 'MAXIMIZED')} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all">{windowState === 'MAXIMIZED' ? <Minimize2 size={14} /> : <Square size={12} />}</button>
                       )}
                       <button onClick={handleCloseWindow} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X size={18} strokeWidth={2.5} /></button>
                   </div>
               </div>
               <div className={`flex-1 relative overflow-hidden bg-slate-50/20 ${windowState === 'MINIMIZED' ? 'hidden' : 'block'}`}>
                   {getModuleComponent(activeModule)}
               </div>
           </div>
        ) : (
           <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
             {currentConfig.bgImage && (
               <div className="absolute inset-0 pointer-events-none select-none z-0">
                 <img src={currentConfig.bgImage} alt="Workspace Background" style={{ opacity: currentConfig.bgOpacity / 100, filter: `blur(${currentConfig.bgBlur}px)`, objectFit: currentConfig.bgFit }} className="w-full h-full grayscale-[0.1]" />
                 <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-transparent to-slate-200/50 backdrop-blur-[2px]"></div>
               </div>
             )}
             <MobileLaunchpad onSelect={setActiveModule} />
           </div>
        )}
      </Layout>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
