
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Info, Box, X, Move, 
  Edit2, Trash2, Save, ArrowRightLeft, CheckCircle2, 
  AlertTriangle, Anchor, Scale, User, LayoutGrid, MousePointer2
} from 'lucide-react';

// --- TYPES ---
interface ContainerData {
  id: string; // Container ID (e.g., MSCU1234567)
  client: string;
  type: 'FCL' | 'LCL';
  size: '20' | '40';
  weight: number;
  ship: string;
  block: string;
  bay: string;
  row: string; // R1-R5
  tier: string; // T1-T5 (Height)
  status: 'ALMACENADO' | 'BLOQUEADO' | 'PLANIFICADO';
  color?: string;
}

// --- MOCK DATA ---
const INITIAL_INVENTORY: ContainerData[] = [
  { id: 'MSCU1234567', client: 'SODIMAC', type: 'FCL', size: '40', weight: 22500, ship: 'MSC ROSA', block: 'A', bay: '01', row: 'R1', tier: 'T1', status: 'ALMACENADO', color: 'bg-blue-600' },
  { id: 'HLCU9876543', client: 'FALABELLA', type: 'FCL', size: '40', weight: 18000, ship: 'HAPAG LONDON', block: 'A', bay: '01', row: 'R1', tier: 'T2', status: 'ALMACENADO', color: 'bg-orange-600' },
  { id: 'MAEU1122334', client: 'CENCOSUD', type: 'FCL', size: '20', weight: 12000, ship: 'MAERSK SEALAND', block: 'A', bay: '01', row: 'R3', tier: 'T1', status: 'BLOQUEADO', color: 'bg-red-600' },
  { id: 'CSQU5566778', client: 'WALMART', type: 'LCL', size: '40', weight: 5000, ship: 'COSCO SHIPPING', block: 'C', bay: '05', row: 'R2', tier: 'T1', status: 'ALMACENADO', color: 'bg-purple-600' },
  { id: 'CMAU9988776', client: 'MERCADO LIBRE', type: 'FCL', size: '40', weight: 24000, ship: 'CMA CGM', block: 'A', bay: '01', row: 'R2', tier: 'T3', status: 'PLANIFICADO', color: 'bg-teal-600' },
];

const ROWS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];
const TIERS = ['T5', 'T4', 'T3', 'T2', 'T1']; // Visual order: Top to Bottom
const BAYS = ['01', '03', '05', '07', '09', '11'];

export const BarotiView: React.FC = () => {
  // State
  const [inventory, setInventory] = useState<ContainerData[]>(INITIAL_INVENTORY);
  const [activeBlock, setActiveBlock] = useState('A');
  const [activeBay, setActiveBay] = useState('01');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'TODOS' | 'FCL' | 'LCL'>('TODOS');
  
  // Modal & Actions State
  const [selectedUnit, setSelectedUnit] = useState<ContainerData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [moveMode, setMoveMode] = useState<{ active: boolean; sourceId?: string }>({ active: false });
  const [editForm, setEditForm] = useState<Partial<ContainerData>>({});
  
  // Drag & Drop State
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // --- DERIVED DATA ---
  
  // Filter inventory based on search and active view
  const filteredInventory = useMemo(() => {
    return inventory.filter(c => {
      const matchSearch = searchTerm === '' || c.id.includes(searchTerm.toUpperCase()) || c.client.toUpperCase().includes(searchTerm.toUpperCase());
      const matchType = filterType === 'TODOS' || c.type === filterType;
      return matchSearch && matchType;
    });
  }, [inventory, searchTerm, filterType]);

  // Statistics for Bays Overview
  const bayStats = useMemo(() => {
    return BAYS.map(bay => {
      const count = inventory.filter(c => c.block === activeBlock && c.bay === bay).length;
      return { id: bay, used: count, total: ROWS.length * TIERS.length }; 
    });
  }, [inventory, activeBlock]);

  // Find Suggested Slot (First empty slot from Bottom-Left)
  const suggestedSlot = useMemo(() => {
      if (!moveMode.active && !draggedId) return null;
      
      // Algorithm: Fill T1 first across all rows, then T2, etc.
      // Or typically: Fill Columns (Stacks) first? Let's assume Row based fill for stability
      for (let i = TIERS.length - 1; i >= 0; i--) { // Start from T1 (last index in TIERS array is T1)
          const t = TIERS[i];
          for (const r of ROWS) {
              const isOccupied = inventory.some(c => c.block === activeBlock && c.bay === activeBay && c.row === r && c.tier === t);
              if (!isOccupied) {
                  return { row: r, tier: t };
              }
          }
      }
      return null;
  }, [inventory, activeBlock, activeBay, moveMode.active, draggedId]);

  // --- HANDLERS ---

  const handleMoveContainer = (id: string, targetRow: string, targetTier: string) => {
      // Check if occupied
      const occupied = inventory.find(c => c.block === activeBlock && c.bay === activeBay && c.row === targetRow && c.tier === targetTier);
      
      if (occupied) {
          if (!draggedId) alert("Posición ocupada."); // Only alert if clicking
          return;
      }

      const container = inventory.find(c => c.id === id);
      if (!container) return;

      // Confirm if manual move (not drag)
      if (!draggedId && !window.confirm(`¿Mover ${id} a ${activeBlock}-${activeBay} | ${targetRow}-${targetTier}?`)) {
          return;
      }

      setInventory(prev => prev.map(c => c.id === id ? { ...c, block: activeBlock, bay: activeBay, row: targetRow, tier: targetTier } : c));
      setMoveMode({ active: false });
      setSelectedUnit(null);
      setDraggedId(null);
  };

  const handleCellClick = (row: string, tier: string) => {
    const container = inventory.find(c => c.block === activeBlock && c.bay === activeBay && c.row === row && c.tier === tier);

    // MOVE MODE CLICK LOGIC
    if (moveMode.active && moveMode.sourceId) {
      handleMoveContainer(moveMode.sourceId, row, tier);
      return;
    }

    // NORMAL CLICK LOGIC
    if (container) {
      setSelectedUnit(container);
      setEditForm(container);
      setIsEditing(false);
    }
  };

  // --- DRAG HANDLERS ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedId(id);
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
      // Optional: Set custom drag image
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, row: string, tier: string) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      if (id && id === draggedId) {
          handleMoveContainer(id, row, tier);
      }
      setDraggedId(null);
  };

  const handleUpdate = () => {
    if (selectedUnit && editForm) {
      setInventory(prev => prev.map(c => c.id === selectedUnit.id ? { ...c, ...editForm } : c));
      setSelectedUnit(null);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (selectedUnit && window.confirm("¿Eliminar contenedor del inventario? Esta acción es irreversible.")) {
      setInventory(prev => prev.filter(c => c.id !== selectedUnit.id));
      setSelectedUnit(null);
    }
  };

  const initMove = () => {
    setMoveMode({ active: true, sourceId: selectedUnit?.id });
    setSelectedUnit(null); // Close modal to show grid
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans overscroll-contain w-full relative">
       
       {/* --- MOVE MODE OVERLAY INDICATOR --- */}
       {(moveMode.active || draggedId) && (
         <div className="sticky top-0 z-30 bg-amber-500 text-white px-6 py-3 rounded-xl shadow-lg mb-4 flex justify-between items-center animate-in slide-in-from-top-2">
            <div className="flex items-center font-bold text-sm uppercase tracking-wider">
               <ArrowRightLeft className="mr-3" />
               {draggedId ? `Arrastrando unidad ${draggedId}...` : `Modo Reubicación: Seleccione destino para ${moveMode.sourceId}`}
            </div>
            {!draggedId && (
                <button 
                onClick={() => setMoveMode({ active: false })} 
                className="bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors"
                >
                <X size={18} />
                </button>
            )}
         </div>
       )}

       <div className="w-full space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8 w-full">

             {/* HEADER: BLOCKS & FILTERS */}
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
                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-end"><Filter size={10} className="mr-1"/> Filtros de Visualización</h3>
                   <div className="flex bg-slate-100 p-1 rounded-lg">
                      {['TODOS', 'FCL', 'LCL'].map(type => (
                         <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${filterType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                            {type}
                         </button>
                      ))}
                   </div>
                </div>
             </div>

             {/* BAYS OVERVIEW */}
             <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Selector de Bahía (Bay)</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                   {bayStats.map(bay => (
                      <button 
                        key={bay.id} 
                        onClick={() => setActiveBay(bay.id)}
                        className={`border rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer group relative overflow-hidden ${activeBay === bay.id ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                      >
                         <span className={`text-xs font-bold ${activeBay === bay.id ? 'text-blue-700' : 'text-slate-700'}`}>BAY {bay.id}</span>
                         <div className="flex items-center justify-between w-full mt-2">
                             <span className="text-[9px] font-bold text-slate-400">Ocupación</span>
                             <span className={`text-[9px] font-bold ${bay.used / bay.total > 0.8 ? 'text-red-500' : 'text-slate-600'}`}>{Math.round((bay.used / bay.total) * 100)}%</span>
                         </div>
                         <div className="w-full bg-slate-100 h-1.5 mt-1 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${bay.used / bay.total > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(bay.used / bay.total) * 100}%` }}></div>
                         </div>
                      </button>
                   ))}
                </div>
             </div>

             {/* SEARCH BAR */}
             <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center"><Search size={10} className="mr-1"/> Localizar Unidad</h3>
                    {(moveMode.active || draggedId) && <span className="text-[10px] font-bold text-amber-500 uppercase animate-pulse flex items-center"><MousePointer2 size={10} className="mr-1"/> Seleccione o suelte en una celda libre</span>}
                </div>
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por ID Contenedor o Cliente..."
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                   />
                </div>
             </div>

             {/* --- INTERACTIVE MAP (STACK PROFILE) --- */}
             <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm flex flex-col">
                
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <LayoutGrid size={18} className="text-slate-500"/>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                            VISTA FÍSICA: BLOQUE {activeBlock} / BAY {activeBay}
                        </span>
                    </div>
                    <div className="flex items-center space-x-4 text-[10px] font-bold uppercase text-slate-400">
                        <span className="flex items-center"><div className="w-2 h-2 bg-blue-600 rounded-sm mr-1.5"></div> Ocupado</span>
                        <span className="flex items-center"><div className="w-2 h-2 bg-slate-200 border border-slate-300 border-dashed rounded-sm mr-1.5"></div> Libre</span>
                        <span className="flex items-center"><div className="w-2 h-2 bg-amber-200 border border-amber-400 rounded-sm mr-1.5"></div> Sugerido</span>
                    </div>
                </div>

                <div className="p-8 bg-slate-100/50 overflow-x-auto relative">
                   {/* Background Grid Pattern */}
                   <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

                   <div className="min-w-[600px] w-full max-w-5xl mx-auto">
                      
                      {/* Grid Header (Rows) */}
                      <div className="grid grid-cols-7 mb-2 gap-3">
                         <div className="text-right pr-4 text-[10px] font-bold text-slate-300 self-end pb-2 flex items-center justify-end">
                             <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-500">TIER</span>
                         </div> 
                         {ROWS.map(c => (
                            <div key={c} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-2 border-b-2 border-slate-200">{c}</div>
                         ))}
                      </div>

                      {/* Grid Body (Tiers) */}
                      {TIERS.map(tier => (
                         <div key={tier} className="grid grid-cols-7 mb-3 gap-3">
                            {/* Tier Label */}
                            <div className="flex items-center justify-end pr-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r-2 border-slate-200">{tier}</div>
                            
                            {/* Slots */}
                            {ROWS.map(row => {
                               // Check for container in this exact 3D coordinate
                               const container = filteredInventory.find(c => c.block === activeBlock && c.bay === activeBay && c.row === row && c.tier === tier);
                               // Check if slot is strictly occupied (ignoring filters for visual occupancy)
                               const isOccupied = inventory.some(c => c.block === activeBlock && c.bay === activeBay && c.row === row && c.tier === tier);
                               
                               // Calculate opacity for search focus
                               const isDimmed = searchTerm && !container && isOccupied;
                               
                               // Check if suggested slot
                               const isSuggested = suggestedSlot && suggestedSlot.row === row && suggestedSlot.tier === tier;

                               return (
                                  <div 
                                    key={`${tier}-${row}`} 
                                    onClick={() => handleCellClick(row, tier)}
                                    onDragOver={!isOccupied ? handleDragOver : undefined}
                                    onDrop={!isOccupied ? (e) => handleDrop(e, row, tier) : undefined}
                                    draggable={!!container}
                                    onDragStart={container ? (e) => handleDragStart(e, container.id) : undefined}
                                    className={`
                                        aspect-[16/7] rounded-md flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border relative group select-none
                                        ${container 
                                            ? `${container.color} text-white border-transparent shadow-md hover:shadow-lg hover:scale-[1.02] hover:z-10` 
                                            : isOccupied
                                                ? `bg-slate-200 border-slate-300 ${isDimmed ? 'opacity-20' : ''}` // Occupied but filtered out
                                                : (moveMode.active || draggedId) && isSuggested
                                                    ? 'bg-amber-100 border-amber-400 border-2 shadow-inner scale-105 z-10' // Suggested Slot
                                                    : (moveMode.active || draggedId)
                                                        ? 'bg-blue-50 border-blue-200 border-dashed hover:bg-blue-100' // Available Target
                                                        : 'bg-white border-slate-200 border-dashed hover:bg-slate-50' // Empty
                                        }
                                    `}
                                  >
                                     {container ? (
                                         <>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black tracking-tight leading-none">{container.id.substring(0, 4)}</span>
                                                <span className="text-[9px] font-bold tracking-tight opacity-90">{container.id.substring(4)}</span>
                                            </div>
                                            {container.status === 'BLOQUEADO' && (
                                                <div className="absolute top-1 right-1 text-red-200 animate-pulse"><AlertTriangle size={10} /></div>
                                            )}
                                            {draggedId === container.id && (
                                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                                    <Move size={16} className="text-slate-800 animate-spin-slow" />
                                                </div>
                                            )}
                                         </>
                                     ) : isOccupied ? (
                                         <span className="text-[9px] font-bold text-slate-400">FILTRADO</span>
                                     ) : (
                                         <>
                                            {(moveMode.active || draggedId) && isSuggested && (
                                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[7px] px-1.5 rounded-full font-bold uppercase tracking-wider z-20">Sugerido</span>
                                            )}
                                            <span className={`text-[8px] font-bold uppercase tracking-widest ${isSuggested ? 'text-amber-600' : 'text-slate-200 group-hover:text-blue-400'}`}>
                                                {(moveMode.active || draggedId) ? 'SOLTAR' : 'LIBRE'}
                                            </span>
                                         </>
                                     )}
                                  </div>
                               );
                            })}
                         </div>
                      ))}
                   </div>
                </div>
             </div>

          </div>
       </div>

       {/* --- CONTAINER DETAIL MODAL --- */}
       {selectedUnit && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
                   
                   {/* HEADER */}
                   <div className={`relative px-8 py-6 ${selectedUnit.color || 'bg-slate-900'} overflow-hidden`}>
                       <div className="absolute -right-6 -top-6 text-white opacity-10 pointer-events-none rotate-12">
                           <Box size={140} />
                       </div>

                       <div className="relative z-10 text-white pr-12">
                           <h3 className="text-3xl font-black tracking-tighter leading-none mb-1">{selectedUnit.id}</h3>
                           <div className="flex items-center gap-2">
                               <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                   {selectedUnit.client}
                               </span>
                               <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest border-l border-white/30 pl-2">
                                   {selectedUnit.type} CONTAINER
                               </span>
                           </div>
                       </div>

                       <button 
                           onClick={() => setSelectedUnit(null)} 
                           className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/10 hover:bg-black/30 rounded-full transition-all duration-200 backdrop-blur-sm"
                           title="Cerrar"
                       >
                           <X size={20} />
                       </button>
                   </div>

                   {/* BODY */}
                   <div className="p-6">
                       {isEditing ? (
                           <div className="space-y-4">
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</label>
                                       <input type="text" value={editForm.client} onChange={e => setEditForm({...editForm, client: e.target.value})} className="w-full p-2 border rounded text-sm font-bold" />
                                   </div>
                                   <div>
                                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peso (Kg)</label>
                                       <input type="number" value={editForm.weight} onChange={e => setEditForm({...editForm, weight: Number(e.target.value)})} className="w-full p-2 border rounded text-sm font-bold" />
                                   </div>
                               </div>
                               <div>
                                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</label>
                                   <select 
                                      value={editForm.status} 
                                      onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                                      className="w-full p-2 border rounded text-sm font-bold"
                                   >
                                       <option value="ALMACENADO">ALMACENADO</option>
                                       <option value="BLOQUEADO">BLOQUEADO</option>
                                       <option value="PLANIFICADO">PLANIFICADO</option>
                                   </select>
                               </div>
                           </div>
                       ) : (
                           <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                               <div>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-1"><Map size={12} className="mr-1"/> Ubicación</p>
                                   <p className="text-sm font-bold text-slate-800">BL: {selectedUnit.block} | BAY: {selectedUnit.bay}</p>
                                   <p className="text-xs text-slate-500">{selectedUnit.row} / {selectedUnit.tier}</p>
                               </div>
                               <div>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-1"><Scale size={12} className="mr-1"/> Peso Bruto</p>
                                   <p className="text-sm font-bold text-slate-800">{selectedUnit.weight.toLocaleString()} kg</p>
                               </div>
                               <div>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-1"><Anchor size={12} className="mr-1"/> Nave / Viaje</p>
                                   <p className="text-sm font-bold text-slate-800">{selectedUnit.ship}</p>
                               </div>
                               <div>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-1"><Info size={12} className="mr-1"/> Estado</p>
                                   <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase ${selectedUnit.status === 'BLOQUEADO' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                       {selectedUnit.status}
                                   </span>
                               </div>
                           </div>
                       )}
                   </div>

                   {/* FOOTER ACTIONS */}
                   <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                       {isEditing ? (
                           <>
                               <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-slate-500 hover:text-slate-700">CANCELAR</button>
                               <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center shadow-sm hover:bg-blue-700">
                                   <Save size={14} className="mr-2"/> GUARDAR
                               </button>
                           </>
                       ) : (
                           <>
                               <button onClick={handleDelete} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Eliminar">
                                   <Trash2 size={18} />
                               </button>
                               <div className="flex space-x-3">
                                   <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                       <Edit2 size={14} className="mr-2"/> EDITAR
                                   </button>
                                   <button onClick={initMove} className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95">
                                       <Move size={14} className="mr-2"/> MOVER
                                   </button>
                               </div>
                           </>
                       )}
                   </div>
               </div>
           </div>
       )}

    </div>
  );
};

// Simple Map icon for the modal
const Map = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
);
