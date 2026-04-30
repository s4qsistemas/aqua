import { useState, useEffect } from "react";
import { IconClose, IconBuilding } from "./Icons";

export default function TenantFormModal({ isOpen, onClose, onConfirm, initialData, plans }: any) {
  const [nombre, setNombre] = useState("");
  const [planId, setPlanId] = useState("");

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNombre(initialData.nombre || "");
        setPlanId(initialData.planId || "");
      } else {
        setNombre("");
        setPlanId("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all group"
        >
          <IconClose className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconBuilding className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isEditing ? "Editar Comunidad" : "Nueva Comunidad"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {isEditing ? "Actualiza los datos básicos del cliente." : "Registra un nuevo cliente en el sistema."}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nombre de la Comunidad</label>
            <input
              type="text"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-white"
              placeholder="Ej: Condominio Los Alerces"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              {isEditing ? "Plan" : "Plan inicial"}
            </label>
            <select
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none text-slate-800 dark:text-white"
              onChange={(e) => setPlanId(e.target.value)}
              value={planId}
            >
              <option value="">Seleccione un plan...</option>
              {plans.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>


          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={!nombre.trim() || (!isEditing && !planId)}
              className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
              onClick={() => onConfirm({ nombre, planId })}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
