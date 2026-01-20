
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { CHILE_GEO_DATA } from '../constants';
import { 
  MapPin, Building2, Layers, 
  Save, Trash2, ChevronDown, Plus, X, Globe,
  CheckCircle2, Map
} from 'lucide-react';

interface CustomSelectProps {
  label: string;
  step: string;
  icon: React.ReactNode;
  value: string;
  options: string[];
  placeholder: string;
  onSelect: (val: string) => void;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  label, step, icon, value, options, placeholder, onSelect, disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${disabled ? 'opacity-40 pointer-events-none' : ''}`} ref={containerRef}>
      <label className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
         <span className="text-blue-600 mr-1.5">{icon}</span>
         <span className="mr-1 text-slate-500">{step}.</span> {label}
      </label>
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex justify-between items-center cursor-pointer transition-all hover:bg-slate-100 ${isOpen ? 'ring-2 ring-blue-500/10 border-blue-400 bg-white' : ''}`}
      >
        <span className={value ? 'text-slate-800' : 'text-slate-400 font-normal'}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[105%] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
          {options.map(opt => (
            <div 
              key={opt}
              onClick={() => { onSelect(opt); setIsOpen(false); }}
              className={`px-4 py-3 text-xs font-bold cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between ${value === opt ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
            >
              <span>{opt}</span>
              {value === opt && <CheckCircle2 size={14} />}
            </div>
          ))}
          {options.length === 0 && (
              <div className="px-4 py-3 text-xs text-slate-400 italic">No hay opciones disponibles</div>
          )}
        </div>
      )}
    </div>
  );
};

export const GeographyView: React.FC = () => {
  const { geoRecords, addGeoRecord, deleteGeoRecord, emplacements, addEmplacement } = useApp();
  
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedEmplacement, setSelectedEmplacement] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRegion, setNewEmpRegion] = useState('');
  const [newEmpCommune, setNewEmpCommune] = useState('');

  const regions = CHILE_GEO_DATA.map(r => r.region);
  const communesOfRegion = CHILE_GEO_DATA.find(r => r.region === selectedRegion)?.communes || [];
  const communesOfModalRegion = CHILE_GEO_DATA.find(r => r.region === newEmpRegion)?.communes || [];

  const handleReset = () => {
    setSelectedRegion('');
    setSelectedCommune('');
    setSelectedEmplacement('');
  };

  const handleSaveVincular = () => {
    if (selectedRegion && selectedCommune && selectedEmplacement) {
      addGeoRecord({
        id: Date.now().toString(),
        region: selectedRegion,
        commune: selectedCommune,
        emplacement: selectedEmplacement,
        timestamp: new Date().toISOString()
      });
      handleReset();
    }
  };

  const handleCreateEmplacement = () => {
    if (newEmpName && newEmpRegion && newEmpCommune) {
      addEmplacement(newEmpName);
      addGeoRecord({
        id: Date.now().toString(),
        region: newEmpRegion,
        commune: newEmpCommune,
        emplacement: newEmpName,
        timestamp: new Date().toISOString()
      });
      setNewEmpName('');
      setNewEmpRegion('');
      setNewEmpCommune('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans overscroll-contain w-full">
      <div className="w-full space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-lg text-white shadow-lg flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">CONFIGURACIÓN TERRITORIAL</h2>
              <p className="text-xs text-slate-500 font-medium">Gestión de nodos y sucursales regionales</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus size={16} className="mr-2" />
            NUEVO EMPLAZAMIENTO
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full">
          <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <CustomSelect 
                  step="01"
                  label="NODO OPERATIVO"
                  icon={<Building2 size={12}/>}
                  value={selectedEmplacement}
                  options={emplacements}
                  placeholder="Seleccionar nodo..."
                  onSelect={setSelectedEmplacement}
                />
                <CustomSelect 
                  step="02"
                  label="REGIÓN GEOGRÁFICA"
                  icon={<Map size={12}/>}
                  value={selectedRegion}
                  options={regions}
                  placeholder="Definir Región..."
                  onSelect={(val) => { setSelectedRegion(val); setSelectedCommune(''); }}
                  disabled={!selectedEmplacement}
                />
                <CustomSelect 
                  step="03"
                  label="JURISDICCIÓN / COMUNA"
                  icon={<Layers size={12}/>}
                  value={selectedCommune}
                  options={communesOfRegion}
                  placeholder="Definir Comuna..."
                  onSelect={setSelectedCommune}
                  disabled={!selectedRegion}
                />
             </div>

             <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
                <button 
                  onClick={handleReset}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  LIMPIAR FORMULARIO
                </button>
                <button 
                  onClick={handleSaveVincular}
                  disabled={!(selectedRegion && selectedCommune && selectedEmplacement)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95
                    ${(selectedRegion && selectedCommune && selectedEmplacement)
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' 
                      : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'}
                  `}
                >
                  <CheckCircle2 size={16} />
                  <span>CERTIFICAR LOCALIZACIÓN</span>
                </button>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">NODO</th>
                  <th className="px-8 py-5">REGIÓN / TERRITORIO</th>
                  <th className="px-8 py-5">COMUNA</th>
                  <th className="px-8 py-5 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {geoRecords.length === 0 ? (
                   <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 text-xs italic">
                         No hay configuraciones territoriales registradas.
                      </td>
                   </tr>
                ) : (
                  geoRecords.map((record) => (
                    <tr key={record.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 text-xs font-bold text-slate-800">{record.emplacement}</td>
                      <td className="px-8 py-4 text-xs font-medium text-slate-500">{record.region}</td>
                      <td className="px-8 py-4 text-xs font-medium text-slate-500">{record.commune}</td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => deleteGeoRecord(record.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
             {/* Modal Content */}
             {/* ... */}
             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center">
                <Globe size={16} className="mr-2 text-blue-600" /> Nuevo Nodo
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Descriptivo</label>
                <input 
                  type="text" autoFocus placeholder="Ej: Bodega Norte" value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <CustomSelect 
                step="A" label="Región Operativa" icon={<Map size={12}/>} value={newEmpRegion}
                options={regions} placeholder="Seleccionar..."
                onSelect={(val) => { setNewEmpRegion(val); setNewEmpCommune(''); }}
              />
              <CustomSelect 
                step="B" label="Comuna Jurisdiccional" icon={<Layers size={12}/>} value={newEmpCommune}
                options={communesOfModalRegion} placeholder="Seleccionar..."
                disabled={!newEmpRegion} onSelect={setNewEmpCommune}
              />
            </div>
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={handleCreateEmplacement}
                disabled={!(newEmpName && newEmpRegion && newEmpCommune)}
                className={`w-full py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center space-x-2
                  ${(newEmpName && newEmpRegion && newEmpCommune)
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}
                `}
              >
                <Save size={14} />
                <span>Registrar Emplazamiento</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
