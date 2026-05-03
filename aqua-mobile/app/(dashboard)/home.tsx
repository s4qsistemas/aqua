import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';

export default function DashboardHome() {
    const { user, logout } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Encabezado */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hola, {user?.nombre?.split(' ')[0] || 'Operador'}</Text>
                        <Text style={styles.subtitle}>
                            {user?.tenant?.nombre || 'Comunidad Principal'} • Monitoreo Activo
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>Salir</Text>
                    </TouchableOpacity>
                </View>

                {/* Tarjetas de SCADA */}
                <Text style={styles.sectionTitle}>Estado General</Text>

                <View style={styles.grid}>
                    {/* Tarjeta 1: Nivel del Estanque */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Nivel Estanque 1</Text>
                        <Text style={styles.cardValueMain}>78%</Text>
                        <View style={styles.statusBarWrapper}>
                            <View style={[styles.statusBar, { width: '78%', backgroundColor: '#0ea5e9' }]} />
                        </View>
                        <Text style={styles.cardStatus}>Estado: Óptimo</Text>
                    </View>

                    {/* Tarjeta 2: Estado de la Bomba */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Bomba Principal</Text>
                        <Text style={[styles.cardValueMain, { color: '#22c55e' }]}>ON</Text>
                        <Text style={styles.cardSubValue}>Modo: Automático</Text>
                        <Text style={styles.cardStatus}>Última partida: 08:30 AM</Text>
                    </View>
                </View>

                {/* Tarjeta de Alertas Recientes */}
                <Text style={styles.sectionTitle}>Alertas Recientes</Text>
                <View style={styles.alertCard}>
                    <View style={styles.alertIndicator} />
                    <View>
                        <Text style={styles.alertTitle}>Todo en orden</Text>
                        <Text style={styles.alertTime}>Actualizado hace 1 min</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a', // Slate 900
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    subtitle: {
        color: '#38bdf8', // Sky 400
        fontSize: 14,
        marginTop: 4,
    },
    logoutButton: {
        backgroundColor: '#334155', // Slate 700
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoutText: {
        color: '#f8fafc',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#94a3b8', // Slate 400
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'column',
        gap: 16,
        marginBottom: 32,
    },
    card: {
        backgroundColor: '#1e293b', // Slate 800
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardTitle: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardValueMain: {
        color: '#f8fafc',
        fontSize: 48,
        fontWeight: 'bold',
    },
    cardSubValue: {
        color: '#cbd5e1',
        fontSize: 16,
        marginTop: 4,
    },
    statusBarWrapper: {
        height: 8,
        backgroundColor: '#0f172a',
        borderRadius: 4,
        marginTop: 12,
        marginBottom: 8,
        overflow: 'hidden',
    },
    statusBar: {
        height: '100%',
        borderRadius: 4,
    },
    cardStatus: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 8,
    },
    alertCard: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#22c55e', // Borde verde de "Ok"
    },
    alertIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
        marginRight: 12,
    },
    alertTitle: {
        color: '#f8fafc',
        fontSize: 16,
        fontWeight: '600',
    },
    alertTime: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 4,
    },
});