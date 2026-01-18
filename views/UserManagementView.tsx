
import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { CHILE_GEO_DATA } from '../constants';
import { User } from '../types';
import { 
  Users, UserPlus, Shield, Fingerprint, MapPin, 
  Globe, Building2, Save, X, Trash2, Search,
  CheckCircle2, Info, ChevronRight, UserCheck, 
  Circle, CheckCircle, ShieldCheck, Briefcase
} from 'lucide-react';

const labelClass = "text-xs font-semibold text-slate-500 ml-1 mb-2 block";
const inputClass = "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all duration-300 shadow-sm";

export const UserManagementView: React.FC = () => {
  const { users, addUser, emplacements } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    rut: '',
    role: 'OPERATOR',
    location: '',
    commune: '',
    password: ''
  });

  const allCommunes = useMemo(() => {
    return CHILE_GEO_DATA.flatMap(r => r.communes).sort();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.rut.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleCreateUser = () => {
    if (newUser.name && newUser.rut && newUser.location && newUser.role) {
      addUser({
        ...newUser,
        id: Date.now().toString(),
        password: newUser.password || '123456'
      } as User);
      setIsModalOpen(false);
      setNewUser({ name: '', rut: '', role: 'OPERATOR', location: '', commune: '', password: '' });
    } else {
      alert("Validación de seguridad: Por favor complete los campos requeridos.");
    }
  };

  const rolesList = [
    { id: 'ADMIN', label: 'Administrador Central', desc: 'Control total de la infraestructura', icon: ShieldCheck },
    { id: 'OPERATOR', label: 'Operador Logístico', desc: 'Gestión de inventario y flujos', icon: Briefcase },
    { id: 'DRIVER', label: 'Personal en Ruta', desc: 'Transporte y entregas técnicas', icon: MapPin },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header & Tabs */}
      <div className="px-12 py-10 border-b border-slate-100 bg-white flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Gestión de Personal</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Administración de credenciales y permisos de seguridad</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center shadow-lg transition-all duration-300 active:scale-95 group"
          >
            <UserPlus size={18} className="mr-3 group-hover:scale-110 transition-transform" /> 
            Añadir Colaborador
          </button>
        </div>

        <div className="flex space-x-10 border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'users' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Base de Usuarios
            {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full animate-in fade-in zoom-in"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'roles' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Matriz de Permisos
            {activeTab === 'roles' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full animate-in fade-in zoom-in"></div>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-12">
        {activeTab === 'users' ? (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div className="relative w-96 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por identidad o nombre..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                />
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500">
                {filteredUsers.length} REGISTROS ACTIVOS
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6">Colaborador</th>
                    <th className="px-10 py-6">Identidad Física</th>
                    <th className="px-10 py-6">Rango Asignado</th>
                    <th className="px-10 py-6">Ubicación</th>
                    <th className="px-10 py-6 text-right">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-sm shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            {u.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-base">{u.name}</div>
                            <div className="text-xs text-slate-400 font-medium">{u.commune || 'Jurisdicción No Definida'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 font-mono text-xs font-semibold text-slate-500">{u.rut}</td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : u.role === 'OPERATOR' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-teal-50 text-teal-600 border-teal-100'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center text-sm font-semibold text-slate-700">
                          <Building2 size={16} className="mr-2.5 text-slate-300" />
                          {u.location}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2.5">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                          <span className="text-xs font-bold text-slate-400">ONLINE</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
             <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Shield size={20} className="mr-4 text-blue-600" /> Jerarquía Corporativa
              </h3>
              <div className="space-y-5">
                {rolesList.map(r => (
                  <div key={r.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center space-x-6 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                      <r.icon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{r.label}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl text-white space-y-8 relative overflow-hidden group">
               <Fingerprint size={200} className="absolute -right-20 -bottom-20 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
               <h3 className="text-lg font-bold flex items-center">
                  <Fingerprint size={20} className="mr-4 text-blue-400" /> Registro de Seguridad
               </h3>
               <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Toda credencial emitida está sujeta a la norma de seguridad ISO/IEC 27001, garantizando que cada transacción sea auditada en tiempo real por el sistema central.
               </p>
               <div className="pt-6 grid grid-cols-1 gap-4">
                  <div className="flex items-center text-xs font-bold text-blue-400 bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                     <CheckCircle2 size={16} className="mr-3" /> Cifrado de Punto a Extremo
                  </div>
                  <div className="flex items-center text-xs font-bold text-blue-400 bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                     <CheckCircle2 size={16} className="mr-3" /> Trazabilidad de Dispositivo
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-[25px] animate-in fade-in duration-500 overflow-hidden">
          <div className="bg-white w-full h-full flex flex-col animate-in slide-in-from-bottom-12 duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <div className="px-12 py-10 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
               <div className="flex items-center space-x-6">
                  <div className="bg-slate-900 p-5 rounded-[1.5rem] text-white shadow-2xl">
                    <UserPlus size={36} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none italic uppercase">ALTA DE PERSONAL</h3>
                    <p className="text-sm font-semibold text-slate-400 mt-3 flex items-center">
                      <ShieldCheck size={16} className="mr-2 text-blue-500" /> Protocolo de Registro en Red Centralizada
                    </p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="group p-4 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all duration-300 border border-slate-100 hover:border-red-100">
                  <X size={32} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50/30">
               <div className="max-w-6xl mx-auto px-12 py-20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
                     <div className="space-y-12">
                        <div className="flex items-center space-x-4 mb-2">
                           <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                           <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">DATOS DE IDENTIDAD</h4>
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}><UserCheck size={14} className="inline mr-2 text-blue-600" /> Nombre Completo</label>
                           <input placeholder="Nombre y Apellidos" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value.toUpperCase()})} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}><Fingerprint size={14} className="inline mr-2 text-blue-600" /> RUT / ID Nacional</label>
                           <input placeholder="12.345.678-9" value={newUser.rut} onChange={e => setNewUser({...newUser, rut: e.target.value})} className={`${inputClass} font-mono`} />
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}><Shield size={14} className="inline mr-2 text-blue-600" /> Clave Temporal</label>
                           <input type="password" placeholder="••••••••" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className={inputClass} />
                        </div>
                     </div>
                     <div className="space-y-12">
                        <div className="flex items-center space-x-4 mb-2">
                           <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                           <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">ASIGNACIÓN Y RANGO</h4>
                        </div>
                        <div className="space-y-6">
                           <div className="space-y-2">
                             <label className={labelClass}><Globe size={14} className="inline mr-2 text-blue-600" /> Comuna Jurisdiccional</label>
                             <select value={newUser.commune} onChange={e => setNewUser({...newUser, commune: e.target.value})} className={`${inputClass} appearance-none cursor-pointer`}>
                                <option value="">Seleccionar Comuna...</option>
                                {allCommunes.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className={labelClass}><MapPin size={14} className="inline mr-2 text-blue-600" /> Emplazamiento Activo</label>
                             <select value={newUser.location} onChange={e => setNewUser({...newUser, location: e.target.value})} className={`${inputClass} appearance-none cursor-pointer font-bold text-blue-600`}>
                                <option value="">Seleccionar Nodo de Red...</option>
                                {emplacements.map(e => <option key={e} value={e}>{e}</option>)}
                             </select>
                           </div>
                           <div className="space-y-3">
                              <label className={labelClass}><ShieldCheck size={14} className="inline mr-2 text-blue-600" /> Rol en la Estructura</label>
                              <div className="flex flex-col space-y-3">
                                 {rolesList.map(r => (
                                    <button key={r.id} type="button" onClick={() => setNewUser({...newUser, role: r.id})} className={`flex items-center p-5 rounded-2xl border text-left transition-all duration-300 group ${newUser.role === r.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-slate-50'}`}>
                                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-5 transition-colors ${newUser.role === r.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-blue-600'}`}>
                                          <r.icon size={20} />
                                       </div>
                                       <div className="flex-1">
                                          <p className="font-bold text-sm tracking-tight">{r.label}</p>
                                          <p className={`text-[11px] mt-0.5 font-medium ${newUser.role === r.id ? 'text-white/70' : 'text-slate-400'}`}>{r.desc}</p>
                                       </div>
                                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${newUser.role === r.id ? 'bg-white border-white' : 'border-slate-200'}`}>
                                          {newUser.role === r.id && <CheckCircle className="text-blue-600" size={16} />}
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="px-12 py-12 bg-white border-t border-slate-100 flex justify-between items-center flex-shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors px-6 py-3">Abortar Procedimiento</button>
               <button onClick={handleCreateUser} className="bg-slate-900 hover:bg-blue-600 text-white px-24 py-6 rounded-[1.5rem] font-bold text-base shadow-2xl transition-all flex items-center group overflow-hidden relative">
                 <span className="relative z-10 flex items-center"><Save size={20} className="mr-4 group-hover:scale-110 transition-transform" />CERTIFICAR USUARIO</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
