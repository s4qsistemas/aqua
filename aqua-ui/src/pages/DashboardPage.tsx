import Navbar from "../components/Navbar";
import TenantStatusModal from "../components/TenantStatusModal";
import TenantPlanModal from "../components/TenantPlanModal";
import TenantHistoryModal from "../components/TenantHistoryModal";
import TenantFormModal from "../components/TenantFormModal";
import { useTenants } from "../hooks/useTenants";

export default function DashboardPage() {
  // Extraemos toda la lógica y estados desde nuestro Custom Hook
  const {
    tenants, planes, historial, selectedTenant,
    showStatusModal, setShowStatusModal,
    showPlanModal, setShowPlanModal,
    showHistoryModal, setShowHistoryModal,
    showFormModal, setShowFormModal,
    onNew, onEdit, onPlan, onStatus, onHistory,
    handleConfirmStatus, handleConfirmPlan, handleConfirmForm
  } = useTenants();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="pt-24 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Gestión de <span className="gradient-text">Comunidades</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Administra el acceso, planes y monitoreo de tus clientes activos.
            </p>
          </div>
          <button
            onClick={onNew}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
          >
            + Nueva Comunidad
          </button>
        </div>

        {/* Tabla de Tenants */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Comunidad</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Estado</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Plan</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Fecha Alta</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{t.nombre}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${t.estado === 'ACTIVO' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {t.estado}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-600 dark:text-slate-400 font-medium">
                    {t.plan?.nombre || "Sin Plan"}
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => onEdit(t)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors text-blue-500" title="Editar">
                        <span className="material-symbols-outlined !text-[20px]">edit</span>
                      </button>
                      <button onClick={() => onPlan(t)} className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors text-amber-500" title="Cambiar Plan">
                        <span className="material-symbols-outlined !text-[20px]">inventory_2</span>
                      </button>
                      <button
                        onClick={() => onStatus(t)}
                        className={`p-2 rounded-xl transition-colors ${t.estado === "ACTIVO" ? "hover:bg-red-50 text-red-500" : "hover:bg-green-50 text-green-600"}`}
                        title={t.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                      >
                        <span className="material-symbols-outlined !text-[20px]">
                          {t.estado === "ACTIVO" ? "power_settings_new" : "play_circle"}
                        </span>
                      </button>
                      <button onClick={() => onHistory(t)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500" title="Historial">
                        <span className="material-symbols-outlined !text-[20px]">history</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-slate-500">
                    No se encontraron comunidades.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <TenantStatusModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} onConfirm={handleConfirmStatus} />
      <TenantPlanModal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} plans={planes} onConfirm={handleConfirmPlan} />
      <TenantHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} data={historial} />
      <TenantFormModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} onConfirm={handleConfirmForm} initialData={selectedTenant} plans={planes} />
    </div>
  );
}