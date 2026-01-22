
import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  FileClock, Search, Printer, MapPin, Download,
  CheckCircle, AlertCircle, XCircle, Image as ImageIcon, X
} from 'lucide-react';

export const MobileHistoryView: React.FC = () => {
  const { mobileInspections, user, appName, currentConfig } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPhotos, setViewingPhotos] = useState<string[] | null>(null);

  const localInspections = useMemo(() => {
    return mobileInspections.filter(i => 
      i.location === user?.location &&
      (i.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
       i.driver.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [mobileInspections, user, searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 font-sans report-container w-full">
      
      {/* Print Header */}
      <div className="print-only">
        <div className="print-header">
          <div className="flex flex-col">
            <h1 className="print-title">{appName}</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{user?.location}</p>
          </div>
          {currentConfig.logo && (
            <img src={currentConfig.logo} alt="Logo" className="print-logo" />
          )}
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase underline">Histórico de Control Móvil</h2>
          <p className="text-xs text-slate-500">Generado el: {new Date().toLocaleString()}</p>
        </div>
      </div>

      <div className="w-full space-y-6">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 no-print">
            <div className="flex items-center space-x-4">
               <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
                  <FileClock size={24} />
               </div>
               <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight">Histórico Móvil</h2>
                  <p className="text-xs md:text-sm text-slate-500 font-medium">Registro de inspecciones y estado de flota</p>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar patente..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
                    />
                </div>
                <button 
                  onClick={handlePrint}
                  className="flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-wider"
                >
                    <Printer size={16} className="mr-2" /> Imprimir
                </button>
            </div>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
             <div className="overflow-x-auto">
                 <table className="w-full text-left whitespace-nowrap">
                     <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                         <tr>
                             <th className="px-6 py-4">Fecha / Hora</th>
                             <th className="px-6 py-4">Móvil (PPU)</th>
                             <th className="px-6 py-4">Conductor</th>
                             <th className="px-6 py-4">Estado</th>
                             <th className="px-6 py-4">Observaciones</th>
                             <th className="px-6 py-4 text-center">Evidencia</th>
                             <th className="px-6 py-4 text-right">Inspector</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 text-sm">
                         {localInspections.length === 0 ? (
                             <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400 italic text-xs uppercase tracking-wider">No hay inspecciones registradas.</td></tr>
                         ) : (
                             localInspections.map(insp => (
                                 <tr key={insp.id} className="hover:bg-slate-50 transition-colors">
                                     <td className="px-6 py-4 text-xs font-mono text-slate-500">
                                         {new Date(insp.timestamp).toLocaleString()}
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-slate-800 font-bold text-xs">{insp.plate}</span>
                                     </td>
                                     <td className="px-6 py-4 text-xs font-bold text-slate-700">
                                         {insp.driver}
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${
                                             insp.status === 'LIMPIO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                             insp.status === 'PRESENTABLE' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                             'bg-red-50 text-red-600 border-red-100'
                                         }`}>
                                             {insp.status === 'LIMPIO' ? <CheckCircle size={10} className="mr-1"/> : 
                                              insp.status === 'PRESENTABLE' ? <CheckCircle size={10} className="mr-1"/> : 
                                              <XCircle size={10} className="mr-1"/>}
                                             {insp.status}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4">
                                         <p className="text-xs text-slate-500 truncate max-w-[150px] md:max-w-[200px]" title={insp.details}>
                                             {insp.details || '---'}
                                         </p>
                                     </td>
                                     <td className="px-6 py-4 text-center">
                                         <button 
                                            onClick={() => setViewingPhotos(Object.values(insp.photos))}
                                            className="inline-flex items-center justify-center p-2 bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                         >
                                             <ImageIcon size={16} />
                                         </button>
                                     </td>
                                     <td className="px-6 py-4 text-right text-xs font-mono text-slate-400">
                                         {insp.user}
                                     </td>
                                 </tr>
                             ))
                         )}
                     </tbody>
                 </table>
             </div>
         </div>

      </div>

      {/* Photo Viewer Modal */}
      {viewingPhotos && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300 no-print">
           <button 
             onClick={() => setViewingPhotos(null)}
             className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
           >
              <X size={32} />
           </button>
           
           <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[85vh]">
               {viewingPhotos.map((photo, idx) => (
                  <div key={idx} className="bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl aspect-[4/3] relative">
                     <img src={photo} className="w-full h-full object-contain" />
                  </div>
               ))}
           </div>
        </div>
      )}

    </div>
  );
};
