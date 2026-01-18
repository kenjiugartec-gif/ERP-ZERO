import React from 'react';
import { useApp } from '../store/AppContext';

export const HistoryView: React.FC = () => {
  const { transactions } = useApp();
  
  // Logic to compare items (Mocking diff)
  // Positive blue, negative red
  
  return (
    <div className="h-full overflow-y-auto p-6 bg-white">
      <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Histórico de Movimientos</h2>
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border-b border-slate-200">Fecha/Hora</th>
                <th className="px-4 py-3 border-b border-slate-200">Patente</th>
                <th className="px-4 py-3 border-b border-slate-200">Conductor</th>
                <th className="px-4 py-3 border-b border-slate-200">Items Salida</th>
                <th className="px-4 py-3 border-b border-slate-200">Items Entrada</th>
                <th className="px-4 py-3 border-b border-slate-200">Diferencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map(t => {
                 const countOut = t.exitItems_ES.reduce((acc, i) => acc + i.quantity, 0);
                 const countIn = t.entryItems_ES.reduce((acc, i) => acc + i.quantity, 0);
                 const diff = countIn - countOut;
                 return (
                   <tr key={t.id} className="hover:bg-slate-50">
                     <td className="px-4 py-3 text-slate-600">{t.entryTime ? new Date(t.entryTime).toLocaleString() : 'En curso'}</td>
                     <td className="px-4 py-3 font-bold text-slate-800">{t.plate}</td>
                     <td className="px-4 py-3 text-slate-600">{t.driver}</td>
                     <td className="px-4 py-3 text-slate-600">{countOut}</td>
                     <td className="px-4 py-3 text-slate-600">{countIn}</td>
                     <td className={`px-4 py-3 font-bold ${diff >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                       {diff > 0 ? `+${diff}` : diff}
                     </td>
                   </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SalesControlView: React.FC = () => {
    const { transactions } = useApp();
    return (
        <div className="h-full overflow-y-auto p-6 bg-white">
            <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Control VTA (Auditoría)</h2>
                <div className="space-y-4">
                    {transactions.filter(t => t.status === 'COMPLETED').map(t => (
                        <div key={t.id} className="p-4 border rounded-xl hover:shadow-md transition bg-white border-slate-200">
                            <div className="flex justify-between items-start mb-2">
                                 <div>
                                    <h3 className="font-bold text-lg text-slate-700">{t.plate} <span className="text-sm font-normal text-slate-500">| {t.driver}</span></h3>
                                    <p className="text-xs text-slate-400">{t.id}</p>
                                 </div>
                                 <div className="text-right text-xs text-slate-500">
                                    <p><span className="font-semibold text-slate-700">Salida:</span> {new Date(t.exitTime || '').toLocaleString()} por {t.user_Gate_Out}</p>
                                    <p><span className="font-semibold text-slate-700">Entrada:</span> {new Date(t.entryTime || '').toLocaleString()} por {t.user_Gate_In}</p>
                                 </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                    <h4 className="font-bold text-orange-500 mb-1">Declarado Salida (E/S)</h4>
                                    <ul className="list-disc pl-4 text-slate-600">
                                        {t.exitItems_ES.map((i, idx) => <li key={idx}>{i.quantity}x {i.name} {i.details && `(${i.details})`}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                    <h4 className="font-bold text-purple-500 mb-1">Declarado Entrada (E/S)</h4>
                                    <ul className="list-disc pl-4 text-slate-600">
                                        {t.entryItems_ES.map((i, idx) => <li key={idx}>{i.quantity}x {i.name} {i.details && `(${i.details})`}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                    {transactions.filter(t => t.status === 'COMPLETED').length === 0 && (
                        <p className="text-center text-slate-400 py-8">No hay registros completados para auditoría.</p>
                    )}
                </div>
            </div>
        </div>
    );
};