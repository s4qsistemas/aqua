import { useAuth } from "../context/AuthContext";
import { useTenants } from "../hooks/useTenants";
import Navbar from "../components/Navbar";
import UsersFormModal from "../components/UsersFormModal";
import UserCascadingEditModal from "../components/UserCascadingEditModal";
import CredentialsAlertModal from "../components/CredentialsAlertModal";
import { IconUsers, IconEdit } from "../components/Icons";

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const {
        tenants, 
        showUserModal, setShowUserModal,
        showUserCascadeModal, setShowUserCascadeModal,
        onNewUser, onManageUsers,
        handleConfirmUserForm, handleResetUserPassword, handleToggleUserStatus,
        credentialsAlert, setCredentialsAlert
    } = useTenants();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="pt-24 px-8 max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Panel de <span className="gradient-text">Control</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Bienvenido, administrador de <b>{user?.tenant?.nombre || "tu comunidad"}</b>.
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onManageUsers}
                            className="flex items-center space-x-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-2xl hover:bg-slate-50 transition-all font-bold border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                            <IconEdit />
                            <span>Editar Equipo</span>
                        </button>
                        <button
                            onClick={onNewUser}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                        >
                            <IconUsers />
                            <span>Añadir Miembro</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card de Estado de Comunidad */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mi Comunidad</span>
                            <span className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{user?.tenant?.nombre}</h3>
                        <p className="text-slate-500 text-sm mt-1">Suscripción: <span className="font-bold text-blue-600 uppercase">{user?.tenant?.plan?.nombre || "Básico"}</span></p>
                    </div>

                    {/* Placeholder para Estaciones (Próximamente) */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center opacity-60">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-400">Próximamente: Estaciones</p>
                    </div>

                    {/* Placeholder para Alertas (Próximamente) */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center opacity-60">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-400">Próximamente: Alertas</p>
                    </div>
                </div>
            </div>

            {/* Modales de Gestión de Usuarios */}
            <UsersFormModal 
                isOpen={showUserModal} 
                onClose={() => setShowUserModal(false)} 
                onConfirm={handleConfirmUserForm} 
                tenants={tenants} 
                onToggleStatus={handleToggleUserStatus} 
                onResetPassword={handleResetUserPassword} 
            />
            <UserCascadingEditModal 
                isOpen={showUserCascadeModal} 
                onClose={() => setShowUserCascadeModal(false)} 
                tenants={tenants} 
                onConfirm={handleConfirmUserForm} 
                onToggleStatus={handleToggleUserStatus} 
                onResetPassword={handleResetUserPassword} 
            />
            <CredentialsAlertModal 
                isOpen={!!credentialsAlert} 
                onClose={() => setCredentialsAlert(null)} 
                data={credentialsAlert} 
            />
        </div>
    );
}