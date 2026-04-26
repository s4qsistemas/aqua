import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();

    const isDashboard = location.pathname.includes("/dashboard") || isAuthenticated;

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/20 dark:border-slate-800/50 rounded-2xl px-6 py-3 shadow-xl">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <Link to="/" className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                        hidro<span className="text-blue-500">Control</span>
                    </Link>
                </div>

                {!isDashboard && (
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Link to="/" className="hover:text-blue-500 transition-colors">Inicio</Link>
                        <Link to="/" className="hover:text-blue-500 transition-colors">Plataforma</Link>
                        <Link to="/" className="hover:text-blue-500 transition-colors">Soluciones</Link>
                        <Link to="/" className="hover:text-blue-500 transition-colors">Soporte</Link>
                    </div>
                )}

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2 mr-2">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">
                                        {user?.rol === "SUPERADMIN" ? "SA" : user?.nombre?.substring(0, 2).toUpperCase() || "AD"}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {user?.nombre || "Usuario"}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-xl transition-all flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Salir</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                        >
                            Acceder
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}