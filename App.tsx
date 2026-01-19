
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
    // Aplicamos font-family a todos los elementos de texto interactivos
    styleTag.innerHTML = `
      html {
        font-size: ${currentConfig.fontSize}px !important;
      }
      body, button, input, select, textarea, h1, h2, h3, h4, h5, h6, span, p, div {
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

  if (!user) {
    return <Login />;
  }

  const getModuleComponent = (moduleName: string) => {
    switch (moduleName) {
      case 'dashboard': return <Dashboard />;
      case 'stock': return <StockControl />;
      case 'gate': return <GateControl />;
      case 'io': return <IOControl />;
      case 'fleet': return <FleetView />;
      case 'reception': return <ReceptionView />;
      case 'dispatch': return <DispatchView />;
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
        
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
           {/* Main Background Image - Controlada por Configuración */}
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

           {/* Se han eliminado los elementos de branding central para dejar el espacio limpio */}
        </div>

        {activeModule && (
           <div className="absolute inset-0 z-30 flex flex-col bg-slate-50/30 backdrop-blur-md animate-in zoom-in-[0.99] fade-in duration-200 overflow-hidden">
               <div className="flex-1 flex flex-col bg-slate-50 w-full h-full shadow-none border-none">
                   <div className="flex justify-end items-center px-6 py-3 bg-white border-b border-slate-200 flex-shrink-0">
                       <button 
                           onClick={() => setActiveModule('')}
                           className="group p-1.5 rounded-full bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all duration-200"
                           title="Cerrar"
                       >
                           <X size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                       </button>
                   </div>
                   <div className="flex-1 overflow-hidden relative bg-slate-50 p-6">
                      <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                         {getModuleComponent(activeModule)}
                      </div>
                   </div>
               </div>
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
