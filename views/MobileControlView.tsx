
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Smartphone, Camera, CheckCircle, AlertTriangle, 
  ChevronDown, Save, Send, Image as ImageIcon,
  CheckCircle2, X, AlertCircle, Loader2, User, Calendar, RefreshCcw
} from 'lucide-react';
import { MobileInspection } from '../types';

export const MobileControlView: React.FC = () => {
  const { user, vehicles, addMobileInspection, appName, currentConfig } = useApp();
  
  const [selectedPlate, setSelectedPlate] = useState('');
  const [status, setStatus] = useState<'LIMPIO' | 'PRESENTABLE' | 'SUCIO' | ''>('');
  const [details, setDetails] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [currentInspection, setCurrentInspection] = useState<MobileInspection | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Refs for hidden file inputs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const PHOTO_SLOTS = [
    { key: 'frontal', label: 'Frontal', required: true },
    { key: 'trasera', label: 'Trasera', required: true },
    { key: 'latIzq', label: 'Lateral Izq.', required: true },
    { key: 'latDer', label: 'Lateral Der.', required: true },
    { key: 'interiorDelantero', label: 'Interior (Piloto)', required: true },
    { key: 'interiorTrasero', label: 'Interior (Traseros)', required: true },
    { key: 'pickup', label: 'Pickup / Carga', required: true },
  ];

  const [photos, setPhotos] = useState<Record<string, string>>({
    frontal: '', trasera: '', latIzq: '', latDer: '', interiorDelantero: '', interiorTrasero: '', pickup: ''
  });

  const localVehicles = useMemo(() => {
    return vehicles.filter(v => v.location === user?.location);
  }, [vehicles, user]);

  const completionPercentage = useMemo(() => {
      let totalFields = 3 + PHOTO_SLOTS.length;
      let filledFields = 0;
      if (selectedPlate) filledFields++;
      if (status) filledFields++;
      if (details.trim().length > 5) filledFields++;
      PHOTO_SLOTS.forEach(slot => {
          if (photos[slot.key]) filledFields++;
      });
      return Math.round((filledFields / totalFields) * 100);
  }, [selectedPlate, status, details, photos]);

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => ({ ...prev, [key]: reader.result as string }));
        setErrors(prev => prev.filter(err => err !== key));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = (key: string) => {
    fileInputRefs.current[key]?.click();
  };

  const validateForm = () => {
      const newErrors: string[] = [];
      if (!selectedPlate) newErrors.push('plate');
      if (!status) newErrors.push('status');
      if (!details || details.trim().length < 5) newErrors.push('details');
      PHOTO_SLOTS.forEach(slot => {
          if (!photos[slot.key]) newErrors.push(slot.key);
      });
      setErrors(newErrors);
      return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      alert("Protocolo incompleto. Debe capturar todas las evidencias fotográficas obligatorias.");
      return;
    }

    const vehicle = localVehicles.find(v => v.plate === selectedPlate);
    const timestamp = new Date().toISOString();

    const newInspection: MobileInspection = {
      id: Date.now().toString(),
      plate: selectedPlate,
      driver: vehicle?.driver || 'Desconocido',
      status: status as 'LIMPIO' | 'PRESENTABLE' | 'SUCIO',
      photos: { ...photos } as any,
      details,
      timestamp: timestamp,
      location: user?.location || 'Central',
      user: user?.name || 'Usuario'
    };

    setIsSending(true);

    setTimeout(() => {
      addMobileInspection(newInspection);
      setCurrentInspection(newInspection);
      setPrintMode(true);
      setTimeout(() => {
        window.print();
        setPrintMode(false);
        alert("Inspección certificada y transmitida correctamente.");
        setSelectedPlate('');
        setStatus('');
        setDetails('');
        setPhotos({ frontal: '', trasera: '', latIzq: '', latDer: '', interiorDelantero: '', interiorTrasero: '', pickup: '' });
        setErrors([]);
        setIsSending(false);
        setCurrentInspection(null);
      }, 800);
    }, 1500);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 font-sans w-full">
      <div className={`w-full max-w-5xl mx-auto ${printMode ? 'hidden' : 'block'}`}>
        
        {/* Header con estética de terminal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
           <div className="flex items-center space-x-4">
               <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg border border-slate-800">
                  <Camera size={24} strokeWidth={2} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Certificación Móvil</h2>
                  <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1.5 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    SISTEMA DE CAPTURA ACTIVO
                  </p>
               </div>
           </div>
           
           <div className="flex items-center justify-between md:justify-end space-x-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
               <div className="text-left md:text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Validación de Datos</p>
                   <p className={`text-sm font-black ${completionPercentage === 100 ? 'text-emerald-600' : 'text-slate-800'}`}>{completionPercentage}% INTEGRIDAD</p>
               </div>
               <div className="w-10 h-10 relative flex items-center justify-center flex-shrink-0">
                   <svg className="w-full h-full transform -rotate-90">
                       <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                       <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={107} strokeDashoffset={107 - (107 * completionPercentage / 100)} className={`transition-all duration-700 ease-out ${completionPercentage === 100 ? 'text-emerald-500' : 'text-blue-600'}`} />
                   </svg>
               </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${errors.includes('plate') ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'}`}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                        01. Unidad a Inspeccionar <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <select 
                            value={selectedPlate} 
                            onChange={e => { setSelectedPlate(e.target.value); setErrors(prev => prev.filter(err => err !== 'plate')); }}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-800 outline-none focus:border-blue-500 appearance-none transition-all cursor-pointer"
                        >
                            <option value="">-- SELECCIONE PPU --</option>
                            {localVehicles.map(v => (
                            <option key={v.plate} value={v.plate}>{v.plate} | {v.driver.split(' ')[0].toUpperCase()}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${errors.includes('status') ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'}`}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                        02. Condición del Activo <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {['LIMPIO', 'PRESENTABLE', 'SUCIO'].map((st) => (
                            <button
                            key={st}
                            onClick={() => { setStatus(st as any); setErrors(prev => prev.filter(err => err !== 'status')); }}
                            className={`w-full flex items-center justify-between p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                status === st 
                                ? st === 'LIMPIO' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' 
                                : st === 'PRESENTABLE' ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                : 'bg-red-600 text-white border-red-600 shadow-lg'
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                            }`}
                            >
                                <span>{st}</span>
                                {status === st && <CheckCircle2 size={14} />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${errors.includes('details') ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'}`}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                        04. Notas de Campo <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea 
                        value={details}
                        onChange={e => { setDetails(e.target.value); setErrors(prev => prev.filter(err => err !== 'details')); }}
                        placeholder="INGRESE DETALLES RELEVANTES DEL ESTADO FÍSICO..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all resize-none h-32 uppercase placeholder:normal-case"
                    />
                </div>
            </div>

            <div className="lg:col-span-2 flex flex-col h-full">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-2">
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center">
                            03. Registro de Evidencias (7) <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center space-x-2">
                             <div className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-widest flex items-center">
                                <Camera size={10} className="mr-1.5" /> Cámara Nativa Activa
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {PHOTO_SLOTS.map((slot) => {
                            const isFilled = !!photos[slot.key];
                            const isError = errors.includes(slot.key);

                            return (
                                <div key={slot.key} className="flex flex-col">
                                    <input 
                                        type="file" 
                                        ref={el => fileInputRefs.current[slot.key] = el}
                                        onChange={e => handleFileChange(slot.key, e)}
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                    />
                                    <div 
                                        onClick={() => triggerCamera(slot.key)}
                                        className={`group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all ${
                                            isFilled 
                                                ? 'border-2 border-emerald-500 shadow-md ring-4 ring-emerald-50' 
                                                : isError 
                                                    ? 'border-2 border-red-400 bg-red-50 animate-pulse' 
                                                    : 'border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400'
                                        }`}
                                    >
                                        {isFilled ? (
                                            <>
                                                <img src={photos[slot.key]} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                                                    <RefreshCcw size={20} className="text-white mb-2" />
                                                    <span className="text-[8px] text-white font-black uppercase">Recapturar</span>
                                                </div>
                                                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg z-10">
                                                    <CheckCircle2 size={12} />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                                                <div className={`p-3 rounded-full mb-2 ${isError ? 'bg-red-100 text-red-600' : 'bg-white text-blue-600 shadow-sm border border-slate-100'}`}>
                                                    <Camera size={20} />
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest leading-tight ${isError ? 'text-red-600' : 'text-slate-400'}`}>
                                                    {slot.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex justify-end pb-12 md:pb-0">
                    <button 
                        onClick={handleSave}
                        disabled={isSending || completionPercentage < 100}
                        className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center
                            ${completionPercentage < 100 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none' 
                                : isSending 
                                    ? 'bg-slate-900 text-white cursor-wait' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/40 active:scale-95'
                            }
                        `}
                    >
                        {isSending ? (
                            <>
                                <Loader2 size={16} className="mr-3 animate-spin" /> PROCESANDO CERTIFICACIÓN...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-3" /> 
                                {completionPercentage < 100 ? `PROTOCOLOS INCOMPLETOS (${completionPercentage}%)` : 'CERTIFICAR Y TRANSMITIR INSPECCIÓN'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Reporte de impresión (No cambia pero se integra con las fotos reales) */}
      <div className="hidden print:block bg-white p-12 w-full max-w-none">
         {currentInspection && (
           <div className="space-y-8 border-4 border-slate-900 p-10">
              <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6">
                 <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">ZERO SYSTEM</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">TECHNICAL INSPECTION REPORT V2.5</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FECHA DE EMISIÓN</p>
                    <p className="text-lg font-mono font-bold">{new Date(currentInspection.timestamp).toLocaleString()}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-12 border-b-2 border-slate-100 pb-8">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">IDENTIFICACIÓN MÓVIL</p>
                    <p className="text-3xl font-black text-slate-900">{currentInspection.plate}</p>
                    <p className="text-sm font-bold text-slate-600 uppercase mt-1">CONDUCTOR: {currentInspection.driver}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CALIFICACIÓN TÉCNICA</p>
                    <span className="text-2xl font-black px-6 py-2 bg-slate-900 text-white rounded inline-block">
                       {currentInspection.status}
                    </span>
                 </div>
              </div>

              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 underline">EVIDENCIA FOTOGRÁFICA CERTIFICADA</p>
                 <div className="grid grid-cols-4 gap-6">
                    {Object.entries(currentInspection.photos).map(([key, url]) => (
                       <div key={key} className="border-2 border-slate-200 rounded p-2">
                          <div className="aspect-[4/3] bg-slate-100 overflow-hidden mb-2">
                             <img src={url} className="w-full h-full object-cover grayscale-[0.5]" />
                          </div>
                          <p className="text-[8px] font-black text-center uppercase text-slate-600">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="border-t-2 border-slate-100 pt-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">OBSERVACIONES DEL INSPECTOR</p>
                 <div className="p-6 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 leading-relaxed uppercase">
                    {currentInspection.details}
                 </div>
              </div>

              <div className="mt-16 text-[9px] text-slate-400 font-mono flex justify-between items-end pt-6 border-t-2 border-slate-900">
                 <div>
                    <p>INSPECTOR ASIGNADO: {currentInspection.user.toUpperCase()}</p>
                    <p>NODO ORIGEN: {currentInspection.location.toUpperCase()}</p>
                 </div>
                 <div className="text-right uppercase">
                    <p>REPORTE ID: {currentInspection.id}</p>
                    <p>SYSTEM HASH: 0x{currentInspection.id.substring(0,8)}...{currentInspection.plate}</p>
                 </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};
