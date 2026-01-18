import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { StockItem } from '../types';
import { Database, Search, MapPin, Save, FileSpreadsheet, ArrowRight, UploadCloud, FileUp } from 'lucide-react';

export const StockControl: React.FC = () => {
  const { stock, addStockItem, updateStockLocation, user } = useApp();
  
  // States
  const [sheetId, setSheetId] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Sheet ID Sync
  const handleSheetSync = () => {
    if (!sheetId) return;
    simulateLoad("Sincronizando con Google Sheets...");
  };

  // Handle Excel Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateLoad(`Cargando archivo: ${e.target.files[0].name}...`);
    }
  };

  const simulateLoad = (message: string) => {
    setIsSimulating(true);
    // Simulate API delay and data population
    setTimeout(() => {
        const mockItems: StockItem[] = [
            {
              id: Date.now().toString(),
              code: `IMP-${Math.floor(Math.random()*1000)}`,
              name: 'Cilindro Oxígeno Portátil',
              category: 'ACTIVO',
              quantity: 8, // Intentionally Low Stock (< 20) to trigger notification
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

  const getStatusBadge = (qty: number) => {
     if (qty === 0) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase">Sin Stock</span>;
     if (qty < 20) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase">Crítico</span>;
     return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700 border border-teal-200 uppercase">Disponible</span>;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      
      {/* Top Control Bar: Inputs & Search */}
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm flex-shrink-0 z-10">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar material..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 text-sm font-medium"
                />
            </div>

            {/* Data Ingestion Controls */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                {/* Google Sheets Input */}
                <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 w-full md:w-80 shadow-sm">
                   <div className="bg-green-50 px-3 py-2 border-r border-slate-200 text-green-700">
                      <FileSpreadsheet size={18} />
                   </div>
                   <input 
                      type="text" 
                      value={sheetId}
                      onChange={(e) => setSheetId(e.target.value)}
                      placeholder="Pegar ID Google Sheet" 
                      className="flex-1 px-3 py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
                   />
                   <button 
                     onClick={handleSheetSync}
                     disabled={!sheetId || isSimulating}
                     className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50"
                   >
                     <ArrowRight size={18} />
                   </button>
                </div>

                <div className="text-slate-300 font-bold self-center hidden md:block">O</div>

                {/* Excel Upload Button */}
                <label className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm text-sm font-bold w-full md:w-auto">
                    <FileUp size={18} />
                    <span>Cargar Excel</span>
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                </label>
            </div>
         </div>
      </div>

      {/* Main Table Area - Fills remaining screen */}
      <div className="flex-1 overflow-auto bg-white relative">
        {isSimulating && (
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-sm font-bold text-blue-700 animate-pulse">Procesando datos...</span>
                </div>
            </div>
        )}
        
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-3 border-b border-slate-200">Material / Producto</th>
              <th className="px-6 py-3 border-b border-slate-200">Categoría</th>
              <th className="px-6 py-3 border-b border-slate-200">Ubicación</th>
              <th className="px-6 py-3 border-b border-slate-200 text-center">Stock Físico</th>
              <th className="px-6 py-3 border-b border-slate-200">Código</th>
              <th className="px-6 py-3 border-b border-slate-200 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredStock.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-3">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.supplier}</div>
                </td>
                <td className="px-6 py-3">
                   <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                       item.category === 'ACTIVO' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-cyan-50 text-cyan-700 border border-cyan-100'
                   }`}>
                      {item.category}
                   </span>
                </td>
                <td className="px-6 py-3">
                   <div className="flex items-center max-w-[150px]">
                     <MapPin size={14} className="text-slate-400 mr-2 flex-shrink-0" />
                     <input 
                        type="text" 
                        value={item.location}
                        onChange={(e) => updateStockLocation(item.id, e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white outline-none w-full text-slate-700 transition-all text-xs py-1"
                     />
                   </div>
                </td>
                <td className="px-6 py-3 text-center">
                    <span className="font-mono text-base font-semibold text-slate-800">{item.quantity}</span>
                </td>
                <td className="px-6 py-3 font-mono text-xs text-slate-500">{item.code}</td>
                <td className="px-6 py-3 text-center">
                   {getStatusBadge(item.quantity)}
                </td>
              </tr>
            ))}
            {filteredStock.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                  <Database size={48} className="mx-auto mb-4 text-slate-200" />
                  <p>No se encontraron registros.</p>
                  <p className="text-xs mt-1">Utilice la barra superior para importar datos.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};