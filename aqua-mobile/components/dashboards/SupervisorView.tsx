// components/dashboards/SupervisorView.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SupervisorView({ user }: { user: any }) {
    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={styles.title}>Panel de <Text style={styles.highlight}>Supervisión</Text></Text>
                <Text style={styles.subtitle}>Operación: <Text style={styles.boldWhite}>{user?.tenant?.nombre || "Comunidad"}</Text></Text>
            </View>

            {/* Estaciones */}
            <TouchableOpacity style={styles.opCard}>
                <View style={styles.opHeader}>
                    <View style={styles.opIconContainer}>
                        <Ionicons name="water" size={28} color="#38bdf8" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={styles.opTitle}>Estaciones de Bombeo</Text>
                        <Text style={styles.opStatus}>3 Activas • 0 Alertas</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#475569" />
                </View>
            </TouchableOpacity>

            {/* Alertas */}
            <TouchableOpacity style={[styles.opCard, { borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                <View style={styles.opHeader}>
                    <View style={[styles.opIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                        <Ionicons name="warning" size={28} color="#f59e0b" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={styles.opTitle}>Historial de Alertas</Text>
                        <Text style={[styles.opStatus, { color: '#f59e0b' }]}>Ver registros críticos</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#475569" />
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: 24 },
    header: { marginBottom: 32 },
    title: { fontSize: 32, fontWeight: '900', color: '#f8fafc' },
    highlight: { color: '#38bdf8' },
    subtitle: { color: '#94a3b8', fontSize: 16, marginTop: 8 },
    boldWhite: { color: '#f8fafc', fontWeight: '600' },
    opCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
    opHeader: { flexDirection: 'row', alignItems: 'center' },
    opIconContainer: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(56, 189, 248, 0.1)', justifyContent: 'center', alignItems: 'center' },
    opTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold' },
    opStatus: { color: '#64748b', fontSize: 14, marginTop: 2 }
});