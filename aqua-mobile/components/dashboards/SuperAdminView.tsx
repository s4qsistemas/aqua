import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Modal, TextInput, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch } from '../../src/services/api';
import UsersFormModal from '../UsersFormModal';

// 1. Define qué puede recibir
interface Props {
    user?: any;
    tenants?: any[];
}

export default function SuperAdminView({ user, tenants: externalTenants }: Props) {
    // 1. Estados principales
    const [listaComunidades, setListaComunidades] = useState<any[]>(externalTenants || []);
    const [planes, setPlanes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [historyEvents, setHistoryEvents] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPlanPicker, setShowPlanPicker] = useState(false);
    const [showAdminPicker, setShowAdminPicker] = useState(false);

    // 2. Estados del Formulario
    const [nombre, setNombre] = useState('');
    const [planId, setPlanId] = useState<string | number | null>(null);
    const [adminId, setAdminId] = useState<string | number | null>(null);
    const [currentTenantUsers, setCurrentTenantUsers] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // 3. Lógica de red
    const cargarComunidades = async () => {
        try {
            setIsLoading(true);
            const data = await apiFetch('/tenants');
            if (Array.isArray(data)) {
                setListaComunidades(data);
            }
        } catch (error: any) {
            console.error("Error al cargar comunidades:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const cargarPlanes = async () => {
        try {
            const data = await apiFetch('/tenants/planes');
            setPlanes(data);
        } catch (error) {
            console.error("Error al cargar planes:", error);
        }
    };

    useEffect(() => {
        cargarComunidades();
        cargarPlanes();
    }, []);

    const openCreateModal = () => {
        setEditingId(null);
        setNombre('');
        setPlanId(null);
        setAdminId(null);
        setCurrentTenantUsers([]);
        setModalVisible(true);
    };

    const openUserManagement = () => {
        setSelectedUser(null);
        setUserModalVisible(true);
    };

    const openEditModal = (tenant: any) => {
        setEditingId(tenant.id);
        setNombre(tenant.nombre);
        setPlanId(tenant.planId || null);
        setCurrentTenantUsers(tenant.usuarios || []);

        // Seteamos el admin actual si existe
        if (tenant.usuarios && tenant.usuarios.length > 0) {
            setAdminId(tenant.usuarios[0].id);
        } else {
            setAdminId(null);
        }

        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            Alert.alert('Validación', 'El nombre es obligatorio');
            return;
        }
        if (!editingId && !planId) {
            Alert.alert('Validación', 'Debe seleccionar un plan inicial');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingId) {
                await apiFetch(`/tenants/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ nombre, adminId })
                });
                Alert.alert('Éxito', 'Comunidad actualizada correctamente');
            } else {
                await apiFetch('/tenants', {
                    method: 'POST',
                    body: JSON.stringify({ nombre, planId: Number(planId), estado: 'ACTIVO' })
                });
                Alert.alert('Éxito', 'Comunidad creada correctamente');
            }
            setModalVisible(false);
            cargarComunidades();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo guardar la comunidad');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmUserForm = async (formData: any, userId?: number) => {
        try {
            setIsSubmitting(true);
            if (userId) {
                await apiFetch(`/usuarios/${userId}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                Alert.alert('Éxito', 'Usuario actualizado correctamente');
            } else {
                const response = await apiFetch('/usuarios', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                Alert.alert(
                    '¡Usuario creado!',
                    `Email: ${response.email}\nClave Temporal: ${response.tempPassword}\n\nPor favor, entrega estas credenciales al nuevo usuario.`
                );
            }
            setUserModalVisible(false);
            cargarComunidades();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo guardar el usuario');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleUserStatus = (userId: number, nuevoEstado: string) => {
        const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar';
        console.log("Clic en handleToggleUserStatus:", userId, nuevoEstado);
        
        Alert.alert(
            "Confirmar acción",
            "¿Estás seguro de que deseas " + accion + " a este usuario?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        try {
                            setIsSubmitting(true);
                            await apiFetch(`/usuarios/${userId}/estado`, {
                                method: 'PATCH',
                                body: JSON.stringify({ estado: nuevoEstado })
                            });
                            Alert.alert('Éxito', "Usuario marcado como " + nuevoEstado);
                            cargarComunidades();
                            setUserModalVisible(false);
                        } catch (error: any) {
                            console.error("Error en handleToggleUserStatus:", error);
                            Alert.alert('Error', 'No se pudo cambiar el estado del usuario');
                        } finally {
                            setIsSubmitting(false);
                        }
                    }
                }
            ]
        );
    };

    const handleResetUserPassword = async (userId: number) => {
        try {
            const response = await apiFetch(`/usuarios/${userId}/reset-password`, {
                method: 'POST'
            });
            Alert.alert(
                'Clave Reseteada',
                `Nueva Clave Temporal: ${response.tempPassword}\n\nEl usuario debe usar esta clave para ingresar.`
            );
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo resetear la clave');
        }
    };

    const openHistory = async (tenantId: string, nombre: string) => {
        try {
            setIsLoading(true);
            const data = await apiFetch(`/tenants/${tenantId}/historial`);
            setHistoryEvents(data);
            setNombre(nombre); // Reutilizamos el estado nombre para el título del modal
            setHistoryModalVisible(true);
        } catch (error) {
            Alert.alert("Error", "No se pudo cargar el historial.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStatus = (tenant: any) => {
        console.log("Clic detectado en toggleStatus para:", tenant.nombre);
        const nuevoEstado = tenant.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
        const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar';

        Alert.alert(
            "Confirmar acción",
            "¿Estás seguro de que deseas " + accion + " la comunidad " + tenant.nombre + "?",
            [
                { text: "Cancelar", style: "cancel", onPress: () => console.log("Cancelado") },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        try {
                            await apiFetch(`/tenants/${tenant.id}/estado`, {
                                method: 'PATCH',
                                body: JSON.stringify({ 
                                    estado: nuevoEstado, 
                                    nota: "Cambio desde app móvil por " + (user?.nombre || "SuperAdmin")
                                })
                            });
                            cargarComunidades();
                        } catch (e) {
                            console.error("Error en toggleStatus:", e);
                            Alert.alert('Error', 'No se pudo cambiar el estado');
                        }
                    }
                }
            ]
        );
    };

    // 4. Renderizado de la UI de la tarjeta
    const renderTenantItem = ({ item: t }: { item: any }) => (
        <View style={styles.tenantCard}>
            <View style={styles.tenantHeader}>
                <Text style={styles.tenantTitle}>{t.nombre}</Text>
                <View style={[
                    styles.statusBadge,
                    t.estado === 'INACTIVO' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                ]}>
                    <Text style={[
                        styles.statusText,
                        t.estado === 'INACTIVO' && { color: '#ef4444' }
                    ]}>{t.estado || 'ACTIVO'}</Text>
                </View>
            </View>

            <View style={styles.tenantInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={14} color="#94a3b8" />
                    <Text style={styles.tenantAdmin}>
                        {t.usuarios && t.usuarios.length > 0 ? t.usuarios[0].nombre + " (" + t.usuarios[0].email + ")" : 'Sin administrador'}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="ribbon-outline" size={14} color="#3b82f6" />
                    <Text style={styles.tenantPlan}>
                        Plan: {t.plan?.nombre || "Básico"}
                    </Text>
                </View>
            </View>

            <View style={styles.tenantActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => openEditModal(t)}>
                    <Ionicons name="create-outline" size={20} color="#3b82f6" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: t.estado === 'ACTIVO' ? '#0f172a' : 'rgba(239, 68, 68, 0.1)' }]}
                    onPress={() => toggleStatus(t)}
                >
                    <Ionicons
                        name={t.estado === 'ACTIVO' ? "power" : "refresh-outline"}
                        size={20}
                        color={t.estado === 'ACTIVO' ? "#ef4444" : "#10b981"}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn} onPress={() => openHistory(t.id, t.nombre)}>
                    <Ionicons name="time-outline" size={20} color="#818cf8" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Gestión de <Text style={styles.highlight}>Comunidades</Text></Text>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.usersButton} onPress={openUserManagement}>
                        <Ionicons name="people-outline" size={20} color="#818cf8" />
                        <Text style={styles.usersButtonText}>Usuarios</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.fabButton} onPress={openCreateModal}>
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Comunidades Activas</Text>

            {isLoading ? (
                <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={listaComunidades}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderTenantItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.loadingText}>No hay comunidades registradas.</Text>}
                />
            )}

            {/* MODAL DE FORMULARIO (IGUALADO A WEB) */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Botón Cerrar */}
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color="#94a3b8" />
                        </TouchableOpacity>

                        {/* Icono y Títulos */}
                        <View style={styles.modalHeader}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="business" size={32} color="#3b82f6" />
                            </View>
                            <Text style={styles.modalTitle}>
                                {editingId ? 'Editar Comunidad' : 'Nueva Comunidad'}
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                {editingId ? 'Actualiza los datos básicos del cliente.' : 'Registra un nuevo cliente en el sistema.'}
                            </Text>
                        </View>

                        {/* Campos del Formulario */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Nombre de la Comunidad</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Condominio Las Brisas"
                                    placeholderTextColor="#64748b"
                                    value={nombre}
                                    onChangeText={setNombre}
                                />
                            </View>

                            {/* Campo Plan (Editable en Crear, Solo Lectura en Editar) */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>{editingId ? 'Plan' : 'Plan inicial'}</Text>
                                {editingId ? (
                                    <View style={[styles.input, styles.disabledInput]}>
                                        <Text style={styles.disabledText}>
                                            {planes.find(p => p.id === planId)?.nombre || "Básico"}
                                        </Text>
                                    </View>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            style={styles.pickerTrigger}
                                            onPress={() => setShowPlanPicker(!showPlanPicker)}
                                        >
                                            <Text style={[styles.pickerText, !planId && { color: '#64748b' }]}>
                                                {planId ? planes.find(p => p.id === planId)?.nombre : 'Seleccione un plan...'}
                                            </Text>
                                            <Ionicons name={showPlanPicker ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
                                        </TouchableOpacity>

                                        {showPlanPicker && (
                                            <View style={styles.pickerDropdown}>
                                                {planes.map((p) => (
                                                    <TouchableOpacity
                                                        key={p.id}
                                                        style={[styles.pickerOption, planId === p.id && styles.pickerOptionActive]}
                                                        onPress={() => {
                                                            setPlanId(p.id);
                                                            setShowPlanPicker(false);
                                                        }}
                                                    >
                                                        <Text style={[styles.pickerOptionText, planId === p.id && styles.pickerOptionTextActive]}>
                                                            {p.nombre}
                                                        </Text>
                                                        {planId === p.id && <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>

                            {/* Campo Administrador (Solo en Edición) */}
                            {editingId && currentTenantUsers.length > 0 && (
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Administrador</Text>
                                    <TouchableOpacity
                                        style={styles.pickerTrigger}
                                        onPress={() => setShowAdminPicker(!showAdminPicker)}
                                    >
                                        <View>
                                            <Text style={styles.pickerText}>
                                                {currentTenantUsers.find(u => u.id === adminId)?.nombre || "Seleccione..."}
                                            </Text>
                                            <Text style={styles.pickerSubtitle}>
                                                {currentTenantUsers.find(u => u.id === adminId)?.email}
                                            </Text>
                                        </View>
                                        <Ionicons name={showAdminPicker ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
                                    </TouchableOpacity>

                                    {showAdminPicker && (
                                        <View style={styles.pickerDropdown}>
                                            {currentTenantUsers.map((u) => (
                                                <TouchableOpacity
                                                    key={u.id}
                                                    style={[styles.pickerOption, adminId === u.id && styles.pickerOptionActive]}
                                                    onPress={() => {
                                                        setAdminId(u.id);
                                                        setShowAdminPicker(false);
                                                    }}
                                                >
                                                    <View>
                                                        <Text style={[styles.pickerOptionText, adminId === u.id && styles.pickerOptionTextActive]}>
                                                            {u.nombre}
                                                        </Text>
                                                        <Text style={styles.pickerOptionSubtitle}>{u.email}</Text>
                                                    </View>
                                                    {adminId === u.id && <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Botones */}
                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={styles.btnCancel}
                                    onPress={() => setModalVisible(false)}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.btnCancelText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.btnConfirm, isSubmitting && { opacity: 0.7 }]}
                                    onPress={handleSave}
                                    disabled={isSubmitting || !nombre.trim() || (!editingId && !planId)}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <Text style={styles.btnConfirmText}>
                                            {editingId ? 'Guardar' : 'Crear Comunidad'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <UsersFormModal 
                key={`user-modal-${listaComunidades.length}`}
                isOpen={userModalVisible}
                onClose={() => setUserModalVisible(false)}
                onConfirm={handleConfirmUserForm}
                tenants={listaComunidades}
                initialData={selectedUser}
                onToggleStatus={handleToggleUserStatus}
                onResetPassword={handleResetUserPassword}
            />

            {/* MODAL DE HISTORIAL (TIMELINE) */}
            <Modal visible={historyModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setHistoryModalVisible(false)}>
                            <Ionicons name="close" size={24} color="#94a3b8" />
                        </TouchableOpacity>

                        <View style={styles.modalHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(129, 140, 248, 0.1)' }]}>
                                <Ionicons name="time" size={32} color="#818cf8" />
                            </View>
                            <Text style={styles.modalTitle}>Historial</Text>
                            <Text style={styles.modalSubtitle}>{nombre}</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
                            {historyEvents.length === 0 ? (
                                <Text style={styles.loadingText}>No hay eventos registrados.</Text>
                            ) : (
                                historyEvents.map((ev, idx) => (
                                    <View key={ev.id || idx} style={styles.timelineItem}>
                                        <View style={styles.timelineLeft}>
                                            <View style={styles.timelineDot} />
                                            {idx !== historyEvents.length - 1 && <View style={styles.timelineLine} />}
                                        </View>
                                        <View style={styles.timelineRight}>
                                            <Text style={styles.timelineDate}>
                                                {new Date(ev.fecha).toLocaleDateString()} {new Date(ev.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                            <Text style={styles.timelineEvent}>{ev.evento}</Text>
                                            {ev.nota && <Text style={styles.timelineNote}>{ev.nota}</Text>}
                                        </View>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                        
                        <TouchableOpacity 
                            style={[styles.btnConfirm, { marginTop: 24, backgroundColor: '#334155' }]} 
                            onPress={() => setHistoryModalVisible(false)}
                        >
                            <Text style={styles.btnConfirmText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a', padding: 24 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 24, fontWeight: '900', color: '#f8fafc' },
    highlight: { color: '#38bdf8' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    usersButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(129, 140, 248, 0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
    usersButtonText: { color: '#818cf8', fontWeight: 'bold', fontSize: 14 },
    fabButton: { backgroundColor: '#2563eb', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 4 },
    sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
    listContent: { paddingBottom: 40 },
    loadingText: { color: '#94a3b8', textAlign: 'center', marginTop: 20 },

    tenantCard: { backgroundColor: '#1e293b', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
    tenantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    tenantTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: '#10b981', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    
    tenantInfo: { marginBottom: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    tenantAdmin: { color: '#94a3b8', fontSize: 13 },
    tenantPlan: { color: '#3b82f6', fontSize: 13, fontWeight: '600' },
    
    tenantActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
    iconBtn: { width: 40, height: 40, backgroundColor: '#0f172a', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1e293b', borderRadius: 32, padding: 32, borderWidth: 1, borderColor: '#334155' },
    closeBtn: { position: 'absolute', top: 24, right: 24, padding: 8, zIndex: 10 },
    modalHeader: { alignItems: 'center', marginBottom: 32 },
    iconContainer: { width: 64, height: 64, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    modalTitle: { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
    modalSubtitle: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 8 },

    timelineItem: { flexDirection: 'row', marginBottom: 0 },
    timelineLeft: { alignItems: 'center', width: 20, marginRight: 16 },
    timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6', marginTop: 6 },
    timelineLine: { flex: 1, width: 2, backgroundColor: '#334155' },
    timelineRight: { flex: 1, paddingBottom: 24 },
    timelineDate: { color: '#64748b', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
    timelineEvent: { color: '#f8fafc', fontSize: 15, fontWeight: '600' },
    timelineNote: { color: '#94a3b8', fontSize: 13, marginTop: 4, fontStyle: 'italic' },
    
    fieldGroup: { marginBottom: 24 },
    fieldLabel: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginLeft: 4 },
    input: { backgroundColor: '#0f172a', color: 'white', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#334155', fontSize: 16 },
    disabledInput: { backgroundColor: 'rgba(15, 23, 42, 0.5)', borderColor: '#1e293b' },
    disabledText: { color: '#64748b', fontSize: 16, fontWeight: '600' },
    pickerTrigger: { backgroundColor: '#0f172a', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pickerText: { color: 'white', fontSize: 16, fontWeight: '600' },
    pickerSubtitle: { color: '#64748b', fontSize: 12 },
    
    pickerDropdown: { marginTop: 8, backgroundColor: '#0f172a', borderRadius: 18, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
    pickerOption: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    pickerOptionActive: { backgroundColor: 'rgba(59, 130, 246, 0.05)' },
    pickerOptionText: { color: '#94a3b8', fontSize: 15, fontWeight: '600' },
    pickerOptionTextActive: { color: '#3b82f6' },
    pickerOptionSubtitle: { color: '#64748b', fontSize: 12 },

    modalFooter: { flexDirection: 'row', gap: 12, marginTop: 16 },
    btnCancel: { flex: 1, paddingVertical: 16, alignItems: 'center', borderRadius: 18 },
    btnCancelText: { color: '#94a3b8', fontSize: 16, fontWeight: 'bold' },
    btnConfirm: { flex: 1, backgroundColor: '#2563eb', paddingVertical: 16, alignItems: 'center', borderRadius: 18, shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    btnConfirmText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
