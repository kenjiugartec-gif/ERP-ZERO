
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Camera, CheckCircle2, ChevronDown, Save, 
  RefreshCcw, Info, Terminal, ShieldCheck, 
  Smartphone, AlertCircle, Loader2, X, Trash2,
  FileText
} from 'lucide-react';
import { MobileInspection } from '../types';

export const MobileControlView: React.FC = () => {
  const { user, vehicles, addMobileInspection } = useApp();
  
  const [selectedPlate, setSelectedPlate] = useState('');
  const [status, setStatus] = useState<'LIMPIO' | 'PRESENTABLE' | 'SUCIO' | ''>('');
  const [details, setDetails] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const PHOTO_SLOTS = [
    { key: 'frontal', label: 'FRONTAL' },
    { key: 'trasera', label: 'TRASERA' },
    { key: 'latIzq', label: 'LATERAL IZQ.' },
    { key: 'latDer', label: 'LATERAL DER.' },
    { key: 'interiorDelantero', label: 'INTERIOR (PILOTO)' },
    { key: 'interiorTrasero', label: 'INTERIOR (TRASEROS)' },
    { key: 'pickup', label: 'PICKUP / CARGA' },
  ];

  const [photos, setPhotos] = useState<Record<string, string>>({
    frontal: '', trasera: '', latIzq: '', latDer: '', interiorDelantero: '', interiorTrasero: '', pickup: ''
  });

  const localVehicles = useMemo(() => {
    return vehicles.filter(v => v.location === user?.location);
  }, [vehicles, user]);

  const completionPercentage = useMemo(() => {
      let totalFields = 2 + PHOTO_SLOTS.length; // Plate + Status + 7 Photos
      let filledFields = 0;
      if (selectedPlate) filledFields++;
      if (status) filledFields++;
      PHOTO_SLOTS.forEach(slot => {
          if (photos[slot.key]) filledFields++;
      });
      return Math.round((filledFields / totalFields) * 100);
  }, [selectedPlate, status, photos]);

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

  const removePhoto = (key: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (confirm(`¿Confirmar eliminación de registro visual: ${key.toUpperCase()}?`)) {
        setPhotos(prev => ({ ...prev, [key]: '' }));
    }
  };

  const triggerCamera = (key: string) => {
    fileInputRefs.current[key]?.click();
  };

  const handleSave = () => {
    if (completionPercentage < 100) {
      alert("PROTOCOL_ERROR: Todos los registros fotográficos y la selección de unidad son obligatorios.");
      return;
    }

    setIsSending(true);
    const vehicle = localVehicles.find(v => v.plate === selectedPlate);

    const newInspection: MobileInspection = {
      id: Date.now().toString(),
      plate: selectedPlate,
      driver: vehicle?.driver || 'Desconocido',
      status: status as any,
      photos: { ...photos } as any,
      details,
      timestamp: new Date().toISOString(),
      location: user?.location || 'Central',
      user: user?.name || 'Usuario'
    };

    // Simulate transmission to technical node
    setTimeout(() => {
      addMobileInspection(newInspection);
      alert("SISTEMA: Certificación de integridad finalizada. Datos transmitidos.");
      setPhotos({ frontal: '', trasera: '', latIzq: '', latDer: '', interiorDelantero: '', interiorTrasero: '', pickup: '' });
      setSelectedPlate('');
      setStatus('');
      setDetails('');
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F8FAFC] font-sans w-full pb-32">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* PANEL DIDÁCTICO INDUSTRIAL */}
        <div className="bg-[#0B1120] rounded-2xl p-6 text-white shadow-2xl border-l-8 border-[#00AEEF] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-white pointer-events-none">
                <ShieldCheck size={80} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center space-x-3 text-[#00AEEF] mb-3">
                    <Terminal size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocolo de Inspección Visual V2.5</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-3">Manual de Integridad Operativa</h2>
                <p className="text-slate-400 text-xs leading-relaxed font-mono max-w-4xl">
                    <span className="text-white font-bold">[INSTRUCCIÓN]</span> El sistema requiere el 100% de la evidencia visual para liberar la unidad. 
                    Las notas de campo son <span className="text-emerald-400">opcionales</span> y no bloquean el despacho.
                    Utilice la cámara trasera para capturar detalles técnicos.
                </p>
            </div>
        </div>

        {/* SELECTORES TÉCNICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Unidad de Transporte</label>
                <div className="relative">
                    <select 
                        value={selectedPlate} 
                        onChange={e => setSelectedPlate(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-800 outline-none focus:border-blue-500 appearance-none transition-all cursor-pointer uppercase"
                    >
                        <option value="">-- SELECCIONE PPU --</option>
                        {localVehicles.map(v => (
                            <option key={v.plate} value={v.plate}>{v.plate} | {v.driver.toUpperCase()}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Calificación de Estado</label>
                <div className="grid grid-cols-3 gap-3">
                    {['LIMPIO', 'PRESENTABLE', 'SUCIO'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setStatus(st as any)}
                            className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                status === st 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                            }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* CUADRÍCULA DE REGISTRO FOTOGRÁFICO */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Evidencia Certificada</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Captura obligatoria de 7 puntos de control técnico</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integridad:</span>
                    <span className={`text-sm font-black ${completionPercentage === 100 ? 'text-emerald-500' : 'text-blue-600'}`}>{completionPercentage}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PHOTO_SLOTS.map((slot) => {
                    const isFilled = !!photos[slot.key];
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
                                className={`group relative aspect-[1.4/1] bg-white rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                                    isFilled 
                                    ? 'border-blue-500 shadow-xl ring-4 ring-blue-50' 
                                    : 'border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                                }`}
                            >
                                {isFilled ? (
                                    <>
                                        <img src={photos[slot.key]} className="w-full h-full object-cover" alt={slot.label} />
                                        <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm space-y-3">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); triggerCamera(slot.key); }}
                                                className="bg-white text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase flex items-center shadow-lg active:scale-95"
                                            >
                                                <RefreshCcw size={14} className="mr-2" /> Recapturar
                                            </button>
                                            <button 
                                                onClick={(e) => removePhoto(slot.key, e)}
                                                className="bg-red-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase flex items-center shadow-lg active:scale-95"
                                            >
                                                <Trash2 size={14} className="mr-2" /> Eliminar
                                            </button>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg z-20">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-slate-200 z-20 shadow-sm">
                                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">{slot.label}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center space-y-4 px-4">
                                        <div className="w-16 h-16 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                            <Camera size={28} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight group-hover:text-blue-500 transition-colors">
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

        {/* NOTAS DE CAMPO - OPCIONAL */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-50 pb-4">
                <FileText size={18} className="text-blue-600" />
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">Notas de Campo</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Observaciones técnicas adicionales <span className="text-emerald-500">(Opcional)</span></p>
                </div>
            </div>
            <textarea 
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="REGISTRE CUALQUIER ANOMALÍA O COMENTARIO TÉCNICO AQUÍ..."
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 h-32 resize-none uppercase transition-all shadow-inner"
            />
        </div>

        {/* ACCIÓN FINAL */}
        <div className="flex justify-end pb-20">
            <button 
                onClick={handleSave}
                disabled={isSending || completionPercentage < 100}
                className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center
                    ${completionPercentage < 100 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : isSending 
                            ? 'bg-slate-900 text-white cursor-wait' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/40 active:scale-95'
                    }
                `}
            >
                {isSending ? (
                    <>
                        <Loader2 size={18} className="mr-3 animate-spin" /> TRANSMITIENDO...
                    </>
                ) : (
                    <>
                        <Save size={20} className="mr-3" /> CERTIFICAR PROTOCOLO
                    </>
                )}
            </button>
        </div>

      </div>
    </div>
  );
};
