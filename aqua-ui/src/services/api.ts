// src/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    // 1. Obtener el token directamente del almacenamiento local
    const token = localStorage.getItem("token");

    // 2. Configurar los encabezados automáticamente
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
        // 3. Ejecutar la petición
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // 4. Interceptar errores de Autenticación (401 o 403) de forma global
        // Evitamos interceptar en la ruta de login para poder mostrar los errores reales al usuario
        if ((response.status === 401 || response.status === 403) && !endpoint.includes('/auth/login')) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login"; // Fuerza la redirección y limpia el estado de la SPA
            throw new Error("Sesión expirada o sin permisos");
        }

        // Manejar respuestas sin contenido (ej. DELETE o algunos PATCH)
        if (response.status === 204) {
            return null;
        }

        // 5. Parsear la respuesta JSON
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.error || "Error en la petición a la API");
        }

        return data;
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error);
        throw error;
    }
};