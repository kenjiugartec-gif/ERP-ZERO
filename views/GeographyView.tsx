
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { CHILE_GEO_DATA } from '../constants';
import { 
  MapPin, Navigation, Building2, Layers, 
  CheckCircle2, Save, Trash2, Clock, Calendar, 
  ChevronDown, Plus, X, Globe
} from 'lucide-react';
import { GeoLocationRecord } from '../types';

interface CustomSelectProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: string[];
  placeholder: string;
  onSelect: (val: string) => void;
  disabled?: boolean;
  stepNumber?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  label, icon, value, options, placeholder, onSelect, disabled, stepNumber, className = "" 
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
    <div className={`space-y-2 relative transition-all duration-300 ${disabled ? 'opacity-30 pointer-events-none' : 'opacity-100'} ${className}`} ref={containerRef}>
      <div className="flex items-center text-slate-400 ml-1">
        <div className="mr-2 text-blue-600">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-widest">{stepNumber ? `${stepNumber}. ` : ''}{label}</span>
      </div>
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-900 flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'ring-4 ring-blue-500/5 bg-white border-blue-400 shadow-sm' : ''}`}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[100%] left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1">
          <div className="max-h-60 overflow-y-auto">
            {options.map(opt => (
              <div 
                key={opt}
                onClick={() => { onSelect(opt); setIsOpen(false); }}
                className={`px-4 py-3 text-xs font-normal cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between ${value === opt ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}
              >
                <span>{opt}</span>
                {value === opt && <CheckCircle2 size={12} />}
              </div>
            ))}
          </div>
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
    <div className="h-full overflow-y-auto p-8 bg-slate-50 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Configuración Territorial</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Gestión de nodos y sucursales regionales</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center shadow-xl shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={16} className="mr-2" />
            Nuevo Emplazamiento
          </button>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <CustomSelect 
              label="Nodo Operativo"
              icon={<Building2 size={16}/>}
              value={selectedEmplacement}
              options={emplacements}
              placeholder="Seleccionar nodo..."
              stepNumber="01"
              onSelect={setSelectedEmplacement}
            />
            <CustomSelect 
              label="Región Geográfica"
              icon={<Navigation size={16}/>}
              value={selectedRegion}
              options={regions}
              placeholder="Definir Región..."
              stepNumber="02"
              onSelect={(val) => { setSelectedRegion(val); setSelectedCommune(''); }}
              disabled={!selectedEmplacement}
            />
            <CustomSelect 
              label="Jurisdicción / Comuna"
              icon={<Layers size={16}/>}
              value={selectedCommune}
              options={communesOfRegion}
              placeholder="Definir Comuna..."
              stepNumber="03"
              onSelect={setSelectedCommune}
              disabled={!selectedRegion}
            />
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-slate-100">
            <button onClick={handleReset} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Limpiar Formulario</button>
            <button 
              onClick={handleSaveVincular}
              disabled={!(selectedRegion && selectedCommune && selectedEmplacement)}
              className={`flex items-center space-x-2 px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg
                ${(selectedRegion && selectedCommune && selectedEmplacement)
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}
              `}
            >
              <Save size={16} />
              <span>Certificar Localización</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Nodo</th>
                <th className="px-8 py-5">Región / Territorio</th>
                <th className="px-8 py-5">Comuna</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {geoRecords.map((record) => (
                <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900">{record.emplacement}</td>
                  <td className="px-8 py-5 text-slate-500 font-normal">{record.region}</td>
                  <td className="px-8 py-5 text-slate-700 font-normal">{record.commune}</td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => deleteGeoRecord(record.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold text-slate-800 uppercase tracking-tight flex items-center">
                <Globe size={18} className="mr-2 text-blue-600" /> Nuevo Nodo
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Descriptivo</label>
                <input 
                  type="text" autoFocus placeholder="Bodega Central" value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                />
              </div>
              <CustomSelect 
                label="Región Operativa" icon={<Navigation size={14}/>} value={newEmpRegion}
                options={regions} placeholder="Seleccionar..."
                onSelect={(val) => { setNewEmpRegion(val); setNewEmpCommune(''); }}
              />
              <CustomSelect 
                label="Comuna Jurisdiccional" icon={<Layers size={14}/>} value={newEmpCommune}
                options={communesOfModalRegion} placeholder="Seleccionar..."
                disabled={!newEmpRegion} onSelect={setNewEmpCommune}
              />
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={handleCreateEmplacement}
                disabled={!(newEmpName && newEmpRegion && newEmpCommune)}
                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center space-x-2
                  ${(newEmpName && newEmpRegion && newEmpCommune)
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}
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
