import { useState, useEffect } from "react";

export default function TenantStatusModal({ isOpen, onClose, onConfirm }: any) {
  const [nota, setNota] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setNota("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all group"
        >
          <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Confirmar Acción</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Por favor, indica el motivo de este cambio de estado.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <textarea
              className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none text-slate-700 dark:text-slate-300"
              placeholder="Ingrese motivo (obligatorio)..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={!nota.trim()}
              className="flex-1 bg-red-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
              onClick={() => onConfirm(nota)}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
