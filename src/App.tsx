
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
import { X, Minus, Square, Minimize2 } from 'lucide-react';
import { MODULES } from './constants';

const DynamicStyles: React.FC = () => {
  const { currentConfig } = useApp();
  
  useEffect(() => {
    // Inject dynamic CSS into head
    const styleId = 'dynamic-typography-styles';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    
    // Aplicamos font-size al html para que rem se escale proporcionalmente en todo el sitio
    // Aplicamos font-family a todos los elementos de texto interactivos, incluyendo ASIDE y NAV
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

const AppContent: React.FC = () => {
  const { user, currentConfig } = useApp();
  const [activeModule, setActiveModule] = useState(''); 
  const [windowState, setWindowState] = useState<'MAXIMIZED' | 'WINDOWED' | 'MINIMIZED'>('MAXIMIZED');

  // Reset window state when module changes
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
        
        {/* Render module or background based on activeModule */}
        {activeModule ? (
           <div className={`
                flex flex-col bg-white border-slate-200 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out
                ${windowState === 'MAXIMIZED' ? 'w-full h-full rounded-none border-0' : ''}
                ${windowState === 'WINDOWED' ? 'absolute inset-4 md:inset-8 rounded-xl border z-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)]' : ''}
                ${windowState === 'MINIMIZED' ? 'absolute bottom-0 right-4 w-72 h-auto rounded-t-xl border border-b-0 z-30 shadow-lg' : ''}
           `}>
               {/* Window Title Bar */}
               <div 
                 className={`
                    flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 select-none
                    ${windowState === 'MINIMIZED' ? 'cursor-pointer hover:bg-slate-100' : ''}
                 `}
                 onClick={windowState === 'MINIMIZED' ? () => setWindowState('WINDOWED') : undefined}
               >
                   <div className="flex items-center space-x-2.5 opacity-80">
                       {currentModuleData && (
                           <div className="text-slate-500">
                               <currentModuleData.icon size={14} />
                           </div>
                       )}
                       <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                           {currentModuleData?.label || 'Sistema'}
                       </span>
                   </div>

                   <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                       <button 
                           onClick={() => setWindowState('MINIMIZED')}
                           className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                           title="Minimizar"
                       >
                           <Minus size={14} strokeWidth={3} />
                       </button>
                       
                       {windowState !== 'MINIMIZED' && (
                           <button 
                               onClick={() => setWindowState(windowState === 'MAXIMIZED' ? 'WINDOWED' : 'MAXIMIZED')}
                               className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                               title={windowState === 'MAXIMIZED' ? "Restaurar" : "Maximizar"}
                           >
                               {windowState === 'MAXIMIZED' ? <Minimize2 size={14} /> : <Square size={12} />}
                           </button>
                       )}

                       <button 
                           onClick={handleCloseWindow}
                           className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                           title="Cerrar"
                       >
                           <X size={16} strokeWidth={2.5} />
                       </button>
                   </div>
               </div>
               
               {/* Module Content */}
               <div className={`flex-1 relative overflow-hidden bg-slate-50/30 ${windowState === 'MINIMIZED' ? 'hidden' : 'block'}`}>
                   {getModuleComponent(activeModule)}
               </div>
           </div>
        ) : (
           <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
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
