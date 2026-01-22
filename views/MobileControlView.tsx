
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Smartphone, Camera, CheckCircle, AlertTriangle, 
  ChevronDown, Save, Send, Image as ImageIcon,
  CheckCircle2, X, AlertCircle, Loader2, User, Calendar
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

  // Update clock every minute for display
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Photo slots configuration
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

  // Filter vehicles by location
  const localVehicles = useMemo(() => {
    return vehicles.filter(v => v.location === user?.location);
  }, [vehicles, user]);

  // Completion percentage calculation
  const completionPercentage = useMemo(() => {
      let totalFields = 3 + PHOTO_SLOTS.length; // Plate, Status, Details + 7 Photos
      let filledFields = 0;
      if (selectedPlate) filledFields++;
      if (status) filledFields++;
      if (details.trim().length > 5) filledFields++; // Min 5 chars for details
      PHOTO_SLOTS.forEach(slot => {
          if (photos[slot.key]) filledFields++;
      });
      return Math.round((filledFields / totalFields) * 100);
  }, [selectedPlate, status, details, photos]);

  const handleSimulatePhoto = (key: string) => {
    const mockPhotos = [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300"
    ];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setPhotos(prev => ({ ...prev, [key]: randomPhoto }));
    // Clear error for this field if exists
    setErrors(prev => prev.filter(e => e !== key));
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
      alert("Formulario incompleto. Todos los campos y fotografías son obligatorios para el protocolo de seguridad.");
      return;
    }

    const vehicle = localVehicles.find(v => v.plate === selectedPlate);
    const timestamp = new Date().toISOString(); // Capture exact time of save
    
    // Cast strict typed photos to the interface format
    const inspectionPhotos = {
        frontal: photos.frontal,
        trasera: photos.trasera,
        latIzq: photos.latIzq,
        latDer: photos.latDer,
        interiorDelantero: photos.interiorDelantero,
        interiorTrasero: photos.interiorTrasero,
        pickup: photos.pickup
    };

    const newInspection: MobileInspection = {
      id: Date.now().toString(),
      plate: selectedPlate,
      driver: vehicle?.driver || 'Desconocido',
      status: status as 'LIMPIO' | 'PRESENTABLE' | 'SUCIO',
      photos: inspectionPhotos,
      details,
      timestamp: timestamp,
      location: user?.location || 'Central',
      user: user?.name || 'Usuario' // Explicitly capturing User Name
    };

    setIsSending(true);

    setTimeout(() => {
      addMobileInspection(newInspection);
      setCurrentInspection(newInspection);
      
      // Trigger Print
      setPrintMode(true);
      setTimeout(() => {
        window.print();
        setPrintMode(false);
        alert("Inspección certificada y enviada a centro de control.");
        
        // Reset
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
        
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
           <div className="flex items-center space-x-4">
               <div className="bg-white p-3 rounded-2xl text-slate-800 shadow-sm border border-slate-200">
                  <Smartphone size={24} strokeWidth={1.5} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">Control Móvil Técnico</h2>
                  <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">PROTOCOLO DE INSPECCIÓN OBLIGATORIO</p>
               </div>
           </div>
           
           {/* Completion Indicator */}
           <div className="flex items-center justify-between md:justify-end space-x-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
               <div className="text-left md:text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Integridad Datos</p>
                   <p className={`text-sm font-black ${completionPercentage === 100 ? 'text-emerald-600' : 'text-slate-800'}`}>{completionPercentage}% COMPLETO</p>
               </div>
               <div className="w-10 h-10 relative flex items-center justify-center flex-shrink-0">
                   <svg className="w-full h-full transform -rotate-90">
                       <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
                       <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={100} strokeDashoffset={100 - completionPercentage} className={`transition-all duration-500 ${completionPercentage === 100 ? 'text-emerald-500' : 'text-blue-600'}`} />
                   </svg>
               </div>
           </div>
        </div>

        {/* User & Date Context Bar */}
        <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400">
                    <User size={16} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inspector (Usuario Activo)</p>
                    <p className="text-sm font-bold text-slate-800 uppercase">{user?.name || 'USUARIO DESCONOCIDO'}</p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400">
                    <Calendar size={16} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha / Hora Registro</p>
                    <p className="text-sm font-bold text-slate-800 uppercase">{currentTime.toLocaleString()}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Left Column: Data Input */}
            <div className="lg:col-span-1 space-y-4 md:space-y-6">
                
                {/* 1. Identification */}
                <div className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm border transition-all ${errors.includes('plate') ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                            1. Unidad (PPU) <span className="text-red-500 ml-1">*</span>
                        </label>
                        {selectedPlate && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                    <div className="relative">
                        <select 
                            value={selectedPlate} 
                            onChange={e => { setSelectedPlate(e.target.value); setErrors(prev => prev.filter(err => err !== 'plate')); }}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 appearance-none transition-all cursor-pointer hover:bg-slate-100"
                        >
                            <option value="">SELECCIONAR MÓVIL...</option>
                            {localVehicles.map(v => (
                            <option key={v.plate} value={v.plate}>{v.plate} - {v.driver.split(' ')[0]}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 2. Status */}
                <div className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm border transition-all ${errors.includes('status') ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            2. Estado General <span className="text-red-500 ml-1">*</span>
                        </label>
                        {status && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                    <div className="flex flex-col space-y-2">
                        {['LIMPIO', 'PRESENTABLE', 'SUCIO'].map((st) => (
                            <button
                            key={st}
                            onClick={() => { setStatus(st as any); setErrors(prev => prev.filter(err => err !== 'status')); }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                                status === st 
                                ? st === 'LIMPIO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500' 
                                : st === 'PRESENTABLE' ? 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500'
                                : 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500'
                                : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:text-slate-600'
                            }`}
                            >
                                <span>{st}</span>
                                {status === st && <div className={`w-2 h-2 rounded-full ${st === 'LIMPIO' ? 'bg-emerald-500' : st === 'PRESENTABLE' ? 'bg-blue-500' : 'bg-red-500'}`}></div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Details */}
                <div className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm border transition-all ${errors.includes('details') ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            4. Observaciones <span className="text-red-500 ml-1">*</span>
                        </label>
                        {details.trim().length >= 5 && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                    <textarea 
                        value={details}
                        onChange={e => { setDetails(e.target.value); setErrors(prev => prev.filter(err => err !== 'details')); }}
                        placeholder="Detalle obligatorio (Min. 5 caracteres)..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-blue-500 transition-all resize-none h-32 placeholder:text-slate-400"
                    />
                    <div className="text-right mt-1">
                        <span className={`text-[9px] font-bold ${details.length < 5 ? 'text-red-400' : 'text-slate-300'}`}>{details.length} / 5 Min</span>
                    </div>
                </div>

            </div>

            {/* Right Column: Photos Grid */}
            <div className="lg:col-span-2 flex flex-col h-full">
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                            3. Evidencia Fotográfica (7/7) <span className="text-red-500 ml-1">*</span>
                        </label>
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-1 rounded border border-slate-200 self-start md:self-auto">
                            REQ. OBLIGATORIO
                        </span>
                    </div>

                    {/* Responsive Grid for Photos: 2 cols on mobile, 3 on desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {PHOTO_SLOTS.map((slot) => {
                            const isFilled = !!photos[slot.key];
                            const isError = errors.includes(slot.key);

                            return (
                                <div 
                                    key={slot.key} 
                                    className={`relative group aspect-[4/3] rounded-xl overflow-hidden transition-all ${
                                        isFilled 
                                            ? 'border-2 border-transparent ring-2 ring-emerald-500/20 shadow-md' 
                                            : isError 
                                                ? 'border-2 border-red-300 bg-red-50/10' 
                                                : 'border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                >
                                    {isFilled ? (
                                        <>
                                            <img src={photos[slot.key]} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <button 
                                                    onClick={() => setPhotos({...photos, [slot.key]: ''})} 
                                                    className="bg-white text-red-500 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-sm z-10 pointer-events-none">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleSimulatePhoto(slot.key)}
                                            className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
                                        >
                                            <div className={`p-2.5 rounded-full mb-1.5 ${isError ? 'bg-red-100 text-red-500' : 'bg-white text-blue-500 shadow-sm'}`}>
                                                <Camera size={18} />
                                            </div>
                                            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wide leading-tight ${isError ? 'text-red-500' : 'text-slate-400'}`}>
                                                {slot.label}
                                            </span>
                                            {isError && <span className="text-[8px] font-bold text-red-400 mt-1 uppercase">Requerido</span>}
                                        </button>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/50">
                                        <div className={`h-full ${isFilled ? 'bg-emerald-500' : 'bg-transparent'} transition-all duration-500 w-full`}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 flex justify-end pb-10 md:pb-0">
                    <button 
                        onClick={handleSave}
                        disabled={isSending || completionPercentage < 100}
                        className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center
                            ${completionPercentage < 100 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300' 
                                : isSending 
                                    ? 'bg-slate-800 text-white cursor-wait' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 active:scale-95'
                            }
                        `}
                    >
                        {isSending ? (
                            <>
                                <Loader2 size={16} className="mr-3 animate-spin" /> PROCESANDO...
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-3" /> 
                                {completionPercentage < 100 ? `COMPLETAR (${completionPercentage}%)` : 'CERTIFICAR INSPECCIÓN'}
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
      </div>

      {/* --- PRINT ONLY LAYOUT (UNCHANGED BUT DATA CONNECTED) --- */}
      <div className="hidden print:block bg-white p-8 w-full max-w-none">
         {currentInspection && (
           <div className="space-y-6">
              <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4">
                 <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">{appName}</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Reporte de Control Móvil</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase">Fecha Inspección</p>
                    <p className="text-lg font-mono font-bold">{new Date(currentInspection.timestamp).toLocaleString()}</p>
                 </div>
              </div>

              {currentConfig.logo && (
                 <img src={currentConfig.logo} alt="Logo" className="absolute top-8 right-1/2 translate-x-1/2 h-12 opacity-20" />
              )}

              <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vehículo</p>
                    <p className="text-xl font-black text-slate-900">{currentInspection.plate}</p>
                    <p className="text-sm font-medium text-slate-600">{currentInspection.driver}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estado General</p>
                    <span className="text-lg font-bold px-3 py-1 bg-slate-100 rounded border border-slate-200 inline-block">
                       {currentInspection.status}
                    </span>
                 </div>
              </div>

              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Evidencia Fotográfica Completa</p>
                 <div className="grid grid-cols-4 gap-4">
                    {Object.entries(currentInspection.photos).map(([key, url]) => (
                       <div key={key} className="border border-slate-200 rounded p-1">
                          <div className="aspect-[4/3] bg-slate-50 overflow-hidden mb-1 relative">
                             <img src={url} className="absolute inset-0 w-full h-full object-cover" />
                          </div>
                          <p className="text-[9px] font-bold text-center uppercase text-slate-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Observaciones</p>
                 <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 min-h-[80px]">
                    {currentInspection.details}
                 </div>
              </div>

              <div className="mt-12 text-[10px] text-slate-400 font-mono text-center pt-4 border-t border-slate-100">
                 <p>INSPECTOR: {currentInspection.user.toUpperCase()}</p>
                 <p>ID REPORTE: {currentInspection.id}</p>
                 <p>COPIA DIGITAL ENVIADA A: info@logisnova.cl | +56920789535</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};
