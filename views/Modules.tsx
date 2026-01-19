
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
  Search, Filter, Wrench, Activity, Fuel, Gauge
} from 'lucide-react';

const inputBaseClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-normal focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300";
const labelClass = "flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1 mb-2.5";

// --- CUSTOM SELECT COMPONENT ---
// Replaces native select to avoid black borders and match input style perfectly
interface FormSelectProps {
  value: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({ value, options, placeholder = "Seleccionar...", onChange, disabled = false, icon }) => {
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
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={containerRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500 shadow-sm' : ''} ${disabled ? 'bg-slate-50 text-slate-400' : ''}`}
      >
        <span className={`${!value ? 'text-slate-300 font-normal' : 'font-bold'}`}>
          {value ? selectedLabel : placeholder}
        </span>
        <div className="flex items-center">
            {icon && <span className="mr-2 text-slate-400">{icon}</span>}
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[110%] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`px-4 py-3 text-xs font-medium cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${value === option.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
            >
              {option.label}
              {value === option.value && <CheckCircle2 size={14} className="text-blue-500"/>}
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
  const { user, emplacements } = useApp();
  
  // Estado inicial del formulario
  const initialFormState = {
    date: new Date().toISOString().split('T')[0], 
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    location: user?.location || '',
    provider: '',
    docType: 'Factura',
    docNumber: '',
    material: '',
    manualEntry: false,
    skuMode: 'Auto',
    quantity: 0,
    um: 'UN',
    qtyUm: 0,
    unitValue: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  
  // Estado para la lista de recepciones y el ID de edición
  const [receptions, setReceptions] = useState<ReceptionRecord[]>([
    {
      id: '1', date: '2026-01-19', time: '13:41', location: 'Central', provider: 'Air Liquide',
      docType: 'Factura', docNumber: '123456', material: 'Cilindro Oxígeno 10m3',
      quantity: 50, um: 'UN', qtyUm: 0, unitValue: 0, total: 0
    }
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Manejo de cambios en inputs
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Guardar o Actualizar
  const handleSave = () => {
    // Validación básica
    if (!formData.location || !formData.docNumber || !formData.material) {
        alert("Complete los campos obligatorios (Sucursal, Documento, Material)");
        return;
    }

    const totalCalculated = formData.quantity * formData.unitValue;

    const record: ReceptionRecord = {
        id: editingId || Date.now().toString(),
        date: formData.date,
        time: formData.time,
        location: formData.location,
        provider: formData.provider,
        docType: formData.docType,
        docNumber: formData.docNumber,
        material: formData.material,
        quantity: Number(formData.quantity),
        um: formData.um,
        qtyUm: Number(formData.qtyUm),
        unitValue: Number(formData.unitValue),
        total: totalCalculated
    };

    if (editingId) {
        setReceptions(prev => prev.map(r => r.id === editingId ? record : r));
        setEditingId(null);
    } else {
        setReceptions(prev => [record, ...prev]);
    }

    // Resetear formulario manteniendo fecha/hora actual
    setFormData({
        ...initialFormState, 
        date: formData.date, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
  };

  // Cargar datos para editar
  const handleEdit = (record: ReceptionRecord) => {
    setEditingId(record.id);
    setFormData({
        ...initialFormState,
        date: record.date,
        time: record.time,
        location: record.location,
        provider: record.provider,
        docType: record.docType,
        docNumber: record.docNumber,
        material: record.material,
        quantity: record.quantity,
        um: record.um,
        qtyUm: record.qtyUm,
        unitValue: record.unitValue,
    });
  };

  // Eliminar registro
  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        setReceptions(prev => prev.filter(r => r.id !== id));
        if (editingId === id) handleReset();
    }
  };

  // Limpiar formulario
  const handleReset = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           
           {/* Header */}
           <div className="flex justify-between items-start mb-8">
              <div>
                  <div className="flex items-center space-x-3">
                     <div className={`${editingId ? 'bg-amber-500' : 'bg-blue-600'} p-2 rounded-lg text-white transition-colors`}>
                        {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                     </div>
                     <div>
                        <h2 className="text-lg font-bold text-slate-800 leading-none">{editingId ? 'Editar Entrada' : 'Nueva Entrada'}</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Recepción de Materiales</p>
                     </div>
                  </div>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                  <Eraser size={14} className="mr-2" />
                  Limpiar / Nuevo
              </button>
           </div>

           {/* Form Grid */}
           <div className="space-y-6">
              
              {/* Row 1: Date, Time, Branch */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><Calendar size={12} className="mr-1.5"/> FECHA</label>
                      <input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><Clock size={12} className="mr-1.5"/> HORA</label>
                      <input type="time" value={formData.time} onChange={e => handleChange('time', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="md:col-span-7">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><MapPin size={12} className="mr-1.5"/> SUCURSAL (EMPLAZAMIENTO)</label>
                      <div className="relative">
                        <select 
                            value={formData.location} 
                            onChange={e => handleChange('location', e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-blue-500 transition-colors appearance-none font-medium"
                        >
                            <option value="">Seleccionar ubicación...</option>
                            {emplacements.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>
              </div>

              {/* Row 2: Provider, Doc Type, Doc Num */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><UserIcon size={12} className="mr-1.5"/> PROVEEDOR</label>
                      <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select 
                                value={formData.provider}
                                onChange={e => handleChange('provider', e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-blue-500 transition-colors appearance-none font-medium"
                            >
                                <option value="">Seleccionar proveedor...</option>
                                <option value="Air Liquide">Air Liquide</option>
                                <option value="Linde">Linde</option>
                                <option value="Indura">Indura</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                          </div>
                          <button className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"><Plus size={16}/></button>
                      </div>
                  </div>
                  <div className="md:col-span-7">
                      <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-4">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><FileText size={12} className="mr-1.5"/> N° DOCUMENTO</label>
                              <div className="relative">
                                <select 
                                    value={formData.docType}
                                    onChange={e => handleChange('docType', e.target.value)}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-blue-500 transition-colors appearance-none font-medium"
                                >
                                    <option>Factura</option>
                                    <option>Guía Despacho</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                              </div>
                          </div>
                          <div className="col-span-8">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 opacity-0">Number</label>
                              <input 
                                type="text" 
                                placeholder="N° 123456" 
                                value={formData.docNumber}
                                onChange={e => handleChange('docNumber', e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors placeholder:font-normal" 
                              />
                          </div>
                      </div>
                  </div>
              </div>

              {/* Row 3: Material, Manual Checkbox, SKU */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-8">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><Package size={12} className="mr-1.5"/> MATERIAL / PRODUCTO</label>
                      <div className="relative">
                        <select 
                            value={formData.material}
                            onChange={e => handleChange('material', e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-blue-500 transition-colors appearance-none font-medium"
                        >
                            <option value="">Seleccionar material...</option>
                            <option value="Cilindro Oxígeno 10m3">Cilindro Oxígeno 10m3</option>
                            <option value="Cilindro Oxígeno 1m3">Cilindro Oxígeno 1m3</option>
                            <option value="Regulador 0-15">Regulador 0-15</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>
                  <div className="md:col-span-4 flex flex-col justify-end">
                      <div className="flex items-center justify-end mb-2">
                           <label className="flex items-center text-[10px] font-bold text-slate-500 cursor-pointer">
                               <input 
                                    type="checkbox" 
                                    checked={formData.manualEntry}
                                    onChange={e => handleChange('manualEntry', e.target.checked)}
                                    className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-0" 
                                />
                               INGRESO MANUAL
                           </label>
                      </div>
                      <div className="relative">
                        <div className="absolute -top-6 left-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center"><Hash size={12} className="mr-1.5"/> CÓDIGO (SKU)</div>
                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 outline-none focus:border-blue-500 transition-colors appearance-none font-medium"
                        >
                            <option>Auto / Manual</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>
              </div>

              {/* Row 4: Quantity, U/M, Q* U/M, Unit Value, Total */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><CheckCircle2 size={12} className="mr-1.5"/> CANTIDAD</label>
                      <input 
                        type="number" 
                        value={formData.quantity}
                        onChange={e => handleChange('quantity', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors" 
                      />
                  </div>
                  <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><Box size={12} className="mr-1.5"/> U/M</label>
                      <div className="relative">
                        <select 
                            value={formData.um}
                            onChange={e => handleChange('um', e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-blue-500 transition-colors appearance-none font-medium"
                        >
                            <option value="UN">UN</option>
                            <option value="KG">KG</option>
                            <option value="L">L</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>
                   <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><Calculator size={12} className="mr-1.5"/> Q* U/M</label>
                      <input type="number" value={formData.qtyUm} disabled className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                   <div className="md:col-span-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">VALOR UNITARIO</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                         <input 
                            type="number" 
                            value={formData.unitValue}
                            onChange={e => handleChange('unitValue', e.target.value)}
                            className="w-full pl-6 pr-2.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors" 
                         />
                      </div>
                  </div>
                   <div className="md:col-span-3">
                      <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center"><Calculator size={12} className="mr-1.5"/> TOTAL (+IVA)</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-xs text-emerald-600 font-bold">$</span>
                         <input 
                            type="text" 
                            readOnly
                            value={(formData.quantity * formData.unitValue).toLocaleString()}
                            className="w-full pl-6 pr-2.5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-black text-emerald-700 outline-none" 
                         />
                      </div>
                  </div>
              </div>

               {/* Row 5: Photo */}
               <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center"><Camera size={12} className="mr-1.5 text-blue-600"/> REGISTRO FOTOGRÁFICO</label>
                  <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-all shadow-md shadow-blue-200">
                          <Camera size={16} className="mr-2" />
                          Tomar Foto
                      </button>
                      <button className="flex items-center justify-center p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold text-xs transition-all">
                          <ImageIcon size={16} className="mr-2 text-blue-500" />
                          Galería
                      </button>
                  </div>
               </div>

               {/* Footer Action */}
               <div className="pt-6 flex justify-end">
                   <button 
                    onClick={handleSave}
                    className={`${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-slate-800'} text-white px-8 py-3 rounded-lg font-bold text-xs flex items-center shadow-lg transition-all active:scale-[0.98]`}
                   >
                       <Save size={16} className="mr-2" />
                       {editingId ? 'Actualizar Registro' : 'Agregar y Guardar'}
                   </button>
               </div>

           </div>
        </div>

        {/* Bottom Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Últimos Registros (Base de Datos)</h3>
           <div className="overflow-x-auto">
               <table className="w-full text-left">
                   <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                       <tr>
                           <th className="pb-3 pl-2">Fecha</th>
                           <th className="pb-3">Cód. Recep.</th>
                           <th className="pb-3">Documento</th>
                           <th className="pb-3">Material</th>
                           <th className="pb-3 text-right">U/M</th>
                           <th className="pb-3 text-right">Cant.</th>
                           <th className="pb-3 text-right">Valor Unit.</th>
                           <th className="pb-3 text-right">Total (c/IVA)</th>
                           <th className="pb-3 text-right pr-2">Acciones</th>
                       </tr>
                   </thead>
                   <tbody className="text-xs text-slate-600 font-medium divide-y divide-slate-50">
                       {receptions.map((item) => (
                           <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${editingId === item.id ? 'bg-blue-50/50' : ''}`}>
                               <td className="py-3 pl-2">{item.date}</td>
                               <td className="py-3 font-mono text-slate-400">REC-{item.id.slice(-3)}</td>
                               <td className="py-3 text-slate-500">{item.docType.substring(0,3)}. {item.docNumber}</td>
                               <td className="py-3 text-slate-800 font-bold">{item.material}</td>
                               <td className="py-3 text-right">{item.um}</td>
                               <td className="py-3 text-right font-bold">{item.quantity}</td>
                               <td className="py-3 text-right text-slate-400">$ {item.unitValue.toLocaleString()}</td>
                               <td className="py-3 text-right font-bold text-emerald-600">$ {item.total.toLocaleString()}</td>
                               <td className="py-3 text-right pr-2">
                                  <div className="flex items-center justify-end space-x-2">
                                     <button 
                                        onClick={() => handleEdit(item)}
                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Editar"
                                     >
                                        <Edit size={14} />
                                     </button>
                                     <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        title="Eliminar"
                                     >
                                        <Trash2 size={14} />
                                     </button>
                                  </div>
                               </td>
                           </tr>
                       ))}
                       {receptions.length === 0 && (
                           <tr>
                               <td colSpan={9} className="py-6 text-center text-slate-400 italic text-[10px] uppercase tracking-widest">
                                   No hay registros de recepción
                               </td>
                           </tr>
                       )}
                   </tbody>
               </table>
               <div className="text-right mt-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest">{receptions.length} mostrados</div>
           </div>
        </div>

      </div>
    </div>
  );
};

export const DispatchView: React.FC = () => {
  const { user, emplacements, vehicles, appName } = useApp();
  
  // Estado para alternar entre Formulario y Tabla de Historial
  const [showHistory, setShowHistory] = useState(false);
  
  // Estado para almacenar registros de despacho (simulación local)
  const [dispatchRecords, setDispatchRecords] = useState<DispatchRecord[]>([]);

  // Estado para visualizador de fotos
  const [viewingPhotos, setViewingPhotos] = useState<string[] | null>(null);

  // Estado para impresión
  const [printingDispatch, setPrintingDispatch] = useState<DispatchRecord | null>(null);

  const [formData, setFormData] = useState({
    emplacement: '',
    origin: '',
    destination: '',
    material: '',
    code: '---',
    quantity: 0,
    reason: '',
    responsible: user?.name || 'Admin',
    receiverName: '',
    plate: '',
    receiverRut: '',
    photos: [] as string[] // URLs de fotos simuladas
  });

  const inputStyle = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-orange-500 transition-colors font-medium placeholder:font-normal placeholder:text-slate-400";
  const labelStyle = "block text-xs font-bold text-slate-700 mb-1.5";
  const requiredStar = <span className="text-orange-500 ml-0.5">*</span>;

  // Función para simular captura de fotos
  const handleSimulatePhoto = () => {
    if (formData.photos.length >= 5) return;
    const mockPhotos = [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&q=80",
      "https://images.unsplash.com/photo-1595246140625-573b715e11d3?w=300&q=80",
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=300&q=80"
    ];
    // Seleccionar una aleatoria
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setFormData(prev => ({ ...prev, photos: [...prev.photos, randomPhoto] }));
  };

  const handleRegister = () => {
    if (!formData.emplacement || !formData.destination || !formData.material || formData.quantity <= 0) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }

    const newRecord: DispatchRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      emplacement: formData.emplacement,
      origin: 'Origen Central', // Simulado
      destination: formData.destination,
      material: formData.material,
      quantity: Number(formData.quantity),
      reason: formData.reason,
      responsible: formData.responsible,
      receiverName: formData.receiverName,
      plate: formData.plate,
      receiverRut: formData.receiverRut,
      photos: formData.photos
    };

    setDispatchRecords(prev => [newRecord, ...prev]);
    alert("Despacho registrado correctamente.");
    
    // Limpiar formulario y cambiar a vista historial opcionalmente
    setFormData({
      emplacement: '', origin: '', destination: '', material: '', code: '---', 
      quantity: 0, reason: '', responsible: user?.name || 'Admin', 
      receiverName: '', plate: '', receiverRut: '', photos: []
    });
    setShowHistory(true);
  };

  const handlePrint = (record: DispatchRecord) => {
    setPrintingDispatch(record);
    setTimeout(() => {
      window.print();
      setPrintingDispatch(null); // Restaurar vista después de imprimir
    }, 500);
  };

  // Renderizado del Template de Impresión (PDF)
  if (printingDispatch) {
    return (
      <div className="bg-white p-12 min-h-screen text-slate-900 font-sans">
        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
          <div>
             <h1 className="text-3xl font-black uppercase tracking-tighter">{appName}</h1>
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Reporte Técnico de Despacho</p>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-slate-400 uppercase">Folio</p>
             <p className="text-xl font-mono font-bold">DSP-{printingDispatch.id.slice(-6)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
           <div className="space-y-4">
              <div><span className="font-bold uppercase text-xs text-slate-500 block">Fecha Emisión</span> {printingDispatch.date}</div>
              <div><span className="font-bold uppercase text-xs text-slate-500 block">Origen</span> {printingDispatch.emplacement}</div>
              <div><span className="font-bold uppercase text-xs text-slate-500 block">Destino</span> {printingDispatch.destination}</div>
           </div>
           <div className="space-y-4 text-right">
              <div><span className="font-bold uppercase text-xs text-slate-500 block">Responsable</span> {printingDispatch.responsible}</div>
              <div><span className="font-bold uppercase text-xs text-slate-500 block">Receptor</span> {printingDispatch.receiverName}</div>
              <div><span className="font-bold uppercase text-xs text-slate-500 block">Patente Transporte</span> {printingDispatch.plate || 'N/A'}</div>
           </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden mb-8">
           <table className="w-full text-left">
              <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-600">
                 <tr>
                    <th className="p-4">Material / Activo</th>
                    <th className="p-4">Motivo</th>
                    <th className="p-4 text-right">Cantidad</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                 <tr>
                    <td className="p-4 font-bold">{printingDispatch.material}</td>
                    <td className="p-4">{printingDispatch.reason || 'Traslado Estándar'}</td>
                    <td className="p-4 text-right font-mono font-bold">{printingDispatch.quantity}</td>
                 </tr>
              </tbody>
           </table>
        </div>

        <div className="mb-8">
           <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 border-b border-slate-100 pb-2">Evidencia Fotográfica Adjunta</h3>
           {printingDispatch.photos.length > 0 ? (
               <div className="grid grid-cols-3 gap-4">
                  {printingDispatch.photos.map((photo, idx) => (
                     <div key={idx} className="aspect-video border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <img src={photo} className="w-full h-full object-cover grayscale-[0.2]" alt={`Evidencia ${idx}`} />
                     </div>
                  ))}
               </div>
           ) : (
             <p className="text-sm italic text-slate-400">Sin evidencia fotográfica registrada.</p>
           )}
        </div>

        <div className="mt-20 pt-8 border-t border-dashed border-slate-300 flex justify-between text-xs text-slate-400 uppercase font-bold tracking-widest">
           <div>Firma Responsable</div>
           <div>Firma Receptor</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Toggle Button */}
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Truck className="mr-3 text-orange-600" /> 
              {showHistory ? 'Historial de Despachos' : 'Registro de Despacho'}
           </h2>
           <button 
             onClick={() => setShowHistory(!showHistory)}
             className={`flex items-center px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm
               ${showHistory ? 'bg-orange-600 text-white shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
             `}
           >
              {showHistory ? (
                <> <Plus size={16} className="mr-2" /> Nuevo Despacho </>
              ) : (
                <> <List size={16} className="mr-2" /> Ver Historial </>
              )}
           </button>
        </div>

        {showHistory ? (
           /* --- TABLA DE HISTORIAL --- */
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100">
                    <tr>
                       <th className="px-6 py-4">Fecha / ID</th>
                       <th className="px-6 py-4">Destino</th>
                       <th className="px-6 py-4">Receptor</th>
                       <th className="px-6 py-4">Patente</th>
                       <th className="px-6 py-4 text-center">Cant.</th>
                       <th className="px-6 py-4 text-center">Evidencia</th>
                       <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-600">
                    {dispatchRecords.length === 0 ? (
                       <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400 italic">No hay despachos registrados.</td></tr>
                    ) : (
                       dispatchRecords.map(record => (
                          <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{record.date}</div>
                                <div className="font-mono text-[10px] text-slate-400">DSP-{record.id.slice(-4)}</div>
                             </td>
                             <td className="px-6 py-4 text-slate-700">{record.destination}</td>
                             <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{record.receiverName}</div>
                                <div className="text-[10px] text-slate-400">{record.receiverRut}</div>
                             </td>
                             <td className="px-6 py-4 font-mono font-bold bg-slate-100 rounded px-2 text-slate-600 inline-block mt-2 mx-6">{record.plate || '---'}</td>
                             <td className="px-6 py-4 text-center font-bold text-lg">{record.quantity}</td>
                             <td className="px-6 py-4 text-center">
                                 {record.photos.length > 0 ? (
                                    <button 
                                      onClick={() => setViewingPhotos(record.photos)}
                                      className="inline-flex items-center justify-center space-x-1 bg-slate-100 hover:bg-orange-50 text-slate-500 hover:text-orange-600 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
                                    >
                                       <ImageIcon size={14} />
                                       <span className="text-[10px] font-bold">{record.photos.length}</span>
                                    </button>
                                 ) : (
                                    <span className="text-[10px] text-slate-300">--</span>
                                 )}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => handlePrint(record)}
                                  className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors inline-flex items-center text-[10px] font-bold uppercase tracking-wider border border-orange-200"
                                >
                                   <Printer size={14} className="mr-1.5"/> PDF
                                </button>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        ) : (
          /* --- FORMULARIO DE NUEVO DESPACHO --- */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-left-4">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-8">
                  <div className="text-orange-600">
                      <Send size={20} className="transform -rotate-45 mb-1" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Nuevo Despacho</h2>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {/* Row 1 */}
                  <div>
                      <label className={labelStyle}>Emplazamiento {requiredStar}</label>
                      <div className="relative">
                          <select 
                            value={formData.emplacement}
                            onChange={e => setFormData({...formData, emplacement: e.target.value})}
                            className={`${inputStyle} appearance-none bg-white`}
                          >
                              <option value="">Seleccionar...</option>
                              {emplacements.map(e => <option key={e} value={e}>{e}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>
                  <div>
                      <label className={labelStyle}>Salida {requiredStar}</label>
                      <div className="relative">
                          <select className={`${inputStyle} appearance-none bg-white`}>
                              <option>Origen Central</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>
                  <div>
                      <label className={labelStyle}>Hasta {requiredStar}</label>
                      <div className="relative">
                          <select 
                             value={formData.destination}
                             onChange={e => setFormData({...formData, destination: e.target.value})}
                             className={`${inputStyle} appearance-none bg-white`}
                          >
                              <option value="">Destino...</option>
                              <option value="Faena Norte">Faena Norte</option>
                              <option value="Hospital Regional">Hospital Regional</option>
                              <option value="Planta Procesos">Planta Procesos</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>
                  <div>
                      <label className={labelStyle}>Material {requiredStar}</label>
                      <div className="relative">
                          <select 
                            value={formData.material}
                            onChange={e => setFormData({...formData, material: e.target.value})}
                            className={`${inputStyle} appearance-none bg-white`}
                          >
                              <option value="">Seleccione Material</option>
                              <option value="Cilindro Oxígeno 10m3">Cilindro Oxígeno 10m3</option>
                              <option value="Cilindro Oxígeno 1m3">Cilindro Oxígeno 1m3</option>
                              <option value="Regulador">Regulador</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>

                  {/* Row 2 */}
                  <div>
                      <label className={labelStyle}>Código (Auto)</label>
                      <input type="text" value="---" readOnly className={`${inputStyle} bg-slate-50 text-slate-500`} />
                  </div>
                  <div>
                      <label className={labelStyle}>Cantidad {requiredStar}</label>
                      <input 
                        type="number" 
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                        placeholder="0" 
                        className={`${inputStyle} bg-white`} 
                      />
                  </div>
                  <div>
                      <label className={labelStyle}>Motivo Despacho {requiredStar}</label>
                      <div className="relative">
                          <select 
                             value={formData.reason}
                             onChange={e => setFormData({...formData, reason: e.target.value})}
                             className={`${inputStyle} appearance-none bg-white`}
                          >
                              <option value="">Seleccionar motivo...</option>
                              <option value="Entrega Cliente">Entrega Cliente</option>
                              <option value="Transferencia Sucursal">Transferencia Sucursal</option>
                              <option value="Mantenimiento">Mantenimiento</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                      </div>
                  </div>
                  <div>
                      <label className={labelStyle}>Usuario Responsable</label>
                      <input type="text" value={formData.responsible} readOnly className={`${inputStyle} bg-slate-100/50 text-slate-500`} />
                  </div>

                  {/* Row 3 */}
                  <div>
                      <label className={labelStyle}>Nombre Receptor {requiredStar}</label>
                      <input 
                        type="text" 
                        value={formData.receiverName}
                        onChange={e => setFormData({...formData, receiverName: e.target.value})}
                        placeholder="Ej. Juan Pérez" 
                        className={`${inputStyle} bg-white`} 
                      />
                  </div>
                  <div>
                      <label className={labelStyle}>Patente Vehículo {requiredStar}</label>
                      <input 
                        type="text" 
                        value={formData.plate}
                        onChange={e => setFormData({...formData, plate: e.target.value.toUpperCase()})}
                        placeholder="ABCD-12" 
                        className={`${inputStyle} bg-white`} 
                      />
                  </div>
                  <div>
                      <label className={labelStyle}>RUT Receptor</label>
                      <input 
                        type="text" 
                        value={formData.receiverRut}
                        onChange={e => setFormData({...formData, receiverRut: e.target.value})}
                        placeholder="12.345.678-9" 
                        className={`${inputStyle} bg-white`} 
                      />
                  </div>
              </div>

              {/* Photo Section */}
              <div className="bg-slate-900 rounded-xl p-6 mb-8 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center space-x-4">
                          <div className="p-2.5 bg-orange-600/10 rounded-lg border border-orange-500/20 text-orange-500">
                              <Camera size={20} />
                          </div>
                          <div>
                              <h3 className="font-bold text-sm text-white">Evidencia Fotográfica</h3>
                              <p className="text-xs text-slate-400 mt-0.5">Adjunte respaldo visual del despacho</p>
                          </div>
                      </div>
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-500/20">{formData.photos.length} / 5 fotos</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
                      <button 
                        onClick={handleSimulatePhoto}
                        className="flex items-center justify-center p-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                      >
                          <Camera size={16} className="mr-2" />
                          Tomar Foto (Simular)
                      </button>
                      <button className="flex items-center justify-center p-3.5 bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg font-bold text-xs transition-all">
                          <ImageIcon size={16} className="mr-2" />
                          Galería
                      </button>
                  </div>

                  {formData.photos.length === 0 ? (
                    <div className="border border-dashed border-slate-700 bg-slate-800/30 rounded-xl h-32 flex flex-col items-center justify-center text-slate-500 relative z-10 transition-all">
                        <div className="bg-slate-800 p-3 rounded-full mb-3">
                             <ImageIcon size={20} className="text-slate-600" />
                        </div>
                        <span className="text-xs font-medium">Sin evidencia adjunta</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-4 relative z-10 animate-in fade-in slide-in-from-bottom-2">
                       {formData.photos.map((photo, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden border border-slate-700 relative group/photo">
                             <img src={photo} className="w-full h-full object-cover" />
                             <button 
                               onClick={() => setFormData(prev => ({...prev, photos: prev.photos.filter((_, i) => i !== index)}))}
                               className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover/photo:opacity-100 transition-opacity"
                             >
                                <X size={10} />
                             </button>
                          </div>
                       ))}
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-2">
                  <button 
                    onClick={handleRegister}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold text-xs flex items-center shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
                  >
                      <Save size={16} className="mr-2" />
                      Registrar Despacho
                  </button>
              </div>
          </div>
        )}
      </div>

      {/* PHOTO VIEWER MODAL */}
      {viewingPhotos && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
           <button 
             onClick={() => setViewingPhotos(null)}
             className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
           >
              <X size={32} />
           </button>
           
           <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto max-h-full">
               {viewingPhotos.map((photo, idx) => (
                  <div key={idx} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col group">
                     <div className="aspect-video relative overflow-hidden bg-black">
                        <img src={photo} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                           <a 
                             href={photo} 
                             download={`evidencia-${idx}.jpg`}
                             target="_blank"
                             rel="noreferrer"
                             className="text-white text-xs font-bold uppercase tracking-widest flex items-center hover:text-orange-400 transition-colors"
                           >
                              <Download size={16} className="mr-2" /> Descargar Original
                           </a>
                        </div>
                     </div>
                     <div className="p-4 flex justify-between items-center text-xs font-mono text-slate-500 border-t border-slate-800 bg-slate-900">
                        <span>IMG_SEQ_{idx + 101}.JPG</span>
                        <span>{(Math.random() * 2 + 1).toFixed(1)} MB</span>
                     </div>
                  </div>
               ))}
           </div>
        </div>
      )}

    </div>
  );
};

export const FleetView: React.FC = () => {
  const { vehicles, addVehicle, user, users } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal Fields State
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
     status: 'AVAILABLE' // Mapped to "Activo" in UI
  });

  const [selectedRegion, setSelectedRegion] = useState('');

  const localVehicles = useMemo(() => {
    return vehicles.filter(v => v.location === user?.location && (v.plate.includes(searchTerm.toUpperCase()) || v.driver.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [vehicles, user, searchTerm]);

  const regions = useMemo(() => CHILE_GEO_DATA.map(r => r.region), []);
  const communes = useMemo(() => selectedRegion ? CHILE_GEO_DATA.find(r => r.region === selectedRegion)?.communes || [] : [], [selectedRegion]);
  const availableDrivers = useMemo(() => users.filter(u => u.role === 'DRIVER'), [users]);

  const handleAdd = () => {
      if(newVehicle.plate && newVehicle.brand && newVehicle.model) {
          addVehicle({ ...newVehicle, location: user?.location || 'Central' } as Vehicle);
          setIsModalOpen(false);
          setNewVehicle({ brand: '', model: '', year: new Date().getFullYear(), location: '', plate: '', driver: '', commune: '', type: 'Camioneta', status: 'AVAILABLE' });
          setSelectedRegion('');
      }
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
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
     <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans">
       <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <StatCard label="Total Flota" value={localVehicles.length} icon={Car} color="bg-blue-600" />
             <StatCard label="Operativos" value={localVehicles.filter(v => v.status === 'AVAILABLE').length} icon={Activity} color="bg-emerald-500" />
             <StatCard label="En Mantenimiento" value={localVehicles.filter(v => v.status === 'MAINTENANCE').length} icon={Wrench} color="bg-amber-500" />
             <StatCard label="Rendimiento Prom." value="12 km/L" icon={Fuel} color="bg-indigo-500" />
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
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
                 <div className="relative min-w-[140px]">
                    <FormSelect 
                        value="" 
                        placeholder="Todos los Tipos"
                        options={[{label: 'Camioneta', value: 'Camioneta'}, {label: 'Furgón', value: 'Furgón'}]} 
                        onChange={() => {}} 
                    />
                 </div>
                 <div className="relative min-w-[140px]">
                    <FormSelect 
                        value="" 
                        placeholder="Todos los Estados"
                        options={[{label: 'Activo', value: 'AVAILABLE'}, {label: 'Mantenimiento', value: 'MAINTENANCE'}]} 
                        onChange={() => {}} 
                    />
                 </div>
                 <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors whitespace-nowrap">
                    <Download size={14} className="mr-2" /> Exportar
                 </button>
                 <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-md shadow-blue-500/20">
                    <Plus size={16} className="mr-2" /> Nuevo Vehículo
                 </button>
             </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
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
                       {localVehicles.length === 0 && (
                           <tr>
                               <td colSpan={9} className="py-8 text-center text-slate-400 italic text-xs">No se encontraron vehículos que coincidan con la búsqueda.</td>
                           </tr>
                       )}
                    </tbody>
                 </table>
             </div>
          </div>
       </div>

       {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-[5px] animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-visible animate-in zoom-in-95 duration-300">
                
                {/* Modal Header */}
                <div className="flex justify-between items-start p-8 border-b border-slate-100">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center">
                            <Plus size={18} className="mr-2 text-blue-600"/> Registrar Nuevo Vehículo
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Complete los datos para agregar un vehículo a la flota.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-6 bg-white overflow-y-visible max-h-[80vh]">
                    
                    {/* Row 1: Plate & Type */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Patente <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center border-r border-slate-200 pr-3 h-full py-2">
                                    <span className="text-[10px] font-black text-slate-400">CL</span>
                                </div>
                                <input 
                                    placeholder="ABCD-12" 
                                    value={newVehicle.plate}
                                    onChange={e => setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()})}
                                    className="w-full pl-14 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-slate-300" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Tipo de Vehículo</label>
                            <FormSelect 
                                value={newVehicle.type || ''}
                                onChange={(val) => setNewVehicle({...newVehicle, type: val})}
                                options={[
                                    { label: 'Camioneta', value: 'Camioneta' },
                                    { label: 'Furgón', value: 'Furgón' },
                                    { label: 'Camión', value: 'Camión' },
                                    { label: 'Automóvil', value: 'Automóvil' }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Row 2: Brand & Model */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Marca <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Ej: Toyota" 
                                value={newVehicle.brand}
                                onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Modelo <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                placeholder="Ej: Hilux" 
                                value={newVehicle.model}
                                onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Row 3: Year & Status */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Año</label>
                            <input 
                                type="number" 
                                placeholder="2026" 
                                value={newVehicle.year}
                                onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Estado</label>
                            <FormSelect 
                                value={newVehicle.status || ''}
                                onChange={(val) => setNewVehicle({...newVehicle, status: val as any})}
                                options={[
                                    { label: 'Activo', value: 'AVAILABLE' },
                                    { label: 'En Mantenimiento', value: 'MAINTENANCE' },
                                    { label: 'En Ruta', value: 'IN_TRANSIT' }
                                ]}
                                icon={<Activity size={14} className="text-slate-400"/>}
                            />
                        </div>
                    </div>

                    {/* Divider Title */}
                    <div className="pt-2">
                        <h4 className="text-xs font-bold text-slate-900">Ubicación y Asignación</h4>
                    </div>

                    {/* Row 4: Region & Commune */}
                    <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Región <span className="text-red-500">*</span></label>
                            <FormSelect 
                                value={selectedRegion}
                                onChange={(val) => { setSelectedRegion(val); setNewVehicle({...newVehicle, commune: ''}) }}
                                options={regions.map(r => ({ label: r, value: r }))}
                                placeholder="Seleccionar Región"
                                icon={<MapPin size={14} className="text-slate-400"/>}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Comuna <span className="text-red-500">*</span></label>
                            <FormSelect 
                                value={newVehicle.commune || ''}
                                onChange={(val) => setNewVehicle({...newVehicle, commune: val})}
                                options={communes.map(c => ({ label: c, value: c }))}
                                placeholder="Seleccionar Comuna"
                                disabled={!selectedRegion}
                                icon={<MapPin size={14} className="text-slate-400"/>}
                            />
                        </div>
                    </div>

                    {/* Row 5: Emplacement (Disabled/Select) */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block">Emplazamiento <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <input 
                             type="text" 
                             readOnly 
                             disabled
                             placeholder="Seleccione una comuna primero"
                             value={newVehicle.commune ? (user?.location || 'Central') : ''}
                             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none italic"
                           />
                        </div>
                    </div>

                    {/* Row 6: Driver Assignment */}
                    <div>
                        <label className="text-xs font-bold text-blue-600 mb-2 flex items-center">
                            <UserIcon size={14} className="mr-1.5" /> Asignación de Conductor
                        </label>
                        <FormSelect 
                            value={newVehicle.driver || ''}
                            onChange={(val) => setNewVehicle({...newVehicle, driver: val})}
                            options={availableDrivers.map(d => ({ label: d.name, value: d.name }))}
                            placeholder="Sin Asignar"
                        />
                        <p className="text-[10px] text-slate-400 mt-2 ml-1">Seleccione un conductor de la lista o déjelo sin asignar.</p>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="p-8 border-t border-slate-100 bg-white flex justify-end items-center space-x-4">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleAdd}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Registrar Vehículo
                    </button>
                </div>

             </div>
          </div>
       )}
     </div>
  );
};
