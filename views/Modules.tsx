import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { CAR_BRANDS, CAR_MODELS } from '../constants';
import { Vehicle } from '../types';
import { 
  Camera, Plus, Trash2, Edit2, AlertCircle, FileText, Send, 
  Image as ImageIcon, RefreshCw, Info, Save, Calendar, Clock, 
  MapPin, Package, Hash, DollarSign, Calculator, Eraser 
} from 'lucide-react';

// --- RECEPCION (Rediseñado estilo Empresarial) ---
export const ReceptionView: React.FC = () => {
  const { stock, user } = useApp();
  
  // Form State
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

  // Derived State
  const selectedMaterial = stock.find(s => s.id === formData.materialId);
  const conversionFactor = 1; // Mock factor for U/M conversion
  const totalQuantity = formData.quantity * conversionFactor;
  const totalValue = Math.round(formData.quantity * formData.unitValue * 1.19); // Assuming +IVA (19%)

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
        
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           
           {/* Header */}
           <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center space-x-3">
                 <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-600/20">
                    <Plus size={20} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-800">Nueva Entrada</h2>
                    <p className="text-xs text-slate-500 font-medium">Recepción de Materiales e Insumos</p>
                 </div>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                 <Eraser size={16} />
                 <span>Limpiar / Nuevo</span>
              </button>
           </div>
           
           <div className="p-8 space-y-8">
               
               {/* Section 1: Context */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <Calendar size={12} className="mr-1.5" /> Fecha
                     </label>
                     <input 
                        type="date" 
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <Clock size={12} className="mr-1.5" /> Hora
                     </label>
                     <input 
                        type="time" 
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <MapPin size={12} className="mr-1.5" /> Sucursal (Emplazamiento)
                     </label>
                     <select 
                        value={formData.branch}
                        onChange={e => setFormData({...formData, branch: e.target.value})}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                     >
                        <option value="">Seleccionar ubicación...</option>
                        <option value="Central">Bodega Central</option>
                        <option value="Norte">Sucursal Norte</option>
                        <option value="Sur">Sucursal Sur</option>
                     </select>
                  </div>
               </div>

               {/* Section 2: Provider & Document */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <FileText size={12} className="mr-1.5" /> Proveedor
                     </label>
                     <div className="flex space-x-2">
                        <select 
                           value={formData.provider}
                           onChange={e => setFormData({...formData, provider: e.target.value})}
                           className="flex-1 p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                           <option value="">Seleccionar proveedor...</option>
                           <option value="AIR_LIQUIDE">Air Liquide Chile S.A.</option>
                           <option value="LINDE">Linde Gas</option>
                           <option value="INDURA">Indura S.A.</option>
                           <option value="IMPORT">Importadora Excel</option>
                        </select>
                        <button className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                           <Plus size={18} />
                        </button>
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <Hash size={12} className="mr-1.5" /> N° Documento
                     </label>
                     <div className="flex space-x-2">
                        <select 
                           value={formData.docType}
                           onChange={e => setFormData({...formData, docType: e.target.value})}
                           className="w-1/3 p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                           <option value="Factura">Factura</option>
                           <option value="Guia">Guía</option>
                           <option value="Boleta">Boleta</option>
                        </select>
                        <input 
                           type="text" 
                           placeholder="N° 123456"
                           value={formData.docNumber}
                           onChange={e => setFormData({...formData, docNumber: e.target.value})}
                           className="flex-1 p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                     </div>
                  </div>
               </div>

               <div className="h-px bg-slate-100 w-full"></div>

               {/* Section 3: Material Detail */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                     <div className="flex justify-between">
                        <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                           <Package size={12} className="mr-1.5" /> Material / Producto
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={formData.manualIngress}
                              onChange={e => setFormData({...formData, manualIngress: e.target.checked})}
                              className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                           />
                           <span className="text-[10px] font-bold text-slate-400 uppercase">Ingreso Manual</span>
                        </label>
                     </div>
                     <select 
                        value={formData.materialId}
                        onChange={handleMaterialChange}
                        disabled={formData.manualIngress}
                        className={`w-full p-2.5 border rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${formData.manualIngress ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-300'}`}
                     >
                        <option value="">Seleccionar material...</option>
                        {stock.map(s => (
                           <option key={s.id} value={s.id}>{s.name} - {s.category}</option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-1.5">
                     <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <Hash size={12} className="mr-1.5" /> Código (SKU)
                     </label>
                     <div className="relative">
                        <input 
                           type="text" 
                           value={formData.sku}
                           readOnly={!formData.manualIngress}
                           className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        {!formData.manualIngress && <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-green-500"></div>}
                     </div>
                  </div>
               </div>

               {/* Section 4: Economic Values */}
               <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="space-y-1.5">
                       <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase">
                          Cantidad
                       </label>
                       <input 
                          type="number" 
                          min="0"
                          value={formData.quantity}
                          onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                          className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 outline-none"
                       />
                   </div>
                   <div className="space-y-1.5">
                       <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase">
                          U/M
                       </label>
                       <select 
                          value={formData.unitMeasure}
                          onChange={e => setFormData({...formData, unitMeasure: e.target.value})}
                          className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 outline-none"
                       >
                          <option value="UN">Unidad</option>
                          <option value="CAJA">Caja (x12)</option>
                          <option value="PALLET">Pallet</option>
                          <option value="KG">Kilogramos</option>
                       </select>
                   </div>
                   <div className="space-y-1.5">
                       <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase">
                          <Calculator size={10} className="mr-1"/> Q * U/M
                       </label>
                       <input 
                          type="text" 
                          readOnly
                          value={totalQuantity}
                          className="w-full p-2 bg-slate-200/50 border border-slate-200 rounded-md text-sm text-slate-600 font-bold outline-none"
                       />
                   </div>
                   <div className="space-y-1.5">
                       <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase">
                          Valor Unitario
                       </label>
                       <div className="relative">
                          <span className="absolute left-2 top-2 text-slate-400 text-xs">$</span>
                          <input 
                              type="number" 
                              value={formData.unitValue}
                              onChange={e => setFormData({...formData, unitValue: parseInt(e.target.value) || 0})}
                              className="w-full pl-5 p-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-blue-500 outline-none"
                           />
                       </div>
                   </div>
                   <div className="space-y-1.5">
                       <label className="flex items-center text-[10px] font-bold text-green-600 uppercase">
                          <DollarSign size={10} className="mr-1"/> Total (+IVA)
                       </label>
                       <div className="w-full p-2 bg-green-50 border border-green-100 rounded-md text-sm text-green-700 font-bold flex items-center">
                          $ {totalValue.toLocaleString('es-CL')}
                       </div>
                   </div>
               </div>

               {/* Section 5: Evidence */}
               <div className="space-y-3">
                   <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <Camera size={12} className="mr-1.5" /> Registro Fotográfico
                   </label>
                   <div className="flex space-x-4">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm shadow-md shadow-blue-900/10 transition-all active:scale-[0.98] flex justify-center items-center">
                          <Camera size={18} className="mr-2" />
                          Tomar Foto
                      </button>
                      <button className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-lg font-bold text-sm transition-colors flex justify-center items-center">
                          <ImageIcon size={18} className="mr-2" />
                          Galería
                      </button>
                   </div>
               </div>

               {/* Footer Action */}
               <div className="flex justify-end pt-4">
                   <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 flex items-center">
                       <Save size={18} className="mr-2" />
                       Agregar y Guardar
                   </button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- DESPACHO (Actualizado según diseño solicitado) ---
export const DispatchView: React.FC = () => {
  const { user, stock } = useApp();
  
  // Local state for form
  const [formData, setFormData] = useState({
    location: '',
    origin: '',
    destination: '',
    materialId: '',
    quantity: 0,
    reason: '',
    receiverName: '',
    plate: '',
    rut: ''
  });

  const selectedMaterial = stock.find(s => s.id === formData.materialId);

  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-8">
         
         {/* Header */}
         <div className="flex items-center space-x-2 text-orange-600 mb-6">
            <Send className="transform -rotate-45 mb-1" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Nuevo Despacho</h2>
         </div>

         {/* Form Container */}
         <div className="bg-white rounded-xl p-1">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                
                {/* Row 1 */}
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Emplazamiento <span className="text-orange-500">*</span></label>
                    <select 
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Central">Central</option>
                        <option value="Norte">Norte</option>
                        <option value="Sur">Sur</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Salida <span className="text-orange-500">*</span></label>
                    <select 
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                        value={formData.origin}
                        onChange={e => setFormData({...formData, origin: e.target.value})}
                    >
                        <option value="">Origen...</option>
                        <option value="Bodega Principal">Bodega Principal</option>
                        <option value="Patio Carga">Patio Carga</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Hasta <span className="text-orange-500">*</span></label>
                    <select 
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                        value={formData.destination}
                        onChange={e => setFormData({...formData, destination: e.target.value})}
                    >
                        <option value="">Destino...</option>
                        <option value="Cliente Final">Cliente Final</option>
                        <option value="Sucursal">Sucursal</option>
                        <option value="Obra">Obra</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Material <span className="text-orange-500">*</span></label>
                    <select 
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                        value={formData.materialId}
                        onChange={e => setFormData({...formData, materialId: e.target.value})}
                    >
                        <option value="">Seleccione Material</option>
                        {stock.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Row 2 */}
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Código (Auto)</label>
                    <input 
                        type="text" 
                        readOnly
                        value={selectedMaterial?.code || '---'}
                        className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none cursor-not-allowed"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Cantidad <span className="text-orange-500">*</span></label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Motivo Despacho <span className="text-orange-500">*</span></label>
                    <select 
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                        value={formData.reason}
                        onChange={e => setFormData({...formData, reason: e.target.value})}
                    >
                        <option value="">Seleccionar motivo...</option>
                        <option value="Venta">Venta</option>
                        <option value="Traslado">Traslado Interno</option>
                        <option value="Mermas">Mermas / Bajas</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Usuario Responsable</label>
                    <input 
                        type="text" 
                        readOnly
                        value={user?.name || 'Admin'}
                        className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none cursor-not-allowed"
                    />
                </div>

                {/* Row 3 */}
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Nombre Receptor <span className="text-orange-500">*</span></label>
                    <input 
                        type="text" 
                        placeholder="Ej. Juan Pérez"
                        value={formData.receiverName}
                        onChange={e => setFormData({...formData, receiverName: e.target.value})}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Patente Vehículo <span className="text-orange-500">*</span></label>
                    <input 
                        type="text" 
                        placeholder="ABCD-12"
                        value={formData.plate}
                        onChange={e => setFormData({...formData, plate: e.target.value})}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">RUT Receptor</label>
                    <input 
                        type="text" 
                        placeholder="12.345.678-9"
                        value={formData.rut}
                        onChange={e => setFormData({...formData, rut: e.target.value})}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    />
                </div>

            </div>

            {/* Evidence Section */}
            <div className="mb-8">
                <label className="block text-xs font-bold text-slate-700 mb-2">Evidencia Fotográfica</label>
                <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Camera className="text-orange-500" size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Evidencia Fotográfica</h4>
                                <p className="text-slate-400 text-xs">Adjunte respaldo visual del despacho</p>
                            </div>
                        </div>
                        <span className="text-orange-500 text-xs font-bold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">0 / 5 fotos</span>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center shadow-lg shadow-orange-900/20">
                            <Camera size={18} className="mr-2" />
                            Tomar Foto
                        </button>
                        <button className="flex-1 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center">
                            <ImageIcon size={18} className="mr-2" />
                            Galería
                        </button>
                    </div>

                    <div className="border-2 border-dashed border-slate-700 rounded-xl h-32 flex flex-col items-center justify-center bg-slate-800/50">
                        <ImageIcon size={32} className="text-slate-600 mb-2" />
                        <span className="text-slate-500 text-xs">Sin evidencia adjunta</span>
                    </div>
                </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end mb-12">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-95 flex items-center">
                    <Save size={18} className="mr-2" />
                    Registrar Despacho
                </button>
            </div>

            {/* Recent History Table */}
            <div className="border-t border-slate-200 pt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Historial Reciente</h3>
                    <button className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium transition-colors">
                        <RefreshCw size={14} className="mr-1.5" /> Actualizar
                    </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm min-h-[150px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Ruta (Origen → Destino)</th>
                                <th className="px-6 py-4">Motivo</th>
                                <th className="px-6 py-4">N° Guía</th>
                                <th className="px-6 py-4">Material</th>
                                <th className="px-6 py-4">Cant.</th>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4 text-center">Evidencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="bg-slate-50 p-3 rounded-full mb-3">
                                            <Info className="text-slate-300" size={24} />
                                        </div>
                                        <p className="text-slate-500 font-medium">No se han registrado despachos aún.</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- FLOTA ---
export const FleetView: React.FC = () => {
  const { vehicles, addVehicle } = useApp();
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
     brand: CAR_BRANDS[0], 
     model: CAR_MODELS[CAR_BRANDS[0] as keyof typeof CAR_MODELS][0],
     km: 0
  });

  const handleAdd = () => {
      if(newVehicle.plate) {
          addVehicle({ 
             ...newVehicle, 
             type: 'Camioneta', 
             status: 'AVAILABLE', 
             location: 'Central',
             driver: newVehicle.driver || 'Sin Asignar',
             commune: newVehicle.commune || 'Santiago',
          } as Vehicle);
      }
  };

  const checkMaintenance = (km: number) => {
     const nextMaint = Math.ceil((km + 1) / 10000) * 10000;
     const diff = nextMaint - km;
     if (diff < 1000) return <span className="text-amber-600 flex items-center text-xs font-bold bg-amber-50 px-2 py-1 rounded border border-amber-100"><AlertCircle size={12} className="mr-1"/> Mantenimiento ({diff} km)</span>;
     return <span className="text-xs text-slate-400">Operativo</span>;
  };

  return (
     <div className="h-full overflow-y-auto p-6 bg-white">
       <div className="space-y-6">
          <div className="flex justify-between items-end">
              <div>
                 <h2 className="text-xl font-bold text-slate-800">Flota Vehicular</h2>
                 <p className="text-sm text-slate-500">Administración y monitoreo de móviles</p>
              </div>
          </div>

          {/* Creation Card */}
          <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">Registrar Nuevo Móvil</h3>
             <div className="grid gap-5 grid-cols-1 md:grid-cols-5 items-end">
                 <div className="space-y-1">
                     <label className="text-xs font-medium text-slate-600">Patente</label>
                     <input 
                        placeholder="ABCD-12"
                        value={newVehicle.plate || ''} 
                        onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})} 
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:border-blue-500 outline-none bg-white" 
                     />
                 </div>
                 <div className="space-y-1">
                     <label className="text-xs font-medium text-slate-600">Marca</label>
                     <select 
                       value={newVehicle.brand} 
                       onChange={e => setNewVehicle({...newVehicle, brand: e.target.value, model: CAR_MODELS[e.target.value as keyof typeof CAR_MODELS][0]})}
                       className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white"
                      >
                         {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                     </select>
                 </div>
                 <div className="space-y-1">
                     <label className="text-xs font-medium text-slate-600">Modelo</label>
                     <select value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white">
                         {/* @ts-ignore */}
                         {CAR_MODELS[newVehicle.brand || 'Toyota']?.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                 </div>
                 <div className="space-y-1">
                     <label className="text-xs font-medium text-slate-600">Kilometraje Inicial</label>
                     <input type="number" value={newVehicle.km} onChange={e => setNewVehicle({...newVehicle, km: parseInt(e.target.value)})} className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:border-blue-500 outline-none bg-white" />
                 </div>
                 <button onClick={handleAdd} className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 flex justify-center items-center transition-colors shadow-sm">
                     <Plus size={18} className="mr-1"/> Agregar
                 </button>
             </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4">Patente</th>
                      <th className="px-6 py-4">Vehículo</th>
                      <th className="px-6 py-4">Conductor Asignado</th>
                      <th className="px-6 py-4">Estado / KM</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                   {vehicles.map(v => (
                      <tr key={v.plate} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-slate-900 font-mono">{v.plate}</td>
                         <td className="px-6 py-4">{v.brand} {v.model}</td>
                         <td className="px-6 py-4 text-slate-600">{v.driver}</td>
                         <td className="px-6 py-4">
                            <div className="font-mono font-medium">{v.km.toLocaleString()} km</div>
                            <div className="mt-1">{checkMaintenance(v.km)}</div>
                         </td>
                         <td className="px-6 py-4 flex justify-end space-x-2">
                            <button className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded transition"><Edit2 size={16}/></button>
                            <button className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition"><Trash2 size={16}/></button>
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