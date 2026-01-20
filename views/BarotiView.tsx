
import React, { useState } from 'react';
import { Search, Filter, Info } from 'lucide-react';

export const BarotiView: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState('A');
  const [activeZone, setActiveZone] = useState('TODOS');

  const bays = [
    { id: '01', used: 0, total: 25 },
    { id: '03', used: 0, total: 25 },
    { id: '05', used: 0, total: 25 },
    { id: '07', used: 0, total: 25 },
    { id: '09', used: 0, total: 25 },
    { id: '11', used: 0, total: 25 },
  ];

  const rows = ['T5', 'T4', 'T3', 'T2', 'T1'];
  const cols = ['R1', 'R2', 'R3', 'R4', 'R5'];

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans overscroll-contain w-full">
       <div className="w-full space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8 w-full">

             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bloque del Depósito</h3>
                   <div className="flex gap-2">
                      {['A', 'B', 'C'].map(block => (
                         <button
                            key={block}
                            onClick={() => setActiveBlock(block)}
                            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all border ${activeBlock === block ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                         >
                            BLOQUE {block}
                         </button>
                      ))}
                   </div>
                </div>
                <div>
                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-end"><Filter size={10} className="mr-1"/> Filtro de Zona Operativa</h3>
                   <div className="flex bg-slate-100 p-1 rounded-lg">
                      {['TODOS', 'FCL', 'LCL'].map(zone => (
                         <button
                            key={zone}
                            onClick={() => setActiveZone(zone)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeZone === zone ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                            {zone}
                         </button>
                      ))}
                   </div>
                </div>
             </div>

             <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bahías Disponibles (Bays)</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                   {bays.map(bay => (
                      <div key={bay.id} className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-blue-300 transition-colors cursor-pointer bg-slate-50/30 group">
                         <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">BAY {bay.id}</span>
                         <span className="text-[10px] font-bold text-blue-500 mt-1">{bay.used} / {bay.total}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center"><Search size={10} className="mr-1"/> Filtro de Unidades (ID / Cliente)</h3>
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input
                      type="text"
                      placeholder="Buscar o filtrar en mapa..."
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                   />
                </div>
             </div>

             <div className="flex items-center gap-6">
                <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                   <span className="w-3 h-3 bg-slate-900 rounded-sm mr-2"></span>
                   Zona FCL (Varios Bloques)
                </div>
                <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                   <span className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></span>
                   Zona LCL (Bloque C)
                </div>
             </div>

             <div className="flex justify-center py-4 overflow-x-auto">
                <div className="min-w-[600px] w-full max-w-4xl">
                   <div className="grid grid-cols-6 mb-4">
                      <div></div> 
                      {cols.map(c => (
                         <div key={c} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c}</div>
                      ))}
                   </div>

                   {rows.map(r => (
                      <div key={r} className="grid grid-cols-6 mb-4 gap-4">
                         <div className="flex items-center justify-end pr-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r}</div>
                         {cols.map(c => (
                            <div key={`${r}-${c}`} className="aspect-[16/9] border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group">
                               <span className="text-[9px] font-bold text-slate-300 group-hover:text-blue-500 uppercase tracking-widest">Libre</span>
                            </div>
                         ))}
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center text-xs font-bold text-slate-600 uppercase tracking-wide">
                   <Info size={16} className="text-blue-500 mr-2" />
                   Los bloques se auto-asignan según flujo: Bloques A-B (FCL) | Bloque C (LCL)
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest">
                   <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-900 mr-1"></span> FCL</div>
                   <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span> LCL</div>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};
