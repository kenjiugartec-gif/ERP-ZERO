
import React, { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Truck, CheckCircle, AlertOctagon, LayoutDashboard, Globe, Info } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { transactions, stock, vehicles, user } = useApp();

  const localTransactions = useMemo(() => transactions.filter(t => {
    const v = vehicles.find(veh => veh.plate === t.plate);
    return v?.location === user?.location;
  }), [transactions, vehicles, user]);

  const localStock = useMemo(() => stock.filter(s => s.location === user?.location), [stock, user]);
  const localVehicles = useMemo(() => vehicles.filter(v => v.location === user?.location), [vehicles, user]);

  const activeRoutes = localTransactions.filter(t => t.status === 'IN_ROUTE').length;
  const completedToday = localTransactions.filter(t => t.status === 'COMPLETED').length;
  const maintenanceSoon = localVehicles.filter(v => (Math.ceil(v.km / 10000) * 10000) - v.km < 1000).length;

  const stockData = localStock.slice(0, 5).map(s => ({ name: s.code, cantidad: s.quantity }));
  
  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#64748b']; 
  const statusData = [
    { name: 'En Ruta', value: activeRoutes },
    { name: 'Completados', value: completedToday },
    { name: 'Pendientes', value: localTransactions.length - activeRoutes - completedToday }
  ].filter(d => d.value > 0);

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass, borderClass }: any) => (
    <div className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300`}>
       <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderClass}`}></div>
       <div className="flex justify-between items-start">
          <div>
            <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">{title}</h3>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
          </div>
          <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 text-opacity-100 shadow-inner`}>
             <Icon size={28} strokeWidth={1.5} />
          </div>
       </div>
       {subtext && <p className="text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest flex items-center"><Globe size={10} className="mr-1.5" /> {subtext}</p>}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-8 space-y-10 bg-slate-50/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
               <LayoutDashboard size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Escritorio Operacional</h2>
               <p className="text-sm text-slate-500 font-medium mt-1">Supervisión en tiempo real del nodo {user?.location || 'General'}</p>
            </div>
         </div>
         <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-400 flex items-center shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            DATOS ACTUALIZADOS: {new Date().toLocaleTimeString()}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
           title="Móviles Activos" 
           value={activeRoutes} 
           icon={Truck} 
           colorClass="bg-blue-600 text-blue-600"
           borderClass="bg-blue-600"
           subtext={`FLOTA TOTAL NODO: ${localVehicles.length}`}
        />
        <StatCard 
           title="Despachos Hoy" 
           value={completedToday} 
           icon={CheckCircle} 
           colorClass="bg-teal-600 text-teal-600"
           borderClass="bg-teal-600"
           subtext="SINCRONIZACIÓN EXITOSA"
        />
        <StatCard 
           title="Alertas Activo" 
           value={maintenanceSoon} 
           icon={AlertOctagon} 
           colorClass="bg-amber-600 text-amber-600"
           borderClass="bg-amber-500"
           subtext="REVISIÓN DE KILOMETRAJE"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[450px]">
            <h3 className="font-bold text-slate-800 mb-8 text-xs uppercase tracking-[0.2em] flex items-center">
               <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
               Niveles de Stock Crítico
            </h3>
            <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stockData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                   <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                   <Tooltip 
                     cursor={{fill: '#f8fafc'}} 
                     contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}} 
                   />
                   <Bar dataKey="cantidad" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[450px]">
            <h3 className="font-bold text-slate-800 mb-8 text-xs uppercase tracking-[0.2em] flex items-center">
               <span className="w-1.5 h-6 bg-teal-600 rounded-full mr-3"></span>
               Estado Logístico de Flota
            </h3>
            <div className="flex-1 w-full min-h-0 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={statusData}
                     innerRadius={80}
                     outerRadius={120}
                     paddingAngle={8}
                     dataKey="value"
                     stroke="none"
                   >
                     {statusData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-slate-900">{localTransactions.length}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eventos</span>
               </div>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
                {statusData.map((d, i) => (
                   <div key={d.name} className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                      <span className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                      {d.name}
                   </div>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
};
