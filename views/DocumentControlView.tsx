
import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Plus, Upload, FileSpreadsheet, Box, 
  ChevronDown, CheckCircle2, FileText, 
  Search, History, Trash2
} from 'lucide-react';
import { ReceptionDocument } from '../types';

const FormSelect = ({ label, placeholder, options, value, onChange }: any) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const FormInput = ({ label, placeholder, value, onChange }: any) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 outline-none focus:border-blue-500 placeholder:text-slate-400"
    />
  </div>
);

export const DocumentControlView: React.FC = () => {
  const { addDocument, documents, user } = useApp();
  const [activeTab, setActiveTab] = useState<'INDIVIDUAL' | 'MASIVA'>('INDIVIDUAL');
  
  // Form State
  const [guideNumber, setGuideNumber] = useState('');
  const [containerSigla, setContainerSigla] = useState('');
  const [containerNum, setContainerNum] = useState('');
  const [containerDigit, setContainerDigit] = useState('');
  const [client, setClient] = useState('');
  const [ship, setShip] = useState('');
  const [voyage, setVoyage] = useState('');
  const [bl, setBl] = useState('');
  const [shippingLine, setShippingLine] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [condition, setCondition] = useState<'DIRECTO' | 'INDIRECTO'>('INDIRECTO');

  const localDocuments = useMemo(() => documents.filter(d => d.location === user?.location), [documents, user]);

  const handleSave = () => {
    if (!guideNumber || !containerSigla || !containerNum) {
        alert("Complete los campos obligatorios (Guía, Contenedor)");
        return;
    }

    const fullContainer = `${containerSigla.toUpperCase()}${containerNum}-${containerDigit}`;

    const newDoc: ReceptionDocument = {
        id: Date.now().toString(),
        guideNumber: guideNumber.toUpperCase(),
        container: fullContainer,
        client: client.toUpperCase(),
        ship: ship.toUpperCase(),
        voyage: voyage.toUpperCase(),
        bl: bl.toUpperCase(),
        shippingLine: shippingLine.toUpperCase(),
        grossWeight: grossWeight,
        condition: condition,
        location: user?.location || 'Central',
        timestamp: new Date().toISOString()
    };

    addDocument(newDoc);
    alert("Documento registrado exitosamente. Disponible para Gate In.");
    
    // Reset Form
    setGuideNumber('');
    setContainerSigla('');
    setContainerNum('');
    setContainerDigit('');
    setClient('');
    setShip('');
    setVoyage('');
    setBl('');
    setShippingLine('');
    setGrossWeight('');
    setCondition('INDIRECTO');
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans overscroll-contain w-full">
       <div className="w-full space-y-6">
          
          <div className="flex space-x-4">
             <button 
                onClick={() => setActiveTab('INDIVIDUAL')}
                className={`flex items-center px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${activeTab === 'INDIVIDUAL' ? 'bg-white text-blue-600 border-blue-600 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
             >
                <Box size={16} className="mr-2" />
                INGRESO INDIVIDUAL
             </button>
             <button 
                onClick={() => setActiveTab('MASIVA')}
                className={`flex items-center px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${activeTab === 'MASIVA' ? 'bg-white text-blue-600 border-blue-600 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
             >
                <FileSpreadsheet size={16} className="mr-2" />
                CARGA MASIVA (EXCEL)
             </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full">
             <div className="bg-slate-900 px-6 py-4 flex items-center">
                 <div className="p-1.5 bg-blue-600 rounded-md mr-3 text-white">
                     <Plus size={16} />
                 </div>
                 <div>
                     <h2 className="text-sm font-bold text-white uppercase tracking-wider">NUEVA PRECARGA DOCUMENTAL</h2>
                     <p className="text-[10px] text-slate-400 font-medium">INGRESE LOS DATOS PARA REGISTRAR LA GUÍA DE ARRIBO</p>
                 </div>
             </div>

             <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                 
                 <div className="space-y-6">
                     <div className="flex items-center space-x-2 text-blue-600 border-b border-blue-100 pb-2 mb-4">
                         <FileText size={16} />
                         <span className="text-xs font-bold uppercase tracking-widest">IDENTIFICACIÓN</span>
                     </div>
                     
                     <FormInput label="N° GUÍA DE RECEPCIÓN" placeholder="GR-0000" value={guideNumber} onChange={setGuideNumber} />
                     
                     <div className="flex flex-col space-y-1.5">
                         <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">CONTENEDOR (SIGLA + N° + DV)</label>
                         <div className="flex space-x-3">
                             <input type="text" placeholder="ABCD" value={containerSigla} onChange={e => setContainerSigla(e.target.value.toUpperCase())} className="w-1/3 p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-center outline-none focus:border-blue-500 uppercase" />
                             <input type="text" placeholder="123456" value={containerNum} onChange={e => setContainerNum(e.target.value)} className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-center outline-none focus:border-blue-500" />
                             <input type="text" placeholder="0" value={containerDigit} onChange={e => setContainerDigit(e.target.value)} className="w-12 p-2.5 bg-slate-50 border border-blue-100 bg-blue-50 rounded-md text-xs text-center font-bold text-blue-700 outline-none" />
                         </div>
                     </div>

                     <FormInput label="CLIENTE / ARMADOR" placeholder="Nombre del Cliente" value={client} onChange={setClient} />
                 </div>

                 <div className="space-y-6">
                     <div className="flex items-center space-x-2 text-blue-600 border-b border-blue-100 pb-2 mb-4">
                         <Box size={16} />
                         <span className="text-xs font-bold uppercase tracking-widest">LOGÍSTICA</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                         <FormSelect label="NAVE" placeholder="Buscar Nave..." options={['MSC ROSA', 'HAPAG LLOYD', 'MAERSK SEALAND']} value={ship} onChange={setShip} />
                         <FormInput label="VIAJE" placeholder="" value={voyage} onChange={setVoyage} />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <FormInput label="N° BL" placeholder="" value={bl} onChange={setBl} />
                         <FormSelect label="LÍNEA NAVIERA" placeholder="Seleccionar..." options={['MSC', 'HAPAG', 'CMA CGM']} value={shippingLine} onChange={setShippingLine} />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <FormInput label="PESO BRUTO (KG)" placeholder="" value={grossWeight} onChange={setGrossWeight} />
                         
                         <div className="flex flex-col space-y-1.5">
                            <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">CONDICIÓN</label>
                            <div className="flex bg-slate-100 rounded-md p-1">
                                <button 
                                  onClick={() => setCondition('DIRECTO')}
                                  className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${condition === 'DIRECTO' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    DIRECTO
                                </button>
                                <button 
                                  onClick={() => setCondition('INDIRECTO')}
                                  className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${condition === 'INDIRECTO' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    INDIRECTO
                                </button>
                            </div>
                         </div>
                     </div>
                 </div>

                 <div className="space-y-6">
                     <div className="flex items-center space-x-2 text-blue-600 border-b border-blue-100 pb-2 mb-4">
                         <FileText size={16} />
                         <span className="text-xs font-bold uppercase tracking-widest">ADJUNTO DIGITAL</span>
                     </div>
                     
                     <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 h-32 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                         <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                             <Upload size={20} className="text-blue-500" />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest">SUBIR GUÍA DIGITAL</span>
                     </div>

                     <button 
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center"
                     >
                         <CheckCircle2 size={18} className="mr-2" />
                         CONFIRMAR REGISTRO
                     </button>
                 </div>

             </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full">
             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                     <div className="p-2 bg-slate-900 text-white rounded-md">
                         <History size={16} />
                     </div>
                     <div>
                         <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">BASE CONTROL DOCUMENTO</h3>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">REGISTRO HISTÓRICO DE INGRESOS CONTROLADOS</p>
                     </div>
                 </div>
                 <div className="flex items-center space-x-4">
                     <div className="px-3 py-1 rounded-full border border-slate-200 bg-white text-[10px] font-bold text-slate-600 uppercase flex items-center">
                         <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                         TOTAL: {localDocuments.length}
                     </div>
                 </div>
             </div>
             
             <div className="overflow-x-auto min-h-[300px] flex flex-col">
                 <table className="w-full text-left">
                     <thead className="bg-slate-50/50 border-b border-slate-100">
                         <tr>
                             {['PRECARGA / GUÍA', 'CONTENEDOR', 'ENTIDADES', 'LOGÍSTICA', 'CARGA / BL', 'ADJUNTO', 'ACCIONES'].map(h => (
                                 <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                             ))}
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                         {localDocuments.map(doc => (
                             <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-6 py-4">
                                     <div className="text-xs font-bold text-slate-800">{doc.guideNumber}</div>
                                     <div className="text-[9px] text-slate-400">{new Date(doc.timestamp).toLocaleDateString()}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100 text-xs font-mono font-bold inline-block">
                                         {doc.container}
                                     </div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="text-xs font-bold text-slate-700">{doc.client}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="text-xs text-slate-600">{doc.ship}</div>
                                     <div className="text-[9px] text-slate-400">V: {doc.voyage}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="text-xs font-medium text-slate-600">{doc.bl}</div>
                                     <div className="text-[9px] text-slate-400">{doc.grossWeight} KG</div>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                     <div className="p-1.5 bg-slate-100 text-slate-400 rounded inline-block cursor-pointer hover:bg-slate-200">
                                         <FileText size={14} />
                                     </div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                 
                 {localDocuments.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-3 py-10">
                        <FileText size={48} className="opacity-20" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-40">SIN REGISTROS DOCUMENTALES</span>
                    </div>
                 )}
             </div>
          </div>

       </div>
    </div>
  );
};
