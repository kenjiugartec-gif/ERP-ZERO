
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Settings, Type, Image as ImageIcon, Layout, 
  Palette, Save, RefreshCw, Upload, AlignLeft, 
  Maximize, Minus, Plus, Info, CheckCircle, Globe,
  Eye, ToggleLeft, ToggleRight, Laptop
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, updateConfig, configs, appName, setAppName } = useApp();
  const currentEmplacement = user?.location || 'Central';
  const config = configs[currentEmplacement] || {
    slogan: "Sistema de Gestión Industrial Grade",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    lineHeight: 1.5,
    primaryColor: "#2563eb",
    logo: undefined,
    disableBold: false
  };

  const [localConfig, setLocalConfig] = useState(config);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    updateConfig(currentEmplacement, localConfig);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLocalConfig({ ...localConfig, logo: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-10 bg-slate-50/50">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Unificado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-xl flex-shrink-0">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Ajustes del Sistema</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Personalización visual para {currentEmplacement}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center shadow-2xl shadow-blue-500/20 transition-all active:scale-95 group"
          >
            <Save size={18} className="mr-3 group-hover:scale-110 transition-transform" />
            Guardar Preferencias
          </button>
        </div>

        {showSuccess && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center text-emerald-700 animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={18} className="mr-3" />
            <span className="text-xs font-bold uppercase tracking-widest">Configuración actualizada correctamente para este nodo.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Columna Branding & Typography (Izquierda) */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
              <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                <ImageIcon size={20} className="text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Identidad Visual</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Logotipo Corporativo</label>
                  <div className="aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                    {localConfig.logo ? (
                      <>
                        <img src={localConfig.logo} alt="Logo preview" className="max-h-full object-contain p-4" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setLocalConfig({...localConfig, logo: undefined})} className="text-white text-xs font-bold bg-red-500/80 px-4 py-2 rounded-full">Eliminar</button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload size={24} className="mx-auto text-slate-300" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Click para subir</p>
                      </div>
                    )}
                    <input type="file" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nombre de Aplicación</label>
                    <input 
                      type="text" 
                      value={appName} 
                      onChange={(e) => setAppName(e.target.value.toUpperCase())}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Eslogan Corporativo</label>
                    <textarea 
                      rows={2}
                      value={localConfig.slogan} 
                      onChange={(e) => setLocalConfig({...localConfig, slogan: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
              <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                <Type size={20} className="text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Tipografía Avanzada</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Familia Tipográfica</label>
                    <select 
                      value={localConfig.fontFamily}
                      onChange={(e) => setLocalConfig({...localConfig, fontFamily: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="'Inter', sans-serif">Inter (Industrial Modern)</option>
                      <option value="'Roboto Mono', monospace">Roboto Mono (Technical)</option>
                      <option value="'Sora', sans-serif">Sora (SaaS Clean)</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tamaño Base</label>
                      <span className="text-xs font-black text-blue-600">{localConfig.fontSize}px</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input type="range" min="12" max="18" value={localConfig.fontSize} onChange={(e) => setLocalConfig({...localConfig, fontSize: parseInt(e.target.value)})} className="flex-1 accent-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interlineado</label>
                      <span className="text-xs font-black text-blue-600">{localConfig.lineHeight}x</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input type="range" min="1" max="2" step="0.1" value={localConfig.lineHeight} onChange={(e) => setLocalConfig({...localConfig, lineHeight: parseFloat(e.target.value)})} className="flex-1 accent-blue-600" />
                    </div>
                  </div>

                  {/* OPCIÓN QUITAR NEGRITAS */}
                  <div className="pt-4">
                    <button 
                      onClick={() => setLocalConfig({...localConfig, disableBold: !localConfig.disableBold})}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${localConfig.disableBold ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex items-center space-x-3">
                         {localConfig.disableBold ? <ToggleRight className="text-blue-600" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
                         <span className={`text-xs font-bold uppercase tracking-wider ${localConfig.disableBold ? 'text-blue-700' : 'text-slate-500'}`}>Quitar Negritas</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Global Weight</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Columna VISTA PREVIA (Derecha) */}
          <div className="lg:col-span-5 space-y-8">
             <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5 relative z-10">
                   <div className="flex items-center text-blue-400 space-x-2">
                      <Eye size={18} />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white">VISTA PREVIA REAL-TIME</h3>
                   </div>
                   <div className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold text-white/40 uppercase tracking-widest border border-white/5">
                      Nodo: {currentEmplacement}
                   </div>
                </div>

                {/* SIMULACIÓN DE INTERFAZ */}
                <div className="flex-1 flex flex-col justify-center items-center">
                   <div className="w-full bg-white rounded-[2rem] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-500 origin-center overflow-hidden">
                      
                      {/* Cabecera Simulada */}
                      <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
                         {localConfig.logo ? (
                            <img src={localConfig.logo} className="h-10 w-auto object-contain" />
                         ) : (
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><Laptop size={20} /></div>
                         )}
                         <div>
                            <h4 
                               style={{ 
                                  fontFamily: localConfig.fontFamily, 
                                  fontSize: `${localConfig.fontSize + 4}px`, 
                                  fontWeight: localConfig.disableBold ? 400 : 700 
                               }} 
                               className="text-slate-900 tracking-tight leading-none"
                            >
                               {appName}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{currentEmplacement}</p>
                         </div>
                      </div>

                      {/* Cuerpo Simulado */}
                      <div className="space-y-4">
                         <div 
                            style={{ 
                               fontFamily: localConfig.fontFamily, 
                               fontSize: `${localConfig.fontSize}px`, 
                               lineHeight: localConfig.lineHeight,
                               fontWeight: localConfig.disableBold ? 400 : 500
                            }} 
                            className="text-slate-600"
                         >
                            {localConfig.slogan}
                         </div>
                         
                         <div className="flex space-x-3 pt-2">
                            <div 
                               style={{ fontWeight: localConfig.disableBold ? 400 : 800 }}
                               className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest"
                            >
                               CERTIFICAR ACCESO
                            </div>
                            <div 
                               style={{ fontWeight: localConfig.disableBold ? 400 : 700 }}
                               className="bg-slate-100 text-slate-400 px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest"
                            >
                               CANCELAR
                            </div>
                         </div>
                      </div>

                      {/* Info Footer Simulado */}
                      <div className="pt-4 flex items-center space-x-3 opacity-30">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                         <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Secure Protocol v3.0</span>
                      </div>
                   </div>

                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mt-8 text-center leading-relaxed">
                      El renderizado visual se adapta <br/> instantáneamente a sus parámetros
                   </p>
                </div>
             </section>
          </div>

        </div>
      </div>
    </div>
  );
};
