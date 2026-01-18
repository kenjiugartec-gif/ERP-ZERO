import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { GateTransaction, TransactionItem } from '../types';
import { ChevronDown, ChevronRight, Save, Lock, Unlock, LogIn, LogOut, Truck, AlertTriangle, XCircle, CheckSquare, ShieldCheck, User, Box, Activity } from 'lucide-react';

// --- CONSTANTS SPECIFIC TO PROMPT ---
const ASSETS_LIST = [
  "Cilindro 10m3", "Cilindro 1m3", "Liberator", "Mochila", "Concentrador", "Regulador"
];

const REGULATOR_VARIANTS = ["0-2", "0-3", "0-6", "0-15"];

const SUPPLIES_LIST = [
  "Agua", "Naricera Adulto", "Naricera Infantil", "Naricera Pediátrica", 
  "Extensión de 7mts", "Extensión de 2mts", "Carro tipo E", 
  "Mangueras Cortas", "Vasos Humidificadores"
];

// --- HELPER COMPONENTS ---

/**
 * InventoryAccordion
 * Handles the specific logic for Assets (with Regulator variants) and Supplies.
 * Supports 'QUANTITY' mode (counters) and 'CHECKLIST' mode (checkboxes).
 */
interface InventoryAccordionProps {
  mode: 'CHECKLIST' | 'QUANTITY'; 
  selectedItems: TransactionItem[];
  onChange: (items: TransactionItem[]) => void;
  readOnly?: boolean;
}

const InventoryAccordion: React.FC<InventoryAccordionProps> = ({ mode, selectedItems, onChange, readOnly = false }) => {
  const [openSection, setOpenSection] = useState<'ACTIVOS' | 'INSUMOS' | null>('ACTIVOS');

  const handleToggleSection = (section: 'ACTIVOS' | 'INSUMOS') => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const getQuantity = (name: string, variant?: string) => {
    if (!variant) {
        // Sum generic items or all variants if no variant specified
        return selectedItems.filter(i => i.name === name).reduce((acc, curr) => acc + curr.quantity, 0);
    }
    const item = selectedItems.find(i => i.name === name && i.details === variant);
    return item ? item.quantity : 0;
  };

  const handleUpdateItem = (name: string, type: 'ACTIVO' | 'INSUMO', value: number | boolean, variant?: string) => {
    if (readOnly) return;

    let newItems = [...selectedItems];
    const existsIndex = newItems.findIndex(i => i.name === name && i.details === variant);

    if (mode === 'CHECKLIST') {
        // Checkbox Logic
        if (value === true) {
             if (existsIndex === -1) newItems.push({ name, type, quantity: 1, details: variant });
        } else {
             if (existsIndex > -1) newItems.splice(existsIndex, 1);
        }
    } else {
        // Quantity Logic
        const qty = value as number;
        if (qty <= 0) {
            if (existsIndex > -1) newItems.splice(existsIndex, 1);
        } else {
            if (existsIndex > -1) {
                newItems[existsIndex].quantity = qty;
            } else {
                newItems.push({ name, type, quantity: qty, details: variant });
            }
        }
    }
    onChange(newItems);
  };

  const renderCounter = (item: string, type: 'ACTIVO' | 'INSUMO', variant?: string) => {
      const qty = getQuantity(item, variant);
      
      if (readOnly) {
          if (qty === 0) return null; // Don't show empty items in read-only
          return (
             <div className="flex items-center space-x-2">
                 <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{qty}</span>
             </div>
          );
      }

      return (
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg">
            <button 
                onClick={() => handleUpdateItem(item, type, qty - 1, variant)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-l-lg transition"
            >-</button>
            <input 
                type="number" 
                value={qty}
                onChange={(e) => handleUpdateItem(item, type, parseInt(e.target.value) || 0, variant)}
                className="w-12 text-center text-sm font-bold bg-transparent outline-none text-slate-700"
            />
            <button 
                onClick={() => handleUpdateItem(item, type, qty + 1, variant)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-r-lg transition"
            >+</button>
        </div>
      );
  };

  const renderRow = (item: string, type: 'ACTIVO' | 'INSUMO') => {
     // Special Case: Regulador in Quantity Mode
     if (item === 'Regulador' && mode === 'QUANTITY') {
         const totalRegulators = REGULATOR_VARIANTS.reduce((acc, v) => acc + getQuantity('Regulador', v), 0);
         
         // In ReadOnly, only show if there are regulators
         if (readOnly && totalRegulators === 0) return null;

         return (
             <div key={item} className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-2">
                 <div className="flex justify-between items-center mb-2">
                     <span className="font-medium text-slate-700 text-sm">Regulador (Detalle)</span>
                     {readOnly && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Total: {totalRegulators}</span>}
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                     {REGULATOR_VARIANTS.map(variant => {
                         const qty = getQuantity('Regulador', variant);
                         if (readOnly && qty === 0) return null;
                         return (
                             <div key={variant} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                 <span className="text-xs text-slate-500 font-semibold">{variant}</span>
                                 {renderCounter('Regulador', type, variant)}
                             </div>
                         );
                     })}
                 </div>
             </div>
         );
     }

     // Standard Row
     const qty = getQuantity(item);
     const isChecked = qty > 0;
     
     if (readOnly && qty === 0) return null;

     return (
         <div key={item} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 transition-colors">
             <div className="flex items-center space-x-3">
                 {mode === 'CHECKLIST' && !readOnly && (
                     <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => handleUpdateItem(item, type, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                     />
                 )}
                 <span className="text-sm text-slate-600 font-medium">{item}</span>
             </div>
             {mode === 'QUANTITY' && renderCounter(item, type)}
         </div>
     );
  };

  return (
    <div className="space-y-4">
      {/* SECTION: ACTIVOS */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
         <button 
           onClick={() => handleToggleSection('ACTIVOS')}
           className={`w-full flex items-center justify-between p-4 transition-colors ${openSection === 'ACTIVOS' ? 'bg-blue-50 text-blue-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
         >
            <div className="flex items-center font-bold text-xs uppercase tracking-wider">
                <Box size={16} className="mr-2" />
                Activos (Cilindros y Equipos)
            </div>
            {openSection === 'ACTIVOS' ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
         </button>
         
         {openSection === 'ACTIVOS' && (
             <div className="p-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                 {ASSETS_LIST.map(item => renderRow(item, 'ACTIVO'))}
             </div>
         )}
      </div>

      {/* SECTION: INSUMOS */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
         <button 
           onClick={() => handleToggleSection('INSUMOS')}
           className={`w-full flex items-center justify-between p-4 transition-colors ${openSection === 'INSUMOS' ? 'bg-teal-50 text-teal-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
         >
            <div className="flex items-center font-bold text-xs uppercase tracking-wider">
                <Activity size={16} className="mr-2" />
                Insumos (Material Médico)
            </div>
            {openSection === 'INSUMOS' ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
         </button>
         
         {openSection === 'INSUMOS' && (
             <div className="p-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                 {SUPPLIES_LIST.map(item => renderRow(item, 'INSUMO'))}
             </div>
         )}
      </div>
    </div>
  );
};

// --- GATE CONTROL VIEW ---
export const GateControl: React.FC = () => {
  const { transactions, updateTransaction, user } = useApp();
  
  // State for Exit Logic
  const [selectedExitPlate, setSelectedExitPlate] = useState('');
  
  // State for Entry Logic
  const [selectedEntry, setSelectedEntry] = useState<GateTransaction | null>(null);
  const [checklistItems, setChecklistItems] = useState<TransactionItem[]>([]);

  // Filter Transactions
  const pendingExit = transactions.filter(t => t.status === 'PENDING_EXIT');
  const inRoute = transactions.filter(t => t.status === 'IN_ROUTE' || t.status === 'PENDING_ENTRY');
  
  const selectedExitTrans = transactions.find(t => t.plate === selectedExitPlate && t.status === 'PENDING_EXIT');

  const handleAuthorizeExit = () => {
    if (selectedExitTrans) {
        if(confirm(`¿Autorizar salida de ${selectedExitTrans.plate}?`)) {
            updateTransaction(selectedExitTrans.id, { 
                status: 'IN_ROUTE', 
                exitTime: new Date().toISOString(),
                user_Gate_Out: user?.name
            });
            setSelectedExitPlate('');
        }
    }
  };

  const handleAuthorizeEntry = () => {
      if (selectedEntry) {
          updateTransaction(selectedEntry.id, {
              status: 'ENTRY_AUTHORIZED',
              entryTime: new Date().toISOString(),
              entryItems_Gate: checklistItems,
              user_Gate_In: user?.name
          });
          setSelectedEntry(null);
          setChecklistItems([]);
          alert(`Ingreso autorizado. Control E/S desbloqueado para ${selectedEntry.plate}`);
      }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
           <div>
              <h2 className="text-xl font-bold text-slate-800">Control Puerta</h2>
              <p className="text-sm text-slate-500">Validación de seguridad y flujos</p>
           </div>
           <div className="bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-600">
               {user?.name || 'Operador'}
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            
            {/* --- COLUMNA SALIDA (Red Design) --- */}
            <div className="flex flex-col">
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-500 overflow-hidden min-h-[500px] flex flex-col relative">
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center text-red-600 mb-1">
                            <LogOut size={20} className="mr-2" />
                            <h3 className="font-bold text-lg text-slate-800">Registro de Salidas</h3>
                        </div>
                        <p className="text-xs text-slate-400">Validación de carga autorizada por E/S</p>
                    </div>

                    <div className="p-6 flex-1 flex flex-col space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-1 block">Vehículo</label>
                                <div className="relative">
                                    <select 
                                        value={selectedExitPlate}
                                        onChange={e => setSelectedExitPlate(e.target.value)}
                                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none appearance-none"
                                    >
                                        <option value="">Selecciona vehículo</option>
                                        {pendingExit.map(t => <option key={t.plate} value={t.plate}>{t.plate}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-1 block">Operador</label>
                                <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 flex items-center">
                                    <User size={14} className="mr-2 opacity-50"/>
                                    {user?.name || '---'}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative border border-slate-100 rounded-xl bg-slate-50/50 p-1">
                             {!selectedExitTrans && (
                                 <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
                                     <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                                         <Lock size={20} />
                                     </div>
                                     <h4 className="font-bold text-slate-800">Acceso Bloqueado</h4>
                                     <p className="text-xs text-slate-500 mt-1">Seleccione un vehículo con salida pendiente.</p>
                                 </div>
                             )}
                             <div className={!selectedExitTrans ? 'filter blur-sm opacity-50' : ''}>
                                 <div className="p-3">
                                     <label className="text-xs font-bold text-slate-700 mb-2 block">Activos e Insumos (Declarados)</label>
                                     <InventoryAccordion 
                                         mode="QUANTITY" 
                                         readOnly={true} 
                                         selectedItems={selectedExitTrans?.exitItems_ES || []} 
                                         onChange={() => {}} 
                                     />
                                 </div>
                             </div>
                        </div>

                        <button 
                            onClick={handleAuthorizeExit}
                            disabled={!selectedExitTrans}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all active:scale-[0.98]
                                ${selectedExitTrans ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-slate-300 cursor-not-allowed shadow-none'}
                            `}
                        >
                            Registrar Salida
                        </button>
                    </div>
                </div>
            </div>

            {/* --- COLUMNA INGRESO (Teal Design) --- */}
            <div className="flex flex-col">
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-teal-500 overflow-hidden min-h-[500px] flex flex-col relative">
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center text-teal-600 mb-1">
                            <LogIn size={20} className="mr-2" />
                            <h3 className="font-bold text-lg text-slate-800">Registro de Ingresos</h3>
                        </div>
                        <p className="text-xs text-slate-400">Control visual de retorno</p>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                        {!selectedEntry ? (
                            <div className="space-y-3">
                                {inRoute.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                                        <Truck size={48} className="mb-2 opacity-50"/>
                                        <p className="text-sm">Sin vehículos en ruta</p>
                                    </div>
                                )}
                                {inRoute.map(t => (
                                    <div key={t.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center hover:border-teal-300 transition-colors cursor-pointer" onClick={() => { setSelectedEntry(t); setChecklistItems([]); }}>
                                        <div>
                                            <span className="font-bold text-slate-800 block">{t.plate}</span>
                                            <span className="text-xs text-slate-500">En Ruta</span>
                                        </div>
                                        <div className="bg-teal-50 text-teal-700 p-2 rounded-lg">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col animate-in slide-in-from-right-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-xl text-slate-800">{selectedEntry.plate}</h4>
                                    <button onClick={() => setSelectedEntry(null)} className="text-slate-400 hover:text-red-500">
                                        <XCircle size={24} />
                                    </button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto mb-4 border border-slate-100 rounded-xl bg-slate-50 p-2">
                                     <InventoryAccordion 
                                         mode="CHECKLIST" 
                                         selectedItems={checklistItems} 
                                         onChange={setChecklistItems} 
                                     />
                                </div>

                                <button 
                                    onClick={handleAuthorizeEntry}
                                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-lg shadow-teal-200 transition-all active:scale-[0.98]"
                                >
                                    Autorizar Ingreso
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

// --- IO CONTROL VIEW ---
export const IOControl: React.FC = () => {
  const { vehicles, createTransaction, transactions, updateTransaction, user } = useApp();
  const [mode, setMode] = useState<'EXIT' | 'ENTRY'>('EXIT');
  const [selectedPlate, setSelectedPlate] = useState('');
  const [items, setItems] = useState<TransactionItem[]>([]);

  // Filtros
  // Para Salida: Vehículos que NO están en una transacción activa
  const availableForExit = vehicles.filter(v => 
    !transactions.find(t => t.plate === v.plate && t.status !== 'COMPLETED')
  );

  // Para Entrada: Vehículos que YA fueron autorizados por Control Puerta (ENTRY_AUTHORIZED)
  const availableForEntry = transactions.filter(t => t.status === 'ENTRY_AUTHORIZED');

  const handleSaveExit = () => {
      if(!selectedPlate) return;
      const vehicle = vehicles.find(v => v.plate === selectedPlate);
      
      const newTransaction: GateTransaction = {
          id: Date.now().toString(),
          plate: selectedPlate,
          driver: vehicle?.driver || 'Desconocido',
          status: 'PENDING_EXIT', // Esto bloqueará la salida en Puerta hasta que E/S termine, pero aquí ya terminó, así que estado PENDING_EXIT habilita a Puerta para revisar.
          exitItems_ES: items,
          exitItems_Gate: [],
          entryItems_ES: [],
          entryItems_Gate: [],
          user_ES_Out: user?.name
      };
      
      createTransaction(newTransaction);
      alert("Salida registrada en E/S. El vehículo ahora es visible en Control Puerta.");
      resetForm();
  };

  const handleSaveEntry = () => {
      if(!selectedPlate) return;
      const trans = transactions.find(t => t.plate === selectedPlate && t.status === 'ENTRY_AUTHORIZED');
      
      if(trans) {
          updateTransaction(trans.id, {
              status: 'COMPLETED',
              entryItems_ES: items,
              user_ES_In: user?.name
          });
          alert("Ingreso registrado. Ciclo completo. Información enviada a Control VTA.");
          resetForm();
      }
  };

  const resetForm = () => {
      setSelectedPlate('');
      setItems([]);
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <div className="max-w-4xl mx-auto">
         
         {/* Navigation Tabs */}
         <div className="flex bg-slate-100 p-1 rounded-xl mb-6 shadow-inner">
             <button 
                onClick={() => { setMode('EXIT'); resetForm(); }}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${mode === 'EXIT' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
                 <LogOut size={16} className="mr-2" />
                 CONTROL SALIDA
             </button>
             <button 
                onClick={() => { setMode('ENTRY'); resetForm(); }}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${mode === 'ENTRY' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
                 <LogIn size={16} className="mr-2" />
                 CONTROL INGRESO
             </button>
         </div>

         {/* Main Card */}
         <div className={`bg-white rounded-xl shadow-lg border-l-4 overflow-hidden min-h-[500px] flex flex-col relative ${mode === 'EXIT' ? 'border-amber-500' : 'border-teal-500'}`}>
             
             {/* Header */}
             <div className="p-6 border-b border-slate-100">
                 <h3 className={`font-bold text-lg flex items-center ${mode === 'EXIT' ? 'text-amber-600' : 'text-teal-600'}`}>
                     {mode === 'EXIT' ? <LogOut size={20} className="mr-2"/> : <LogIn size={20} className="mr-2"/>}
                     {mode === 'EXIT' ? 'Declaración de Carga (Salida)' : 'Declaración de Retorno (Entrada)'}
                 </h3>
                 <p className="text-xs text-slate-400">
                     {mode === 'EXIT' ? 'Registro inicial para desbloqueo de puerta' : 'Cierre de ciclo y auditoría'}
                 </p>
             </div>

             <div className="p-6 flex-1 flex flex-col space-y-6">
                 
                 {/* Selectors */}
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="text-xs font-bold text-slate-700 mb-1 block">
                             {mode === 'EXIT' ? 'Seleccionar Móvil Disponible' : 'Móvil Autorizado por Puerta'}
                         </label>
                         <div className="relative">
                             <select 
                                value={selectedPlate}
                                onChange={e => { setSelectedPlate(e.target.value); setItems([]); }}
                                className={`w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 outline-none appearance-none ${mode === 'EXIT' ? 'focus:ring-amber-100 focus:border-amber-400' : 'focus:ring-teal-100 focus:border-teal-400'}`}
                             >
                                 <option value="">-- Seleccionar --</option>
                                 {mode === 'EXIT' 
                                    ? availableForExit.map(v => <option key={v.plate} value={v.plate}>{v.plate} - {v.driver}</option>)
                                    : availableForEntry.map(t => <option key={t.plate} value={t.plate}>{t.plate} - {t.driver}</option>)
                                 }
                             </select>
                             <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                         </div>
                     </div>
                     <div>
                         <label className="text-xs font-bold text-slate-700 mb-1 block">Responsable E/S</label>
                         <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 flex items-center">
                             <User size={14} className="mr-2 opacity-50"/>
                             {user?.name}
                         </div>
                     </div>
                 </div>

                 {/* Locked State for ENTRY if list is empty */}
                 {mode === 'ENTRY' && availableForEntry.length === 0 && !selectedPlate && (
                     <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                             <Lock size={24} className="text-slate-400"/>
                         </div>
                         <h4 className="font-bold text-slate-600">Módulo Bloqueado</h4>
                         <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                             Control Puerta debe autorizar el ingreso antes de poder registrar la descarga.
                         </p>
                     </div>
                 )}

                 {/* Accordion Form */}
                 {(mode === 'EXIT' || (mode === 'ENTRY' && selectedPlate)) && (
                     <div className="flex-1 relative animate-in slide-in-from-bottom-2">
                         {!selectedPlate && mode === 'EXIT' && (
                              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                  <span className="bg-white px-4 py-2 rounded-full shadow-sm text-xs font-bold text-slate-400 border border-slate-200">Seleccione un vehículo primero</span>
                              </div>
                         )}
                         <div className={!selectedPlate ? 'opacity-50 pointer-events-none' : ''}>
                             <InventoryAccordion 
                                 mode="QUANTITY" 
                                 selectedItems={items} 
                                 onChange={setItems} 
                             />
                         </div>
                     </div>
                 )}

                 {/* Action Button */}
                 {(mode === 'EXIT' || (mode === 'ENTRY' && selectedPlate)) && (
                     <button 
                        onClick={mode === 'EXIT' ? handleSaveExit : handleSaveEntry}
                        disabled={!selectedPlate}
                        className={`w-full py-3.5 rounded-lg font-bold text-white shadow-lg transition-all active:scale-[0.98] flex justify-center items-center
                            ${!selectedPlate 
                                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                : mode === 'EXIT' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'}
                        `}
                     >
                        <Save size={18} className="mr-2" />
                        {mode === 'EXIT' ? 'Guardar Salida (Desbloquear Puerta)' : 'Guardar Ingreso (Finalizar)'}
                     </button>
                 )}

             </div>
         </div>
      </div>
    </div>
  );
};