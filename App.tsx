
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
import { MobileControlView } from './views/MobileControlView'; // New
import { MobileHistoryView } from './views/MobileHistoryView'; // New
import { X } from 'lucide-react';

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
  const [activeModule, setActiveModule] = useState(''); // Default to empty (background view)

  if (!user) {
    return <Login />;
  }

  const getModuleComponent = (moduleName: string) => {
    switch (moduleName) {
      case 'dashboard': return <Dashboard />;
      case 'behavior': return <BehaviorView />; 
      case 'gate_in': return <GateInView />;
      case 'mobile_control': return <MobileControlView />; // New
      case 'documents': return <DocumentControlView />;
      case 'baroti': return <BarotiView />;
      case 'stock': return <StockControl />;
      case 'gate': return <GateControl />;
      case 'io': return <IOControl />;
      case 'fleet': return <FleetView />;
      case 'reception': return <ReceptionView />;
      case 'dispatch': return <DispatchView />;
      case 'mobile_history': return <MobileHistoryView />; // New
      case 'history': return <HistoryView />;
      case 'sales': return <SalesControlView />;
      case 'communes': return <GeographyView />;
      case 'users': return <UserManagementView />;
      case 'settings': return <SettingsView />;
      default: return null;
    }
  };

  return (
    <>
      <DynamicStyles />
      <WelcomeModal />
      <Layout activeModule={activeModule} setActiveModule={setActiveModule}>
        
        {/* Render module or background based on activeModule */}
        {activeModule ? (
           <div className="w-full h-full bg-slate-50/50 relative animate-in fade-in duration-300">
               {/* Global Close Button for Windows */}
               <button 
                 onClick={() => setActiveModule('')}
                 className="absolute top-4 right-6 z-50 p-2 bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500 rounded-full shadow-sm border border-slate-200 transition-all hover:scale-110 hover:shadow-md"
                 title="Cerrar Ventana"
               >
                 <X size={20} />
               </button>
               
               {getModuleComponent(activeModule)}
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
