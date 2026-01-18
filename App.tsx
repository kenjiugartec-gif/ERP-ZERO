
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
import { X, LayoutTemplate } from 'lucide-react';

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
    
    styleTag.innerHTML = `
      :root {
        --base-font-family: ${currentConfig.fontFamily};
        --base-font-size: ${currentConfig.fontSize}px;
        --base-line-height: ${currentConfig.lineHeight};
      }
      body {
        font-family: var(--base-font-family);
        font-size: var(--base-font-size);
        line-height: var(--base-line-height);
        ${currentConfig.disableBold ? 'font-weight: 400 !important;' : ''}
      }
      ${currentConfig.disableBold ? '* { font-weight: 400 !important; }' : ''}
    `;
  }, [currentConfig]);

  return null;
};

const AppContent: React.FC = () => {
  const { user, appName } = useApp();
  const [activeModule, setActiveModule] = useState('dashboard');

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
        
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none select-none">
           <div className="w-32 h-32 bg-slate-200 rounded-2xl flex items-center justify-center mb-6">
              <LayoutTemplate size={64} className="text-slate-400" />
           </div>
           <h1 className="text-4xl font-bold text-slate-300 tracking-tight mb-2 uppercase">{appName}</h1>
           <p className="text-slate-400">Seleccione un módulo del menú para comenzar</p>
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
