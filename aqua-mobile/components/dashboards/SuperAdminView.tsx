// components/dashboards/SuperAdminView.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SuperAdminView({ user, tenants = [] }: { user: any, tenants?: any[] }) {
    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Gestión de <Text style={styles.highlight}>Comunidades</Text></Text>
                </View>
                <TouchableOpacity style={styles.fabButton}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Comunidades Activas</Text>

            {tenants.length === 0 ? (
                <Text style={styles.loadingText}>No hay comunidades registradas o cargando...</Text>
            ) : (
                tenants.map((t) => (
                    <View key={t.id} style={styles.tenantCard}>
                        <View style={styles.tenantHeader}>
                            <Text style={styles.tenantTitle}>{t.nombre}</Text>
                            <View style={[
                                styles.statusBadge,
                                t.estado === 'INACTIVO' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    t.estado === 'INACTIVO' && { color: '#ef4444' }
                                ]}>{t.estado}</Text>
                            </View>
                        </View>

                        <Text style={styles.tenantAdmin}>
                            Admin: {t.usuarios && t.usuarios.length > 0 ? t.usuarios[0].email : 'Sin administrador'}
                        </Text>
                        <Text style={styles.tenantPlan}>
                            Plan: {t.plan?.nombre || "Básico"}
                        </Text>

                        <View style={styles.tenantActions}>
                            <TouchableOpacity style={styles.iconBtn}><Ionicons name="create-outline" size={20} color="#3b82f6" /></TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}><Ionicons name="star-outline" size={20} color="#f59e0b" /></TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}><Ionicons name="power-outline" size={20} color="#ef4444" /></TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: 24, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 28, fontWeight: '900', color: '#f8fafc' },
    highlight: { color: '#38bdf8' },
    fabButton: { backgroundColor: '#2563eb', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 4 },
    sectionTitle: { color: '#94a3b8', fontSize: 16, fontWeight: 'bold', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
    loadingText: { color: '#64748b', fontSize: 14, fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
    tenantCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
    tenantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    tenantTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold', flex: 1 },
    statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },
    tenantAdmin: { color: '#94a3b8', fontSize: 14, marginBottom: 4 },
    tenantPlan: { color: '#cbd5e1', fontSize: 14, marginBottom: 16 },
    tenantActions: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 16 },
    iconBtn: { padding: 8, backgroundColor: '#0f172a', borderRadius: 10 }
});