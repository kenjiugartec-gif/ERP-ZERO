
import React, { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// Add missing Activity import
import { Truck, CheckCircle, AlertOctagon, LayoutDashboard, Globe, ShieldCheck, Terminal, Clock, Box, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { transactions, stock, vehicles, user } = useApp();

  const localTransactions = useMemo(() => transactions.filter(t => t.location === user?.location), [transactions, user]);
  const localStock = useMemo(() => stock.filter(s => s.location === user?.location), [stock, user]);
  const localVehicles = useMemo(() => vehicles.filter(v => v.location === user?.location), [vehicles, user]);

  const activeRoutes = localTransactions.filter(t => t.status === 'IN_ROUTE').length;
  const completedToday = localTransactions.filter(t => t.status === 'COMPLETED').length;
  const maintenanceSoon = localVehicles.filter(v => (Math.ceil(v.km / 10000) * 10000) - v.km < 1000).length;

  const stockData = localStock.slice(0, 5).map(s => ({ name: s.code, cantidad: s.quantity }));
  
  const COLORS = ['#00AEEF', '#10b981', '#f59e0b', '#64748b']; 
  const statusData = [
    { name: 'En Ruta', value: activeRoutes },
    { name: 'Completados', value: completedToday },
    { name: 'Pendientes', value: Math.max(0, localTransactions.length - activeRoutes - completedToday) }
  ].filter(d => d.value > 0);

  const StatCard = ({ title, value, subtext, icon: Icon, accentColor }: any) => (
    <div className={`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 w-full cursor-default`}>
       <div className={`absolute left-0 top-0 bottom-0 w-2 ${accentColor}`}></div>
       
       {/* REJILLA DE FONDO SUTIL */}
       <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

       <div className="flex justify-between items-start relative z-10">
          <div>
            <h3 className="text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] mb-3">{title}</h3>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
          </div>
          <div className={`p-4 rounded-2xl bg-slate-50 text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:text-slate-900 group-hover:bg-white group-hover:shadow-lg shadow-inner`}>
             <Icon size={32} strokeWidth={1.2} />
          </div>
       </div>
       {subtext && (
           <div className="mt-6 flex items-center justify-between">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                    <Globe size={10} className="mr-1.5 text-[#00AEEF]" /> {subtext}
                </p>
                <ChevronRight size={12} className="text-slate-200 group-hover:translate-x-1 group-hover:text-[#00AEEF] transition-all" />
           </div>
       )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50/30 w-full overscroll-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center space-x-5">
            <div className="bg-[#0B1120] p-4 rounded-2xl text-[#00AEEF] shadow-xl shadow-blue-500/10 transition-transform hover:rotate-3">
               <LayoutDashboard size={28} strokeWidth={2} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Dashboard <span className="text-[#00AEEF]">Directivo</span></h2>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                   Sincronización en tiempo real activa
               </p>
            </div>
         </div>
         <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 flex items-center shadow-sm uppercase tracking-widest">
            Protocolo v2.5.0 • {new Date().toLocaleTimeString()}
         </div>
      </div>

      {/* DIDACTIC INDUSTRIAL PANEL */}
      <div className="bg-[#0B1120] rounded-[2.5rem] p-8 md:p-10 border-l-8 border-[#00AEEF] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 text-white pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <ShieldCheck size={160} />
          </div>
          <div className="relative z-10">
              <div className="flex items-center space-x-3 text-[#00AEEF] mb-5">
                  <Terminal size={20} className="animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operational Integrality System</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-5">Manual de Integridad Logística</h2>
              <div className="max-w-4xl space-y-5">
                  <p className="text-slate-400 text-sm leading-relaxed font-mono">
                      <span className="text-white font-bold">[DIDÁCTICO]</span> Este panel consolida las métricas críticas del nodo. 
                      Cada indicador representa un punto de control en la cadena de suministros. 
                      La <span className="text-[#00AEEF] underline underline-offset-4">congruencia técnica</span> es su prioridad: asegure que el movimiento físico de activos sea respaldado por su firma digital en el módulo correspondiente.
                  </p>
                  <div className="flex flex-wrap gap-6 pt-6 border-t border-white/10">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#00AEEF] transition-colors cursor-help">
                          <CheckCircle size={14} className="mr-2 text-emerald-500" /> Tasa de Error: 0%
                      </div>
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#00AEEF] transition-colors cursor-help">
                          <Box size={14} className="mr-2 text-blue-500" /> Stock Certificado
                      </div>
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#00AEEF] transition-colors cursor-help">
                          <Clock size={14} className="mr-2 text-orange-500" /> Latencia: 14ms
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Unidades Activas" value={activeRoutes} icon={Truck} accentColor="bg-[#00AEEF]" subtext={`Flota Total: ${localVehicles.length}`} />
        <StatCard title="Despachos Certificados" value={completedToday} icon={CheckCircle} accentColor="bg-emerald-500" subtext="Rendimiento óptimo" />
        <StatCard title="Alertas de Servicio" value={maintenanceSoon} icon={AlertOctagon} accentColor="bg-amber-500" subtext="Preventivo Sugerido" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
         {/* CHART 1 */}
         <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[450px] group">
            <div className="flex items-center justify-between mb-10">
                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.3em] flex items-center">
                    <div className="w-2 h-8 bg-[#00AEEF] rounded-full mr-4 group-hover:scale-y-110 transition-transform"></div>
                    Stock Crítico por SKU
                </h3>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><LayoutGrid size={16}/></div>
            </div>
            <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stockData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8', fontWeight: '900'}} />
                   <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                   <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'}} />
                   <Bar dataKey="cantidad" fill="#00AEEF" radius={[8, 8, 0, 0]} barSize={45} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* CHART 2 */}
         <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[450px] group">
            <div className="flex items-center justify-between mb-10">
                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.3em] flex items-center">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full mr-4 group-hover:scale-y-110 transition-transform"></div>
                    Distribución de Estados
                </h3>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Activity size={16}/></div>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={statusData} innerRadius={85} outerRadius={125} paddingAngle={8} dataKey="value" stroke="none">
                     {statusData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip contentStyle={{borderRadius: '24px', border: 'none'}} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{localTransactions.length}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Eventos</span>
               </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
                {statusData.map((d, i) => (
                   <div key={d.name} className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                      {d.name}
                   </div>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
};

const LayoutGrid = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const ChevronRight = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6"/>
    </svg>
);
