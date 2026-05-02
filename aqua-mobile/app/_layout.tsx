import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

// Importamos los contextos que armaste
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';

// Este sub-componente actúa como el "guardia de seguridad"
function RootNavigation() {
    const { token, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Si todavía está leyendo el AsyncStorage, no hacemos nada
        if (isLoading) return;

        // Detectamos si el usuario está intentando acceder a una pantalla de la carpeta (auth)
        const inAuthGroup = segments[0] === '(auth)';

        if (!token && !inAuthGroup) {
            // 🔴 No tiene sesión y no está en el login -> Expulsar al Login
            router.replace('/(auth)/login');
        } else if (token && inAuthGroup) {
            // 🟢 Tiene sesión y está en el login -> Redirigir a su Dashboard
            router.replace('/(dashboard)/home');
        }
    }, [token, isLoading, segments]);

    // Pantalla de carga mientras se lee el token del teléfono
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
                <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
        );
    }

    // Slot le dice a Expo Router: "Renderiza la pantalla que corresponda aquí"
    return <Slot />;
}

// El Layout principal que envuelve toda tu aplicación móvil
export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootNavigation />
            </AuthProvider>
        </ThemeProvider>
    );
}