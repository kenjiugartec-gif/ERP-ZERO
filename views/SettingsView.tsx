
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Settings, Type, Image as ImageIcon, Layout, 
  Save, Sliders, CheckCircle, 
  Laptop, MousePointer2, Info, 
  ChevronDown, CheckCircle2, Heading, 
  Type as TextIcon, ToggleLeft, ToggleRight, 
  Monitor, Smartphone, AppWindow, FileText, Upload, Trash2
} from 'lucide-react';

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
        <span style={{ fontFamily: value }}>{selectedLabel}</span>
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
    slogan: "Innovative Solutions, Comprehensive Logistics Solutions.",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    lineHeight: 1.5,
    primaryColor: "#2563eb",
    logo: undefined,
    loginImage: "",
    bgImage: "",
    bgOpacity: 20,
    bgBlur: 0,
    bgFit: 'cover',
    disableBold: false
  };

  const [localConfig, setLocalConfig] = useState(config);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'APP' | 'ELEMENTS'>('APP');

  const handleSave = () => {
    updateConfig(currentEmplacement, localConfig);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileChange = (key: 'loginImage' | 'bgImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig({ ...localConfig, [key]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const previewContainerStyle = {
    fontFamily: localConfig.fontFamily,
    fontSize: `${localConfig.fontSize}px`,
    lineHeight: localConfig.lineHeight,
  };

  const previewBoldStyle = (isHeader = false) => ({
      fontWeight: localConfig.disableBold ? (isHeader ? '800' : '400') : (isHeader ? '800' : '600'),
      fontStyle: 'normal'
  });

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 bg-slate-50/50">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-xl flex-shrink-0">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Ajustes del Nodo</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Configuración técnica de {currentEmplacement}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center shadow-2xl shadow-blue-500/20 transition-all active:scale-95 group"
          >
            <Save size={18} className="mr-3 group-hover:scale-110 transition-transform" />
            Certificar Cambios
          </button>
        </div>

        {showSuccess && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center text-emerald-700 animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={18} className="mr-3" />
            <span className="text-xs font-bold uppercase tracking-widest">Sincronización de estilos completada correctamente.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-6 space-y-8 pb-32">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
                <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                    <Monitor size={20} className="text-blue-600" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Identidad del Nodo</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nombre del Sistema</label>
                        <input type="text" value={appName} onChange={(e) => setAppName(e.target.value.toUpperCase())} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center"><FileText size={10} className="mr-1"/> Eslógan Corporativo <span className="ml-2 text-blue-500">(Bold)</span></label>
                        <textarea value={localConfig.slogan} onChange={(e) => setLocalConfig({...localConfig, slogan: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all h-20 resize-none uppercase" placeholder="Mensaje de bienvenida..."/>
                    </div>
                </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
                <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                    <ImageIcon size={20} className="text-blue-600" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Fondos de Pantalla</h3>
                </div>
                <div className="space-y-8">
                    {/* Carga Fondo Login */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Fondo Inicio de Sesión</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {localConfig.loginImage ? (
                                    <img src={localConfig.loginImage} className="w-full h-full object-cover" alt="Login preview" />
                                ) : (
                                    <ImageIcon size={24} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="flex items-center justify-center w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all">
                                    <Upload size={14} className="mr-2" /> Cargar desde PC
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange('loginImage', e)} />
                                </label>
                                {localConfig.loginImage && (
                                    <button onClick={() => setLocalConfig({...localConfig, loginImage: ''})} className="flex items-center justify-center w-full py-2 text-red-500 text-[9px] font-bold uppercase tracking-widest hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 size={12} className="mr-1" /> Eliminar imagen
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Carga Fondo Escritorio */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Fondo Interfaz Workspace</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {localConfig.bgImage ? (
                                    <img src={localConfig.bgImage} className="w-full h-full object-cover" alt="Desktop preview" />
                                ) : (
                                    <ImageIcon size={24} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="flex items-center justify-center w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all">
                                    <Upload size={14} className="mr-2" /> Cargar desde PC
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange('bgImage', e)} />
                                </label>
                                {localConfig.bgImage && (
                                    <button onClick={() => setLocalConfig({...localConfig, bgImage: ''})} className="flex items-center justify-center w-full py-2 text-red-500 text-[9px] font-bold uppercase tracking-widest hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 size={12} className="mr-1" /> Eliminar imagen
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
          </div>

          <div className="lg:col-span-6 space-y-8">
             <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5 relative z-10">
                   <div className="flex bg-white/5 p-1 rounded-xl">
                      <button onClick={() => setPreviewMode('APP')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${previewMode === 'APP' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/60'}`}><Laptop size={14} className="inline mr-2" /> Vista Módulo</button>
                      <button onClick={() => setPreviewMode('ELEMENTS')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${previewMode === 'ELEMENTS' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/60'}`}><TextIcon size={14} className="inline mr-2" /> Muestra Texto</button>
                   </div>
                   <div className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold text-white/40 uppercase tracking-widest border border-white/5 flex items-center"><MousePointer2 size={10} className="mr-2"/> Simulación Real-Time</div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                   {previewMode === 'APP' ? (
                      <div className="w-full bg-white rounded-[2rem] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-500 origin-center overflow-hidden" style={previewContainerStyle}>
                         <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-[#00AEEF]"><CheckCircle2 size={24} /></div>
                            <div>
                               <h4 style={previewBoldStyle(true)} className="text-slate-900 tracking-tight leading-none uppercase italic">Muestrario de Estilos</h4>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">CONFIGURACIÓN ACTUAL DEL NODO</p>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <p className="text-slate-600 uppercase font-black">{localConfig.slogan}</p>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                               <div className="bg-blue-600 text-white px-5 py-3 rounded-xl uppercase tracking-widest flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-200">ACCIÓN PRINCIPAL</div>
                               <div className="bg-slate-100 text-slate-400 px-5 py-3 rounded-xl uppercase tracking-widest flex items-center justify-center text-[10px] font-black">CANCELAR</div>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div className="w-full bg-white rounded-[2rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden space-y-8" style={previewContainerStyle}>
                         <div className="space-y-2">
                             <h1 style={previewBoldStyle(true)} className="text-3xl text-slate-900 uppercase">Encabezado H1</h1>
                             <p className="text-slate-700 leading-relaxed">Este es el cuerpo de texto normal. <strong>Este es un texto forzado en negrita para jerarquía visual.</strong></p>
                         </div>
                         <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">US</div>
                                 <span className="text-xs text-slate-600 font-black">Usuario_Admin</span>
                             </div>
                             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Rol: Administrador</span>
                         </div>
                      </div>
                   )}

                   <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-2xl">
                       <div className="flex items-start space-x-4">
                           <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Info size={16}/></div>
                           <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-widest font-bold">
                               Recuerde que los saludos ("Buenos días", etc) y el eslogan corporativo siempre se visualizarán en negrita para un impacto profesional superior.
                           </p>
                       </div>
                   </div>
                </div>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
};
