
import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  BarChart3, Calendar, TrendingUp, Package, Activity, 
  ArrowUpRight, Box, Filter, ArrowRightLeft, ArrowDownLeft, ArrowUpRight as ArrowOut
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend, ReferenceLine
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
    
    // Data structures
    const dailyDataMap: Record<string, { 
        date: string, 
        salidasActivos: number, 
        salidasInsumos: number, 
        entradasActivos: number, 
        entradasInsumos: number,
        totalSalida: number,
        totalEntrada: number
    }> = {};

    let totalSalidasPeriodo = 0;
    let totalEntradasPeriodo = 0;
    let activosPendientes = 0;

    // Helper to init date entry
    const getInitData = (date: string) => dailyDataMap[date] || { 
        date, salidasActivos: 0, salidasInsumos: 0, entradasActivos: 0, entradasInsumos: 0, totalSalida: 0, totalEntrada: 0 
    };

    // 1. Process EXITS (Salidas)
    localTransactions.forEach(t => {
        // Calculate items currently pending return (In Route)
        if (t.status === 'IN_ROUTE' || t.status === 'PENDING_ENTRY') {
             t.exitItems_ES.forEach(i => {
                 if (i.type === 'ACTIVO') activosPendientes += i.quantity;
             });
        }

        // Process Exit Flow
        if (t.exitTime) {
            const dateStr = new Date(t.exitTime).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
            const entry = getInitData(dateStr);
            
            t.exitItems_ES.forEach(item => {
                if (item.type === 'ACTIVO') entry.salidasActivos += item.quantity;
                else entry.salidasInsumos += item.quantity;
            });
            entry.totalSalida = entry.salidasActivos + entry.salidasInsumos;
            dailyDataMap[dateStr] = entry;
            
            // Period totals (simple filter logic can be added here if needed, currently taking all history for demo)
            totalSalidasPeriodo += entry.totalSalida;
        }

        // Process Return Flow (Entradas)
        if (t.entryTime && t.status === 'COMPLETED') {
            const dateStr = new Date(t.entryTime).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
            const entry = getInitData(dateStr);

            t.entryItems_ES.forEach(item => {
                if (item.type === 'ACTIVO') entry.entradasActivos += item.quantity;
                else entry.entradasInsumos += item.quantity;
            });
            entry.totalEntrada = entry.entradasActivos + entry.entradasInsumos;
            dailyDataMap[dateStr] = entry;

            totalEntradasPeriodo += entry.totalEntrada;
        }
    });

    // Convert map to array and sort by date
    // (In a real app, use a proper date library to sort correctly, here relying on insertion order roughly or simplistic string sort)
    let chartData = Object.values(dailyDataMap);
    
    // Slice based on range
    chartData = chartData.slice(timeRange === 'WEEK' ? -7 : -30);

    // Calculate Return Rate
    const returnRate = totalSalidasPeriodo > 0 ? Math.round((totalEntradasPeriodo / totalSalidasPeriodo) * 100) : 0;

    return {
        totalSalidasPeriodo,
        totalEntradasPeriodo,
        returnRate,
        activosPendientes,
        chartData
    };
  }, [localTransactions, timeRange]);

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend, trendColor }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-lg transition-all">
       <div className={`absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`}>
           <Icon size={80} />
       </div>
       <div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
               <span className={`w-1.5 h-1.5 rounded-full mr-2 ${colorClass.replace('text-', 'bg-')}`}></span>
               {title}
           </p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
       </div>
       <div className="mt-4 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{subtext}</span>
           {trend && (
               <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full ${trendColor || 'bg-slate-100 text-slate-600'}`}>
                   {trend}
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
                   <ArrowRightLeft size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Flujo de Materiales</h2>
                   <p className="text-sm text-slate-500 font-medium mt-1">Balance de Salidas y Retornos ({user?.location})</p>
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
                 title="Total Salidas" 
                 value={stats.totalSalidasPeriodo} 
                 subtext="Items Despachados" 
                 icon={ArrowOut} 
                 colorClass="text-amber-500"
                 trend="Flujo Saliente"
                 trendColor="bg-amber-50 text-amber-600"
              />
              <StatCard 
                 title="Total Retornos" 
                 value={stats.totalEntradasPeriodo} 
                 subtext="Items Recuperados" 
                 icon={ArrowDownLeft} 
                 colorClass="text-emerald-500"
                 trend="Flujo Entrante"
                 trendColor="bg-emerald-50 text-emerald-600"
              />
              <StatCard 
                 title="Tasa de Retorno" 
                 value={`${stats.returnRate}%`} 
                 subtext="Eficiencia de Ciclo" 
                 icon={Activity} 
                 colorClass="text-blue-500"
                 trend={stats.returnRate > 90 ? 'Óptimo' : 'Revisar'}
                 trendColor={stats.returnRate > 90 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}
              />
              <StatCard 
                 title="Activos en Ruta" 
                 value={stats.activosPendientes} 
                 subtext="Pendientes de Retorno" 
                 icon={Package} 
                 colorClass="text-slate-500"
              />
          </div>

          {/* Main Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
              
              {/* Comparative Chart */}
              <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                      <div>
                          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Comparativa de Flujo</h3>
                          <p className="text-xs text-slate-400 font-medium">Relación entre Despachos (Naranja) y Recuperaciones (Verde)</p>
                      </div>
                      <div className="flex items-center space-x-6">
                          <div className="flex items-center text-[10px] font-bold uppercase text-slate-500">
                              <span className="w-3 h-3 rounded-sm bg-amber-500 mr-2"></span> Salidas (Total)
                          </div>
                          <div className="flex items-center text-[10px] font-bold uppercase text-slate-500">
                              <span className="w-3 h-3 rounded-sm bg-emerald-500 mr-2"></span> Retornos (Total)
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={0}>
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
                                cursor={{fill: '#f8fafc'}} 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}
                              />
                              <Legend wrapperStyle={{ paddingTop: '20px' }} />
                              
                              <Bar 
                                name="Salidas (Activos + Insumos)" 
                                dataKey="totalSalida" 
                                fill="#f59e0b" 
                                radius={[4, 4, 0, 0]} 
                                barSize={20} 
                              />
                              <Bar 
                                name="Retornos (Activos + Insumos)" 
                                dataKey="totalEntrada" 
                                fill="#10b981" 
                                radius={[4, 4, 0, 0]} 
                                barSize={20} 
                              />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

          </div>

          {/* Detailed Data Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Detalle Diario de Movimientos</h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100">
                          <tr>
                              <th className="px-8 py-4">Fecha</th>
                              <th className="px-8 py-4 text-center text-amber-600">Salidas Activos</th>
                              <th className="px-8 py-4 text-center text-amber-600">Salidas Insumos</th>
                              <th className="px-8 py-4 text-center text-emerald-600">Retornos Activos</th>
                              <th className="px-8 py-4 text-center text-emerald-600">Retornos Insumos</th>
                              <th className="px-8 py-4 text-right">Balance Diario</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {stats.chartData.length === 0 ? (
                              <tr>
                                  <td colSpan={6} className="px-8 py-8 text-center text-xs text-slate-400 font-medium uppercase tracking-wide">No hay actividad registrada en este periodo</td>
                              </tr>
                          ) : (
                              [...stats.chartData].reverse().map((row, idx) => {
                                  const balance = row.totalEntrada - row.totalSalida;
                                  return (
                                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="px-8 py-4 text-xs font-bold text-slate-700">{row.date}</td>
                                          <td className="px-8 py-4 text-center text-xs font-medium text-slate-600">{row.salidasActivos}</td>
                                          <td className="px-8 py-4 text-center text-xs font-medium text-slate-600">{row.salidasInsumos}</td>
                                          <td className="px-8 py-4 text-center text-xs font-bold text-emerald-600 bg-emerald-50/30">{row.entradasActivos}</td>
                                          <td className="px-8 py-4 text-center text-xs font-bold text-emerald-600 bg-emerald-50/30">{row.entradasInsumos}</td>
                                          <td className="px-8 py-4 text-right">
                                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${balance >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
                                                  {balance > 0 ? '+' : ''}{balance} Items
                                              </span>
                                          </td>
                                      </tr>
                                  );
                              })
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

       </div>
    </div>
  );
};
