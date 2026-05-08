import { IconClose, IconArrowRight } from "./Icons";

export default function TenantHistoryModal({ isOpen, onClose, data }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Historial de Auditoría</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Registro completo de cambios para esta comunidad.</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all group"
          >
            <IconClose className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
          </button>

        </div>

        <div className="max-h-[60vh] overflow-y-auto p-8">
          <div className="relative border-l-2 border-blue-500/20 ml-3 space-y-8">
            {data.map((h: any) => (
              <div key={h.id} className="relative pl-8">
                {/* Timeline Dot */}
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 shadow-sm"></div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500/30">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${h.tipo === 'ACTIVACION' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      h.tipo === 'DESACTIVACION' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        h.tipo === 'CAMBIO_ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                      {h.tipo.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(h.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">{h.nota}</p>

                  {(h.planAntes || h.planNuevo) && (
                    <div className="mt-3 flex items-center space-x-2 text-xs">
                      <span className="text-slate-400">Plan:</span>
                      <span className="text-slate-500 line-through">{h.planAntes?.nombre || 'N/A'}</span>
                      <IconArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-blue-500 font-bold">{h.planNuevo?.nombre || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {data.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No hay registros históricos para esta comunidad.
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
