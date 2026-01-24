
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
import { X, Minus, Square, Minimize2, ChevronRight, Terminal } from 'lucide-react';
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
      ${currentConfig.disableBold ? '* { font-weight: 400 !important; }' : ''}
    `;
  }, [currentConfig]);

  return null;
};

// --- MOBILE ICON LAUNCHER REDESIGN ---
const MobileLaunchpad: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
    return (
        <div className="lg:hidden h-full overflow-y-auto p-6 bg-[#F8FAFC] pb-24 animate-in fade-in duration-500">
            <div className="mb-10 mt-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">ZERO <span className="text-[#00AEEF]">OS</span></h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Mobile Interface v2.5</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                    <Terminal size={18} />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
                {MODULES.map((mod) => (
                    <button 
                        key={mod.id}
                        onClick={() => onSelect(mod.id)}
                        className="relative bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm active:scale-95 active:shadow-inner active:bg-slate-50 transition-all group overflow-hidden"
                    >
                        {/* EFECTO REJILLA INDUSTRIAL */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                        
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-300 group-hover:rotate-6 shadow-sm border border-slate-100 group-active:scale-90 group-active:bg-slate-900">
                            <mod.icon size={28} strokeWidth={1.5} />
                        </div>
                        
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.1em] leading-tight mb-2 group-hover:text-[#00AEEF] transition-colors">
                            {mod.label}
                        </span>
                        
                        <div className="h-1 w-8 bg-slate-100 group-hover:w-12 group-hover:bg-[#00AEEF] transition-all rounded-full"></div>
                    </button>
                ))}
            </div>

            <div className="mt-16 p-8 border-t border-slate-200 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] opacity-40 italic">Terminal Operativo Seguro</p>
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
                ${windowState === 'WINDOWED' ? 'absolute inset-4 md:inset-8 rounded-[2rem] border z-20 shadow-[0_30px_60px_rgba(0,0,0,0.15)]' : ''}
                ${windowState === 'MINIMIZED' ? 'absolute bottom-0 right-4 w-72 h-auto rounded-t-2xl border border-b-0 z-30 shadow-lg' : ''}
           `}>
               {/* Window Title Bar - Industrial Glass Style */}
               <div 
                 className={`
                    flex items-center justify-between px-6 py-3.5 bg-slate-900 border-b border-white/5 select-none
                    ${windowState === 'MINIMIZED' ? 'cursor-pointer hover:bg-slate-800' : ''}
                 `}
                 onClick={windowState === 'MINIMIZED' ? () => setWindowState('WINDOWED') : undefined}
               >
                   <div className="flex items-center space-x-3">
                       {currentModuleData && (
                           <div className="text-[#00AEEF] animate-pulse">
                               <currentModuleData.icon size={16} strokeWidth={2.5} />
                           </div>
                       )}
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                           {currentModuleData?.label || 'Terminal'}
                       </span>
                   </div>

                   <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                       <button onClick={() => setWindowState('MINIMIZED')} className="p-1.5 text-slate-500 hover:text-white transition-colors"><Minus size={14} /></button>
                       {windowState !== 'MINIMIZED' && (
                           <button onClick={() => setWindowState(windowState === 'MAXIMIZED' ? 'WINDOWED' : 'MAXIMIZED')} className="p-1.5 text-slate-500 hover:text-white transition-colors">
                               {windowState === 'MAXIMIZED' ? <Minimize2 size={14} /> : <Square size={12} />}
                           </button>
                       )}
                       <button onClick={handleCloseWindow} className="p-1.5 text-slate-500 hover:text-red-500 transition-colors"><X size={16} /></button>
                   </div>
               </div>
               
               {/* Module Content */}
               <div className={`flex-1 relative overflow-hidden bg-slate-50/30 ${windowState === 'MINIMIZED' ? 'hidden' : 'block'}`}>
                   {getModuleComponent(activeModule)}
               </div>
           </div>
        ) : (
           <div className="absolute inset-0 flex flex-col overflow-hidden">
             {/* Desktop Content */}
             <div className="hidden lg:flex absolute inset-0 flex-col items-center justify-center overflow-hidden">
                {currentConfig.bgImage && (
                    <div className="absolute inset-0 pointer-events-none select-none z-0">
                        <img 
                        src={currentConfig.bgImage} 
                        alt="Workspace Background" 
                        style={{ 
                            opacity: currentConfig.bgOpacity / 100, 
                            filter: `blur(${currentConfig.bgBlur}px)`,
                            objectFit: currentConfig.bgFit
                        }}
                        className="w-full h-full grayscale-[0.2]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/30"></div>
                    </div>
                )}
             </div>

             {/* Mobile Content: Launchpad */}
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
