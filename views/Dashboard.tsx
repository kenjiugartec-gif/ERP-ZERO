import React from 'react';
import { useApp } from '../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Truck, CheckCircle, AlertOctagon } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { transactions, stock, vehicles } = useApp();

  // Metrics
  const activeRoutes = transactions.filter(t => t.status === 'IN_ROUTE').length;
  const completedToday = transactions.filter(t => t.status === 'COMPLETED').length;
  const maintenanceSoon = vehicles.filter(v => (Math.ceil(v.km / 10000) * 10000) - v.km < 1000).length;

  const stockData = stock.slice(0, 5).map(s => ({ name: s.code, cantidad: s.quantity }));
  
  // Corporate Palette
  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#64748b']; // Blue, Teal, Amber, Slate
  const statusData = [
    { name: 'En Ruta', value: activeRoutes },
    { name: 'Completados', value: completedToday },
    { name: 'Pendientes', value: transactions.length - activeRoutes - completedToday }
  ].filter(d => d.value > 0);

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass, borderClass }: any) => (
    <div className={`bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group`}>
       <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderClass}`}></div>
       <div className="flex justify-between items-start">
          <div>
            <h3 className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
             <Icon size={24} />
          </div>
       </div>
       {subtext && <p className="text-xs text-slate-400 mt-4 font-medium">{subtext}</p>}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 bg-white">
      <div className="flex items-center justify-between mb-2">
         <h2 className="text-xl font-bold text-slate-800">Resumen Operacional</h2>
         <div className="text-sm text-slate-500">Última actualización: hace instantes</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
           title="Móviles en Ruta" 
           value={activeRoutes} 
           icon={Truck} 
           colorClass="bg-blue-100 text-blue-600"
           borderClass="bg-blue-600"
           subtext={`${vehicles.length} vehículos totales en flota`}
        />
        <StatCard 
           title="Transacciones Hoy" 
           value={completedToday} 
           icon={CheckCircle} 
           colorClass="bg-teal-100 text-teal-600"
           borderClass="bg-teal-600"
           subtext="Ciclo completo de E/S"
        />
        <StatCard 
           title="Alerta Mantención" 
           value={maintenanceSoon} 
           icon={AlertOctagon} 
           colorClass="bg-amber-100 text-amber-600"
           borderClass="bg-amber-500"
           subtext="Vehículos próximos a servicio"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
         <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wide">Stock Crítico (Top 5)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                />
                <Bar dataKey="cantidad" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
         </div>

         <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wide">Distribución de Flota</h3>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '6px', border: '1px solid #e2e8f0'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-[-20px]">
               {statusData.map((d, i) => (
                  <div key={d.name} className="flex items-center text-xs text-slate-500">
                     <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                     {d.name}
                  </div>
               ))}
            </div>
         </div>
      </div>
      
      {/* Suggestions */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Inteligencia Operacional</h3>
        <ul className="space-y-3">
          {maintenanceSoon > 0 && (
             <li className="flex items-start text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-3"></div>
                <span>Se requiere agendar <strong>{maintenanceSoon} mantenciones preventivas</strong> para asegurar continuidad operativa.</span>
             </li>
          )}
          {activeRoutes > 5 && (
            <li className="flex items-start text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-3"></div>
                <span>Tráfico elevado en zona norte. Se sugiere revisión de rutas alternativas.</span>
            </li>
          )}
          <li className="flex items-start text-sm text-slate-600">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-3"></div>
             <span>Inventario de 'Nariceras Adulto' muestra desviación estándar respecto a la media mensual.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};