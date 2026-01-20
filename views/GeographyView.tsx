
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { CHILE_GEO_DATA } from '../constants';
import { 
  MapPin, Building2, Layers, 
  Save, Trash2, ChevronDown, Plus, X, Globe,
  CheckCircle2, Map, Hash, User, Ruler, Activity, 
  Navigation, LayoutGrid, Power
} from 'lucide-react';

interface CustomSelectProps {
  label: string;
  step?: string;
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
         {step && <span className="mr-1 text-slate-500">{step}.</span>} {label}
      </label>
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex justify-between items-center cursor-pointer transition-all hover:bg-slate-100 ${isOpen ? 'ring-2 ring-blue-500/10 border-blue-400 bg-white' : ''}`}
      >
        <span className={value ? 'text-slate-800' : 'text-slate-400 font-normal truncate'}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
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

const ModalInput = ({ label, icon: Icon, placeholder, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center ml-1">
        {Icon && <Icon size={12} className="mr-1.5 text-slate-400"/>}
        {label}
    </label>
    <div className="relative group">
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300"
      />
    </div>
  </div>
);

export const GeographyView: React.FC = () => {
  const { geoRecords, addGeoRecord, deleteGeoRecord, emplacements, addEmplacement } = useApp();
  
  // -- State for Linking Existing --
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedEmplacement, setSelectedEmplacement] = useState('');
  
  // -- State for New Emplacement Modal --
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form Data
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpCode, setNewEmpCode] = useState('');
  const [newEmpType, setNewEmpType] = useState('');
  
  const [newEmpRegion, setNewEmpRegion] = useState('');
  const [newEmpCommune, setNewEmpCommune] = useState('');
  const [newEmpAddress, setNewEmpAddress] = useState('');
  
  const [newEmpManager, setNewEmpManager] = useState('');
  const [newEmpCapacity, setNewEmpCapacity] = useState('');
  const [newEmpStatus, setNewEmpStatus] = useState('ACTIVO');

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
      // 1. Add to global list of strings (legacy support)
      addEmplacement(newEmpName);
      
      // 2. Create the Geo Record linkage
      addGeoRecord({
        id: Date.now().toString(),
        region: newEmpRegion,
        commune: newEmpCommune,
        emplacement: newEmpName,
        timestamp: new Date().toISOString()
      });

      // Reset & Close
      setNewEmpName('');
      setNewEmpCode('');
      setNewEmpRegion('');
      setNewEmpCommune('');
      setNewEmpAddress('');
      setNewEmpManager('');
      setNewEmpCapacity('');
      setNewEmpType('');
      setIsModalOpen(false);
    }
  };

  const handleOpenModal = () => {
      // Auto-generate a random code for professional feel
      setNewEmpCode(`NOD-${Math.floor(Math.random() * 10000)}`);
      setNewEmpType('');
      setIsModalOpen(true);
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 font-sans overscroll-contain w-full">
      <div className="w-full space-y-6">
        
        {/* Header Section */}
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
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus size={16} className="mr-2" />
            NUEVO EMPLAZAMIENTO
          </button>
        </div>

        {/* Linker Card */}
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

        {/* Table List */}
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

      {/* --- LARGE MODAL FOR NEW EMPLACEMENT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
             
             {/* Modal Header */}
             <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Nuevo Nodo Operativo</h3>
                        <p className="text-xs text-slate-500 font-medium">Complete la ficha técnica para registrar el emplazamiento</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-50 rounded-full">
                    <X size={20} />
                </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-8 overflow-y-auto flex-1 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COL 1: IDENTIFICACIÓN */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-2 mb-4">
                            <Building2 size={16} className="text-blue-600" />
                            <span className="text-xs font-bold uppercase tracking-widest">1. Identificación</span>
                        </div>
                        
                        <ModalInput 
                            label="Nombre Descriptivo" 
                            placeholder="Ej: Bodega Norte" 
                            value={newEmpName}
                            onChange={(e: any) => setNewEmpName(e.target.value)}
                        />
                        
                        <ModalInput 
                            label="Código Interno (Auto)" 
                            icon={Hash}
                            placeholder="NOD-0000" 
                            value={newEmpCode}
                            readOnly
                            onChange={(e: any) => setNewEmpCode(e.target.value)}
                        />

                        <ModalInput 
                            label="Tipo de Recinto" 
                            icon={LayoutGrid}
                            placeholder="Ej: Centro de Distribución" 
                            value={newEmpType}
                            onChange={(e: any) => setNewEmpType(e.target.value)}
                        />
                    </div>

                    {/* COL 2: UBICACIÓN */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-2 mb-4">
                            <MapPin size={16} className="text-blue-600" />
                            <span className="text-xs font-bold uppercase tracking-widest">2. Ubicación Geográfica</span>
                        </div>

                        <CustomSelect 
                            label="Región Operativa" 
                            icon={<Map size={12}/>} 
                            value={newEmpRegion}
                            options={regions} 
                            placeholder="Seleccionar..."
                            onSelect={(val) => { setNewEmpRegion(val); setNewEmpCommune(''); }}
                        />
                        
                        <CustomSelect 
                            label="Comuna Jurisdiccional" 
                            icon={<Layers size={12}/>} 
                            value={newEmpCommune}
                            options={communesOfModalRegion} 
                            placeholder="Seleccionar..."
                            disabled={!newEmpRegion} 
                            onSelect={setNewEmpCommune}
                        />

                        <ModalInput 
                            label="Dirección / Referencia" 
                            icon={Navigation}
                            placeholder="Av. Principal 1234..." 
                            value={newEmpAddress}
                            onChange={(e: any) => setNewEmpAddress(e.target.value)}
                        />
                    </div>

                    {/* COL 3: DETALLES OPERATIVOS */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-2 mb-4">
                            <Activity size={16} className="text-blue-600" />
                            <span className="text-xs font-bold uppercase tracking-widest">3. Detalles Operativos</span>
                        </div>

                        <ModalInput 
                            label="Jefe / Responsable" 
                            icon={User}
                            placeholder="Nombre Apellido" 
                            value={newEmpManager}
                            onChange={(e: any) => setNewEmpManager(e.target.value)}
                        />

                        <ModalInput 
                            label="Capacidad Estimada (m²)" 
                            icon={Ruler}
                            type="number"
                            placeholder="0" 
                            value={newEmpCapacity}
                            onChange={(e: any) => setNewEmpCapacity(e.target.value)}
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center ml-1">
                                <Power size={12} className="mr-1.5 text-slate-400"/>
                                Estado Inicial
                            </label>
                            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                                <button 
                                    onClick={() => setNewEmpStatus('ACTIVO')}
                                    className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${newEmpStatus === 'ACTIVO' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Activo
                                </button>
                                <button 
                                    onClick={() => setNewEmpStatus('DESACTIVADO')}
                                    className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${newEmpStatus === 'DESACTIVADO' ? 'bg-slate-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Desactivado
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-4 sticky bottom-0 z-10">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-wider"
                >
                    Cancelar Operación
                </button>
                <button 
                    onClick={handleCreateEmplacement}
                    disabled={!(newEmpName && newEmpRegion && newEmpCommune)}
                    className={`px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center space-x-2
                    ${(newEmpName && newEmpRegion && newEmpCommune)
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'}
                    `}
                >
                    <Save size={16} />
                    <span>Registrar Emplazamiento</span>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
