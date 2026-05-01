import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import SupervisorDashboardPage from "../pages/SupervisorDashboardPage";
import ForceChangePassword from "../pages/ForceChangePassword";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Este es el verdadero Semáforo Inteligente e Infranqueable
const RoleBasedDashboard = () => {
    const { user, token, requirePasswordChange } = useAuth();

    // 1. Si no hay token, bloqueado al login
    if (!token) return <Navigate to="/login" replace />;

    // 2. Si tiene clave genérica, bloqueado a la trampa de seguridad
    if (requirePasswordChange) return <Navigate to="/force-change-password" replace />;

    // 3. Distribución estricta por Roles
    if (user?.rol === 'SUPERADMIN') return <DashboardPage />;
    if (user?.rol === 'ADMIN') return <AdminDashboardPage />;
    if (user?.rol === 'SUPERVISOR') return <SupervisorDashboardPage />;

    // Fallback de máxima seguridad: si el rol no coincide, lo expulsa
    return <Navigate to="/login" replace />;
};

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Ruta de Seguridad Obligatoria */}
                    <Route path="/force-change-password" element={<ForceChangePassword />} />

                    {/* TODA la navegación privada pasa por el embudo de roles */}
                    <Route path="/dashboard" element={<RoleBasedDashboard />} />

                    {/* Redirección por defecto si escriben una URL que no existe */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}