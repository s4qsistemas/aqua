import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Modal, TextInput, Alert, ActivityIndicator, ScrollView,
    useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch } from '../../src/services/api';
import UsersFormModal from '../UsersFormModal';
import { io } from 'socket.io-client';

// 0. Define qué puede recibir
interface Props {
    user?: any;
    tenants?: any[];
}

export default function SuperAdminView({ user, tenants: externalTenants }: Props) {
    const { width } = useWindowDimensions();
    const isWide = width > 768;

    // 1. Estados principales
    const [listaComunidades, setListaComunidades] = useState<any[]>(externalTenants || []);
    // ... rest of the states stay the same ...
    const [planes, setPlanes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [historyEvents, setHistoryEvents] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPlanPicker, setShowPlanPicker] = useState(false);
    const [showAdminPicker, setShowAdminPicker] = useState(false);
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

    // Escuchar actualizaciones en tiempo real vía WebSocket
    useEffect(() => {
        const apiBase = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.173:3000/api";
        const socketUrl = apiBase.replace('/api', '');
        const socket = io(socketUrl, { transports: ['websocket'] });
        socket.on('comunidades_actualizadas', () => cargarComunidades());
        return () => { socket.disconnect(); };
    }, []);

    // 4. Manejadores de Modales y Acciones
    const openCreateModal = () => {
        setEditingId(null);
        setNombre('');
        setPlanId(null);
        setAdminId(null);
        setCurrentTenantUsers([]);
        setShowPlanPicker(false);
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
        if (tenant.usuarios && tenant.usuarios.length > 0) {
            setAdminId(tenant.usuarios[0].id);
        } else {
            setAdminId(null);
        }
        setShowAdminPicker(false);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            Alert.alert('Validación', 'El nombre es obligatorio');
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
                let finalPlanId = planId;
                if (!finalPlanId) {
                    const basico = planes.find(p => p.nombre.toLowerCase().includes('basico'));
                    if (basico) finalPlanId = basico.id;
                }
                await apiFetch('/tenants', {
                    method: 'POST',
                    body: JSON.stringify({ nombre, planId: finalPlanId ? Number(finalPlanId) : undefined, estado: 'ACTIVO' })
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
                await apiFetch(`/usuarios/${userId}`, { method: 'PUT', body: JSON.stringify(formData) });
                Alert.alert('Éxito', 'Usuario actualizado correctamente');
            } else {
                const response = await apiFetch('/usuarios', { method: 'POST', body: JSON.stringify(formData) });
                Alert.alert('¡Usuario creado!', `Email: ${response.email}\nClave: ${response.tempPassword}`);
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
        Alert.alert("Confirmar", "¿Seguro?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Confirmar", onPress: async () => {
                try {
                    setIsSubmitting(true);
                    await apiFetch(`/usuarios/${userId}/estado`, { method: 'PATCH', body: JSON.stringify({ estado: nuevoEstado }) });
                    cargarComunidades();
                    setUserModalVisible(false);
                } catch (e) { Alert.alert('Error', 'No se pudo cambiar el estado'); } finally { setIsSubmitting(false); }
            }}
        ]);
    };

    const handleResetUserPassword = async (userId: number) => {
        try {
            const response = await apiFetch(`/usuarios/${userId}/reset-password`, { method: 'POST' });
            Alert.alert('Clave Reseteada', `Nueva Clave: ${response.tempPassword}`);
        } catch (e) { Alert.alert('Error', 'No se pudo resetear la clave'); }
    };

    const openHistory = async (tenantId: string, tenantNombre: string) => {
        try {
            setIsLoading(true);
            const data = await apiFetch(`/tenants/${tenantId}/historial`);
            setHistoryEvents(data);
            setNombre(tenantNombre);
            setHistoryModalVisible(true);
        } catch (e) { Alert.alert("Error", "No se pudo cargar el historial."); } finally { setIsLoading(false); }
    };

    const toggleStatus = (tenant: any) => {
        const nuevoEstado = tenant.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
        Alert.alert("Confirmar", `¿Deseas cambiar el estado a ${nuevoEstado}?`, [
            { text: "Cancelar", style: "cancel" },
            { text: "Confirmar", onPress: async () => {
                try {
                    await apiFetch(`/tenants/${tenant.id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado: nuevoEstado }) });
                    cargarComunidades();
                } catch (e) { Alert.alert('Error', 'No se pudo cambiar el estado'); }
            }}
        ]);
    };

    const renderTenantItem = ({ item: t }: { item: any }) => (
        <View style={[styles.tenantCard, isWide && styles.tenantCardWide]}>
            <View style={styles.tenantHeader}>
                <Text style={styles.tenantTitle}>{t.nombre}</Text>
                <View style={[styles.statusBadge, t.estado === 'INACTIVO' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                    <Text style={[styles.statusText, t.estado === 'INACTIVO' && { color: '#ef4444' }]}>{t.estado || 'ACTIVO'}</Text>
                </View>
            </View>
            <View style={styles.tenantInfo}>
                <View style={styles.infoRow}><Ionicons name="person-outline" size={14} color="#94a3b8" /><Text style={styles.tenantAdmin}>{t.usuarios?.[0]?.nombre || 'Sin admin'}</Text></View>
                <View style={styles.infoRow}><Ionicons name="ribbon-outline" size={14} color="#3b82f6" /><Text style={styles.tenantPlan}>Plan: {t.plan?.nombre || "Básico"}</Text></View>
            </View>
            <View style={styles.tenantActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => openEditModal(t)}><Ionicons name="create-outline" size={20} color="#3b82f6" /></TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => toggleStatus(t)}><Ionicons name={t.estado === 'ACTIVO' ? "power" : "refresh-outline"} size={20} color={t.estado === 'ACTIVO' ? "#ef4444" : "#10b981"} /></TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => openHistory(t.id, t.nombre)}><Ionicons name="time-outline" size={20} color="#818cf8" /></TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.headerRow, isWide && styles.wideContainer]}>
                <View style={{ flex: 1 }}><Text style={styles.title}>Gestión de <Text style={styles.highlight}>Comunidades</Text></Text></View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.usersButton} onPress={openUserManagement}>
                        <Ionicons name="people-outline" size={20} color="#818cf8" /><Text style={styles.usersButtonText}>Usuarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fabButton} onPress={openCreateModal}><Ionicons name="add" size={24} color="white" /></TouchableOpacity>
                </View>
            </View>

            <View style={[isWide && styles.wideContainer, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>Comunidades Activas</Text>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={listaComunidades}
                        keyExtractor={(item) => item.id?.toString()}
                        renderItem={renderTenantItem}
                        numColumns={isWide ? 2 : 1}
                        key={isWide ? 'wide' : 'mobile'}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>

            {/* MODALS stay largely the same but could be centered or fixed width for web */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, isWide && { maxWidth: 500, alignSelf: 'center' }]}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color="#94a3b8" /></TouchableOpacity>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <View style={styles.iconContainer}><Ionicons name="business" size={32} color="#3b82f6" /></View>
                                <Text style={styles.modalTitle}>{editingId ? 'Editar Comunidad' : 'Nueva Comunidad'}</Text>
                            </View>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Nombre</Text>
                                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.btnConfirm} onPress={handleSave}><Text style={styles.btnConfirmText}>Guardar</Text></TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <UsersFormModal isOpen={userModalVisible} onClose={() => setUserModalVisible(false)} onConfirm={handleConfirmUserForm} tenants={listaComunidades} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    wideContainer: { width: '100%', maxWidth: 1200, alignSelf: 'center' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: '900', color: '#f8fafc' },
    highlight: { color: '#38bdf8' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    usersButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(129, 140, 248, 0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
    usersButtonText: { color: '#818cf8', fontWeight: 'bold', fontSize: 14 },
    fabButton: { backgroundColor: '#2563eb', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold', marginHorizontal: 24, marginBottom: 16, textTransform: 'uppercase' },
    listContent: { padding: 24, gap: 16 },
    tenantCard: { backgroundColor: '#1e293b', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#334155' },
    tenantCardWide: { flex: 1, margin: 8 },
    tenantHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    tenantTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },
    tenantInfo: { marginBottom: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    tenantAdmin: { color: '#94a3b8', fontSize: 13 },
    tenantPlan: { color: '#3b82f6', fontSize: 13, fontWeight: '600' },
    tenantActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
    iconBtn: { width: 40, height: 40, backgroundColor: '#0f172a', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1e293b', borderRadius: 32, padding: 32, borderWidth: 1, borderColor: '#334155' },
    closeBtn: { position: 'absolute', top: 24, right: 24, zIndex: 10 },
    modalHeader: { alignItems: 'center', marginBottom: 32 },
    iconContainer: { width: 64, height: 64, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    modalTitle: { color: 'white', fontSize: 26, fontWeight: 'bold' },
    fieldGroup: { marginBottom: 24 },
    fieldLabel: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
    input: { backgroundColor: '#0f172a', color: 'white', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#334155' },
    modalFooter: { marginTop: 16 },
    btnConfirm: { backgroundColor: '#2563eb', paddingVertical: 16, alignItems: 'center', borderRadius: 18 },
    btnConfirmText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});