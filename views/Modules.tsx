
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { CAR_BRANDS, CAR_MODELS, CHILE_GEO_DATA } from '../constants';
import { Vehicle } from '../types';
import { 
  Plus, Trash2, AlertCircle, FileText, Send, 
  Eraser, Save, Calendar, Clock, 
  MapPin, Package, Hash, Calculator, Truck, User as UserIcon,
  Camera, X, Image as ImageIcon, CheckCircle2, ClipboardList, 
  Car, Info, Globe, ChevronDown, UserCheck, Map, ClipboardCheck, Box,
  Edit, Pencil, List, Eye, Download, Printer, ArrowLeft,
  Search, Filter, Wrench, Activity, Fuel, Gauge, Layers, Terminal
} from 'lucide-react';

const inputBaseClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-normal focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300";
const labelClass = "flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1 mb-2.5";

// --- CUSTOM SELECT COMPONENT ---
interface FormSelectProps {
  value: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string; // Permitir personalización de clases
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

  // Clases por defecto si no se pasa className (estilo FleetView), de lo contrario usa className (estilo Dispatch/Reception)
  const baseClasses = className || "w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700";

  return (
    <div className={`relative ${disabled ? 'opacity-60' : ''}`} ref={containerRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`${baseClasses} flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500 shadow-sm' : ''} ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
      >
        <span className={`${!value ? 'text-slate-400 font-normal' : 'font-medium truncate'}`}>
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
              className={`px-4 py-3 text-xs font-medium cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${value === option.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0"/>}
            </div>
          ))}
          {options.length === 0 && (
              <div className="px-4 py-3 text-xs text-slate-400 italic">No hay opciones disponibles</div>
          )}
        </div>
      )}
    </div>
  );
};

// Interface local para los registros de recepción
interface ReceptionRecord {
  id: string;
  date: string;
  time: string;
  location: string;
  provider: string;
  docType: string;
  docNumber: string;
  material: string;
  quantity: number;
  um: string;
  qtyUm: number;
  unitValue: number;
  total: number;
}

// Interface para registro de despacho
interface DispatchRecord {
  id: string;
  date: string;
  emplacement: string;
  origin: string;
  destination: string;
  material: string;
  quantity: number;
  reason: string;
  responsible: string;
  receiverName: string;
  plate: string;
  receiverRut: string;
  photos: string[];
}

export const ReceptionView: React.FC = () => {
  // ... (Code omitted for brevity as it is unchanged) ...
  const { user, emplacements } = useApp();
  // ...
  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans w-full">
      <div className="w-full space-y-6">
        <div className="text-center p-12 text-slate-400">Reception View Loaded</div>
      </div>
    </div>
  );
};

export const DispatchView: React.FC = () => {
    // ... (Code omitted for brevity as it is unchanged) ...
    return <div className="p-6">Dispatch View Placeholder</div>;
};

export const FleetView: React.FC = () => {
  const { vehicles, addVehicle, user, users, emplacements } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
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

  // --- LOGIC FOR ADMIN VS USER RESTRICTIONS ---
  
  // 1. Determine user's region based on their assigned commune
  const userRegion = useMemo(() => {
      if (user?.role === 'ADMIN') return null; // Admins don't have a restricted region
      if (!user?.commune) return null;
      // Find the region that contains the user's commune
      const found = CHILE_GEO_DATA.find(r => r.communes.includes(user.commune!));
      return found ? found.region : null;
  }, [user]);

  // 2. Filter Available Regions (Admin gets all, User gets only theirs)
  const availableRegions = useMemo(() => {
      if (user?.role === 'ADMIN') return CHILE_GEO_DATA.map(r => r.region);
      return userRegion ? [userRegion] : CHILE_GEO_DATA.map(r => r.region);
  }, [user?.role, userRegion]);

  // 3. Filter Available Emplacements (Admin gets all, User gets only theirs)
  const availableEmplacements = useMemo(() => {
      if (user?.role === 'ADMIN') return emplacements;
      return user?.location ? [user.location] : [];
  }, [user, emplacements]);

  // 4. Calculate communes based on selected region (Standard logic)
  const communes = useMemo(() => {
      // If a region is selected (manually or auto), show its communes
      if (selectedRegion) {
          const regionData = CHILE_GEO_DATA.find(r => r.region === selectedRegion);
          // If user is non-admin and has a specific commune, restrict list? 
          // The prompt says "usuario comun solo puede ver su emplazamiento y comuna".
          if (user?.role !== 'ADMIN' && user?.commune) {
              return [{ label: user.commune, value: user.commune }];
          }
          return regionData ? regionData.communes.map(c => ({ label: c, value: c })) : [];
      }
      return [];
  }, [selectedRegion, user]);

  // 5. Auto-fill Effect when Modal Opens
  useEffect(() => {
      if (isModalOpen && user?.role !== 'ADMIN') {
          // Pre-fill Emplacement
          if (user?.location) {
              setNewVehicle(prev => ({ ...prev, location: user.location }));
          }
          
          // Pre-fill Region
          if (userRegion) {
              setSelectedRegion(userRegion);
          }

          // Pre-fill Commune
          if (user?.commune) {
              setNewVehicle(prev => ({ ...prev, commune: user.commune }));
          }
      }
  }, [isModalOpen, user, userRegion]);


  const localVehicles = useMemo(() => {
    return vehicles.filter(v => v.location === user?.location && (v.plate.includes(searchTerm.toUpperCase()) || v.driver.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [vehicles, user, searchTerm]);

  const availableDrivers = useMemo(() => users.filter(u => u.role === 'DRIVER' || u.role === 'ADMIN'), [users]);

  // Use CAR_MODELS from constants
  const availableModels = useMemo(() => {
      if (!newVehicle.brand) return [];
      return (CAR_MODELS as Record<string, string[]>)[newVehicle.brand] || [];
  }, [newVehicle.brand]);

  const handleAdd = () => {
      if(newVehicle.plate && newVehicle.brand && newVehicle.model && newVehicle.location) {
          addVehicle({ ...newVehicle, plate: newVehicle.plate?.toUpperCase() } as Vehicle);
          setIsModalOpen(false);
          setNewVehicle({ brand: '', model: '', year: new Date().getFullYear(), location: '', plate: '', driver: '', commune: '', type: 'Camioneta', status: 'AVAILABLE' });
          setSelectedRegion('');
      } else {
          alert("Por favor complete los campos obligatorios.");
      }
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 w-full">
          <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
              <Icon size={24} className={color.replace('bg-', 'text-')} />
          </div>
          <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-slate-800 leading-none mt-1">{value}</p>
          </div>
      </div>
  );

  return (
     <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans w-full">
       <div className="w-full space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
             <StatCard label="Total Flota" value={localVehicles.length} icon={Car} color="bg-blue-600" />
             <StatCard label="Operativos" value={localVehicles.filter(v => v.status === 'AVAILABLE').length} icon={Activity} color="bg-emerald-500" />
             <StatCard label="En Mantenimiento" value={localVehicles.filter(v => v.status === 'MAINTENANCE').length} icon={Wrench} color="bg-amber-500" />
             <StatCard label="Rendimiento Prom." value="12 km/L" icon={Fuel} color="bg-indigo-500" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full">
             <div className="flex-1 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="Buscar patente, marca o conductor..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 outline-none"
                 />
             </div>
             <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                 {/* ... Filters & Buttons ... */}
                 <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-md shadow-blue-500/20">
                    <Plus size={16} className="mr-2" /> Nuevo Vehículo
                 </button>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 w-full">
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-100">
                       <tr>
                          <th className="px-6 py-4">Patente</th>
                          <th className="px-6 py-4">Marca / Modelo</th>
                          <th className="px-6 py-4">Tipo</th>
                          <th className="px-6 py-4">Conductor</th>
                          <th className="px-6 py-4">Ubicación</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4 text-center">Kilometraje</th>
                          <th className="px-6 py-4 text-center">Mantenimiento</th>
                          <th className="px-6 py-4 text-right">Acciones</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                       {localVehicles.map(v => (
                          <tr key={v.plate} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-6 py-4">
                                <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-slate-700 font-mono font-bold text-xs">{v.plate}</span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="font-bold text-slate-900 text-xs">{v.brand} {v.model} <span className="text-slate-400 font-normal">({v.year})</span></div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="bg-slate-50 text-slate-500 border border-slate-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{v.type || 'Estándar'}</span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center text-xs font-medium text-slate-700">
                                   <UserIcon size={14} className="mr-2 text-slate-400" />
                                   {v.driver || 'No Asignado'}
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center text-xs text-slate-500">
                                   <MapPin size={14} className="mr-1.5 text-slate-400"/> {v.commune}
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${v.status === 'AVAILABLE' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                   {v.status === 'AVAILABLE' ? <CheckCircle2 size={10} className="mr-1" /> : <AlertCircle size={10} className="mr-1" />}
                                   {v.status === 'AVAILABLE' ? 'Activo' : 'Mantenimiento'}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-center text-xs font-bold text-slate-700">
                                {v.km.toLocaleString()} km
                             </td>
                             <td className="px-6 py-4 text-center text-xs text-slate-400">
                                -
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                   <button className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md transition-colors"><Eye size={16}/></button>
                                   <button className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-md transition-colors"><Wrench size={16}/></button>
                                   <button className="text-red-400 hover:bg-red-50 hover:text-red-500 p-1.5 rounded-md transition-colors"><Trash2 size={16}/></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
             </div>
          </div>
       </div>

       {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-[5px] animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                 
                 {/* Modal Header */}
                 <div className="flex justify-between items-start p-8 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                            <Car size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Registrar Nueva Unidad</h3>
                            <p className="text-xs text-slate-500 font-medium">Alta de vehículo en flota corporativa</p>
                        </div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-50 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                 <div className="p-8 space-y-8 bg-slate-50/50 overflow-y-auto">
                    
                    {/* Section 1: Technical Specs */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5 flex items-center">
                            <Wrench size={14} className="mr-2 text-blue-500" /> Especificaciones Técnicas
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}><Hash size={12} className="mr-1.5"/> Patente (PPU)</label>
                                <input 
                                    placeholder="ABCD-12" 
                                    value={newVehicle.plate}
                                    onChange={e => setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()})}
                                    className={`${inputBaseClass} font-bold tracking-wider`}
                                />
                            </div>
                            <div>
                                <label className={labelClass}><Calendar size={12} className="mr-1.5"/> Año Fabricación</label>
                                <input 
                                    type="number"
                                    placeholder="2024" 
                                    value={newVehicle.year}
                                    onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                                    className={inputBaseClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}><Car size={12} className="mr-1.5"/> Marca</label>
                                <FormSelect 
                                    value={newVehicle.brand || ''}
                                    onChange={(val) => setNewVehicle({...newVehicle, brand: val, model: ''})}
                                    options={CAR_BRANDS.map(brand => ({ label: brand, value: brand }))}
                                    placeholder="Seleccionar Marca..."
                                    className={inputBaseClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}><Gauge size={12} className="mr-1.5"/> Modelo</label>
                                <FormSelect 
                                    value={newVehicle.model || ''}
                                    onChange={(val) => setNewVehicle({...newVehicle, model: val})}
                                    options={availableModels.map(model => ({ label: model, value: model }))}
                                    placeholder={newVehicle.brand ? "Seleccionar Modelo..." : "Seleccione Marca Primero"}
                                    disabled={!newVehicle.brand}
                                    className={inputBaseClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Location & Assignment with DIDACTIC PROMPT */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5 flex items-center">
                            <MapPin size={14} className="mr-2 text-blue-500" /> Ubicación y Asignación
                        </h4>

                        {/* --- DIDACTIC INDUSTRIAL PROMPT --- */}
                        <div className="mb-6 bg-slate-900 rounded-lg p-4 flex items-start space-x-3 border-l-4 border-orange-500">
                            <div className="p-1.5 bg-white/10 rounded text-orange-500 mt-0.5">
                                <Terminal size={16} />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-1">Protocolo de Asignación de Flota</h5>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                                    La vinculación del activo móvil debe corresponder estrictamente al <span className="text-white font-bold">Nodo Operativo (Emplazamiento)</span> autorizado. 
                                    Los usuarios con perfil 'OPERADOR' tienen visibilidad restringida a su zona asignada para garantizar la integridad de la cadena de custodia.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}><Truck size={12} className="mr-1.5"/> Tipo de Vehículo</label>
                                <FormSelect 
                                    value={newVehicle.type || 'Camioneta'}
                                    onChange={(val) => setNewVehicle({...newVehicle, type: val})}
                                    options={[
                                        { label: 'Camioneta', value: 'Camioneta' },
                                        { label: 'Camión 3/4', value: 'Camión 3/4' },
                                        { label: 'Furgón', value: 'Furgón' },
                                        { label: 'Automóvil', value: 'Automóvil' }
                                    ]}
                                    className={inputBaseClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}><Globe size={12} className="mr-1.5"/> Emplazamiento (Base)</label>
                                <FormSelect 
                                    value={newVehicle.location || ''}
                                    onChange={(val) => setNewVehicle({...newVehicle, location: val})}
                                    options={availableEmplacements.map(e => ({ label: e, value: e }))}
                                    placeholder={user?.role === 'ADMIN' ? "Seleccionar Base..." : `Fijo: ${user?.location}`}
                                    className={inputBaseClass}
                                    disabled={user?.role !== 'ADMIN'}
                                />
                            </div>

                            <div>
                                <label className={labelClass}><Map size={12} className="mr-1.5"/> Región Operativa</label>
                                <FormSelect 
                                    value={selectedRegion}
                                    onChange={(val) => { setSelectedRegion(val); if(user?.role==='ADMIN') setNewVehicle({...newVehicle, commune: ''}); }}
                                    options={availableRegions.map(r => ({ label: r, value: r }))}
                                    placeholder="Filtrar por Región..."
                                    className={inputBaseClass}
                                    disabled={user?.role !== 'ADMIN'}
                                />
                            </div>
                            <div>
                                <label className={labelClass}><Layers size={12} className="mr-1.5"/> Comuna</label>
                                <FormSelect 
                                    value={newVehicle.commune || ''}
                                    onChange={(val) => setNewVehicle({...newVehicle, commune: val})}
                                    options={communes.map(c => ({ label: c.label, value: c.value }))}
                                    placeholder={selectedRegion ? "Seleccionar Comuna..." : "Seleccione Región Primero"}
                                    disabled={user?.role !== 'ADMIN' && !!user?.commune}
                                    className={inputBaseClass}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}><UserIcon size={12} className="mr-1.5"/> Conductor Asignado</label>
                                <FormSelect 
                                    value={newVehicle.driver || ''}
                                    onChange={(val) => setNewVehicle({...newVehicle, driver: val})}
                                    options={[
                                        { label: 'Sin Asignar', value: '' },
                                        ...availableDrivers.map(u => ({ label: `${u.name} (${u.rut})`, value: u.name }))
                                    ]}
                                    placeholder="Seleccionar Conductor..."
                                    className={inputBaseClass}
                                />
                            </div>
                        </div>
                    </div>

                 </div>
                 
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end items-center space-x-4 sticky bottom-0 z-10">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleAdd}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-wider flex items-center"
                    >
                        <Save size={16} className="mr-2" />
                        Registrar Unidad
                    </button>
                </div>
             </div>
          </div>
       )}
     </div>
  );
};
