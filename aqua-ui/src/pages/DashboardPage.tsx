import { useEffect } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import TenantStatusModal from "../components/TenantStatusModal";
import TenantPlanModal from "../components/TenantPlanModal";
import TenantHistoryModal from "../components/TenantHistoryModal";
import TenantFormModal from "../components/TenantFormModal";
import UsersFormModal from "../components/UsersFormModal";
import CredentialsAlertModal from "../components/CredentialsAlertModal";
import { useAuth } from "../context/AuthContext";
import { useTenants } from "../hooks/useTenants";
import { TableSkeleton } from '../components/TableSkeleton';
import { IconUsers, IconEdit, IconPlan, IconPower, IconPlay, IconHistory } from '../components/Icons';

export default function DashboardPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.rol === 'SUPERADMIN';

  // Extraemos TODA la lógica y estados sin omitir nada
  const {
    tenants, isLoading, planes, historial, selectedTenant,
    showStatusModal, setShowStatusModal,
    showPlanModal, setShowPlanModal,
    showHistoryModal, setShowHistoryModal,
    selectedUser, onNewUser, onEditUser,
    showFormModal, setShowFormModal,
    showUserModal, setShowUserModal,
    onNew, onEdit, onPlan, onStatus, onHistory,
    handleConfirmStatus, handleConfirmPlan,
    handleConfirmForm, handleConfirmUserForm,
    handleResetUserPassword, handleToggleUserStatus,
    credentialsAlert, setCredentialsAlert,
    fetchTenants
  } = useTenants();

  // Escuchar actualizaciones en tiempo real vía WebSocket
  useEffect(() => {
    // Intentamos obtener la base del backend desde env, o usamos localhost por defecto
    const baseUrl = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') 
      : "http://localhost:3000";

    const socket = io(baseUrl);

    socket.on('comunidades_actualizadas', () => {
      console.log('🔄 Cambio detectado en comunidades, actualizando datos...');
      if (fetchTenants) fetchTenants();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchTenants]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar global */}
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
          <div className="flex items-center space-x-3">
            {isSuperAdmin && (
              <button
                onClick={onNewUser}
                className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-2xl hover:bg-indigo-100 transition-all font-bold"
              >
                <IconUsers />
                <span>Usuarios</span>
              </button>
            )}
            <button
              onClick={onNew}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
            >
              + Nueva Comunidad
            </button>
          </div>
        </div>

        {/* Tabla de Tenants */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Comunidad</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Administrador</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Estado</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Plan</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">Fecha Alta</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">

              {/* Lógica condicional: Loading -> Empty -> Data */}
              {isLoading ? (
                <TableSkeleton />
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-slate-500">
                    No se encontraron comunidades.
                  </td>
                </tr>
              ) : (
                tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <span className={`font-bold transition-all ${t.estado === 'INACTIVO' ? 'text-slate-400 dark:text-slate-500 opacity-60' : 'text-slate-800 dark:text-slate-200'}`}>
                        {t.nombre}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {t.usuarios && t.usuarios.length > 0 ? (
                        <div className="flex items-center justify-between group">
                          <div className="flex flex-col items-start">
                            <span className={`font-semibold text-sm transition-all ${t.usuarios[0].estado === 'INACTIVO' ? 'text-slate-400 dark:text-slate-500 opacity-60' : 'text-slate-700 dark:text-slate-300'}`}>
                              {t.usuarios[0].nombre}
                            </span>
                            {t.usuarios[0].estado === 'INACTIVO' ? (
                              <span className="px-2 py-0.5 mt-0.5 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-400 text-[10px] font-bold tracking-wider">
                                DESACTIVADO
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.usuarios[0].email}</span>
                            )}
                          </div>
                          {isSuperAdmin && (
                            <button
                              onClick={() => onEditUser(t.usuarios[0])}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-blue-500 hover:text-blue-600 dark:text-blue-400"
                              title="Editar Usuario"
                            >
                              <IconEdit />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${t.estado === 'ACTIVO' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {t.estado}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {t.plan?.nombre || "Sin Plan"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 text-sm">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => onEdit(t)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors text-blue-500" title="Editar">
                          <IconEdit />
                        </button>
                        <button onClick={() => onPlan(t)} className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors text-amber-500" title="Cambiar Plan">
                          <IconPlan />
                        </button>
                        <button
                          onClick={() => onStatus(t)}
                          className={`p-2 rounded-xl transition-colors ${t.estado === "ACTIVO" ? "hover:bg-red-50 text-red-500" : "hover:bg-green-50 text-green-600"}`}
                          title={t.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                        >
                          {t.estado === "ACTIVO" ? <IconPower /> : <IconPlay />}
                        </button>
                        <button onClick={() => onHistory(t)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500" title="Historial">
                          <IconHistory />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
      <UsersFormModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} onConfirm={handleConfirmUserForm} tenants={tenants} initialData={selectedUser} onToggleStatus={handleToggleUserStatus} onResetPassword={handleResetUserPassword} />
      <CredentialsAlertModal isOpen={!!credentialsAlert} onClose={() => setCredentialsAlert(null)} data={credentialsAlert} />
    </div>
  );
}