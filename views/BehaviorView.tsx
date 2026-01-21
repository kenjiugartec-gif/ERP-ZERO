
import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  BarChart3, Calendar, TrendingUp, Package, Activity, 
  ArrowUpRight, Box, Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';

export const BehaviorView: React.FC = () => {
  const { transactions, user } = useApp();
  const [timeRange, setTimeRange] = useState<'WEEK' | 'MONTH'>('WEEK');

  // Filter transactions by location
  const localTransactions = useMemo(() => {
    return transactions.filter(t => t.location === user?.location);
  }, [transactions, user]);

  // Process data for charts and cards
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let insumosToday = 0;
    let activosToday = 0;
    let insumosWeek = 0;
    let activosWeek = 0;
    let insumosMonth = 0;
    let activosMonth = 0;

    // Data for charts
    const dailyDataMap: Record<string, { date: string, insumos: number, activos: number }> = {};
    const itemDistribution: Record<string, number> = {};

    localTransactions.forEach(t => {
      // Consider transactions that imply withdrawal (leaving the premise)
      // 'IN_ROUTE' (currently out) or 'COMPLETED' (finished cycle)
      if (t.status === 'IN_ROUTE' || t.status === 'COMPLETED' || t.status === 'PENDING_ENTRY') {
        if (!t.exitTime) return;
        
        const transDate = new Date(t.exitTime);
        const transDateStr = transDate.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
        
        // Initialize map for chart
        if (!dailyDataMap[transDateStr]) {
            dailyDataMap[transDateStr] = { date: transDateStr, insumos: 0, activos: 0 };
        }

        // Sum items
        let tInsumos = 0;
        let tActivos = 0;

        t.exitItems_ES.forEach(item => {
            if (item.type === 'INSUMO') {
                tInsumos += item.quantity;
                itemDistribution[item.name] = (itemDistribution[item.name] || 0) + item.quantity;
            } else if (item.type === 'ACTIVO') {
                tActivos += item.quantity;
                itemDistribution[item.name] = (itemDistribution[item.name] || 0) + item.quantity;
            }
        });

        // Add to map
        dailyDataMap[transDateStr].insumos += tInsumos;
        dailyDataMap[transDateStr].activos += tActivos;

        // Add to cards counters
        const cleanTransDate = new Date(transDate);
        cleanTransDate.setHours(0,0,0,0);

        if (cleanTransDate.getTime() === today.getTime()) {
            insumosToday += tInsumos;
            activosToday += tActivos;
        }
        
        if (cleanTransDate >= oneWeekAgo) {
            insumosWeek += tInsumos;
            activosWeek += tActivos;
        }

        if (cleanTransDate >= startOfMonth) {
            insumosMonth += tInsumos;
            activosMonth += tActivos;
        }
      }
    });

    // Convert map to array and sort
    const chartData = Object.values(dailyDataMap).slice(timeRange === 'WEEK' ? -7 : -30);
    
    // Top items for bar chart
    const topItems = Object.entries(itemDistribution)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return {
        insumosToday,
        activosToday,
        insumosWeek,
        activosWeek,
        insumosMonth,
        activosMonth,
        chartData,
        topItems
    };
  }, [localTransactions, timeRange]);

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-full relative overflow-hidden group">
       <div className={`absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
           <Icon size={64} />
       </div>
       <div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
       </div>
       <div className="mt-4 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-500">{subtext}</span>
           {trend && (
               <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                   <ArrowUpRight size={12} className="mr-1" /> {trend}
               </span>
           )}
       </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50 w-full font-sans">
       <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center space-x-4">
                <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-xl flex-shrink-0">
                   <BarChart3 size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Comportamiento</h2>
                   <p className="text-sm text-slate-500 font-medium mt-1">Análisis de consumo y retiro de materiales ({user?.location})</p>
                </div>
             </div>
             
             <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                 <button 
                    onClick={() => setTimeRange('WEEK')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${timeRange === 'WEEK' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    Semana
                 </button>
                 <button 
                    onClick={() => setTimeRange('MONTH')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${timeRange === 'MONTH' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    Mes
                 </button>
             </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                 title="Insumos (Hoy)" 
                 value={stats.insumosToday} 
                 subtext="Unidades retiradas" 
                 icon={Package} 
                 colorClass="text-blue-600"
              />
              <StatCard 
                 title="Activos (Hoy)" 
                 value={stats.activosToday} 
                 subtext="Equipos en circulación" 
                 icon={Box} 
                 colorClass="text-purple-600"
              />
              <StatCard 
                 title={`Insumos (${timeRange === 'WEEK' ? 'Semana' : 'Mes'})`} 
                 value={timeRange === 'WEEK' ? stats.insumosWeek : stats.insumosMonth} 
                 subtext="Total acumulado" 
                 icon={Activity} 
                 colorClass="text-emerald-600"
                 trend="+12% vs. anterior"
              />
              <StatCard 
                 title={`Activos (${timeRange === 'WEEK' ? 'Semana' : 'Mes'})`} 
                 value={timeRange === 'WEEK' ? stats.activosWeek : stats.activosMonth} 
                 subtext="Total acumulado" 
                 icon={TrendingUp} 
                 colorClass="text-amber-600"
                 trend="+5% vs. anterior"
              />
          </div>

          {/* Main Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
              
              {/* Timeline Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                      <div>
                          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Tendencia de Retiros</h3>
                          <p className="text-xs text-slate-400 font-medium">Comparativa Insumos vs Activos</p>
                      </div>
                      <div className="flex items-center space-x-4">
                          <div className="flex items-center text-[10px] font-bold uppercase text-slate-500">
                              <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span> Insumos
                          </div>
                          <div className="flex items-center text-[10px] font-bold uppercase text-slate-500">
                              <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span> Activos
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorInsumos" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorActivos" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} 
                                dy={10}
                              />
                              <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 10}} 
                              />
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="insumos" 
                                stroke="#2563eb" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorInsumos)" 
                              />
                              <Area 
                                type="monotone" 
                                dataKey="activos" 
                                stroke="#9333ea" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorActivos)" 
                              />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Top Items Chart */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="mb-8">
                      <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Top 5 Items</h3>
                      <p className="text-xs text-slate-400 font-medium">Mayor rotación en el periodo</p>
                  </div>
                  
                  <div className="flex-1 w-full min-h-0">
                      {stats.topItems.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={stats.topItems} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                  <XAxis type="number" hide />
                                  <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    width={100}
                                    tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} 
                                  />
                                  <Tooltip 
                                    cursor={{fill: '#f8fafc'}} 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                  />
                                  <Bar dataKey="value" fill="#0d9488" radius={[0, 6, 6, 0]} barSize={24} />
                              </BarChart>
                          </ResponsiveContainer>
                      ) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-300">
                              <Filter size={32} className="mb-2 opacity-50" />
                              <span className="text-xs font-bold uppercase">Sin datos suficientes</span>
                          </div>
                      )}
                  </div>
              </div>

          </div>

          {/* Simple Data Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Detalle Diario de Retiros</h3>
                  <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors uppercase tracking-wider">
                      Ver Todo
                  </button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100">
                          <tr>
                              <th className="px-8 py-4">Fecha</th>
                              <th className="px-8 py-4 text-center">Insumos Retirados</th>
                              <th className="px-8 py-4 text-center">Activos Movilizados</th>
                              <th className="px-8 py-4 text-right">Total Transacciones</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {stats.chartData.length === 0 ? (
                              <tr>
                                  <td colSpan={4} className="px-8 py-8 text-center text-xs text-slate-400 font-medium uppercase tracking-wide">No hay actividad registrada en este periodo</td>
                              </tr>
                          ) : (
                              [...stats.chartData].reverse().map((row, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-8 py-4 text-xs font-bold text-slate-700">{row.date}</td>
                                      <td className="px-8 py-4 text-center">
                                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{row.insumos}</span>
                                      </td>
                                      <td className="px-8 py-4 text-center">
                                          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">{row.activos}</span>
                                      </td>
                                      <td className="px-8 py-4 text-right text-xs font-bold text-slate-500">
                                          {row.insumos + row.activos} Items
                                      </td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

       </div>
    </div>
  );
};
