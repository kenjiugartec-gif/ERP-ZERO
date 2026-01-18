
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { StockItem } from '../types';
import { Database, Search, MapPin, Save, FileSpreadsheet, ArrowRight, UploadCloud, FileUp } from 'lucide-react';

const inputBaseClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-normal focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all shadow-sm";

export const StockControl: React.FC = () => {
  const { stock, addStockItem, updateStockLocation, user } = useApp();
  
  const [sheetId, setSheetId] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSheetSync = () => {
    if (!sheetId) return;
    simulateLoad("Sincronizando con Google Sheets...");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateLoad(`Cargando archivo: ${e.target.files[0].name}...`);
    }
  };

  const simulateLoad = (message: string) => {
    setIsSimulating(true);
    setTimeout(() => {
        const mockItems: StockItem[] = [
            {
              id: Date.now().toString(),
              code: `IMP-${Math.floor(Math.random()*1000)}`,
              name: 'Cilindro Oxígeno Portátil',
              category: 'ACTIVO',
              quantity: 8,
              location: 'Recepcion',
              receptionBranch: user?.location || 'Central',
              supplier: 'Excel Import',
              lastUpdated: new Date().toISOString()
            }
        ];
        mockItems.forEach(item => addStockItem(item));
        setIsSimulating(false);
        setSheetId('');
    }, 1500);
  };

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-white border-b border-slate-100 p-6 flex-shrink-0 z-10">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar material o código..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none text-slate-900 text-sm font-normal shadow-sm transition-all"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-green-500/5 focus-within:border-green-400 w-full md:w-96 shadow-sm transition-all">
                   <div className="bg-green-50 px-4 py-3.5 border-r border-slate-100 text-green-700">
                      <FileSpreadsheet size={18} />
                   </div>
                   <input 
                      type="text" 
                      value={sheetId}
                      onChange={(e) => setSheetId(e.target.value)}
                      placeholder="Pegar ID Google Sheet" 
                      className="flex-1 px-4 py-3.5 text-sm outline-none text-slate-900 font-normal placeholder:text-slate-400 bg-transparent"
                   />
                   <button 
                     onClick={handleSheetSync}
                     disabled={!sheetId || isSimulating}
                     className="px-5 py-3.5 bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50"
                   >
                     <ArrowRight size={20} />
                   </button>
                </div>

                <label className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl cursor-pointer transition-all shadow-lg active:scale-95 text-xs font-bold uppercase tracking-widest w-full md:w-auto">
                    <FileUp size={18} />
                    <span>Cargar Excel</span>
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                </label>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-auto bg-white relative">
        {isSimulating && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span className="text-sm font-bold text-blue-700 uppercase tracking-widest animate-pulse">Sincronizando...</span>
                </div>
            </div>
        )}
        
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest sticky top-0 z-10 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Material</th>
              <th className="px-8 py-5">Categoría</th>
              <th className="px-8 py-5">Nodo</th>
              <th className="px-8 py-5 text-center">Físico</th>
              <th className="px-8 py-5">Audit SKU</th>
              <th className="px-8 py-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStock.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{item.supplier}</div>
                </td>
                <td className="px-8 py-5">
                   <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[9px] font-bold border border-slate-200">{item.category}</span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center space-x-2 text-slate-600">
                     <MapPin size={12} className="opacity-40" />
                     <input 
                        type="text" 
                        value={item.location}
                        onChange={(e) => updateStockLocation(item.id, e.target.value)}
                        className="bg-transparent border-none outline-none focus:bg-slate-100 focus:px-2 focus:rounded-md transition-all text-xs"
                     />
                   </div>
                </td>
                <td className="px-8 py-5 text-center font-black text-slate-800">{item.quantity}</td>
                <td className="px-8 py-5 font-mono text-xs text-slate-400">{item.code}</td>
                <td className="px-8 py-5 text-center">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${item.quantity < 20 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {item.quantity < 20 ? 'Crítico' : 'OK'}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
