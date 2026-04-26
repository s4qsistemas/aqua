import Navbar from "../components/Navbar";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/10 blur-[120px] rounded-full animate-pulse"></div>
            </div>

            <Navbar />

            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-bold mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span>SISTEMA DE GESTIÓN INTELIGENTE</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                        Control Total de tus <br />
                        <span className="gradient-text">Recursos Hídricos</span>
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 mx-auto lg:mx-0 leading-relaxed">
                        hidroControl transforma la gestión de agua con monitoreo en tiempo real, 
                        analítica avanzada y control remoto seguro para estaciones, sensores y bombas.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105">
                            Solicitar Demo
                        </button>
                        <a href="/login" className="w-full sm:w-auto">
                            <button className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                                Explorar Plataforma
                            </button>
                        </a>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center lg:justify-start space-x-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="h-7" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" alt="Azure" className="h-7" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Cloud_Platform_Logo.svg" alt="GCP" className="h-7" />
                    </div>

                </div>

                <div className="flex-1 relative">
                    <div className="relative z-10 animate-float">
                        <div className="bg-gradient-to-tr from-blue-600 to-teal-400 p-1 rounded-[2.5rem] shadow-2xl">
                            <div className="bg-slate-900 rounded-[2.3rem] overflow-hidden">
                                <img 
                                    src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000" 
                                    alt="Dashboard Preview" 
                                    className="w-full h-auto opacity-80"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Decorative Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-blue-500/10 rounded-full -z-10"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-blue-500/5 rounded-full -z-10"></div>
                </div>
            </section>
        </div>
    );
}