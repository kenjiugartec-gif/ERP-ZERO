
import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { CAR_BRANDS, CAR_MODELS, CHILE_GEO_DATA } from '../constants';
import { Vehicle } from '../types';
import { 
  Plus, Trash2, AlertCircle, FileText, Send, 
  Eraser, Save, Calendar, Clock, 
  MapPin, Package, Hash, Calculator, Truck, User as UserIcon,
  Camera, X, Image as ImageIcon, CheckCircle2, ClipboardList, 
  Car, Info, Globe, ChevronDown, UserCheck, Map, ClipboardCheck
} from 'lucide-react';

const inputBaseClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-normal focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300";
const labelClass = "flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1 mb-2.5";

export const ReceptionView: React.FC = () => {
  const { stock, user } = useApp();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    branch: user?.location || '',
    provider: '',
    docType: 'Factura',
    docNumber: '',
  });

  return (
    <div className="h-full overflow-y-auto p-8 bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-10 py-8 border-b border-slate-100 bg-white">
              <div className="flex items-center space-x-4">
                 <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
                    <ClipboardCheck size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Registro de Entrada</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Recepción técnica de suministros y activos</p>
                 </div>
              </div>
           </div>
           <div className="p-10 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1.5">
                     <label className={labelClass}><Calendar size={12} className="mr-2 text-blue-500" /> Fecha Contable</label>
                     <input type="date" value={formData.date} className={inputBaseClass} />
                  </div>
                  <div className="space-y-1.5">
                     <label className={labelClass}><Clock size={12} className="mr-2 text-blue-500" /> Hora de Ingreso</label>
                     <input type="time" value={formData.time} className={inputBaseClass} />
                  </div>
                  <div className="space-y-1.5">
                     <label className={labelClass}><MapPin size={12} className="mr-2 text-blue-600" /> Emplazamiento</label>
                     <input type="text" readOnly value={user?.location || 'Sin Asignar'} className={`${inputBaseClass} bg-slate-50 font-black text-blue-600 border-blue-100 shadow-none cursor-default`} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                     <label className={labelClass}><FileText size={12} className="mr-2 text-blue-500" /> Proveedor Autorizado</label>
                     <select className={inputBaseClass}>
                        <option value="">Seleccionar proveedor...</option>
                        <option value="AIR_LIQUIDE">Air Liquide Chile S.A.</option>
                        <option value="LINDE">Linde Gas</option>
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className={labelClass}><Hash size={12} className="mr-2 text-blue-500" /> Folio de Documento</label>
                     <input type="text" placeholder="GD / Factura N°" className={`${inputBaseClass} font-mono font-bold`} />
                  </div>
               </div>
               <div className="flex justify-end pt-6">
                   <button className="bg-slate-900 hover:bg-slate-800 text-white px-12 py-5 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-[0.98] flex items-center">
                       <Save size={18} className="mr-3" /> Certificar Entrada
                   </button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const DispatchView: React.FC = () => {
  const { user, emplacements } = useApp();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
  });

  return (
    <div className="h-full overflow-y-auto p-8 bg-slate-50/50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-10 py-8 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                 <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
                    <Truck size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Registro de Despacho</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Gestión de salida y transferencia de activos</p>
                 </div>
              </div>
           </div>
           <div className="p-10 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1.5">
                     <label className={labelClass}><Calendar size={12} className="mr-2 text-orange-500" /> Fecha Despacho</label>
                     <input type="date" value={formData.date} className={inputBaseClass} />
                  </div>
                  <div className="space-y-1.5">
                     <label className={labelClass}><MapPin size={12} className="mr-2 text-orange-500" /> Destino Operativo</label>
                     <select className={inputBaseClass}>
                        <option value="">Definir Destino...</option>
                        {emplacements.filter(e => e !== user?.location).map(emp => <option key={emp} value={emp}>{emp}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className={labelClass}><FileText size={12} className="mr-2 text-orange-500" /> N° Guía de Despacho</label>
                     <input type="text" placeholder="GD-XXXXXX" className={`${inputBaseClass} font-mono font-bold`} />
                  </div>
               </div>
               <div className="flex justify-end pt-6">
                   <button className="bg-slate-900 hover:bg-slate-800 text-white px-14 py-5 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center shadow-2xl transition-all active:scale-[0.98]">
                       <Save size={18} className="mr-3" /> Emitir y Despachar
                   </button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const FleetView: React.FC = () => {
  const { vehicles, addVehicle, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
     brand: CAR_BRANDS[0], 
     model: CAR_MODELS[CAR_BRANDS[0] as keyof typeof CAR_MODELS][0],
     year: new Date().getFullYear(),
     km: 0,
     location: user?.location || '',
     plate: '',
     driver: '',
     commune: ''
  });

  const localVehicles = useMemo(() => vehicles.filter(v => v.location === user?.location), [vehicles, user]);
  const communes = useMemo(() => CHILE_GEO_DATA.flatMap(r => r.communes).sort(), []);

  const handleAdd = () => {
      if(newVehicle.plate && newVehicle.commune && newVehicle.brand && newVehicle.model) {
          addVehicle({ ...newVehicle, type: 'Operativo', status: 'AVAILABLE', location: user?.location || 'Central' } as Vehicle);
          setIsModalOpen(false);
          setNewVehicle({ brand: CAR_BRANDS[0], model: CAR_MODELS[CAR_BRANDS[0] as keyof typeof CAR_MODELS][0], year: new Date().getFullYear(), location: user?.location || '', plate: '', driver: '', commune: '' });
      }
  };

  return (
     <div className="h-full overflow-y-auto p-8 bg-slate-50/50">
       <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                  <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
                    <Car size={24} />
                  </div>
                  <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Gestión de Flota</h2>
                      <p className="text-sm text-slate-500 font-medium mt-1">Control de activos móviles del nodo {user?.location}</p>
                  </div>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-sm flex items-center shadow-2xl transition-all active:scale-[0.98]">
                <Plus size={18} className="mr-2"/> Nuevo Móvil
              </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-100">
                   <tr>
                      <th className="px-10 py-6">Patente</th>
                      <th className="px-10 py-6">Activo</th>
                      <th className="px-10 py-6">Responsable</th>
                      <th className="px-10 py-6">Jurisdicción</th>
                      <th className="px-10 py-6 text-right">Acciones</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                   {localVehicles.map(v => (
                      <tr key={v.plate} className="hover:bg-slate-50/80 transition-colors">
                         <td className="px-10 py-6 font-black text-slate-900 font-mono text-lg">{v.plate}</td>
                         <td className="px-10 py-6">
                            <div className="font-bold text-slate-800 text-xs uppercase">{v.brand} {v.model}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{v.year}</div>
                         </td>
                         <td className="px-10 py-6 text-slate-500 font-bold text-[11px] uppercase tracking-wide">{v.driver || 'No Asignado'}</td>
                         <td className="px-10 py-6">
                            <span className="text-slate-500 text-[10px] font-black uppercase flex items-center tracking-widest">
                               <MapPin size={12} className="mr-2 text-blue-500"/> {v.commune}
                            </span>
                         </td>
                         <td className="px-10 py-6 text-right">
                            <button className="text-slate-200 hover:text-red-500 p-2 transition-colors"><Trash2 size={18}/></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-[25px] animate-in fade-in duration-500 overflow-hidden">
             <div className="bg-white w-full h-full flex flex-col animate-in slide-in-from-bottom-12 duration-500">
                <div className="px-12 py-10 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
                   <div className="flex items-center space-x-6">
                      <div className="bg-slate-900 p-5 rounded-[1.5rem] text-white shadow-2xl">
                        <Car size={36} />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none italic uppercase">ALTA DE VEHÍCULO</h3>
                        <p className="text-sm font-semibold text-slate-400 mt-3 flex items-center">
                          <Info size={16} className="mr-2 text-blue-500" /> Protocolo de Integración de Flota Crítica
                        </p>
                      </div>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="group p-4 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100 hover:border-red-100">
                      <X size={32} />
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50/50">
                  <div className="max-w-5xl mx-auto px-12 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                       <div className="space-y-10">
                          <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-3">Identificación Técnica</h4>
                          <div className="space-y-2">
                             <label className={labelClass}><Hash size={11} className="mr-2" /> Patente</label>
                             <input placeholder="XXXX-00" value={newVehicle.plate} onChange={e => setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()})} className={inputBaseClass} />
                          </div>
                          <div className="space-y-2">
                             <label className={labelClass}><Calendar size={11} className="mr-2" /> Año</label>
                             <input type="number" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})} className={inputBaseClass} />
                          </div>
                       </div>
                       <div className="space-y-10">
                          <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-3">Asignación Operativa</h4>
                          <div className="space-y-2">
                             <label className={labelClass}><Globe size={11} className="mr-2" /> Comuna</label>
                             <select value={newVehicle.commune} onChange={e => setNewVehicle({...newVehicle, commune: e.target.value})} className={inputBaseClass}>
                                <option value="">Seleccionar...</option>
                                {communes.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className={labelClass}><UserCheck size={11} className="mr-2" /> Conductor</label>
                             <input placeholder="Nombre completo" value={newVehicle.driver} onChange={e => setNewVehicle({...newVehicle, driver: e.target.value})} className={inputBaseClass} />
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="px-12 py-10 bg-white border-t border-slate-100 flex justify-between items-center">
                   <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold text-sm">Cancelar</button>
                   <button onClick={handleAdd} className="bg-slate-900 hover:bg-blue-600 text-white px-16 py-6 rounded-2xl font-bold text-base shadow-2xl transition-all flex items-center">
                     <Save size={20} className="mr-4" /> Certificar Activo
                   </button>
                </div>
             </div>
          </div>
       )}
     </div>
  );
};
