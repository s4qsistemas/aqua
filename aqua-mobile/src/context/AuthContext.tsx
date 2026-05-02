// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    tenantId?: number | null;
    tenant?: any | null; // Tipado simplificado para el ejemplo
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    requirePasswordChange: boolean;
    isLoading: boolean; // NUEVO: Para saber si estamos leyendo la memoria
    login: (token: string, user: User, requirePasswordChange: boolean) => Promise<void>;
    logout: () => Promise<void>;
    resolvePasswordChange: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [requirePasswordChange, setRequirePasswordChange] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Al abrir la app, revisa si hay una sesión guardada
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                const storedUser = await AsyncStorage.getItem("user");
                const storedRequirePasswordChange = await AsyncStorage.getItem("requirePasswordChange");

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setRequirePasswordChange(storedRequirePasswordChange === "true");
                }
            } catch (e) {
                console.error("Error restaurando sesión", e);
            } finally {
                setIsLoading(false); // Ya terminó de buscar en la memoria
            }
        };

        bootstrapAsync();
    }, []);

    const login = async (newToken: string, newUser: User, mustChangePass: boolean = false) => {
        setToken(newToken);
        setUser(newUser);
        setRequirePasswordChange(mustChangePass);

        await AsyncStorage.setItem("token", newToken);
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        await AsyncStorage.setItem("requirePasswordChange", String(mustChangePass));
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        setRequirePasswordChange(false);

        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("requirePasswordChange");
    };

    const resolvePasswordChange = async () => {
        setRequirePasswordChange(false);
        await AsyncStorage.removeItem("requirePasswordChange");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                requirePasswordChange,
                isLoading,
                login,
                logout,
                resolvePasswordChange,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}