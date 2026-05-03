import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { apiFetch } from '../../src/services/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Nuevo estado para el mensaje de error visual
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { login } = useAuth();

    const handleLogin = async () => {
        // Limpiamos errores previos al intentar de nuevo
        setErrorMsg(null);

        if (!email || !password) {
            setErrorMsg('Por favor, completa todos los campos');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            // Si el backend responde con éxito, guardamos los datos
            await login(response.token, response.user, response.requirePasswordChange);

        } catch (error: any) {
            // 2. Capturamos el mensaje exacto que configuramos en auth.controller.ts
            // Ej: "Credenciales inválidas" o "Tu comunidad se encuentra inactiva"
            setErrorMsg(error.message || 'Ocurrió un error inesperado');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Aqua Mobile</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* 3. Renderizado condicional del error en color rojo */}
            {errorMsg && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            )}

            <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    errorContainer: { backgroundColor: '#ffebee', padding: 10, borderRadius: 5, marginBottom: 15 },
    errorText: { color: '#d32f2f', textAlign: 'center', fontSize: 14 },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#99ccff' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});