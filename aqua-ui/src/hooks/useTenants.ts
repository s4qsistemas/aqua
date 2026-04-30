import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export function useTenants() {
    const { isAuthenticated } = useAuth();

    // Estados de datos
    const [tenants, setTenants] = useState<any[]>([]);
    const [planes, setPlanes] = useState<any[]>([]);
    const [historial, setHistorial] = useState<any[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Estados de UI (Modales)
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    // Fetch inicial
    useEffect(() => {
        if (isAuthenticated) {
            fetchTenants();
            fetchPlanes();
        }
    }, [isAuthenticated]);

    const fetchTenants = async () => {
        setIsLoading(true); // Comienza la carga
        try {
            const data = await apiFetch('/tenants');
            setTenants(data);
        } catch (error) {
            console.error("Error al cargar comunidades", error);
        } finally {
            setIsLoading(false); // Termina la carga pase lo que pase
        }
    };

    const fetchPlanes = async () => {
        try {
            const data = await apiFetch("/tenants/planes");
            setPlanes(data);
        } catch (error) {
            console.error("Error al cargar planes:", error);
        }
    };

    const fetchHistorial = async (tenantId: number) => {
        try {
            const data = await apiFetch(`/tenants/${tenantId}/historial`);
            setHistorial(data);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        }
    };

    // Handlers para abrir modales
    const onNew = () => { setSelectedTenant(null); setShowFormModal(true); };

    const onNewUser = () => { setSelectedUser(null); setShowUserModal(true); };
    const onEditUser = (user: any) => { setSelectedUser(user); setShowUserModal(true); };

    const onEdit = (t: any) => {
        if (t.estado === "INACTIVO") {
            alert("No se puede editar una comunidad inactiva.");
            return;
        }
        setSelectedTenant(t);
        setShowFormModal(true);
    };
    const onPlan = (t: any) => {
        if (t.estado === "INACTIVO") {
            alert("No se puede cambiar el plan de una comunidad inactiva.");
            return;
        }
        setSelectedTenant(t);
        setShowPlanModal(true);
    };
    const onStatus = (t: any) => { setSelectedTenant(t); setShowStatusModal(true); };

    const onHistory = async (t: any) => {
        setSelectedTenant(t);
        await fetchHistorial(t.id);
        setShowHistoryModal(true);
    };

    // Handlers para mutaciones
    const handleConfirmStatus = async (nota: string) => {
        const nuevoEstado = selectedTenant.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
        try {
            await apiFetch(`/tenants/${selectedTenant.id}/estado`, {
                method: "PATCH",
                body: JSON.stringify({ estado: nuevoEstado, nota })
            });
            await fetchTenants();
            setShowStatusModal(false);
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    };

    const handleConfirmPlan = async (planId: string, nota: string) => {
        try {
            await apiFetch(`/tenants/${selectedTenant.id}/plan`, {
                method: "PATCH",
                body: JSON.stringify({ planId: Number(planId), nota })
            });
            await fetchTenants();
            setShowPlanModal(false);
        } catch (error) {
            console.error("Error al cambiar plan:", error);
        }
    };

    const handleConfirmForm = async (data: { nombre: string, planId?: string }) => {
        try {
            const url = selectedTenant ? `/tenants/${selectedTenant.id}` : `/tenants`;
            await apiFetch(url, {
                method: selectedTenant ? "PUT" : "POST",
                body: JSON.stringify(data)
            });
            await fetchTenants();
            setShowFormModal(false);
        } catch (error) {
            console.error("Error al guardar comunidad:", error);
        }
    };

    const handleConfirmUserForm = async (formData: any, userId?: number) => {
        try {
            if (userId) {
                // MODO EDICIÓN
                await apiFetch(`/usuarios/${userId}`, {
                    method: "PUT",
                    body: JSON.stringify(formData)
                });
                alert("Usuario actualizado correctamente.");
            } else {
                // MODO CREACIÓN
                const response = await apiFetch(`/usuarios`, {
                    method: "POST",
                    body: JSON.stringify(formData)
                });

                // LA NOTIFICACIÓN INTELIGENTE (Muestra la clave que generó el backend)
                alert(`¡Usuario creado exitosamente!\n\nEmail: ${response.email}\nContraseña Temporal: ${response.tempPassword}\n\nPor favor, entrega estas credenciales al nuevo usuario.`);
            }

            await fetchTenants();
            setShowUserModal(false);
        } catch (error: any) {
            alert("Error: " + error.message);
        }
    };

    const handleResetUserPassword = async (userId: number) => {
        if (!confirm("¿Seguro que deseas resetear la contraseña? El usuario quedará bloqueado hasta que inicie sesión con la clave temporal y cree una nueva.")) return;

        try {
            const response = await apiFetch(`/usuarios/${userId}/reset-password`, {
                method: "POST"
            });

            // LA NOTIFICACIÓN INTELIGENTE DEL RESETEO
            alert(`Contraseña reseteada exitosamente.\n\nNueva Contraseña Temporal: ${response.tempPassword}\n\nEl usuario debe usar esta clave para ingresar.`);
        } catch (error: any) {
            alert("Error: " + error.message);
        }
    };

    const handleToggleUserStatus = async (userId: number, nuevoEstado: string) => {
        if (!confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) return;

        try {
            await apiFetch(`/usuarios/${userId}/estado`, {
                method: "PATCH",
                body: JSON.stringify({ estado: nuevoEstado })
            });
            await fetchTenants();
            setShowUserModal(false); // Cierra el modal para refrescar
        } catch (error: any) {
            alert("Error: " + error.message);
        }
    };

    return {
        tenants, isLoading, planes, historial, selectedTenant,
        showStatusModal, setShowStatusModal,
        showPlanModal, setShowPlanModal,
        showHistoryModal, setShowHistoryModal,
        selectedUser, onNewUser, onEditUser,
        showFormModal, setShowFormModal,
        showUserModal, setShowUserModal,
        onNew, onEdit, onPlan, onStatus, onHistory,
        handleConfirmStatus, handleConfirmPlan, handleConfirmForm, handleConfirmUserForm, handleResetUserPassword, handleToggleUserStatus
    };
}