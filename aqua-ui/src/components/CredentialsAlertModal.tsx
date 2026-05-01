import { IconClose } from "./Icons";

export default function CredentialsAlertModal({ isOpen, onClose, data }: any) {
  if (!isOpen || !data) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all group">
          <IconClose className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{data.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{data.message}</p>
        </div>

        <div className="space-y-4">
          {data.email && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{data.email}</p>
              </div>
              <button onClick={() => handleCopy(data.email)} className="px-4 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copiar
              </button>
            </div>
          )}
          {data.tempPassword && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">Contraseña Temporal</p>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 font-mono tracking-widest">{data.tempPassword}</p>
              </div>
              <button onClick={() => handleCopy(data.tempPassword)} className="px-4 py-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 font-medium text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copiar
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button onClick={onClose} className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
