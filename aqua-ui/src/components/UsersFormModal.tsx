import { useState, useEffect } from "react";
import { IconClose, IconAddUser } from "./Icons";

export default function UsersFormModal({
    isOpen,
    onClose,
    onConfirm,
    tenants,
    initialData,
    onToggleStatus,
    onResetPassword
}: any) {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        rol: "ADMIN",
        tenantId: ""
    });

    // Detectamos si estamos creando o editando
    const isEditing = !!initialData;
    const isActivo = initialData?.estado === "ACTIVO";

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setFormData({
                    nombre: initialData.nombre || "",
                    email: initialData.email || "",
                    rol: initialData.rol || "ADMIN",
                    tenantId: initialData.tenantId?.toString() || ""
                });
            } else {
                setFormData({ nombre: "", email: "", rol: "ADMIN", tenantId: "" });
            }
        }
    }, [isOpen, initialData, isEditing]);

    if (!isOpen) return null;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200">

                <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all group">
                    <IconClose className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconAddUser className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        {isEditing ? "Modifica los datos y accesos." : "Configura el acceso para un nuevo miembro."}
                    </p>
                </div>

                <div className="space-y-4">
                    <input
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Nombre completo"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                    <input
                        type="email"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase ml-2 text-slate-400">Rol</label>
                            <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-white" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPERVISOR">SUPERVISOR</option>
                                <option value="TECNICO">TECNICO</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase ml-2 text-slate-400">Comunidad</label>
                            <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-white" value={formData.tenantId} onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}>
                                <option value="">Seleccionar...</option>
                                {tenants.map((t: any) => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Controles de Seguridad (Solo visibles en Edición) */}
                    {isEditing && (
                        <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Estado de cuenta</span>
                                <button
                                    onClick={() => onToggleStatus(initialData.id, isActivo ? "INACTIVO" : "ACTIVO")}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${isActivo
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                        }`}
                                >
                                    {isActivo ? "Desactivar" : "Activar"}
                                </button>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Credenciales</span>
                                <button
                                    onClick={() => onResetPassword(initialData.id)}
                                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Resetear Clave
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
                        <button
                            disabled={!formData.nombre || !formData.tenantId || !isEmailValid}
                            onClick={() => onConfirm(formData, initialData?.id)}
                            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isEditing ? "Guardar Cambios" : "Crear Usuario"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}