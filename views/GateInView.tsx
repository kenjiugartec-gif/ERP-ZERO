
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Truck, User, FileText, Calendar, 
  Scale, Anchor, MapPin, CheckCircle2, ChevronDown,
  Info, AlertTriangle, UserPlus, File, Tag, Container,
  Clock, Hash
} from 'lucide-react';
import { useApp } from '../store/AppContext';

const FormSelect = ({ label, placeholder, options, value, onChange }: any) => (
  <div className="flex flex-col space-y-1.5 w-full">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 appearance-none cursor-pointer uppercase transition-all"
      >
        <option value="">{placeholder}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const FormInput = ({ label, placeholder, icon: Icon, value = "", readOnly = false, onChange, onBlur }: any) => (
  <div className="flex flex-col space-y-1.5 w-full">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative group">
      {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Icon size={16} />
          </div>
      )}
      <input 
        type="text" 
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 ${readOnly ? 'bg-slate-50' : 'bg-white'} border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-300 transition-all`}
      />
    </div>
  </div>
);

export const GateInView: React.FC = () => {
  const { documents, user } = useApp();
  const [cargoType, setCargoType] = useState<'FCL' | 'LCL'>('FCL');
  const [currentDate] = useState(new Date().toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Form State
  const [guideNumber, setGuideNumber] = useState('');
  const [client, setClient] = useState('');
  const [eir, setEir] = useState('');
  const [container, setContainer] = useState({ sigla: '', num: '', dv: '' });
  const [shippingLine, setShippingLine] = useState('');
  const [bl, setBl] = useState('');
  const [tara, setTara] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [nave, setNave] = useState('');
  const [viaje, setViaje] = useState('');

  // Auto-fill logic when Guide Number changes
  const handleGuideBlur = () => {
      const doc = documents.find(d => d.guideNumber === guideNumber.toUpperCase() && d.location === user?.location);
      if (doc) {
          // Parse container string to populate fields
          const containerParts = doc.container.split('-');
          const mainPart = containerParts[0] || '';
          const dv = containerParts[1] || '';
          // Simple split for demo purposes, robust regex might be needed for production
          const sigla = mainPart.substring(0, 4);
          const num = mainPart.substring(4);

          setContainer({ sigla, num, dv });
          setClient(doc.client);
          setBl(doc.bl);
          setShippingLine(doc.shippingLine);
          setNave(doc.ship);
          setViaje(doc.voyage);
          setGrossWeight(doc.grossWeight);
          // Set condition if applicable
          if (doc.condition === 'DIRECTO') {
              // Handle logic for Directo if needed in UI
          }
      }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans overscroll-contain w-full">
       <div className="w-full">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full mb-6">
             
             {/* Header */}
             <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
                 <div className="flex items-center space-x-4">
                     <div className="bg-slate-900 p-3 rounded-xl text-white shadow-lg">
                         <ArrowRight size={24} />
                     </div>
                     <div>
                         <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">REGISTRO DE RECEPCIÓN</h1>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">PROTOCOLO GATE-IN TERMINAL</p>
                     </div>
                 </div>
                 <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider shadow-sm">
                     ESPACIOS DISPONIBLES PARA FCL: <span className="text-blue-600">300</span>
                 </div>
             </div>

             <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                 
                 {/* COLUMNA IZQUIERDA - CHOFER Y TRANSPORTE */}
                 <div className="space-y-8">
                     <div className="flex items-center space-x-2 text-blue-600 pb-2 border-b border-blue-100">
                         <Truck size={18} />
                         <span className="text-xs font-black uppercase tracking-widest">1. DATOS DEL CHOFER Y TRANSPORTE</span>
                     </div>

                     <div className="space-y-6">
                         <div className="p-1 bg-slate-50 rounded-xl border border-slate-100">
                            <FormInput 
                                label="PATENTE CAMIÓN (XXXX-XX)" 
                                placeholder="PPPT-56" 
                                value="PPPT-56" 
                            />
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                             <div>
                                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">TIPO DOCUMENTO</label>
                                 <div className="flex bg-slate-100 p-1 rounded-lg">
                                     <button className="flex-1 py-2 rounded-md bg-white shadow-sm text-[10px] font-bold text-blue-600 uppercase border border-slate-200">NACIONAL</button>
                                     <button className="flex-1 py-2 rounded-md text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600">EXTRANJERO</button>
                                 </div>
                             </div>
                             <FormInput 
                                label="RUT (XXXXXXXX-X)" 
                                placeholder="12.345.678-9" 
                                icon={Hash}
                                value="17454521-9"
                             />
                         </div>

                         <div>
                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">NOMBRE CHOFER</label>
                             <div className="relative">
                                 <input 
                                    type="text" 
                                    value="Kenji Ugarte" 
                                    className="w-full pl-4 pr-32 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none focus:border-blue-500"
                                 />
                                 <button className="absolute right-2 top-1.5 bottom-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 rounded-md text-[9px] font-bold uppercase flex items-center transition-colors">
                                     <UserPlus size={12} className="mr-1.5"/> REGISTRAR NUEVO
                                 </button>
                             </div>
                         </div>

                         <FormInput 
                            label="EMPRESA TRANSPORTISTA" 
                            placeholder="Nombre Empresa" 
                            value="Los Tito Ltda"
                         />
                     </div>
                 </div>

                 {/* COLUMNA DERECHA - DETALLES CARGA */}
                 <div className="space-y-8 relative">
                     <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                         <div className="flex items-center space-x-2 text-blue-600">
                            <Anchor size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">2. DETALLES DE LA CARGA</span>
                         </div>
                         <div className="flex bg-slate-100 p-1 rounded-lg">
                             <button 
                                onClick={() => setCargoType('FCL')}
                                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${cargoType === 'FCL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                                 FCL (CONTENEDOR)
                             </button>
                             <button 
                                onClick={() => setCargoType('LCL')}
                                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${cargoType === 'LCL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                                 LCL (SUELTO)
                             </button>
                         </div>
                     </div>

                     <div className="space-y-6 pb-40"> 
                         <div className="grid grid-cols-2 gap-6">
                             <div className="relative">
                                <FormInput 
                                    label="N° GUÍA DE RECEPCIÓN" 
                                    placeholder="EJ: GR-1020" 
                                    icon={FileText} 
                                    value={guideNumber}
                                    onChange={setGuideNumber}
                                    onBlur={handleGuideBlur}
                                />
                                {documents.length > 0 && !guideNumber && (
                                    <div className="absolute top-0 right-0 text-[9px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded">
                                        AUTOCOMPLETE DISPONIBLE
                                    </div>
                                )}
                             </div>
                             <FormInput label="CLIENTE / ARMADOR" placeholder="" icon={Tag} value={client} onChange={setClient} />
                         </div>

                         <FormInput label="N° EIR (INTERCHANGE RECEIPT)" placeholder="EJ: EIR-100200" icon={File} value={eir} onChange={setEir} />

                         <div>
                             <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">FECHA Y HORA DE INGRESO</label>
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center uppercase"><Clock size={10} className="mr-1"/> AHORA</span>
                             </div>
                             <div className="relative">
                                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                 <input type="text" value={currentDate} readOnly className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none" />
                             </div>
                         </div>

                         <div>
                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">IDENTIFICACIÓN UNIDAD (SIGLA + N°)</label>
                             <div className="flex gap-3">
                                 <input 
                                    type="text" 
                                    placeholder="ABCD" 
                                    value={container.sigla} 
                                    onChange={e => setContainer({...container, sigla: e.target.value.toUpperCase()})}
                                    className="w-1/3 py-3 text-center bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 uppercase" 
                                />
                                 <input 
                                    type="text" 
                                    placeholder="123456" 
                                    value={container.num}
                                    onChange={e => setContainer({...container, num: e.target.value})}
                                    className="flex-1 py-3 text-center bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500" 
                                />
                                 <input 
                                    type="text" 
                                    placeholder="0" 
                                    value={container.dv}
                                    onChange={e => setContainer({...container, dv: e.target.value})}
                                    className="w-16 py-3 text-center bg-blue-50 border border-blue-200 rounded-lg text-sm font-bold text-blue-700 outline-none" 
                                />
                             </div>
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                             <FormSelect label="LÍNEA NAVIERA" placeholder="SELECCIONAR..." options={['MSC', 'HAPAG', 'MAERSK', 'CMA CGM']} value={shippingLine} onChange={setShippingLine} />
                             <FormInput label="N° BL" placeholder="" value={bl} onChange={setBl} />
                         </div>

                         <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block border-b border-slate-200 pb-2">PESOS DEL CONTENEDOR (KG)</label>
                             <div className="grid grid-cols-2 gap-6">
                                 <FormInput label="TARA (KG)" placeholder="" icon={Scale} value={tara} onChange={setTara} />
                                 <FormInput label="PESO BRUTO (KG)" placeholder="" icon={Scale} value={grossWeight} onChange={setGrossWeight} />
                             </div>
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                             <FormSelect label="NAVE" placeholder="SELECCIONAR..." options={['MSC ROSA', 'HAPAG LLOYD', 'MAERSK SEALAND']} value={nave} onChange={setNave} />
                             <FormInput label="VIAJE" placeholder="" value={viaje} onChange={setViaje} />
                         </div>
                     </div>

                     <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-xl p-5 shadow-xl text-white">
                         <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center space-x-2">
                                 <MapPin size={16} className="text-blue-400" />
                                 <div>
                                     <h3 className="text-xs font-bold uppercase tracking-wider">POSICIÓN YARD (BAROTI)</h3>
                                 </div>
                             </div>
                             <div className="flex items-center text-[9px] font-bold text-amber-400 uppercase">
                                 <AlertTriangle size={10} className="mr-1" />
                                 SOLO SE MUESTRAN ESPACIOS APTOS PARA FCL
                             </div>
                         </div>
                         
                         <div className="relative">
                             <select className="w-full pl-4 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-white outline-none focus:border-blue-500 appearance-none cursor-pointer">
                                 <option>Bloque A | B01 R1 T1</option>
                                 <option>Bloque A | B01 R1 T2</option>
                                 <option>Bloque B | B05 R2 T1</option>
                             </select>
                             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                         </div>
                     </div>

                 </div>

             </div>

             <div className="p-6 bg-slate-50 border-t border-slate-200">
                 <button className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center">
                     <ArrowRight size={16} className="mr-2" /> CONFIRMAR RECEPCIÓN
                 </button>
             </div>

          </div>
       </div>
    </div>
  );
};
