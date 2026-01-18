
import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { StockItem } from '../types';
import { Database, Search, MapPin, Save, FileSpreadsheet, ArrowRight, UploadCloud, FileUp, Package, Download } from 'lucide-react';

export const StockControl: React.FC = () => {
  const { stock, addStockItem, updateStockLocation, user, currentConfig, appName } = useApp();
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
              location: user?.location || 'Central',
              receptionBranch: user?.location || 'Central',
              supplier: 'Excel Import',
              lastUpdated: new Date().toISOString()
            }
        ];
        mockItems.forEach(item => addStockItem(item));
        setIsSimulating(false);
    }, 1500);
  };

  const filteredStock = useMemo(() => {
    return stock.filter(item => 
      item.location === user?.location && 
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [stock, user, searchTerm]);

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-white report-container">
      {/* Print-Only Header */}
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
          <h2 className="text-lg font-bold uppercase underline">Certificado de Inventario Técnico</h2>
          <p className="text-xs text-slate-500">Auditoría de existencias: {new Date().toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white border-b border-slate-100 p-8 flex-shrink-0 z-10 no-print">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
               <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
                  <Package size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Inventario Técnico</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Gestión de existencias del nodo {user?.location}</p>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar material..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none text-slate-900 text-sm shadow-sm transition-all"
                    />
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl cursor-pointer transition-all border border-slate-200 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                      <FileUp size={18} />
                      <span className="hidden sm:inline">Importar XLS</span>
                      <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                  </label>
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-xs font-bold uppercase tracking-widest"
                  >
                      <Download size={18} />
                      <span className="hidden sm:inline">Bajar Reporte</span>
                  </button>
                </div>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-auto bg-white relative print:overflow-visible">
        {isSimulating && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center no-print">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span className="text-sm font-bold text-blue-700 uppercase tracking-widest animate-pulse">Procesando Datos...</span>
                </div>
            </div>
        )}
        
        <table className="w-full text-sm text-left print:border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest sticky top-0 z-10 border-b border-slate-100 print:static print:bg-slate-100 print:text-slate-900">
            <tr>
              <th className="px-8 py-5">Material</th>
              <th className="px-8 py-5 text-center">Tipo</th>
              <th className="px-8 py-5 text-center">Físico</th>
              <th className="px-8 py-5">Control SKU</th>
              <th className="px-8 py-5">Última Auditoría</th>
              <th className="px-8 py-5 text-right no-print">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStock.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{item.supplier}</div>
                </td>
                <td className="px-8 py-5 text-center">
                   <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[9px] font-bold border border-slate-200 print:border-none print:p-0">{item.category}</span>
                </td>
                <td className="px-8 py-5 text-center font-black text-slate-800 text-base">{item.quantity}</td>
                <td className="px-8 py-5 font-mono text-xs text-slate-500">{item.code}</td>
                <td className="px-8 py-5 text-xs text-slate-400">
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 text-right no-print">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${item.quantity < 20 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {item.quantity < 20 ? 'Reposición' : 'Óptimo'}
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
