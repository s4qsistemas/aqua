import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/20 dark:border-slate-800/50 rounded-2xl px-6 py-3 shadow-xl">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                        hidro<span className="text-blue-500">Control</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Link to="/" className="hover:text-blue-500 transition-colors">Inicio</Link>
                    <Link to="/" className="hover:text-blue-500 transition-colors">Plataforma</Link>
                    <Link to="/" className="hover:text-blue-500 transition-colors">Soluciones</Link>
                    <Link to="/" className="hover:text-blue-500 transition-colors">Soporte</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link
                        to="/login"
                        className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                    >
                        Acceder
                    </Link>
                </div>
            </div>
        </nav>
    );
}