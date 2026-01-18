
import React, { useState, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { CAR_BRANDS, CAR_MODELS } from '../constants';
import { Vehicle } from '../types';
import { 
  Plus, Trash2, AlertCircle, FileText, Send, 
  Eraser, Save, Calendar, Clock, 
  MapPin, Package, Hash, Calculator, Truck, User as UserIcon,
  Camera, X, Image as ImageIcon, CheckCircle2, ClipboardList
} from 'lucide-react';

const inputBaseClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-normal focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all shadow-sm";

// --- RECEPCION (VINCULADO) ---
export const ReceptionView: React.FC = () => {
  const { stock, user, emplacements } = useApp();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    branch: '',
    provider: '',
    docType: 'Factura',
    docNumber: '',
    materialId: '',
    manualIngress: false,
    sku: 'Auto / Manual',
    quantity: 0,
    unitMeasure: 'UN',
    unitValue: 0,
  });

  const selectedMaterial = stock.find(s => s.id === formData.materialId);
  const totalValue = Math.round(formData.quantity * formData.unitValue * 1.19);

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const matId = e.target.value;
    const mat = stock.find(s => s.id === matId);
    setFormData({
      ...formData, 
      materialId: matId,
      sku: mat ? mat.code : 'Auto / Manual'
    });
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      branch: '',
      provider: '',
      docType: 'Factura',
      docNumber: '',
      materialId: '',
      manualIngress: false,
      sku: 'Auto / Manual',
      quantity: 0,
      unitMeasure: 'UN',
      unitValue: 0,
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center space-x-3">
                 <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/20">
                    <Plus size={20} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-800">Nueva Entrada</h2>
                    <p className="text-xs text-slate-500 font-medium">Recepción de Materiales e Insumos</p>
                 </div>
              </div>
              <button onClick={handleReset} className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                 <Eraser size={16} />
                 <span>Limpiar / Nuevo</span>
              </button>
           </div>
           
           <div className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Calendar size={12} className="mr-1.5" /> Fecha
                     </label>
                     <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Clock size={12} className="mr-1.5" /> Hora
                     </label>
                     <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <MapPin size={12} className="mr-1.5" /> Sucursal
                     </label>
                     <select 
                        value={formData.branch}
                        onChange={e => setFormData({...formData, branch: e.target.value})}
                        className={inputBaseClass}
                     >
                        <option value="">Seleccionar ubicación...</option>
                        {emplacements.map(emp => (
                           <option key={emp} value={emp}>{emp}</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <FileText size={12} className="mr-1.5" /> Proveedor
                     </label>
                     <select value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} className={inputBaseClass}>
                        <option value="">Seleccionar proveedor...</option>
                        <option value="AIR_LIQUIDE">Air Liquide Chile S.A.</option>
                        <option value="LINDE">Linde Gas</option>
                        <option value="INDURA">Indura S.A.</option>
                        <option value="IMPORT">Importadora Excel</option>
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Hash size={12} className="mr-1.5" /> N° Documento
                     </label>
                     <div className="flex space-x-3">
                        <select value={formData.docType} onChange={e => setFormData({...formData, docType: e.target.value})} className={`${inputBaseClass} w-1/3`}>
                           <option value="Factura">Factura</option>
                           <option value="Guia">Guía</option>
                        </select>
                        <input type="text" placeholder="N° 123456" value={formData.docNumber} onChange={e => setFormData({...formData, docNumber: e.target.value})} className={`${inputBaseClass} flex-1`} />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Package size={12} className="mr-1.5" /> Material / Producto
                     </label>
                     <select value={formData.materialId} onChange={handleMaterialChange} className={inputBaseClass}>
                        <option value="">Seleccionar material...</option>
                        {stock.map(s => (
                           <option key={s.id} value={s.id}>{s.name} - {s.category}</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Hash size={12} className="mr-1.5" /> Código (SKU)
                     </label>
                     <input type="text" value={formData.sku} readOnly className={`${inputBaseClass} bg-slate-100/50 cursor-not-allowed`} />
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                   <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cantidad</label>
                       <input type="number" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className={inputBaseClass} />
                   </div>
                   <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">U/M</label>
                       <select value={formData.unitMeasure} onChange={e => setFormData({...formData, unitMeasure: e.target.value})} className={inputBaseClass}>
                          <option value="UN">Unidad</option>
                          <option value="CAJA">Caja (x12)</option>
                       </select>
                   </div>
                   <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Q * U/M</label>
                       <input type="text" readOnly value={formData.quantity} className={`${inputBaseClass} bg-slate-200/30 text-slate-500 font-bold`} />
                   </div>
                   <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Unitario</label>
                       <input type="number" value={formData.unitValue} onChange={e => setFormData({...formData, unitValue: parseInt(e.target.value) || 0})} className={inputBaseClass} />
                   </div>
                   <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-green-600 uppercase ml-1">Total (+IVA)</label>
                       <div className="w-full p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 font-bold">$ {totalValue.toLocaleString('es-CL')}</div>
                   </div>
               </div>

               <div className="flex justify-end pt-4">
                   <button className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center">
                       <Save size={18} className="mr-2" /> Guardar Recepción
                   </button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- DESPACHO (VINCULADO Y CON PERSISTENCIA EN TABLA) ---
interface SavedDispatch {
  id: string;
  timestamp: string;
  origin: string;
  destination: string;
  materialName: string;
  sku: string;
  quantity: number;
  reason: string;
  receiver: string;
  rut: string;
  plate: string;
  docNumber: string; // N° Guía de Despacho
  photosCount: number;
  previewPhoto?: string;
}

export const DispatchView: React.FC = () => {
  const { user, stock, emplacements } = useApp();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [savedDispatches, setSavedDispatches] = useState<SavedDispatch[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    location: '',
    origin: 'Bodega Principal',
    destination: '',
    materialId: '',
    quantity: 0,
    reason: 'Venta',
    receiverName: '',
    plate: '',
    docNumber: '', // N° Guía de Despacho
    rut: '',
    photos: [] as string[]
  });

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      location: '',
      origin: 'Bodega Principal',
      destination: '',
      materialId: '',
      quantity: 0,
      reason: 'Venta',
      receiverName: '',
      plate: '',
      docNumber: '',
      rut: '',
      photos: []
    });
  };

  const handleSaveDispatch = () => {
    if (!formData.location || !formData.destination || !formData.materialId || formData.quantity <= 0) {
      alert("Por favor complete los campos mandatorios (Origen, Destino, Material y Cantidad).");
      return;
    }

    const selectedMaterial = stock.find(s => s.id === formData.materialId);
    
    const newDispatch: SavedDispatch = {
      id: `DSP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: `${formData.date} ${formData.time}`,
      origin: formData.location,
      destination: formData.destination,
      materialName: selectedMaterial?.name || 'Desconocido',
      sku: selectedMaterial?.code || 'S/N',
      quantity: formData.quantity,
      reason: formData.reason,
      receiver: formData.receiverName || 'No especificado',
      rut: formData.rut || 'No especificado',
      plate: formData.plate || 'No especificado',
      docNumber: formData.docNumber || 'S/G',
      photosCount: formData.photos.length,
      previewPhoto: formData.photos.length > 0 ? formData.photos[0] : undefined
    };

    setSavedDispatches(prev => [newDispatch, ...prev]);
    alert(`Despacho ${newDispatch.id} certificado correctamente.`);
    handleReset();
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, photoData]
        }));
      }
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const selectedMaterial = stock.find(s => s.id === formData.materialId);

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center space-x-3">
                 <div className="bg-orange-600 p-2.5 rounded-xl text-white shadow-lg shadow-orange-600/20">
                    <Send size={20} className="transform -rotate-45" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Registro de Despacho</h2>
                    <p className="text-xs text-slate-500 font-medium">Auditoría fotográfica y transferencia de nodos</p>
                 </div>
              </div>
              <button onClick={handleReset} className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                 <Eraser size={16} />
                 <span>Limpiar Formulario</span>
              </button>
           </div>

           <div className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Calendar size={12} className="mr-1.5 text-orange-600" /> Fecha Emisión
                     </label>
                     <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Clock size={12} className="mr-1.5 text-orange-600" /> Hora Salida
                     </label>
                     <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <MapPin size={12} className="mr-1.5 text-orange-600" /> Nodo de Origen
                     </label>
                     <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputBaseClass}>
                        <option value="">Seleccionar Nodo...</option>
                        {emplacements.map(emp => (
                           <option key={emp} value={emp}>{emp}</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <MapPin size={12} className="mr-1.5 text-blue-600" /> Destino Final
                     </label>
                     <select value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className={inputBaseClass}>
                        <option value="">Definir Destino...</option>
                        <option value="Cliente Final">Cliente Final / Domicilio</option>
                        {emplacements.map(emp => (
                           <option key={`dest-${emp}`} value={emp}>Transferencia a: {emp}</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Truck size={12} className="mr-1.5" /> Motivo Operación
                     </label>
                     <select value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className={inputBaseClass}>
                        <option value="Venta">Venta / Servicio Directo</option>
                        <option value="Traslado">Traslado Interno (Stock)</option>
                        <option value="Mantenimiento">Servicio Técnico Externo</option>
                        <option value="Devolucion">Devolución a Proveedor</option>
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Hash size={12} className="mr-1.5" /> N° Guía de Despacho
                     </label>
                     <input 
                        type="text" 
                        placeholder="GD-123456" 
                        value={formData.docNumber} 
                        onChange={e => setFormData({...formData, docNumber: e.target.value})} 
                        className={inputBaseClass} 
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Package size={12} className="mr-1.5" /> Ítem de Carga
                     </label>
                     <select value={formData.materialId} onChange={e => setFormData({...formData, materialId: e.target.value})} className={inputBaseClass}>
                        <option value="">Seleccionar material...</option>
                        {stock.map(s => (
                           <option key={s.id} value={s.id}>{s.name} [Disp: {s.quantity}]</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Hash size={12} className="mr-1.5" /> SKU
                     </label>
                     <input type="text" value={selectedMaterial?.code || 'S/N'} readOnly className={`${inputBaseClass} bg-slate-100/50 cursor-not-allowed`} />
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-orange-600 uppercase tracking-wider ml-1">
                        <Calculator size={12} className="mr-1.5" /> Cantidad
                     </label>
                     <input type="number" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className={inputBaseClass} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        <Truck size={12} className="mr-1.5" /> Patente Transporte
                     </label>
                     <input type="text" placeholder="ABCD-12" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} className={`${inputBaseClass} font-mono uppercase`} />
                  </div>
               </div>

               <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] flex items-center">
                        <Camera size={14} className="mr-2 text-orange-600"/> Evidencia Fotográfica
                      </h3>
                    </div>
                    <button onClick={startCamera} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center transition-all active:scale-95 shadow-lg">
                      <Plus size={14} className="mr-2"/> Capturar
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     {formData.photos.map((photo, index) => (
                        <div key={index} className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden border-2 border-white shadow-sm group">
                           <img src={photo} alt={`Captura ${index + 1}`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => removePhoto(index)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-900 rounded-2xl shadow-xl">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identidad Receptor</label>
                     <input type="text" placeholder="Nombre completo" value={formData.receiverName} onChange={e => setFormData({...formData, receiverName: e.target.value})} className="w-full p-3 bg-slate-800 border-none rounded-xl text-sm text-white font-normal placeholder:text-slate-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">RUT Receptor</label>
                     <input type="text" placeholder="12.345.678-9" value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} className="w-full p-3 bg-slate-800 border-none rounded-xl text-sm text-white font-normal placeholder:text-slate-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Audit Log</label>
                     <div className="w-full p-3 bg-slate-800 border-none rounded-xl text-sm text-orange-400 font-bold flex items-center">
                        <UserIcon size={12} className="mr-2 opacity-50"/> {user?.name || 'ADMIN'}
                     </div>
                  </div>
               </div>

               <div className="flex justify-end pt-4">
                   <button onClick={handleSaveDispatch} className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-95 flex items-center uppercase text-xs tracking-[0.2em]">
                       <Save size={18} className="mr-2" /> Certificar y Despachar
                   </button>
               </div>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-8 py-5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
              <ClipboardList size={18} className="text-slate-400" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Historial Reciente</h3>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/30 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                       <th className="px-6 py-4">Folio / Guía</th>
                       <th className="px-6 py-4">Ruta / Patente</th>
                       <th className="px-6 py-4">Material</th>
                       <th className="px-6 py-4 text-center">Cant.</th>
                       <th className="px-6 py-4 text-right">Estado</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {savedDispatches.map((dispatch) => (
                       <tr key={dispatch.id} className="hover:bg-slate-50/50 text-sm">
                          <td className="px-6 py-4">
                             <div className="font-mono font-bold text-slate-900">{dispatch.id}</div>
                             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Guía: {dispatch.docNumber}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="text-slate-600">{dispatch.origin} → {dispatch.destination}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase">{dispatch.plate}</div>
                          </td>
                          <td className="px-6 py-4 font-medium">{dispatch.materialName}</td>
                          <td className="px-6 py-4 text-center font-bold">{dispatch.quantity}</td>
                          <td className="px-6 py-4 text-right">
                             <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border border-green-100">Certificado</span>
                          </td>
                       </tr>
                    ))}
                    {savedDispatches.length === 0 && (
                       <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-xs uppercase tracking-widest">
                             No se registran despachos certificados en la sesión.
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 z-[300] flex flex-col bg-black/95 animate-in fade-in duration-300">
           <div className="flex-1 relative flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl border border-white/10" />
              <div className="absolute top-8 right-8">
                 <button onClick={stopCamera} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all">
                    <X size={24} />
                 </button>
              </div>
           </div>
           <div className="h-32 bg-slate-900 border-t border-slate-800 flex items-center justify-center space-x-12">
              <button onClick={takePhoto} className="w-16 h-16 rounded-full bg-white border-4 border-slate-400 flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
                 <Camera size={24} className="text-slate-900" />
              </button>
              <button onClick={stopCamera} className="px-8 py-3 bg-green-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-green-700 shadow-lg">Finalizar</button>
           </div>
           <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

// --- FLOTA (VINCULADO) ---
export const FleetView: React.FC = () => {
  const { vehicles, addVehicle, emplacements } = useApp();
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
     brand: CAR_BRANDS[0], 
     model: CAR_MODELS[CAR_BRANDS[0] as keyof typeof CAR_MODELS][0],
     km: 0,
     location: ''
  });

  const handleAdd = () => {
      if(newVehicle.plate) {
          addVehicle({ 
             ...newVehicle, 
             type: 'Camioneta', 
             status: 'AVAILABLE',
             location: newVehicle.location || 'Sin Ubicación',
             driver: newVehicle.driver || 'Sin Asignar',
             commune: newVehicle.commune || 'Por Definir',
          } as Vehicle);
          alert(`Móvil ${newVehicle.plate} registrado correctamente.`);
      }
  };

  return (
     <div className="h-full overflow-y-auto p-6 bg-slate-50/50">
       <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center space-x-3">
              <div className="bg-slate-900 p-2.5 rounded-xl text-white shadow-lg">
                <Truck size={22} />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Gestión de Flota</h2>
                  <p className="text-xs text-slate-500 font-medium">Control de activos de transporte</p>
              </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
             <div className="grid gap-6 grid-cols-1 md:grid-cols-4 items-end">
                 <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider ml-1">Patente</label>
                     <input placeholder="ABCD-12" value={newVehicle.plate || ''} onChange={e => setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()})} className={inputBaseClass} />
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider ml-1">Ubicación (Nodo)</label>
                     <select value={newVehicle.location} onChange={e => setNewVehicle({...newVehicle, location: e.target.value})} className={inputBaseClass}>
                         <option value="">Seleccionar...</option>
                         {emplacements.map(emp => <option key={emp} value={emp}>{emp}</option>)}
                     </select>
                 </div>
                 <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider ml-1">Chofer</label>
                     <input placeholder="Nombre" value={newVehicle.driver || ''} onChange={e => setNewVehicle({...newVehicle, driver: e.target.value})} className={inputBaseClass} />
                 </div>
                 <button onClick={handleAdd} className="bg-blue-600 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center">
                     <Plus size={16} className="mr-2"/> Registrar
                 </button>
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-widest border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4">Patente</th>
                      <th className="px-6 py-4">Conductor</th>
                      <th className="px-6 py-4">Nodo</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                   {vehicles.map(v => (
                      <tr key={v.plate} className="hover:bg-slate-50/80 transition-colors">
                         <td className="px-6 py-4 font-black text-slate-900 font-mono text-base">{v.plate}</td>
                         <td className="px-6 py-4 text-slate-700 font-medium">{v.driver}</td>
                         <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase border border-blue-100">{v.location}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all"><Trash2 size={16}/></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
     </div>
  );
};

const ArrowRightIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
