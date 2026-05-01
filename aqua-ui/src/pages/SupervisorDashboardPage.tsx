import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function SupervisorDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-32 pb-12">
                {/* Cabecera del Supervisor */}
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Panel de <span className="gradient-text">Supervisión</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-2xl leading-relaxed">
                        Bienvenido, supervisor de <strong className="text-slate-900 dark:text-slate-200 font-bold">{user?.tenant?.nombre || 'tu comunidad'}</strong>. 
                        Aquí tienes un resumen del estado operativo actual.
                    </p>
                </div>

                {/* Tarjetas de Monitoreo Rápido */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Tarjeta 1: Estado de Estaciones */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:scale-[1.02] hover:shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado Operativo</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Estaciones</h3>
                            </div>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl">
                                <span className="text-xl">⚡</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Monitoreo en tiempo real de niveles, presiones y estado de bombas.</p>
                        <button className="mt-8 w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 group">
                            <span>Ver Estaciones</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Tarjeta 2: Alertas Recientes */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:scale-[1.02] hover:shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notificaciones</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Alertas Activas</h3>
                            </div>
                            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl">
                                <span className="text-xl">🔔</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Registro detallado de eventos críticos y umbrales fuera de rango.</p>
                        <button className="mt-8 w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 group">
                            <span>Revisar Alertas</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Tarjeta 3: Resumen Ejecutivo (Próximamente) */}
                    <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center opacity-50 animate-in fade-in zoom-in-95 duration-1000">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-400 tracking-wide">Próximamente: Estadísticas</p>
                    </div>
                </div>
            </main>
        </div>
    );
}