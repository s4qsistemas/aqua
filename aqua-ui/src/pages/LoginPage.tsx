import Navbar from "../components/Navbar";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/5 blur-[120px] rounded-full"></div>
            </div>

            <Navbar />

            <div className="flex-1 flex justify-center items-center px-6 pt-20">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-slate-900 shadow-2xl shadow-blue-500/10 border border-slate-100 dark:border-slate-800 rounded-3xl p-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                Iniciar sesión
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Bienvenido de nuevo a hidroControl
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                                    Usuario
                                </label>
                                <input
                                    type="text"
                                    placeholder="ej: jsmith"
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Recordarme</span>
                                </label>
                                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">¿Olvidaste tu clave?</a>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Ingresar
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-sm text-slate-500">
                                ¿No tienes acceso? <a href="#" className="text-blue-600 font-bold hover:underline">Contacta a tu administrador</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}