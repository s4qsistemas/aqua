import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ForceChangePassword from "../pages/ForceChangePassword";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider, useAuth } from "../context/AuthContext";
function RootRedirect() {
    const { user, requirePasswordChange } = useAuth();

    if (requirePasswordChange) return <Navigate to="/force-change-password" />;

    // Semáforo de roles
    return user?.rol === 'SUPERADMIN'
        ? <Navigate to="/dashboard" />
        : <Navigate to="/admin-dashboard" />;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<RootRedirect />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                        <Route path="/force-change-password" element={<ForceChangePassword />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}