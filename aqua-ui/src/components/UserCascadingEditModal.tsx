import { useState, useEffect } from "react";
import { IconClose, IconEdit, IconUsers } from "./Icons";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function UserCascadingEditModal({
    isOpen,
    onClose,
    tenants = [],
    onConfirm,
    onToggleStatus,
    onResetPassword
}: any) {
    const { user } = useAuth();
    const isSuperAdmin = user?.rol === 'SUPERADMIN';

    // Estados de filtrado
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Filtros seleccionados
    const [filters, setFilters] = useState({
        tenantId: isSuperAdmin ? "" : user?.tenantId?.toString() || "",
        rol: "ADMIN",
        estado: "ACTIVO"
    });

    // Usuario seleccionado para editar
    const [selectedUserId, setSelectedUserId] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        rol: "ADMIN",
        tenantId: ""
    });

    // Cargar todos los usuarios al abrir
    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await apiFetch("/usuarios");
            setAllUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Lógica de filtrado en cascada
    useEffect(() => {
        let result = allUsers;

        if (filters.tenantId) {
            result = result.filter(u => u.tenantId?.toString() === filters.tenantId);
        }
        if (filters.rol) {
            result = result.filter(u => u.rol === filters.rol);
        }
        if (filters.estado) {
            result = result.filter(u => u.estado === filters.estado);
        }

        setFilteredUsers(result);
        
        // Si el usuario seleccionado ya no está en la lista filtrada, lo limpiamos
        if (selectedUserId && !result.find(u => u.id.toString() === selectedUserId)) {
            setSelectedUserId("");
            setFormData({ nombre: "", email: "", rol: "ADMIN", tenantId: "" });
        }
    }, [filters, allUsers]);

    // Cuando se selecciona un usuario de la lista final
    const handleUserSelect = (id: string) => {
        setSelectedUserId(id);
        const found = allUsers.find(u => u.id.toString() === id);
        if (found) {
            setFormData({
                nombre: found.nombre,
                email: found.email,
                rol: found.rol,
                tenantId: found.tenantId?.toString() || ""
            });
        }
    };

    if (!isOpen) return null;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all group">
                    <IconClose className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                </button>

                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                        <IconUsers className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión Avanzada de Usuarios</h2>
                        <p className="text-slate-500 text-sm">Filtra y selecciona el usuario que deseas modificar.</p>
                    </div>
                </div>

                {/* Filtros en Cascada */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    {isSuperAdmin && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase ml-2 text-slate-400">Comunidad</label>
                            <select 
                                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-semibold"
                                value={filters.tenantId}
                                onChange={(e) => setFilters({ ...filters, tenantId: e.target.value })}
                            >
                                <option value="">Todas las comunidades</option>
                                {tenants.map((t: any) => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-2 text-slate-400">Rol del Usuario</label>
                        <select 
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-semibold"
                            value={filters.rol}
                            onChange={(e) => setFilters({ ...filters, rol: e.target.value })}
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPERVISOR">SUPERVISOR</option>
                            <option value="TECNICO">TECNICO</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-2 text-slate-400">Estado</label>
                        <select 
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-semibold"
                            value={filters.estado}
                            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                        >
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                    {/* Select Final de Usuario */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Seleccionar Usuario ({filteredUsers.length})</label>
                        <select 
                            className="w-full p-4 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-900/50 rounded-2xl outline-none text-blue-900 dark:text-blue-100 font-bold"
                            value={selectedUserId}
                            onChange={(e) => handleUserSelect(e.target.value)}
                        >
                            <option value="">-- Elige un usuario para editar --</option>
                            {filteredUsers.map((u: any) => (
                                <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
                            ))}
                        </select>
                    </div>

                    {/* Formulario de Edición (Solo si hay usuario seleccionado) */}
                    {selectedUserId && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase ml-2 text-slate-400">Nombre Completo</label>
                                    <input
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase ml-2 text-slate-400">Email de Acceso</label>
                                    <input
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Controles de Seguridad */}
                            <div className="flex flex-col gap-2 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                    <div>
                                        <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">Estado de la cuenta</span>
                                        <p className="text-[10px] text-slate-500">Define si el usuario puede ingresar al sistema.</p>
                                    </div>
                                    <button
                                        onClick={() => onToggleStatus(Number(selectedUserId), filters.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO")}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${filters.estado === "ACTIVO"
                                                ? 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white'
                                                : 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white'
                                            }`}
                                    >
                                        {filters.estado === "ACTIVO" ? "Desactivar Usuario" : "Activar Usuario"}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">Seguridad</span>
                                        <p className="text-[10px] text-slate-500">Genera una nueva clave temporal para el usuario.</p>
                                    </div>
                                    <button
                                        onClick={() => onResetPassword(Number(selectedUserId))}
                                        className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        Resetear Contraseña
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-8 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <button onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-800 transition-colors">Cerrar</button>
                    <button
                        disabled={!selectedUserId || !formData.nombre || !isEmailValid}
                        onClick={() => onConfirm(formData, Number(selectedUserId))}
                        className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 hover:bg-blue-700 transition-all"
                    >
                        Actualizar Datos de Usuario
                    </button>
                </div>
            </div>
        </div>
    );
}
