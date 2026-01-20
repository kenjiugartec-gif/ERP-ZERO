
import React, { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { History, FileText, Download, Printer, FileX } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { transactions, currentConfig, appName, user } = useApp();
  
  const localTransactions = useMemo(() => {
    return transactions.filter(t => t.location === user?.location);
  }, [transactions, user]);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-white report-container w-full">
      <div className="print-only">
        <div className="print-header">
          <div className="flex flex-col">
            <h1 className="print-title">{appName}</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{user?.location}</p>
          </div>
          {currentConfig.logo && (
            <img src={currentConfig.logo} alt="Logo" className="print-logo" />
          )}
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase underline">Reporte Histórico de Movimientos</h2>
          <p className="text-xs text-slate-500">Generado el: {new Date().toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 no-print w-full">
        <div className="flex items-center space-x-4">
          <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Histórico de Movimientos</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Registro cronológico de entradas y salidas técnicas ({user?.location})</p>
          </div>
        </div>
        
        <button 
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center shadow-lg transition-all active:scale-95"
        >
          <Download size={18} className="mr-2" />
          Descargar PDF
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 print:bg-white print:border-none print:p-0 w-full">
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 print:border-none w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100 print:bg-slate-200">
              <tr>
                <th className="px-6 py-4">Fecha/Hora</th>
                <th className="px-6 py-4">Patente</th>
                <th className="px-6 py-4">Conductor</th>
                <th className="px-6 py-4 text-center">Items Salida</th>
                <th className="px-6 py-4 text-center">Items Entrada</th>
                <th className="px-6 py-4 text-center">Diferencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {localTransactions.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">No hay movimientos registrados en {user?.location}.</td>
                  </tr>
              ) : localTransactions.map(t => {
                 const countOut = t.exitItems_ES.reduce((acc, i) => acc + i.quantity, 0);
                 const countIn = t.entryItems_ES.reduce((acc, i) => acc + i.quantity, 0);
                 const diff = countIn - countOut;
                 return (
                   <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4 text-slate-600">{t.entryTime ? new Date(t.entryTime).toLocaleString() : 'En curso'}</td>
                     <td className="px-6 py-4 font-bold text-slate-800">{t.plate}</td>
                     <td className="px-6 py-4 text-slate-600">{t.driver}</td>
                     <td className="px-6 py-4 text-slate-600 text-center">{countOut}</td>
                     <td className="px-6 py-4 text-slate-600 text-center">{countIn}</td>
                     <td className={`px-6 py-4 font-bold text-center ${diff >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
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
    const { transactions, currentConfig, appName, user } = useApp();
    
    const localCompletedTransactions = useMemo(() => {
        return transactions.filter(t => t.status === 'COMPLETED' && t.location === user?.location);
    }, [transactions, user]);

    const handleDownload = () => {
      window.print();
    };

    return (
        <div className="h-full overflow-y-auto p-6 bg-white report-container w-full">
            <div className="print-only">
              <div className="print-header">
                <div className="flex flex-col">
                  <h1 className="print-title">{appName}</h1>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{user?.location}</p>
                </div>
                {currentConfig.logo && (
                  <img src={currentConfig.logo} alt="Logo" className="print-logo" />
                )}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase underline">Control de Auditoría VTA</h2>
                <p className="text-xs text-slate-500">Corte de auditoría: {new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 no-print w-full">
              <div className="flex items-center space-x-4">
                <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg flex-shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Control VTA (Auditoría)</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Supervisión comercial y auditoría de carga ({user?.location})</p>
                </div>
              </div>
              
              <button 
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center shadow-lg transition-all active:scale-95"
              >
                <Download size={18} className="mr-2" />
                Exportar Reporte
              </button>
            </div>

            <div className="space-y-6 w-full">
                {localCompletedTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                             <FileX size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600">Sin Registros Completados</h3>
                        <p className="text-sm text-slate-400 mt-2">No hay transacciones finalizadas para auditar en {user?.location}.</p>
                    </div>
                ) : (
                    localCompletedTransactions.map(t => (
                        <div key={t.id} className="p-6 border rounded-[2rem] hover:shadow-lg transition-all bg-white border-slate-200 print:rounded-none print:shadow-none print:border-slate-300 print:mb-8 w-full">
                            <div className="flex justify-between items-start mb-6">
                                 <div>
                                    <h3 className="font-bold text-xl text-slate-800">{t.plate} <span className="text-sm font-normal text-slate-500 ml-2">| Conductor: {t.driver}</span></h3>
                                    <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">ID TRANSACCIÓN: {t.id}</p>
                                 </div>
                                 <div className="text-right text-xs text-slate-500 space-y-1">
                                    <p><span className="font-bold text-slate-700">DESPACHO:</span> {new Date(t.exitTime || '').toLocaleString()}</p>
                                    <p><span className="font-bold text-slate-700">RETORNO:</span> {new Date(t.entryTime || '').toLocaleString()}</p>
                                 </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 print:bg-white">
                                    <h4 className="font-bold text-orange-500 mb-2 uppercase text-[10px] tracking-widest print:text-slate-900 print:underline">Declaración E/S (Salida)</h4>
                                    <ul className="space-y-1 text-slate-600 font-medium">
                                        {t.exitItems_ES.map((i, idx) => <li key={idx} className="flex justify-between"><span>{i.name}</span> <span className="font-bold">{i.quantity}</span></li>)}
                                        {t.exitItems_ES.length === 0 && <li className="text-slate-400 italic">Sin items declarados</li>}
                                    </ul>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 print:bg-white">
                                    <h4 className="font-bold text-purple-500 mb-2 uppercase text-[10px] tracking-widest print:text-slate-900 print:underline">Declaración E/S (Retorno)</h4>
                                    <ul className="space-y-1 text-slate-600 font-medium">
                                        {t.entryItems_ES.map((i, idx) => <li key={idx} className="flex justify-between"><span>{i.name}</span> <span className="font-bold">{i.quantity}</span></li>)}
                                        {t.entryItems_ES.length === 0 && <li className="text-slate-400 italic">Sin items declarados</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
