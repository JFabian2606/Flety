import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function LoginRedirect({ redirectTo, roleName, dashboardLabel }) {
    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            router.visit(redirectTo, {
                replace: true,
            });
        }, 1400);

        return () => window.clearTimeout(timeoutId);
    }, [redirectTo]);

    return (
        <>
            <Head title="Preparando acceso" />

            <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-2xl shadow-xl p-8 sm:p-12 text-center relative overflow-hidden">
                    
                    {/* Efecto de luz superior muy sutil */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-400/10 blur-2xl rounded-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-sm mb-8">
                            <img
                                src="/assets/landing/logo_flety.png"
                                alt="Flety"
                                className="h-10 w-auto animate-pulse"
                            />
                        </div>

                        <div className="space-y-2 mb-10">
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                                Acceso Autorizado
                            </p>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                Preparando tu panel
                            </h1>
                            <p className="text-base text-slate-500 leading-relaxed max-w-sm mx-auto">
                                Cargando entorno seguro para{' '}
                                <span className="font-bold text-slate-800">
                                    {roleName}
                                </span>
                                .
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-left mb-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                Destino
                            </p>
                            <p className="text-lg font-bold text-slate-800">
                                {dashboardLabel}
                            </p>

                            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                {/* Barra que se llena progresivamente simulando la carga */}
                                <div className="h-full rounded-full bg-emerald-500 transition-all duration-[1400ms] ease-out w-full" style={{ animation: 'progress-load 1.4s ease-out forwards' }} />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                            <svg className="w-4 h-4 text-emerald-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Conectando...
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes progress-load {
                        0% { width: 0%; }
                        20% { width: 30%; }
                        60% { width: 70%; }
                        100% { width: 100%; }
                    }
                `}} />
            </div>
        </>
    );
}
