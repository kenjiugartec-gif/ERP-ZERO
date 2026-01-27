
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, Info, Box, X, Move, 
  Edit2, Trash2, Save, ArrowRightLeft, 
  AlertTriangle, Anchor, Scale, LayoutGrid, 
  MousePointer2, Container, MoreVertical, 
  RefreshCw, CheckCircle2, ChevronRight, Layers,
  Database, Navigation, Lock
} from 'lucide-react';

// --- TYPES ---
interface ContainerData {
  id: string; // ISO Code (e.g., MSCU1234567)
  client: string; // Shipping Line
  type: '20GP' | '40HC' | '40RH'; // ISO Type
  weight: number; // VGM
  pod: string; // Port of Discharge
  block: string;
  bay: string;
  row: string; // R1-R6
  tier: string; // T1-T5
  status: 'ALMACENADO' | 'BLOQUEADO' | 'PLANIFICADO' | 'DESPACHO';
  arrival: string;
}

// --- CONFIG ---
const ROWS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];
const TIERS = ['T5', 'T4', 'T3', 'T2', 'T1']; // Top to Bottom rendering
const BAYS = ['01', '03', '05', '07', '09', '11'];
const BLOCKS = ['A', 'B', 'C', 'D'];

// --- MOCK GENERATOR ---
const generateMockData = (block: string): ContainerData[] => {
    const data: ContainerData[] = [];
    const lines = ['MSC', 'HAPAG', 'MAERSK', 'CMA CGM', 'ONE'];
    const types = ['20GP', '40HC', '40RH'] as const;
    
    BAYS.forEach(bay => {
        ROWS.forEach(row => {
            TIERS.forEach(tier => {
                if (Math.random() > 0.6) { // 40% occupancy
                    const line = lines[Math.floor(Math.random() * lines.length)];
                    data.push({
                        id: `${line.substring(0,3).toUpperCase()}U${Math.floor(100000 + Math.random() * 900000)}`,
                        client: line,
                        type: types[Math.floor(Math.random() * types.length)],
                        weight: Math.floor(12000 + Math.random() * 18000),
                        pod: ['SANT ANTONIO', 'VALPARAISO', 'ROTTERDAM', 'SHANGHAI'][Math.floor(Math.random() * 4)],
                        block,
                        bay,
                        row,
                        tier,
                        status: Math.random() > 0.9 ? 'BLOQUEADO' : 'ALMACENADO',
                        arrival: new Date().toISOString()
                    });
                }
            });
        });
    });
    return data;
};

export const BarotiView: React.FC = () => {
  // --- STATE ---
  const [inventory, setInventory] = useState<ContainerData[]>([]);
  const [activeBlock, setActiveBlock] = useState('A');
  const [activeBay, setActiveBay] = useState('01');
  const [selectedUnit, setSelectedUnit] = useState<ContainerData | null>(null);
  
  // Interaction State
  const [searchTerm, setSearchTerm] = useState('');
  const [moveMode, setMoveMode] = useState<{ active: boolean; sourceId?: string }>({ active: false });
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // --- DERIVED DATA ---
  const currentViewContainers = useMemo(() => {
      return inventory.filter(c => c.block === activeBlock && c.bay === activeBay);
  }, [inventory, activeBlock, activeBay]);

  const blockStats = useMemo(() => {
      const totalSlots = ROWS.length * TIERS.length * BAYS.length;
      const occupied = inventory.filter(c => c.block === activeBlock).length;
      const utilization = Math.round((occupied / totalSlots) * 100);
      return { occupied, totalSlots, utilization };
  }, [inventory, activeBlock]);

  // --- ACTIONS ---
  const handleGenerate = () => {
      if (confirm("¿Generar simulación de patio? Esto reemplazará los datos actuales del bloque.")) {
          const newData = generateMockData(activeBlock);
          // Remove existing for this block
          const cleanInv = inventory.filter(c => c.block !== activeBlock);
          setInventory([...cleanInv, ...newData]);
      }
  };

  const handleCellClick = (row: string, tier: string) => {
      const container = currentViewContainers.find(c => c.row === row && c.tier === tier);

      if (moveMode.active && moveMode.sourceId) {
          // Execute Move
          if (container) {
              alert("Error: Celda ocupada.");
              return;
          }
          setInventory(prev => prev.map(c => c.id === moveMode.sourceId ? { ...c, block: activeBlock, bay: activeBay, row, tier } : c));
          setMoveMode({ active: false });
          setSelectedUnit(null);
          return;
      }

      if (container) {
          setSelectedUnit(container);
      } else {
          setSelectedUnit(null); // Clicked empty space
      }
  };

  const handleDelete = () => {
      if (selectedUnit && confirm("¿Confirmar salida/eliminación del sistema?")) {
          setInventory(prev => prev.filter(c => c.id !== selectedUnit.id));
          setSelectedUnit(null);
      }
  };

  const getContainerColor = (client: string, status: string) => {
      if (status === 'BLOQUEADO') return 'bg-red-600 border-red-800 text-white pattern-diagonal-stripes-sm';
      if (status === 'PLANIFICADO') return 'bg-amber-500 border-amber-700 text-white';
      
      switch(client) {
          case 'MSC': return 'bg-[#FFC20E] border-[#D4A00B] text-slate-900';
          case 'HAPAG': return 'bg-[#F26334] border-[#C14F29] text-white';
          case 'MAERSK': return 'bg-[#42B0D5] border-[#3289A8] text-white';
          case 'ONE': return 'bg-[#E03C89] border-[#B02E6B] text-white';
          case 'CMA CGM': return 'bg-[#002C60] border-[#001A3A] text-white';
          default: return 'bg-blue-600 border-blue-800 text-white';
      }
  };

  return (
    <div className="h-full flex flex-col bg-[#F1F5F9] font-sans w-full overflow-hidden">
        
        {/* --- TOP BAR: STATUS & CONTROLS --- */}
        <div className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 flex-shrink-0 z-20">
            <div className="flex items-center space-x-4">
                <div className="flex items-center text-slate-800">
                    <Database size={20} className="mr-2 text-blue-600" />
                    <span className="text-sm font-black uppercase tracking-widest">Yard Manager</span>
                </div>
                <div className="h-6 w-[1px] bg-slate-200"></div>
                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Nivel de Ocupación (Bloque {activeBlock}):</span>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${blockStats.utilization > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{width: `${blockStats.utilization}%`}}
                        ></div>
                    </div>
                    <span className="text-slate-700">{blockStats.utilization}% ({blockStats.occupied}/{blockStats.totalSlots})</span>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Buscar Unidad..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-lg text-xs font-bold text-slate-700 outline-none w-48 transition-all uppercase"
                    />
                </div>
                {inventory.length === 0 && (
                    <button 
                        onClick={handleGenerate}
                        className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                    >
                        <RefreshCw size={14} className="mr-2" /> Simular
                    </button>
                )}
            </div>
        </div>

        {/* --- MAIN WORKSPACE --- */}
        <div className="flex flex-1 overflow-hidden relative">
            
            {/* 1. LEFT SIDEBAR: YARD NAVIGATION */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 overflow-y-auto">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Selector de Bloque</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {BLOCKS.map(block => (
                            <button
                                key={block}
                                onClick={() => setActiveBlock(block)}
                                className={`h-16 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                                    activeBlock === block 
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' 
                                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                }`}
                            >
                                <span className="text-xl font-black">{block}</span>
                                <span className="text-[8px] font-bold uppercase tracking-wider">Bloque</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex-1 p-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Bahías (Bays)</h3>
                    <div className="space-y-1">
                        {BAYS.map(bay => {
                            const count = inventory.filter(c => c.block === activeBlock && c.bay === bay).length;
                            const total = ROWS.length * TIERS.length;
                            const percent = (count / total) * 100;
                            
                            return (
                                <button
                                    key={bay}
                                    onClick={() => setActiveBay(bay)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all group ${
                                        activeBay === bay 
                                        ? 'bg-slate-900 text-white shadow-md' 
                                        : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <Layers size={14} className={`mr-3 ${activeBay === bay ? 'text-blue-400' : 'text-slate-300'}`} />
                                        BAY {bay}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-16 h-1.5 rounded-full overflow-hidden ${activeBay === bay ? 'bg-white/20' : 'bg-slate-200'}`}>
                                            <div className={`h-full ${percent > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${percent}%`}}></div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. CENTER: STACK VISUALIZATION (THE DIGITAL TWIN) */}
            <div className="flex-1 bg-slate-100/50 relative overflow-hidden flex flex-col">
                {/* Visual Sky/Context */}
                <div className="absolute inset-0 pointer-events-none opacity-5" style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                
                {/* Top Info Bar within Canvas */}
                <div className="absolute top-4 left-6 z-10 flex space-x-4">
                    <div className="bg-white/80 backdrop-blur border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ubicación Actual</span>
                        <div className="flex items-center text-lg font-black text-slate-800">
                            <span className="text-blue-600 mr-2">BLOQUE {activeBlock}</span>
                            <ChevronRight size={16} className="text-slate-400 mx-1" />
                            <span>BAY {activeBay}</span>
                        </div>
                    </div>
                    {moveMode.active && (
                        <div className="bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse flex items-center">
                            <ArrowRightLeft size={18} className="mr-2" />
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest block">Modo Reubicación</span>
                                <span className="text-xs font-bold">Seleccione celda destino para {moveMode.sourceId}</span>
                            </div>
                            <button onClick={() => setMoveMode({active: false})} className="ml-4 bg-black/20 hover:bg-black/30 p-1 rounded"><X size={14}/></button>
                        </div>
                    )}
                </div>

                {/* The Grid */}
                <div className="flex-1 flex items-end justify-center pb-12 overflow-x-auto overflow-y-hidden px-10">
                    <div className="relative">
                        {/* Floor Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-300 rounded-full opacity-50 blur-sm translate-y-2"></div>
                        
                        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${ROWS.length}, minmax(120px, 1fr))` }}>
                            {ROWS.map(row => (
                                <div key={row} className="flex flex-col space-y-3 justify-end">
                                    {TIERS.map(tier => {
                                        const container = currentViewContainers.find(c => c.row === row && c.tier === tier);
                                        const isSelected = selectedUnit?.id === container?.id;
                                        const isMatch = searchTerm && container?.id.includes(searchTerm.toUpperCase());
                                        const isBlocked = container?.status === 'BLOQUEADO';

                                        return (
                                            <div 
                                                key={tier}
                                                onClick={() => handleCellClick(row, tier)}
                                                className={`
                                                    relative h-32 w-full rounded-md border-2 transition-all duration-200 cursor-pointer group select-none
                                                    ${container 
                                                        ? `${getContainerColor(container.client, container.status)} shadow-lg hover:scale-[1.02] hover:z-10` 
                                                        : `border-slate-200 border-dashed bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300`
                                                    }
                                                    ${isSelected ? 'ring-4 ring-blue-500/30 z-20 scale-[1.05]' : ''}
                                                    ${isMatch ? 'ring-4 ring-amber-400 z-20 animate-pulse' : (searchTerm && container ? 'opacity-20 blur-[1px]' : '')}
                                                `}
                                            >
                                                {container ? (
                                                    <div className="h-full flex flex-col justify-between p-2 relative overflow-hidden">
                                                        {/* Container Face */}
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-[10px] font-black uppercase tracking-tight opacity-90 drop-shadow-sm">{container.client}</span>
                                                            <span className="text-[9px] font-bold px-1.5 rounded bg-black/20 backdrop-blur-sm text-white">{container.type}</span>
                                                        </div>
                                                        
                                                        {isBlocked && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                                                <Lock size={24} className="text-white/80 drop-shadow-md" />
                                                            </div>
                                                        )}

                                                        <div className="flex flex-col items-center">
                                                            <span className="text-sm font-black tracking-tight drop-shadow-md">{container.id.substring(0,4)}</span>
                                                            <span className="text-xs font-bold opacity-80">{container.id.substring(4)}</span>
                                                        </div>

                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[8px] font-mono opacity-70">{row}/{tier}</span>
                                                            <span className="text-[8px] font-bold opacity-70">{container.weight / 1000}T</span>
                                                        </div>
                                                        
                                                        {/* Corner accents for realism */}
                                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20"></div>
                                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20"></div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 group-hover:text-blue-400">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest mb-1">{tier}</span>
                                                        {moveMode.active ? (
                                                            <CheckCircle2 size={18} className="text-blue-400 animate-bounce" />
                                                        ) : (
                                                            <PlusIcon />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-200">
                                        {row}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. RIGHT SIDEBAR: INSPECTOR PANEL */}
            {selectedUnit ? (
                <div className="w-80 bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col animate-in slide-in-from-right duration-300">
                    <div className={`h-32 ${getContainerColor(selectedUnit.client, selectedUnit.status)} p-6 flex flex-col justify-end relative`}>
                        <button onClick={() => setSelectedUnit(null)} className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/10 rounded-full p-1"><X size={16}/></button>
                        <h2 className="text-2xl font-black text-white tracking-tight">{selectedUnit.id}</h2>
                        <div className="flex items-center text-white/80 text-xs font-bold mt-1">
                            <Anchor size={12} className="mr-1.5" /> {selectedUnit.client}
                        </div>
                    </div>
                    
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Tamaño / Tipo" value={selectedUnit.type} />
                            <DetailItem label="Peso VGM" value={`${selectedUnit.weight} kg`} />
                            <DetailItem label="Puerto Destino" value={selectedUnit.pod} />
                            <DetailItem label="Estado" value={selectedUnit.status} isBadge />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                                <Map size={12} className="mr-2" /> Coordenadas Yard
                            </h4>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                                <div className="flex flex-col items-center"><span className="text-[9px] text-slate-400 uppercase">Bloque</span>{selectedUnit.block}</div>
                                <div className="h-8 w-[1px] bg-slate-200"></div>
                                <div className="flex flex-col items-center"><span className="text-[9px] text-slate-400 uppercase">Bay</span>{selectedUnit.bay}</div>
                                <div className="h-8 w-[1px] bg-slate-200"></div>
                                <div className="flex flex-col items-center"><span className="text-[9px] text-slate-400 uppercase">Row</span>{selectedUnit.row}</div>
                                <div className="h-8 w-[1px] bg-slate-200"></div>
                                <div className="flex flex-col items-center"><span className="text-[9px] text-slate-400 uppercase">Tier</span>{selectedUnit.tier}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button 
                                onClick={() => { setMoveMode({ active: true, sourceId: selectedUnit.id }); }}
                                className="w-full py-3 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg active:scale-95"
                            >
                                <ArrowRightLeft size={14} className="mr-2" /> Reubicar (Move)
                            </button>
                            <button 
                                className="w-full py-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center"
                            >
                                <Edit2 size={14} className="mr-2" /> Editar Datos
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center"
                            >
                                <Trash2 size={14} className="mr-2" /> Gate Out / Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-16 bg-white border-l border-slate-200 z-10 flex flex-col items-center py-6 space-y-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <Info size={16} />
                    </div>
                    {/* Vertical Text */}
                    <div className="writing-vertical-lr transform rotate-180 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] whitespace-nowrap">
                        Inspector de Unidad
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const DetailItem = ({ label, value, isBadge }: any) => (
    <div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
        {isBadge ? (
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                value === 'BLOQUEADO' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
            }`}>{value}</span>
        ) : (
            <span className="text-sm font-bold text-slate-800">{value}</span>
        )}
    </div>
);

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const Map = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
);
