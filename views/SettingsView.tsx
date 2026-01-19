
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Settings, Type, Image as ImageIcon, Layout, 
  Save, Upload, Sliders, BoxSelect, CheckCircle, 
  Laptop, Monitor, Layers, ToggleLeft, ToggleRight,
  User, Lock, Eye, Building2, ChevronDown, ChevronRight, CheckCircle2
} from 'lucide-react';

// --- CUSTOM SETTINGS SELECT ---
interface SettingsSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

const SettingsSelect: React.FC<SettingsSelectProps> = ({ value, onChange, options, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'bg-white ring-4 ring-blue-500/5 border-blue-400' : ''}`}
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[110%] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`px-4 py-3 text-sm cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${value === option.value ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'}`}
            >
              <span style={{ fontFamily: option.value }}>{option.label}</span>
              {value === option.value && <CheckCircle2 size={14} className="text-blue-500"/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
    loginImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop",
    bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
    bgOpacity: 20,
    bgBlur: 0,
    bgFit: 'cover',
    disableBold: false
  };

  const [localConfig, setLocalConfig] = useState(config);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'APP' | 'LOGIN' | 'DESKTOP'>('APP');

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

  const handleLoginImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLocalConfig({ ...localConfig, loginImage: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLocalConfig({ ...localConfig, bgImage: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-10 bg-slate-50/50">
      <div className="max-w-6xl mx-auto space-y-10">
        
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
          
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
              <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                <ImageIcon size={20} className="text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Identidad Visual</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Logotipo Corporativo</label>
                  <div className="aspect-square w-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                    {localConfig.logo ? (
                      <>
                        <img src={localConfig.logo} alt="Logo preview" className="max-h-full object-contain p-4" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setLocalConfig({...localConfig, logo: undefined})} className="text-white text-[9px] font-bold bg-red-500/80 px-3 py-1 rounded-full">Eliminar</button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1">
                        <Upload size={16} className="mx-auto text-slate-300" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Subir Logo</p>
                      </div>
                    )}
                    <input type="file" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Imagen Lateral Login</label>
                  <div className="aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                    {localConfig.loginImage ? (
                      <>
                        <img src={localConfig.loginImage} alt="Login preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setLocalConfig({...localConfig, loginImage: undefined})} className="text-white text-[9px] font-bold bg-red-500/80 px-3 py-1 rounded-full">Restaurar</button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1">
                        <Upload size={16} className="mx-auto text-slate-300" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Subir Imagen</p>
                      </div>
                    )}
                    <input type="file" onChange={handleLoginImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nombre de Aplicación</label>
                  <input 
                    type="text" 
                    value={appName} 
                    onChange={(e) => setAppName(e.target.value.toUpperCase())}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Eslogan Corporativo</label>
                  <textarea 
                    rows={2}
                    value={localConfig.slogan} 
                    onChange={(e) => setLocalConfig({...localConfig, slogan: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
              <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                <Layers size={20} className="text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Escritorio y Fondo Principal</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Imagen de Fondo (Post-Login)</label>
                  <div className="aspect-video w-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                    {localConfig.bgImage ? (
                      <>
                        <img src={localConfig.bgImage} alt="Background preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setLocalConfig({...localConfig, bgImage: undefined})} className="text-white text-[9px] font-bold bg-red-500/80 px-3 py-1 rounded-full">Remover</button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1">
                        <Upload size={16} className="mx-auto text-slate-300" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Subir Fondo</p>
                      </div>
                    )}
                    <input type="file" onChange={handleBgImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center">Recomendado: 1920x1080px Grayscale</p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center"><Sliders size={12} className="mr-2 text-blue-500"/> Atenuación (Opacidad)</label>
                      <span className="text-xs font-black text-blue-600">{localConfig.bgOpacity}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="5" value={localConfig.bgOpacity} onChange={(e) => setLocalConfig({...localConfig, bgOpacity: parseInt(e.target.value)})} className="w-full accent-blue-600" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center"><BlurIcon size={12} className="mr-2 text-blue-500"/> Desenfoque (Blur)</label>
                      <span className="text-xs font-black text-blue-600">{localConfig.bgBlur}px</span>
                    </div>
                    <input type="range" min="0" max="20" step="1" value={localConfig.bgBlur} onChange={(e) => setLocalConfig({...localConfig, bgBlur: parseInt(e.target.value)})} className="w-full accent-blue-600" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center"><BoxSelect size={12} className="mr-2 text-blue-500"/> Ajuste de Escala</label>
                    <div className="flex gap-2">
                       {['cover', 'contain', 'auto'].map((mode) => (
                         <button 
                           key={mode} 
                           onClick={() => setLocalConfig({...localConfig, bgFit: mode as any})}
                           className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all ${localConfig.bgFit === mode ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                         >
                           {mode}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
              <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                <Type size={20} className="text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Tipografía Avanzada Global</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Familia Tipográfica Global</label>
                    <SettingsSelect
                        value={localConfig.fontFamily}
                        onChange={(val) => setLocalConfig({...localConfig, fontFamily: val})}
                        options={[
                            { label: 'Inter (Industrial Moderno)', value: "'Inter', sans-serif" },
                            { label: 'Arial (Clásico Estándar)', value: "'Arial', sans-serif" },
                            { label: 'Roboto (Google Standard)', value: "'Roboto', sans-serif" },
                            { label: 'Open Sans (Lectura Clara)', value: "'Open Sans', sans-serif" },
                            { label: 'Montserrat (Geométrico)', value: "'Montserrat', sans-serif" },
                            { label: 'Sora (SaaS Tech)', value: "'Sora', sans-serif" },
                            { label: 'Roboto Mono (Técnico / Código)', value: "'Roboto Mono', monospace" }
                        ]}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escalado General (Base Size)</label>
                      <span className="text-xs font-black text-blue-600">{localConfig.fontSize}px</span>
                    </div>
                    <input type="range" min="10" max="22" value={localConfig.fontSize} onChange={(e) => setLocalConfig({...localConfig, fontSize: parseInt(e.target.value)})} className="w-full accent-blue-600" />
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interlineado (Line Height)</label>
                      <span className="text-xs font-black text-blue-600">{localConfig.lineHeight}x</span>
                    </div>
                    <input type="range" min="0.8" max="2.2" step="0.1" value={localConfig.lineHeight} onChange={(e) => setLocalConfig({...localConfig, lineHeight: parseFloat(e.target.value)})} className="w-full accent-blue-600" />
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={() => setLocalConfig({...localConfig, disableBold: !localConfig.disableBold})}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${localConfig.disableBold ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex items-center space-x-3">
                         {localConfig.disableBold ? <ToggleRight className="text-blue-600" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
                         <span className={`text-xs font-bold uppercase tracking-wider ${localConfig.disableBold ? 'text-blue-700' : 'text-slate-500'}`}>Desactivar Negritas Globales</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-8">
             <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5 relative z-10">
                   <div className="flex bg-white/5 p-1 rounded-xl">
                      <button 
                        onClick={() => setPreviewMode('APP')}
                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${previewMode === 'APP' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/60'}`}
                      >
                        <Laptop size={14} className="inline mr-2" />
                        App
                      </button>
                      <button 
                        onClick={() => setPreviewMode('LOGIN')}
                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${previewMode === 'LOGIN' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/60'}`}
                      >
                        <Monitor size={14} className="inline mr-2" />
                        Login
                      </button>
                      <button 
                        onClick={() => setPreviewMode('DESKTOP')}
                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${previewMode === 'DESKTOP' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/60'}`}
                      >
                        <Layout size={14} className="inline mr-2" />
                        Fondo
                      </button>
                   </div>
                   <div className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold text-white/40 uppercase tracking-widest border border-white/5">
                      Vista Previa
                   </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center">
                   {previewMode === 'APP' ? (
                      <div className="w-full bg-white rounded-[2rem] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-500 origin-center overflow-hidden">
                         <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
                            {localConfig.logo ? (
                               <img src={localConfig.logo} className="h-10 w-auto object-contain" />
                            ) : (
                               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><Laptop size={20} /></div>
                            )}
                            <div>
                               <h4 style={{ fontFamily: localConfig.fontFamily, fontSize: `${localConfig.fontSize + 4}px`, fontWeight: localConfig.disableBold ? 400 : 700 }} className="text-slate-900 tracking-tight leading-none uppercase">{appName}</h4>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{currentEmplacement}</p>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div style={{ fontFamily: localConfig.fontFamily, fontSize: `${localConfig.fontSize}px`, lineHeight: localConfig.lineHeight, fontWeight: localConfig.disableBold ? 400 : 500 }} className="text-slate-600">
                               {localConfig.slogan}
                            </div>
                            <div className="flex space-x-3 pt-2">
                               <div style={{ fontWeight: localConfig.disableBold ? 400 : 800, fontSize: `${localConfig.fontSize - 2}px` }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest">BOTÓN MUESTRA</div>
                               <div style={{ fontSize: `${localConfig.fontSize - 2}px` }} className="bg-slate-100 text-slate-400 px-5 py-2.5 rounded-xl uppercase tracking-widest">CANCELAR</div>
                            </div>
                         </div>
                      </div>
                   ) : previewMode === 'LOGIN' ? (
                      <div className="w-full bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden flex h-96 border border-white/10">
                         {/* Split screen preview reflecting new login design */}
                         <div className="hidden md:block w-1/2 relative bg-slate-800">
                            <img src={localConfig.loginImage} className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                               <h1 style={{ fontFamily: localConfig.fontFamily, fontSize: `${localConfig.fontSize + 6}px` }} className="text-white font-black leading-tight mb-1">
                                  {appName}
                               </h1>
                               <p className="text-white/60 text-[10px]">{localConfig.slogan.substring(0, 40)}...</p>
                            </div>
                         </div>
                         <div className="w-full md:w-1/2 p-6 flex flex-col justify-center bg-white">
                            <div style={{ fontFamily: localConfig.fontFamily }}>
                                <h2 style={{ fontSize: `${localConfig.fontSize + 4}px`, fontWeight: localConfig.disableBold ? 400 : 700 }} className="text-slate-900 mb-1">Iniciar Sesión</h2>
                                <p style={{ fontSize: `${localConfig.fontSize - 2}px` }} className="text-slate-500 mb-6">Ingrese sus credenciales</p>
                                
                                <div className="space-y-3">
                                   <div className="relative">
                                     <User size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                     <div className="w-full pl-9 py-2 border rounded text-xs text-slate-400">Nombre de usuario</div>
                                   </div>
                                   <div className="relative">
                                     <Lock size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                     <div className="w-full pl-9 py-2 border rounded text-xs text-slate-400">Contraseña</div>
                                   </div>
                                   
                                   <div className="pt-2">
                                     <label style={{ fontSize: `${localConfig.fontSize - 3}px` }} className="block font-bold text-slate-800 mb-1">Seleccionar Sucursal</label>
                                     <div className="relative">
                                        <Building2 size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                        <div className="w-full pl-9 py-2 border rounded text-xs text-slate-400 flex justify-between">
                                            <span>Sucursal</span> <ChevronDown size={12}/>
                                        </div>
                                     </div>
                                   </div>

                                   <div className="w-full bg-blue-600 h-9 rounded mt-4 flex items-center justify-center text-white text-xs">
                                       Ingresar al Sistema <ChevronRight size={12} className="ml-1"/>
                                   </div>
                                </div>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div className="w-full aspect-video bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden relative border border-white/10 flex flex-col items-center justify-center p-6">
                         <img 
                            src={localConfig.bgImage} 
                            style={{ opacity: localConfig.bgOpacity / 100, filter: `blur(${localConfig.bgBlur}px)`, objectFit: localConfig.bgFit }} 
                            className="absolute inset-0 w-full h-full pointer-events-none"
                         />
                         <div className="relative z-10 text-center opacity-40">
                            <div className="w-12 h-12 bg-white/50 backdrop-blur rounded-2xl mx-auto mb-4 border border-white flex items-center justify-center"><Layout size={24}/></div>
                            <h4 className="text-xl font-black uppercase tracking-tighter italic">{appName}</h4>
                         </div>
                      </div>
                   )}

                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mt-8 text-center leading-relaxed">
                      Control visual de despliegue <br/> corporativo para nodos operativos
                   </p>
                </div>
             </section>
          </div>

        </div>
      </div>
    </div>
  );
};

const BlurIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20" />
    <path d="M12 6c4 0 4 12 0 12" />
    <path d="M12 10c2 0 2 4 0 4" />
  </svg>
);
