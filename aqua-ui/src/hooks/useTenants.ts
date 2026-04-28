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

    // Estados de UI (Modales)
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    // Fetch inicial
    useEffect(() => {
        if (isAuthenticated) {
            fetchTenants();
            fetchPlanes();
        }
    }, [isAuthenticated]);

    const fetchTenants = async () => {
        try {
            const data = await apiFetch("/tenants");
            setTenants(data);
        } catch (error) {
            console.error("Error al cargar comunidades:", error);
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

    // Handlers para confirmar acciones (Llamadas a la API)
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

    // Retornamos todo lo que el componente visual necesita
    return {
        tenants, planes, historial, selectedTenant,
        showStatusModal, setShowStatusModal,
        showPlanModal, setShowPlanModal,
        showHistoryModal, setShowHistoryModal,
        showFormModal, setShowFormModal,
        onNew, onEdit, onPlan, onStatus, onHistory,
        handleConfirmStatus, handleConfirmPlan, handleConfirmForm
    };
}