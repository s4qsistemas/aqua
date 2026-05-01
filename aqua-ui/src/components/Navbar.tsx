import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {

    const { isAuthenticated, user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        logout();
    };

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('dark');
        } else {
            // Si es 'system', verificamos la preferencia actual del SO
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(isDark ? 'light' : 'dark');
        }
    };

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/20 dark:border-slate-800/50 rounded-2xl px-6 py-3 shadow-xl">
                <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                    <img src={isDarkMode ? "/img/logoAquaSyncDark.png" : "/img/logoAquaSync.png"} alt="AquaSync Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
                </Link>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">

                            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
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
                            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Acceso Clientes
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}