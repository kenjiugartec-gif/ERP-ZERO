
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { CAR_BRANDS, CAR_MODELS, CHILE_GEO_DATA } from '../constants';
import { Vehicle, ASSET_TYPES, SUPPLY_TYPES } from '../types';
import { 
  Plus, Trash2, AlertCircle, FileText, Send, 
  Eraser, Save, Calendar, Clock, 
  MapPin, Package, Hash, Calculator, Truck, User as UserIcon,
  Camera, X, Image as ImageIcon, CheckCircle2, ClipboardList, 
  Car, Info, Globe, ChevronDown, UserCheck, Map, ClipboardCheck, Box,
  Edit, Pencil, List, Eye, Download, Printer, ArrowLeft,
  Search, Filter, Wrench, Activity, Fuel, Gauge, Layers, Terminal,
  UserPlus, Navigation, RefreshCcw, MoreHorizontal
} from 'lucide-react';

const inputBaseClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300 placeholder:font-normal";
const labelClass = "flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1 mb-2.5";

// --- CUSTOM SELECT COMPONENT ---
interface FormSelectProps {
  value: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({ value, options, placeholder = "Seleccionar...", onChange, disabled = false, icon, className }) => {
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
  const baseClasses = className || "w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-bold";

  return (
    <div className={`relative ${disabled ? 'opacity-60' : ''}`} ref={containerRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`${baseClasses} flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'bg-white ring-4 ring-blue-500/5 border-blue-500 shadow-sm' : ''} ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
      >
        <span className={`${!value ? 'text-slate-400 font-normal' : 'font-bold truncate'}`}>
          {value ? selectedLabel : placeholder}
        </span>
        <div className="flex items-center">
            {icon && <span className="mr-2 text-slate-400">{icon}</span>}
            {!disabled && <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />}
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-[110%] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`px-4 py-3 text-xs font-bold cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${value === option.value ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0"/>}
            </div>
          ))}
          {options.length === 0 && (
              <div className="px-4 py-3 text-xs text-slate-400 italic font-medium">Sin opciones disponibles</div>
          )}
        </div>
      )}
    </div>
  );
};

export const ReceptionView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans w-full flex items-center justify-center">
      <div className="text-center space-y-4 opacity-40">
        <ClipboardCheck size={64} className="mx-auto text-slate-300" />
        <p className="text-xs font-black uppercase tracking-[0.3em]">Modulo de Recepción en Mantenimiento</p>
      </div>
    </div>
  );
};

export const DispatchView: React.FC = () => {
  const { user, vehicles, emplacements } = useApp();
  
  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    emplacement: user?.location || '',
    origin: '',
    destination: '',
    material: '',
    quantity: '',
    reason: '',
    responsible: user?.name || '',
    receiverName: '',
    plate: '',
    receiverRut: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const localVehicles = useMemo(() => {
    return vehicles.filter(v => v.location === user?.location);
  }, [vehicles, user]);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos([...photos, event.target.result as string]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    alert("Protocolo de Despacho Certificado. Generando Guía de Salida...");
    // Logic to persist dispatch record would go here
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans w-full">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* HEADER TÉCNICO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
           <div className="flex items-center space-x-5">
               <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl">
                  <Truck size={28} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Despacho de Activos</h2>
                  <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] mt-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    SISTEMA DE SALIDA AUTORIZADA
                  </p>
               </div>
           </div>
           <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
               <div className="text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Responsable de Nodo</p>
                   <p className="text-xs font-black text-slate-800 uppercase">{user?.name}</p>
               </div>
               <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
               <Calendar size={18} className="text-blue-500" />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COL 1: FLUJO LOGÍSTICO */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
                <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                    <Navigation size={18} className="text-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest">01. Ruta Logística</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Nodo Operativo (Emplazamiento)</label>
                        <FormSelect 
                            value={formData.emplacement}
                            onChange={v => setFormData({...formData, emplacement: v})}
                            options={emplacements.map(e => ({ label: e, value: e }))}
                            disabled={user?.role !== 'ADMIN'}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Punto de Origen</label>
                        <input 
                            className={inputBaseClass}
                            value={formData.origin}
                            onChange={e => setFormData({...formData, origin: e.target.value})}
                            placeholder="EJ: BODEGA CENTRAL SECTOR A"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Destino Final / Cliente</label>
                        <input 
                            className={inputBaseClass}
                            value={formData.destination}
                            onChange={e => setFormData({...formData, destination: e.target.value})}
                            placeholder="EJ: CLIENTE SANTIAGO ORIENTE"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Motivo del Movimiento</label>
                        <FormSelect 
                            value={formData.reason}
                            onChange={v => setFormData({...formData, reason: v})}
                            options={[
                                { label: 'ENTREGA A CLIENTE', value: 'CLIENTE' },
                                { label: 'TRASLADO ENTRE SUCURSALES', value: 'SUCURSAL' },
                                { label: 'RETIRO POR MANTENIMIENTO', value: 'MANTENCION' },
                                { label: 'OTRO MOTIVO', value: 'OTRO' }
                            ]}
                            placeholder="SELECCIONAR CAUSA..."
                        />
                    </div>
                </div>
            </div>

            {/* COL 2: DETALLE DE CARGA */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
                <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                    <Box size={18} className="text-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest">02. Especificación de Carga</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Material / Equipo</label>
                        <FormSelect 
                            value={formData.material}
                            onChange={v => setFormData({...formData, material: v})}
                            options={[
                                ...ASSET_TYPES.map(a => ({ label: `ACTIVO: ${a}`, value: a })),
                                ...SUPPLY_TYPES.map(s => ({ label: `INSUMO: ${s}`, value: s }))
                            ]}
                            placeholder="BUSCAR ITEM EN CATÁLOGO..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Cantidad</label>
                            <input 
                                type="number"
                                className={inputBaseClass}
                                value={formData.quantity}
                                onChange={e => setFormData({...formData, quantity: e.target.value})}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Unidad de Medida</label>
                            <div className="p-4 bg-slate-100 rounded-xl text-xs font-black text-slate-400 text-center uppercase tracking-widest">
                                UNIDADES
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white border-l-4 border-blue-500 shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <Terminal size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Protocolo de Integridad</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                            Verifique que la cantidad física coincida con el despacho digital antes de autorizar la salida del recinto.
                        </p>
                    </div>

                    <div className="pt-4">
                        <label className={labelClass}>Observaciones Técnicas</label>
                        <textarea 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 h-24 resize-none uppercase"
                            placeholder="NOTAS ADICIONALES DE DESPACHO..."
                        />
                    </div>
                </div>
            </div>

            {/* COL 3: RECEPTOR Y EVIDENCIA */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
                <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-5">
                    <UserCheck size={18} className="text-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest">03. Certificación de Recepción</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Patente del Vehículo (PPU)</label>
                        <FormSelect 
                            value={formData.plate}
                            onChange={v => setFormData({...formData, plate: v})}
                            options={localVehicles.map(veh => ({ label: veh.plate, value: veh.plate }))}
                            placeholder="SELECCIONAR MÓVIL..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Nombre del Receptor / Chofer</label>
                        <input 
                            className={inputBaseClass}
                            value={formData.receiverName}
                            onChange={e => setFormData({...formData, receiverName: e.target.value})}
                            placeholder="EJ: JUAN PEREZ"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>RUT del Receptor</label>
                        <input 
                            className={inputBaseClass}
                            value={formData.receiverRut}
                            onChange={e => setFormData({...formData, receiverRut: e.target.value})}
                            placeholder="12.345.678-9"
                        />
                    </div>

                    <div className="pt-2">
                        <label className={labelClass}>Evidencia Fotográfica de Carga</label>
                        <div className="grid grid-cols-2 gap-3">
                            {photos.map((p, idx) => (
                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group shadow-md border border-slate-200">
                                    <img src={p} className="w-full h-full object-cover" />
                                    <button onClick={() => removePhoto(idx)} className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {photos.length < 4 && (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                                >
                                    <Camera size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Capturar</span>
                                    <input type="file" ref={fileInputRef} onChange={handlePhotoCapture} accept="image/*" capture="environment" className="hidden" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <button 
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center"
                    >
                        <Send size={18} className="mr-3" />
                        Certificar Despacho
                    </button>
                </div>
            </div>
        </div>

        {/* TOOLBAR INFERIOR */}
        <div className="bg-slate-900 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white shadow-2xl">
            <div className="flex items-center space-x-6">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Estado del Protocolo</span>
                    <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-tighter">Terminal Ready</span>
                    </div>
                </div>
                <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nivel de Seguridad</span>
                    <span className="text-xs font-black uppercase tracking-tighter text-blue-400">Encriptación AES-256</span>
                </div>
            </div>
            <div className="flex space-x-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Reiniciar Formulario
                </button>
                <button className="flex-1 md:flex-none px-6 py-3 bg-white text-slate-900 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center">
                    <Printer size={16} className="mr-2" /> Imprimir Ticket
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export const FleetView: React.FC = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, user, users, emplacements } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track editing state
  const [originalPlate, setOriginalPlate] = useState<string | null>(null);

  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
     brand: '', 
     model: '',
     year: new Date().getFullYear(),
     km: 0,
     location: '',
     plate: '',
     driver: '',
     commune: '',
     type: 'Camioneta',
     status: 'AVAILABLE'
  });

  const [selectedRegion, setSelectedRegion] = useState('');

  const userRegion = useMemo(() => {
      if (user?.role === 'ADMIN') return null;
      if (!user?.commune) return null;
      const found = CHILE_GEO_DATA.find(r => r.communes.includes(user.commune!));
      return found ? found.region : null;
  }, [user]);

  const availableRegions = useMemo(() => {
      if (user?.role === 'ADMIN') return CHILE_GEO_DATA.map(r => r.region);
      return userRegion ? [userRegion] : CHILE_GEO_DATA.map(r => r.region);
  }, [user?.role, userRegion]);

  const availableEmplacements = useMemo(() => {
      if (user?.role === 'ADMIN') return emplacements;
      return user?.location ? [user.location] : [];
  }, [user, emplacements]);

  const communes = useMemo(() => {
      if (selectedRegion) {
          const regionData = CHILE_GEO_DATA.find(r => r.region === selectedRegion);
          if (user?.role !== 'ADMIN' && user?.commune) {
              return [{ label: user.commune, value: user.commune }];
          }
          return regionData ? regionData.communes.map(c => ({ label: c, value: c })) : [];
      }
      return [];
  }, [selectedRegion, user]);

  useEffect(() => {
      if (isModalOpen && user?.role !== 'ADMIN' && !originalPlate) {
          if (user?.location) setNewVehicle(prev => ({ ...prev, location: user.location }));
          if (userRegion) setSelectedRegion(userRegion);
          if (user?.commune) setNewVehicle(prev => ({ ...prev, commune: user.commune }));
      }
  }, [isModalOpen, user, userRegion, originalPlate]);

  const localVehicles = useMemo(() => {
    return vehicles.filter(v => v.location === user?.location && (v.plate.includes(searchTerm.toUpperCase()) || v.driver.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [vehicles, user, searchTerm]);

  const availableDrivers = useMemo(() => users.filter(u => u.role === 'DRIVER' || u.role === 'ADMIN'), [users]);

  const availableModels = useMemo(() => {
      if (!newVehicle.brand) return [];
      return (CAR_MODELS as Record<string, string[]>)[newVehicle.brand] || [];
  }, [newVehicle.brand]);

  const handleEdit = (vehicle: Vehicle) => {
      setNewVehicle({...vehicle});
      setOriginalPlate(vehicle.plate);
      
      if (vehicle.commune) {
          const regionData = CHILE_GEO_DATA.find(r => r.communes.includes(vehicle.commune));
          if (regionData) setSelectedRegion(regionData.region);
      }
      
      setIsModalOpen(true);
  };

  const handleDelete = (plate: string) => {
      if (confirm(`¿Está seguro de eliminar el vehículo ${plate}? Esta acción no se puede deshacer.`)) {
          deleteVehicle(plate);
      }
  };

  const handleSave = () => {
      if(newVehicle.plate && newVehicle.brand && newVehicle.model && newVehicle.location) {
          const upperPlate = newVehicle.plate.toUpperCase();
          
          if (originalPlate) {
              // EDIT MODE
              updateVehicle(originalPlate, { ...newVehicle, plate: upperPlate } as Vehicle);
          } else {
              // CREATE MODE
              if (vehicles.some(v => v.plate === upperPlate)) {
                  alert("La patente ya existe en el sistema.");
                  return;
              }
              addVehicle({ ...newVehicle, plate: upperPlate } as Vehicle);
          }
          
          closeModal();
      } else {
          alert("Por favor complete los campos obligatorios.");
      }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setNewVehicle({ brand: '', model: '', year: new Date().getFullYear(), location: '', plate: '', driver: '', commune: '', type: 'Camioneta', status: 'AVAILABLE' });
      setOriginalPlate(null);
      setSelectedRegion('');
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center space-x-5 w-full">
          <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
              <Icon size={24} className={color.replace('bg-', 'text-')} />
          </div>
          <div>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{label}</p>
              <p className="text-3xl font-black text-slate-800 leading-none mt-1">{value}</p>
          </div>
      </div>
  );

  return (
     <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans w-full">
       <div className="w-full space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
             <StatCard label="Total Flota" value={localVehicles.length} icon={Car} color="bg-blue-600" />
             <StatCard label="Operativos" value={localVehicles.filter(v => v.status === 'AVAILABLE').length} icon={Activity} color="bg-emerald-500" />
             <StatCard label="Mantenimiento" value={localVehicles.filter(v => v.status === 'MAINTENANCE').length} icon={Wrench} color="bg-amber-500" />
             <StatCard label="Rendimiento" value="12 km/L" icon={Fuel} color="bg-indigo-500" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm w-full">
             <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="BUSCAR PATENTE O OPERADOR..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all uppercase"
                 />
             </div>
             <button onClick={() => { setOriginalPlate(null); setIsModalOpen(true); }} className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                <Plus size={18} className="mr-2" /> Registrar Unidad
             </button>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-200 w-full">
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white uppercase font-black text-[10px] tracking-widest">
                       <tr>
                          <th className="px-8 py-5">UNIDAD (PPU)</th>
                          <th className="px-8 py-5">FICHA TÉCNICA</th>
                          <th className="px-8 py-5">OPERADOR ASIGNADO</th>
                          <th className="px-8 py-5">ESTADO</th>
                          <th className="px-8 py-5 text-center">KM</th>
                          <th className="px-8 py-5 text-right">ACCIONES</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                       {localVehicles.map(v => (
                          <tr key={v.plate} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-8 py-5">
                                <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-mono font-black text-sm tracking-widest">{v.plate}</span>
                             </td>
                             <td className="px-8 py-5">
                                <div className="font-black text-slate-900 text-xs">{v.brand} {v.model}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{v.type} • {v.year}</div>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center text-xs font-bold text-slate-700">
                                   <UserIcon size={14} className="mr-2 text-blue-500" />
                                   {v.driver || 'SIN ASIGNAR'}
                                </div>
                                <div className="flex items-center text-[10px] text-slate-400 font-bold mt-1">
                                   <MapPin size={12} className="mr-1.5"/> {v.commune}
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${v.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                   <div className={`w-1.5 h-1.5 rounded-full mr-2 ${v.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                   {v.status === 'AVAILABLE' ? 'Operativo' : 'En Taller'}
                                </span>
                             </td>
                             <td className="px-8 py-5 text-center font-mono font-bold text-slate-600">
                                {v.km.toLocaleString()}
                             </td>
                             <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                   <button 
                                      onClick={() => handleEdit(v)}
                                      className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-[10px] font-bold uppercase tracking-wider"
                                      title="Editar Ficha"
                                   >
                                      <Pencil size={12} className="mr-1.5"/> Editar
                                   </button>
                                   <button 
                                      onClick={() => handleDelete(v.plate)}
                                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                      title="Dar de Baja"
                                   >
                                      <Trash2 size={16}/>
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                       {localVehicles.length === 0 && (
                           <tr>
                               <td colSpan={6} className="px-8 py-8 text-center text-slate-400 italic text-xs">No hay unidades registradas en este nodo.</td>
                           </tr>
                       )}
                    </tbody>
                 </table>
             </div>
          </div>
       </div>

       {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-[5px] animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                 <div className="flex justify-between items-start p-8 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-600 p-3 rounded-2xl text-white">
                            <Car size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{originalPlate ? 'Editar Unidad' : 'Alta de Unidad'}</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">VINCULACIÓN A FLOTA CORPORATIVA</p>
                        </div>
                    </div>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-50 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                 <div className="p-8 space-y-8 bg-slate-50/50 overflow-y-auto">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] border-b border-slate-100 pb-4 mb-8 flex items-center">
                            <Wrench size={14} className="mr-2 text-blue-500" /> ESPECIFICACIONES TÉCNICAS
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClass}>Patente (PPU)</label>
                                <input placeholder="ABCD-12" value={newVehicle.plate} onChange={e => setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()})} className={`${inputBaseClass} tracking-widest font-black uppercase`} />
                            </div>
                            <div>
                                <label className={labelClass}>Año Fabricación</label>
                                <input type="number" placeholder="2024" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})} className={inputBaseClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Marca</label>
                                <FormSelect value={newVehicle.brand || ''} onChange={(val) => setNewVehicle({...newVehicle, brand: val, model: ''})} options={CAR_BRANDS.map(brand => ({ label: brand, value: brand }))} placeholder="SELECCIONAR..." />
                            </div>
                            <div>
                                <label className={labelClass}>Modelo</label>
                                <FormSelect value={newVehicle.model || ''} onChange={(val) => setNewVehicle({...newVehicle, model: val})} options={availableModels.map(model => ({ label: model, value: model }))} placeholder={newVehicle.brand ? "SELECCIONAR..." : "ELIJA MARCA..."} disabled={!newVehicle.brand} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] border-b border-slate-100 pb-4 mb-8 flex items-center">
                            <MapPin size={14} className="mr-2 text-blue-500" /> UBICACIÓN Y ASIGNACIÓN
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClass}>Tipo de Vehículo</label>
                                <FormSelect value={newVehicle.type || 'Camioneta'} onChange={(val) => setNewVehicle({...newVehicle, type: val})} options={[{ label: 'CAMIONETA', value: 'Camioneta' }, { label: 'CAMIÓN 3/4', value: 'Camión 3/4' }, { label: 'FURGÓN', value: 'Furgón' }, { label: 'AUTOMÓVIL', value: 'Automóvil' }]} />
                            </div>
                            <div>
                                <label className={labelClass}>Emplazamiento (Base)</label>
                                <FormSelect value={newVehicle.location || ''} onChange={(val) => setNewVehicle({...newVehicle, location: val})} options={availableEmplacements.map(e => ({ label: e, value: e }))} placeholder={user?.role === 'ADMIN' ? "SELECCIONAR..." : `BASE: ${user?.location}`} disabled={user?.role !== 'ADMIN'} />
                            </div>
                            <div>
                                <label className={labelClass}>Región Operativa</label>
                                <FormSelect value={selectedRegion} onChange={(val) => { setSelectedRegion(val); if(user?.role==='ADMIN') setNewVehicle({...newVehicle, commune: ''}); }} options={availableRegions.map(r => ({ label: r, value: r }))} placeholder="FILTRAR..." disabled={user?.role !== 'ADMIN'} />
                            </div>
                            <div>
                                <label className={labelClass}>Comuna Jurisdiccional</label>
                                <FormSelect value={newVehicle.commune || ''} onChange={(val) => setNewVehicle({...newVehicle, commune: val})} options={communes.map(c => ({ label: c.label, value: c.value }))} placeholder="SELECCIONAR..." disabled={user?.role !== 'ADMIN' && !!user?.commune} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Conductor Certificado</label>
                                <FormSelect value={newVehicle.driver || ''} onChange={(val) => setNewVehicle({...newVehicle, driver: val})} options={[{ label: 'SIN ASIGNAR', value: '' }, ...availableDrivers.map(u => ({ label: `${u.name.toUpperCase()} (${u.rut})`, value: u.name }))]} placeholder="BUSCAR OPERADOR..." />
                            </div>
                        </div>
                    </div>
                 </div>
                <div className="p-8 border-t border-slate-100 bg-white flex justify-end items-center space-x-5 sticky bottom-0 z-10">
                    <button onClick={closeModal} className="px-10 py-4 border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Cancelar Operación</button>
                    <button onClick={handleSave} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black shadow-xl shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest flex items-center"><Save size={18} className="mr-2" /> {originalPlate ? 'Guardar Cambios' : 'Certificar Registro'}</button>
                </div>
             </div>
          </div>
       )}
     </div>
  );
};
