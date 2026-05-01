import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, requirePasswordChange } = useAuth();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            // El useEffect de redirección solo se ejecuta si la página se carga ya autenticada.
            // Para el flujo normal de login, la lógica está dentro de handleSubmit.
            if (requirePasswordChange) {
                navigate("/force-change-password");
            } else {
                navigate("/home"); // RootRedirect decidirá si va a dashboard o admin-dashboard
            }
        }
    }, [isAuthenticated, navigate, requirePasswordChange]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await apiFetch(`/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email: user, password }),
            });

            login(data.token, data.user, data.requirePasswordChange);

            // Redirección inteligente basada en el estado y rol
            if (data.requirePasswordChange) {
                navigate("/force-change-password");
            } else if (data.user.rol === 'SUPERADMIN') {
                navigate("/dashboard");
            } else {
                navigate("/admin-dashboard");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/5 blur-[120px] rounded-full"></div>
            </div>

            <Navbar />

            <div className="flex-1 flex flex-col justify-center items-center px-6 pt-20 pb-12">
                <div className="w-full max-w-md h-full flex flex-col justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-slate-900 shadow-2xl shadow-blue-500/10 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col justify-center"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                                aqua<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">Sync</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Bienvenidos
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    placeholder="ej: admin@ejemplo.com"
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Recordarme</span>
                                </label>
                                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">¿Olvidaste tu clave?</a>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-100 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <span>Ingresar</span>
                                )}
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-sm text-slate-500">
                                ¿No tienes acceso? <a href="#" className="text-blue-600 font-bold hover:underline">Contacta a tu administrador</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

