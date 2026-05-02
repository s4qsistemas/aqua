import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function DashboardHome() {
    const { logout, user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Panel SCADA Móvil</Text>
            <Text style={styles.subtitle}>Bienvenido, {user?.nombre || 'Administrador'}</Text>

            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
    },
    title: {
        fontSize: 24,
        color: '#f8fafc',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#38bdf8',
        marginTop: 8,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});