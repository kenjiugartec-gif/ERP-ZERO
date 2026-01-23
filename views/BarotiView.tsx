
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Info, Box, X, Move, 
  Edit2, Trash2, Save, ArrowRightLeft, CheckCircle2, 
  AlertTriangle, Anchor, Scale, User
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
];

const ROWS = ['R1', 'R2', 'R3', 'R4', 'R5'];
const TIERS = ['T5', 'T4', 'T3', 'T2', 'T1']; // Top to bottom visual
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
      return { id: bay, used: count, total: 25 }; // 5x5 grid
    });
  }, [inventory, activeBlock]);

  // --- HANDLERS ---

  const handleCellClick = (row: string, tier: string) => {
    // Find container in this slot
    const container = inventory.find(c => c.block === activeBlock && c.bay === activeBay && c.row === row && c.tier === tier);

    // MOVE MODE LOGIC
    if (moveMode.active && moveMode.sourceId) {
      if (container) {
        alert("Espacio ocupado. Seleccione una celda vacía.");
        return;
      }
      // Execute Move
      if (window.confirm(`¿Confirmar reubicación a Bloque ${activeBlock} | Bay ${activeBay} | ${row} | ${tier}?`)) {
        setInventory(prev => prev.map(c => c.id === moveMode.sourceId ? { ...c, block: activeBlock, bay: activeBay, row, tier } : c));
        setMoveMode({ active: false });
        setSelectedUnit(null);
      }
      return;
    }

    // NORMAL MODE LOGIC (Open Details)
    if (container) {
      setSelectedUnit(container);
      setEditForm(container);
      setIsEditing(false);
    }
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
    // Keep modal open or close it? Let's close it to show the grid
    setSelectedUnit(null); 
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans overscroll-contain w-full relative">
       
       {/* --- MOVE MODE OVERLAY INDICATOR --- */}
       {moveMode.active && (
         <div className="sticky top-0 z-20 bg-amber-500 text-white px-6 py-3 rounded-xl shadow-lg mb-4 flex justify-between items-center animate-pulse">
            <div className="flex items-center font-bold text-sm uppercase tracking-wider">
               <ArrowRightLeft className="mr-3" />
               Modo Reubicación Activo: Seleccione un espacio libre
            </div>
            <button 
              onClick={() => setMoveMode({ active: false })} 
              className="bg-white/20 hover:bg-white/30 p-1 rounded-full"
            >
              <X size={18} />
            </button>
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
                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-end"><Filter size={10} className="mr-1"/> Zona Operativa</h3>
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
                         <span className="text-[10px] font-bold text-slate-400 mt-1">{bay.used} / {bay.total}</span>
                         <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{ width: `${(bay.used / bay.total) * 100}%` }}></div>
                         </div>
                      </button>
                   ))}
                </div>
             </div>

             {/* SEARCH BAR */}
             <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center"><Search size={10} className="mr-1"/> Localizar Unidad</h3>
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
             <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Box size={18} className="text-slate-500"/>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                            VISTA DE PERFIL: BLOQUE {activeBlock} / BAY {activeBay}
                        </span>
                    </div>
                    {moveMode.active && <span className="text-[10px] font-bold text-amber-500 uppercase animate-pulse">Seleccione destino...</span>}
                </div>

                <div className="p-8 bg-slate-50/20 overflow-x-auto">
                   <div className="min-w-[600px] w-full max-w-5xl mx-auto">
                      
                      {/* Grid Header (Rows) */}
                      <div className="grid grid-cols-6 mb-2">
                         <div className="text-right pr-4 text-[10px] font-bold text-slate-300 self-end pb-2">TIER / ROW</div> 
                         {ROWS.map(c => (
                            <div key={c} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-2">{c}</div>
                         ))}
                      </div>

                      {/* Grid Body (Tiers) */}
                      {TIERS.map(tier => (
                         <div key={tier} className="grid grid-cols-6 mb-3 gap-3">
                            {/* Tier Label */}
                            <div className="flex items-center justify-end pr-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tier}</div>
                            
                            {/* Slots */}
                            {ROWS.map(row => {
                               // Check for container in this exact 3D coordinate
                               const container = filteredInventory.find(c => c.block === activeBlock && c.bay === activeBay && c.row === row && c.tier === tier);
                               // Check if slot is strictly occupied (ignoring filters for visual occupancy)
                               const isOccupied = inventory.some(c => c.block === activeBlock && c.bay === activeBay && c.row === row && c.tier === tier);
                               
                               // Calculate opacity for search focus
                               const isDimmed = searchTerm && !container && isOccupied;

                               return (
                                  <div 
                                    key={`${tier}-${row}`} 
                                    onClick={() => handleCellClick(row, tier)}
                                    className={`
                                        aspect-[16/6] rounded-md flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border relative group
                                        ${container 
                                            ? `${container.color} text-white border-transparent shadow-md hover:shadow-lg hover:scale-[1.02]` 
                                            : isOccupied
                                                ? `bg-slate-200 border-slate-300 ${isDimmed ? 'opacity-20' : ''}` // Occupied but filtered out
                                                : moveMode.active 
                                                    ? 'bg-amber-50 border-amber-300 border-dashed hover:bg-amber-100 animate-pulse' // Move Target
                                                    : 'bg-white border-slate-200 border-dashed hover:bg-slate-50' // Empty
                                        }
                                    `}
                                  >
                                     {container ? (
                                         <>
                                            <span className="text-[10px] font-black tracking-tight leading-none">{container.id}</span>
                                            <span className="text-[8px] font-medium opacity-90 mt-0.5">{container.client}</span>
                                            {container.status === 'BLOQUEADO' && (
                                                <div className="absolute top-1 right-1 text-red-200"><AlertTriangle size={8} /></div>
                                            )}
                                         </>
                                     ) : isOccupied ? (
                                         <span className="text-[9px] font-bold text-slate-400">FILTRADO</span>
                                     ) : (
                                         <span className={`text-[9px] font-bold uppercase tracking-widest ${moveMode.active ? 'text-amber-500' : 'text-slate-200 group-hover:text-blue-400'}`}>
                                             {moveMode.active ? 'DISPONIBLE' : 'LIBRE'}
                                         </span>
                                     )}
                                  </div>
                               );
                            })}
                         </div>
                      ))}
                   </div>
                </div>

                {/* Legend */}
                <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                   <div className="flex gap-4">
                       <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span> FCL (General)</div>
                       <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-600 mr-2"></span> Prioridad</div>
                       <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span> LCL (Consolidado)</div>
                       <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-600 mr-2"></span> Bloqueado</div>
                   </div>
                   <div>{inventory.filter(c => c.block === activeBlock && c.bay === activeBay).length} Unidades en Bay {activeBay}</div>
                </div>
             </div>

          </div>
       </div>

       {/* --- CONTAINER DETAIL MODAL --- */}
       {selectedUnit && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
                   
                   <div className={`px-6 py-4 flex justify-between items-center ${selectedUnit.color || 'bg-slate-900'}`}>
                       <div className="text-white">
                           <h3 className="text-lg font-black tracking-tight">{selectedUnit.id}</h3>
                           <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{selectedUnit.client} | {selectedUnit.type}</p>
                       </div>
                       <button onClick={() => setSelectedUnit(null)} className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full transition-colors">
                           <X size={18} />
                       </button>
                   </div>

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

// Simple Map icon for the modal since it wasn't imported
const Map = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
);
