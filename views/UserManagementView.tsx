
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { CHILE_GEO_DATA, MODULES } from '../constants';
import { User, Role } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
  Search, Plus, MoreHorizontal, MapPin, 
  Shield, User as UserIcon, Mail, Lock, 
  CreditCard, ChevronDown, Check, X,
  Grid, List, Copy, Edit2, Info,
  ClipboardList, Box, CheckSquare, CheckCircle2,
  Settings, LayoutGrid, Truck, HelpCircle, DoorOpen,
  ArrowLeftRight, FileCheck, History, Download, Minus,
  LayoutDashboard, Package, ClipboardCheck, Car, Users, FileText, Trash2, Send, Save, Loader2, Building2
} from 'lucide-react';

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`pb-4 px-1 text-sm font-bold transition-all relative ${active ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'}`}
  >
    {label}
  </button>
);

const ModalInput = ({ label, icon: Icon, placeholder, value, onChange, type = "text", className = "" }: any) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center">
        {Icon && <Icon size={12} className="mr-1.5 text-slate-400"/>}
        {label}
    </label>
    <div className="relative group">
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm`}
      />
    </div>
  </div>
);

const ModalSelect = ({ label, placeholder, options, value, onChange, disabled = false, icon: Icon }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((o: any) => o.value === value)?.label || value;

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center">
                {Icon && <Icon size={12} className="mr-1.5 text-slate-400"/>}
                {label}
            </label>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium flex justify-between items-center cursor-pointer shadow-sm transition-all ${isOpen ? 'bg-white border-blue-500 ring-4 ring-blue-500/10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-slate-700'}`}
            >
                <span className={!value ? 'text-slate-400' : 'text-slate-800'}>{value ? selectedLabel : placeholder}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute top-[110%] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {options.map((opt: any) => (
                        <div 
                            key={opt.value} 
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            className={`px-4 py-3 text-sm cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0 transition-colors ${value === opt.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            {opt.label}
                            {value === opt.value && <Check size={16} className="text-blue-600"/>}
                        </div>
                    ))}
                    {options.length === 0 && (
                        <div className="p-4 text-center text-slate-400 text-xs italic">No hay opciones disponibles</div>
                    )}
                </div>
            )}
        </div>
    );
};

type PermissionStatus = 'TOTAL' | 'PARCIAL' | 'NONE';

const PermissionBadge = ({ status }: { status: PermissionStatus }) => {
    if (status === 'TOTAL') {
        return (
            <div className="inline-flex items-center justify-center px-3 py-1 rounded bg-emerald-100 text-emerald-600 space-x-1.5 min-w-[70px]">
                <Check size={12} strokeWidth={3} />
                <span className="text-[10px] font-bold">Total</span>
            </div>
        );
    }
    if (status === 'PARCIAL') {
        return (
            <div className="inline-flex items-center justify-center px-3 py-1 rounded bg-blue-100 text-blue-600 space-x-1.5 min-w-[70px]">
                <Minus size={12} strokeWidth={3} />
                <span className="text-[10px] font-bold">Parcial</span>
            </div>
        );
    }
    return (
        <div className="inline-flex items-center justify-center px-3 py-1 text-slate-300">
            <X size={14} strokeWidth={2} />
        </div>
    );
};

// --- ROLES VIEW COMPONENT ---
const RolesView = () => {
    const { roles, addRole, updateRole, deleteRole } = useApp();
    const [viewMode, setViewMode] = useState<'HIERARCHY' | 'MATRIX'>('HIERARCHY');
    const [selectedRole, setSelectedRole] = useState(roles[0]?.id || "ADMIN");
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
    
    const [newRoleData, setNewRoleData] = useState({
        name: '',
        description: '',
        permissions: {} as Record<string, string[]>
    });

    const togglePermissionForNewRole = (moduleId: string, level: string) => {
        setNewRoleData(prev => {
            const currentPerms = prev.permissions[moduleId] || [];
            if (currentPerms.includes(level)) {
                const updated = { ...prev.permissions };
                delete updated[moduleId]; 
                return { ...prev, permissions: updated };
            } else {
                return { ...prev, permissions: { ...prev.permissions, [moduleId]: [level] } };
            }
        });
    };

    const handleSaveRole = () => {
        if (!newRoleData.name) return;

        if (editingRoleId) {
            updateRole(editingRoleId, {
                name: newRoleData.name,
                description: newRoleData.description,
                permissions: newRoleData.permissions
            });
        } else {
            addRole({
                id: newRoleData.name.toUpperCase().replace(/\s+/g, '_'),
                name: newRoleData.name,
                description: newRoleData.description,
                permissions: newRoleData.permissions
            });
        }
        
        setIsRoleModalOpen(false);
        setNewRoleData({ name: '', description: '', permissions: {} });
        setEditingRoleId(null);
    };

    const handleEditRole = (role: Role) => {
        setNewRoleData({
            name: role.name,
            description: role.description,
            permissions: role.permissions || {}
        });
        setEditingRoleId(role.id);
        setIsRoleModalOpen(true);
    };

    const handleDeleteRole = (role: Role) => {
        if (role.isSystem) {
            alert('No se pueden eliminar roles protegidos del sistema.');
            return;
        }
        if (confirm(`¿Eliminar rol ${role.name}? Esta acción afectará a los usuarios asignados.`)) {
            deleteRole(role.id);
            if (selectedRole === role.id) setSelectedRole(roles[0]?.id || 'ADMIN');
        }
    };

    const handleNewRole = () => {
        setNewRoleData({ name: '', description: '', permissions: {} });
        setEditingRoleId(null);
        setIsRoleModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300 w-full">
            {/* ... (Roles View JSX remains largely the same for brevity, focus is on User Modal) ... */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="flex items-start space-x-4">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Settings size={24} />
                     </div>
                     <div>
                         <h2 className="text-lg font-bold text-slate-800">Gestión de Roles y Permisos</h2>
                         <p className="text-xs text-slate-500 mt-1">Administre los niveles de acceso y perfiles de usuario.</p>
                     </div>
                </div>
                <div className="flex items-center space-x-3">
                     <div className="flex bg-slate-100 p-1 rounded-lg">
                         <button 
                            onClick={() => setViewMode('HIERARCHY')}
                            className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'HIERARCHY' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                             <List size={14} className="mr-1.5" /> Jerárquico
                         </button>
                         <button 
                            onClick={() => setViewMode('MATRIX')}
                            className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'MATRIX' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                             <LayoutGrid size={14} className="mr-1.5" /> Matriz
                         </button>
                     </div>
                     <button 
                        onClick={handleNewRole}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-md shadow-blue-500/20"
                     >
                         <Plus size={16} className="mr-2" /> Nuevo Rol
                     </button>
                </div>
            </div>

            {viewMode === 'MATRIX' ? (
                <div className="flex-1 w-full overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 border-b border-slate-100 flex justify-end">
                        <button className="flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            <Download size={14} className="mr-2" />
                            Exportar CSV
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-white sticky top-0 z-10">
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-800 bg-white border-r border-slate-100 min-w-[200px] sticky left-0 z-20">
                                        Módulo del Sistema
                                    </th>
                                    {roles.map(role => (
                                        <th key={role.id} className="px-4 py-4 text-[10px] font-bold text-slate-500 text-center min-w-[120px] bg-white group cursor-pointer hover:bg-slate-50" onClick={() => handleEditRole(role)}>
                                            <div className="flex flex-col items-center">
                                                <span>{role.name}</span>
                                                <Edit2 size={10} className="mt-1 opacity-0 group-hover:opacity-100 text-blue-500" />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MODULES.map((mod, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 bg-white border-r border-slate-100 sticky left-0 z-10">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-slate-400">
                                                    <mod.icon size={16} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-800">{mod.label}</span>
                                            </div>
                                        </td>
                                        {roles.map((role) => {
                                            let status: PermissionStatus = 'NONE';
                                            if (role.isSystem && role.id === 'ADMIN') status = 'TOTAL';
                                            else if (role.permissions && role.permissions[mod.id]) status = 'TOTAL'; 
                                            
                                            return (
                                                <td key={role.id} className="px-4 py-3 text-center">
                                                    <PermissionBadge status={status} />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 items-start h-full overflow-hidden animate-in fade-in slide-in-from-left-2 w-full">
                    <div className="w-full lg:w-72 flex-shrink-0 space-y-4 h-full flex flex-col">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                    <UserIcon size={12} className="mr-2" /> LISTA DE ROLES ({roles.length})
                                </h3>
                            </div>
                            <div className="py-2 overflow-y-auto max-h-[400px]">
                                {roles.map(role => (
                                    <div 
                                        key={role.id} 
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors border-l-2 ${selectedRole === role.id ? 'bg-blue-50/50 border-blue-500' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                                    >
                                        <span className={`text-xs font-bold ${selectedRole === role.id ? 'text-blue-600' : 'text-slate-600'}`}>{role.name}</span>
                                        <div className="flex items-center text-slate-400 space-x-1">
                                            {selectedRole === role.id && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEditRole(role); }}
                                                className="hover:bg-blue-100 p-1.5 rounded transition-colors"
                                                title="Editar Rol"
                                            >
                                                <Edit2 size={12} className="text-slate-400 hover:text-blue-600" />
                                            </button>
                                            {!role.isSystem && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteRole(role); }}
                                                    className="hover:bg-red-50 p-1.5 rounded transition-colors group"
                                                    title="Eliminar Rol"
                                                >
                                                    <Trash2 size={12} className="text-slate-400 group-hover:text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start space-x-3">
                            <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-blue-700 mb-1">Información</h4>
                                <p className="text-[11px] text-blue-600/80 leading-relaxed">Los permisos definidos aquí afectan directamente qué módulos pueden ver y utilizar los usuarios asignados a este rol.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-6 overflow-y-auto h-full pr-2">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Permisos: {roles.find(r => r.id === selectedRole)?.name}</h3>
                                        <p className="text-xs text-slate-500">Visualizando estructura de acceso jerárquico</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">OPERACIONES POR MÓDULO</h4>

                        <div className="space-y-4">
                            {MODULES.map(module => (
                                <div key={module.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-slate-50 flex justify-between items-start">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                                <module.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">{module.label}</h4>
                                                <p className="text-xs text-slate-400 mt-0.5">Control de acceso y funcionalidad</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex flex-wrap gap-2">
                                            {['Leer', 'Crear', 'Actualizar', 'Eliminar'].map(action => (
                                                <button 
                                                    key={action} 
                                                    className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all select-none active:scale-95 ${
                                                        (selectedRole === 'ADMIN') 
                                                        ? 'border-blue-200 bg-blue-50 text-blue-600 shadow-sm' 
                                                        : 'border-slate-100 bg-white text-slate-300'
                                                    }`}
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isRoleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                         <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{editingRoleId ? 'Editar Rol Existente' : 'Crear Nuevo Rol'}</h3>
                                <p className="text-sm text-slate-500 mt-1">Defina el nombre, descripción y asigne los módulos permitidos.</p>
                            </div>
                            <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 bg-white overflow-y-auto flex-1">
                            <ModalInput 
                                label="NOMBRE DEL ROL" 
                                icon={Shield} 
                                placeholder="Ej. Auditor de Calidad" 
                                value={newRoleData.name} 
                                onChange={(e: any) => setNewRoleData({...newRoleData, name: e.target.value})} 
                            />
                            {/* ... Role Content ... */}
                            <div className="border-t border-slate-100 pt-6">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-4 block">ASIGNACIÓN DE MÓDULOS</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {MODULES.map(mod => {
                                        const isSelected = newRoleData.permissions[mod.id]?.includes('TOTAL');
                                        return (
                                            <div 
                                                key={mod.id}
                                                onClick={() => togglePermissionForNewRole(mod.id, 'TOTAL')}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={isSelected ? 'text-blue-600' : 'text-slate-400'}>
                                                        <mod.icon size={18} />
                                                    </div>
                                                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>{mod.label}</span>
                                                </div>
                                                {isSelected && <CheckCircle2 size={16} className="text-blue-600" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end space-x-4 sticky bottom-0 z-10">
                            <button onClick={() => setIsRoleModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
                            <button onClick={handleSaveRole} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all active:scale-95">{editingRoleId ? 'Guardar Cambios' : 'Crear Rol'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const UserManagementView: React.FC = () => {
  const { users, roles, addUser, editUser, deleteUser, emplacements } = useApp();
  const [activeTab, setActiveTab] = useState('users'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
      name: '',
      rutBody: '',
      rutDv: '',
      username: '',
      email: '',
      password: '',
      role: '',
      region: '',
      commune: '',
      emplacement: ''
  });

  const regions = useMemo(() => CHILE_GEO_DATA.map(r => ({ label: r.region, value: r.region })), []);
  const communes = useMemo(() => {
      if (!formData.region) return [];
      const regionData = CHILE_GEO_DATA.find(r => r.region === formData.region);
      return regionData ? regionData.communes.map(c => ({ label: c, value: c })) : [];
  }, [formData.region]);

  const roleOptions = useMemo(() => roles.map(r => ({ label: r.name, value: r.id })), [roles]);
  const emplacementOptions = useMemo(() => emplacements.map(e => ({ label: e, value: e })), [emplacements]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.rut.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSave = async () => {
      if(!formData.name || !formData.rutBody || !formData.role) {
          alert("Por favor complete los campos obligatorios: Nombre, RUT y Rol");
          return;
      }
      
      const fullRut = `${formData.rutBody}-${formData.rutDv}`;
      const userLocation = formData.emplacement || formData.commune || 'General';
      
      if (editingUserId) {
          editUser(editingUserId, {
              name: formData.name,
              rut: fullRut,
              role: formData.role,
              location: userLocation,
              commune: formData.commune,
              ...(formData.password ? { password: formData.password } : {})
          });
          setIsModalOpen(false);
          resetForm();
      } else {
          setIsGenerating(true);
          try {
              const newUserId = Date.now().toString();
              const roleName = roles.find(r => r.id === formData.role)?.name || formData.role;
              const tempPass = formData.password || '123456';
              const userEmail = formData.email;

              const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
              
              const prompt = `...`; 
              
              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview',
                contents: "Generate welcome email",
              });
              
              addUser({
                  id: newUserId,
                  name: formData.name,
                  rut: fullRut,
                  role: formData.role,
                  location: userLocation,
                  commune: formData.commune,
                  password: tempPass
              });

          } catch (error) {
              addUser({
                  id: Date.now().toString(),
                  name: formData.name,
                  rut: fullRut,
                  role: formData.role,
                  location: userLocation,
                  commune: formData.commune,
                  password: formData.password || '123456'
              });
          } finally {
              setIsGenerating(false);
              setIsModalOpen(false);
              resetForm();
          }
      }
  };

  const resetForm = () => {
      setFormData({ name: '', rutBody: '', rutDv: '', username: '', email: '', password: '', role: '', region: '', commune: '', emplacement: '' });
      setEditingUserId(null);
  };

  const handleEditUser = (user: User) => {
      const [rutBody, rutDv] = user.rut.split('-');
      let foundRegion = '';
      if (user.commune) {
          const regionData = CHILE_GEO_DATA.find(r => r.communes.includes(user.commune || ''));
          if (regionData) foundRegion = regionData.region;
      }

      setFormData({
          name: user.name,
          rutBody: rutBody || '',
          rutDv: rutDv || '',
          username: '', 
          email: '', 
          password: '', 
          role: user.role,
          region: foundRegion,
          commune: user.commune || '',
          emplacement: user.location || ''
      });
      setEditingUserId(user.id);
      setIsModalOpen(true);
  };

  const handleDeleteUser = (id: string) => {
      if (confirm('¿Está seguro de eliminar este usuario? Esta acción es irreversible.')) {
          deleteUser(id);
      }
  };

  const getRoleBadge = (roleId: string) => {
      const role = roles.find(r => r.id === roleId);
      if (!role) return <span className="text-slate-400 text-xs">Sin Rol</span>;

      let icon = UserIcon;
      if (role.id === 'ADMIN') icon = Shield;
      if (role.id === 'DRIVER') icon = Truck;

      const IconComp = icon;

      return (
          <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700">
              <IconComp size={12} className="mr-1.5 text-slate-400"/> {role.name}
          </span>
      );
  };

  const getInitials = (name: string) => name.substring(0,2).toUpperCase();
  const getHandle = (name: string) => `@${name.split(' ')[0].toLowerCase()}${name.split(' ')[1] ? name.split(' ')[1].substring(0,1).toLowerCase() : ''}`;

  return (
    <div className="h-full flex flex-col bg-slate-50/50 w-full">
      <div className="bg-white border-b border-slate-200 px-8 pt-6 sticky top-0 z-20 w-full">
         <div className="flex space-x-6">
            <TabButton label="Gestión de Usuarios" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <TabButton label="Roles y Permisos" active={activeTab === 'roles'} onClick={() => setActiveTab('roles')} />
         </div>
      </div>

      <div className="flex-1 overflow-hidden p-6 lg:p-8 w-full">
        
        {activeTab === 'users' && (
           <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300 w-full">
              <div className="px-8 py-8 border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-900">Administración de Accesos</h1>
                <p className="text-sm text-slate-500 mt-1">Gestión integral de usuarios, roles y permisos.</p>
              </div>

              <div className="px-8 py-6 flex justify-between items-center bg-slate-50/50">
                  <div className="relative w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre, usuario o email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:border-blue-500 outline-none transition-colors"
                      />
                  </div>
                  <button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                      <Plus size={16} className="mr-2" />
                      Nuevo Usuario
                  </button>
              </div>

              <div className="flex-1 overflow-auto px-8">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-slate-100">
                              <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Usuario</th>
                              <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Rol</th>
                              <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Permisos Especiales</th>
                              <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Emplazamiento/Comuna</th>
                              <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">Acciones</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {filteredUsers.map(u => (
                              <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                                  <td className="py-4 pr-4">
                                      <div className="flex items-center">
                                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                                              {getInitials(u.name)}
                                          </div>
                                          <div>
                                              <div className="text-sm font-bold text-slate-800">{u.name}</div>
                                              <div className="text-xs text-slate-400">{getHandle(u.name)}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="py-4 pr-4">
                                      {getRoleBadge(u.role)}
                                  </td>
                                  <td className="py-4 pr-4">
                                      <div className="flex items-center text-xs text-slate-500">
                                          <MapPin size={12} className="mr-1.5 text-slate-400" />
                                          {u.commune || 'General'}
                                      </div>
                                  </td>
                                  <td className="py-4 pr-4">
                                      <div className="flex flex-wrap gap-2">
                                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[10px] font-bold uppercase">
                                              VTA {u.location.substring(0,3).toUpperCase()}
                                          </span>
                                          {u.role === 'ADMIN' && (
                                             <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded text-[10px] font-bold uppercase">
                                               +1
                                             </span>
                                          )}
                                      </div>
                                  </td>
                                  <td className="py-4 text-right">
                                      <div className="flex items-center justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                          <button 
                                            onClick={() => handleEditUser(u)} 
                                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Editar Usuario"
                                          >
                                              <Edit2 size={16} />
                                          </button>
                                          <button 
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            title="Eliminar Usuario"
                                          >
                                              <Trash2 size={16} />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
           </div>
        )}

        {activeTab === 'roles' && <RolesView />}
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                  <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">{editingUserId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
                          <p className="text-sm text-slate-500 mt-1">Complete los datos requeridos para gestionar el perfil de acceso.</p>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="p-10 space-y-8 bg-white overflow-y-auto flex-1 pb-48">
                      <ModalInput 
                          label="NOMBRE COMPLETO" 
                          icon={UserIcon} 
                          placeholder="Nombre Apellido" 
                          value={formData.name} 
                          onChange={(e: any) => {
                              const val = e.target.value;
                              const formatted = val.replace(/\b\w/g, (c: string) => c.toUpperCase());
                              setFormData({...formData, name: formatted});
                          }} 
                      />
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center">
                                  <CreditCard size={12} className="mr-1.5 text-slate-400"/> RUT
                              </label>
                              <div className="flex gap-3">
                                  <div className="relative flex-1 group">
                                      <input type="text" placeholder="12345678" value={formData.rutBody} onChange={(e) => setFormData({...formData, rutBody: e.target.value})} className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" />
                                  </div>
                                  <span className="self-center text-slate-300">-</span>
                                  <input type="text" placeholder="K" value={formData.rutDv} onChange={(e) => setFormData({...formData, rutDv: e.target.value})} className="w-16 text-center py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" />
                              </div>
                              <p className="text-[10px] text-slate-400">Sin puntos ni guión</p>
                          </div>
                          
                          <ModalInput label="USUARIO" icon={UserIcon} placeholder="" value={formData.username} onChange={(e: any) => setFormData({...formData, username: e.target.value})} />
                          <ModalInput label="CORREO ELECTRÓNICO" icon={Mail} placeholder="usuario@empresa.com" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <ModalInput label="CONTRASEÑA" icon={Lock} type="password" placeholder={editingUserId ? "•••• (Sin Cambios)" : "••••"} value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} />
                          <ModalSelect label="ROL DE ACCESO" icon={Shield} placeholder="Seleccionar rol" value={formData.role} onChange={(val: string) => setFormData({...formData, role: val})} options={roleOptions} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                          <ModalSelect label="REGIÓN" icon={MapPin} placeholder="Seleccionar región" value={formData.region} onChange={(val: string) => setFormData({...formData, region: val, commune: ''})} options={regions} />
                          <ModalSelect label="COMUNA" icon={MapPin} placeholder="Seleccionar comuna" value={formData.commune} onChange={(val: string) => setFormData({...formData, commune: val})} options={communes} disabled={!formData.region} />
                          <ModalSelect 
                            label="EMPLAZAMIENTOS (SUCURSALES)" 
                            icon={Building2}
                            placeholder="Seleccionar sucursal operativa" 
                            value={formData.emplacement} 
                            onChange={(val: string) => setFormData({...formData, emplacement: val})} 
                            options={emplacementOptions}
                         />
                      </div>
                  </div>

                  <div className="px-10 py-6 border-t border-slate-100 bg-white flex justify-end space-x-4 sticky bottom-0 z-10">
                      <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
                      <button 
                        onClick={handleSave} 
                        disabled={isGenerating}
                        className={`px-8 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center ${isGenerating ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                          {isGenerating ? (
                              <>
                                <Loader2 size={18} className="mr-2 animate-spin" />
                                Generando...
                              </>
                          ) : (
                              <>
                                {editingUserId ? <Save size={18} className="mr-2"/> : <Send size={18} className="mr-2"/>}
                                {editingUserId ? 'Guardar Cambios' : 'Crear y Enviar'}
                              </>
                          )}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
