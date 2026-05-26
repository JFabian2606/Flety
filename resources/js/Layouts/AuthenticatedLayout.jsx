import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const roleSlug = user.role?.slug;
    const moduleLinks =
        roleSlug === 'administrador'
            ? [
                  {
                      label: 'Panel resumen',
                      href: route('admin.dashboard'),
                      active: route().current('admin.dashboard'),
                      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
                  },
                  {
                      label: 'Validar transportistas',
                      href: route('admin.transporters.index'),
                      active: route().current('admin.transporters.*'),
                      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>,
                  },
                  {
                      label: 'Validar vehículos',
                      href: route('admin.vehicles.index'),
                      active: route().current('admin.vehicles.*'),
                      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
                  },
                  {
                      label: 'Monitoreo de rutas',
                      href: route('admin.routes.index'),
                      active: route().current('admin.routes.*'),
                      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
                  },
                  {
                      label: 'Estadísticas de uso',
                      href: route('admin.stats.index'),
                      active: route().current('admin.stats.*'),
                      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
                  },
              ]
              : roleSlug === 'transportista'
                ? [
                    {
                        label: 'Panel transportista',
                        href: route('transporter.dashboard'),
                        active: route().current('transporter.dashboard'),
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                    },
                    {
                        label: 'Gestionar rutas',
                        href: route('transporter.routes.index'),
                        active: route().current('transporter.routes.index'),
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
                    },
                    {
                        label: 'Solicitudes y contactos',
                        href: route('transporter.requests.index'),
                        active: route().current('transporter.requests.index') || route().current('transporter.transport-requests.*'),
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
                    },
                    {
                        label: 'Registrar vehiculo',
                        href: route('transporter.vehicles.create'),
                        active: route().current('transporter.vehicles.*'),
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>,
                    },
                ]
              : [
                    {
                        label: 'Panel productor',
                        href: route('producer.dashboard'),
                        active: route().current('producer.dashboard'),
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                    },
                    {
                        label: 'Rutas disponibles',
                        href: route('producer.routes.index'),
                        active: route().current('producer.routes.index'),
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
                    },
                    {
                        label: 'Rutas activas',
                        href: route('producer.requests.index'),
                        active: route().current('producer.requests.index'),
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                    },
                ];

    const [showingModuleMenu, setShowingModuleMenu] = useState(false);

    // Dynamic styles based on role
    const getDrawerStyles = () => {
        const baseStyle = {
            headerBg: 'bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] text-white',
            logoInvert: true,
            cardBg: 'bg-white/10 border-white/20',
            textColor: 'text-white',
            subTextColor: 'text-emerald-100',
            pillBg: 'bg-white text-emerald-800',
            closeBtn: 'border-white/20 bg-white/10 text-white hover:bg-white/20',
            drawerBg: 'bg-slate-50',
            activeLink: 'bg-emerald-600 text-white shadow-md',
            inactiveLink: 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700',
        };

        if (roleSlug === 'administrador') {
            return { ...baseStyle, title: 'Centro de Comando' };
        } else if (roleSlug === 'transportista') {
            return { ...baseStyle, title: 'Panel de Flota' };
        } else {
            return { ...baseStyle, title: 'Panel Logístico' };
        }
    };

    const styles = getDrawerStyles();

    return (
        <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#eef7ec_0%,#f6faf3_42%,#fbfcf8_100%)] text-[#203029]">
            <button
                type="button"
                onClick={() => setShowingModuleMenu(true)}
                className="interactive-lift fixed left-4 top-5 z-40 inline-flex h-12 items-center gap-3 rounded-2xl border border-emerald-600 bg-emerald-700 px-4 text-sm font-semibold text-white shadow-[0_18px_42px_-26px_rgba(21,128,61,0.8)] transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 sm:left-6 sm:top-6 sm:h-14 sm:px-5"
                aria-label="Abrir menu operativo"
            >
                <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M5 7H19"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                    />
                    <path
                        d="M5 12H19"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                    />
                    <path
                        d="M5 17H15"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                    />
                </svg>
                <span>Menu</span>
            </button>

            {showingModuleMenu ? (
                <div className="fixed inset-0 z-50">
                    <button
                        type="button"
                        className="animate-overlay-in absolute inset-0 bg-[#203029]/40 backdrop-blur-sm"
                        aria-label="Cerrar menu de modulos"
                        onClick={() => setShowingModuleMenu(false)}
                    />
                    <aside className={`animate-drawer-in absolute left-0 top-0 flex h-full w-[min(23.5rem,calc(100vw-1.25rem))] flex-col border-r border-[#dfe8dc] shadow-2xl ${styles.drawerBg}`}>
                        <div className={`px-5 py-6 ${styles.headerBg}`}>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-white/10 px-2 backdrop-blur-sm">
                                        <ApplicationLogo className={`h-8 w-auto ${styles.logoInvert ? 'brightness-0 invert' : ''}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">
                                            {styles.title}
                                        </h2>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowingModuleMenu(false)}
                                    className={`interactive-lift inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${styles.closeBtn}`}
                                    aria-label="Cerrar modulos"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M6 6L18 18" /><path d="M18 6L6 18" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className={`mt-6 rounded-2xl border p-4 backdrop-blur-md ${styles.cardBg}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className={`text-xs font-bold uppercase tracking-widest ${styles.subTextColor}`}>
                                            {user.role?.name ?? 'Usuario'}
                                        </p>
                                        <p className={`mt-1 text-sm font-bold ${styles.textColor}`}>
                                            {user.name}
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles.pillBg}`}>
                                        Activo
                                    </span>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
                            <p className="px-2 pb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Menú Principal</p>
                            {moduleLinks.map((module) => (
                                <Link
                                    key={module.href}
                                    href={module.href}
                                    onClick={() => setShowingModuleMenu(false)}
                                    className={`interactive-lift group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition border ${
                                        module.active ? styles.activeLink : styles.inactiveLink
                                    }`}
                                >
                                    <span className="inline-flex items-center gap-3">
                                        <span className={`${module.active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                                            {module.icon}
                                        </span>
                                        <span>{module.label}</span>
                                    </span>
                                    <span
                                        className={
                                            module.active
                                                ? 'text-white/75'
                                                : 'text-[#9aa89f]'
                                        }
                                    >
                                        {'>'}
                                    </span>
                                </Link>
                            ))}
                        </nav>

                        <div className="space-y-2 border-t border-[#dfe8dc] bg-white px-4 py-4">
                            <Link
                                href={route('profile.edit')}
                                onClick={() => setShowingModuleMenu(false)}
                                className="interactive-lift block rounded-xl border border-[#dfe8dc] px-4 py-3 text-sm font-semibold text-[#42534a] transition hover:bg-[#f8fbf6]"
                            >
                                Configurar perfil
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setShowingModuleMenu(false)}
                                className="interactive-lift block w-full rounded-xl border border-rose-200 px-4 py-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                            >
                                Cerrar sesion
                            </Link>
                        </div>
                    </aside>
                </div>
            ) : null}

            <main className="animate-app-page-in min-w-0 overflow-x-hidden pt-20 sm:pt-24">
                {children}
            </main>
        </div>
    );
}
