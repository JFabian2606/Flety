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
                      label: 'Panel administrador',
                      href: route('admin.dashboard'),
                      active: route().current('admin.dashboard'),
                  },
                  {
                      label: 'Validar transportistas',
                      href: route('admin.transporters.index'),
                      active: route().current('admin.transporters.*'),
                  },
              ]
              : roleSlug === 'transportista'
                ? [
                    {
                        label: 'Panel transportista',
                        href: route('transporter.dashboard'),
                        active: route().current('transporter.dashboard'),
                    },
                    {
                        label: 'Gestionar rutas',
                        href: route('transporter.routes.index'),
                        active: route().current('transporter.routes.index'),
                    },
                    {
                        label: 'Solicitudes y contactos',
                        href: route('transporter.requests.index'),
                        active:
                            route().current('transporter.requests.index') ||
                            route().current('transporter.transport-requests.*'),
                    },
                    {
                        label: 'Registrar vehiculo',
                        href: route('transporter.vehicles.create'),
                        active: route().current('transporter.vehicles.*'),
                    },
                ]
              : [
                    {
                        label: 'Panel productor',
                        href: route('producer.dashboard'),
                        active: route().current('producer.dashboard'),
                    },
                    {
                        label: 'Rutas disponibles',
                        href: route('producer.routes.index'),
                        active: route().current('producer.routes.index'),
                    },
                ];

    const [showingModuleMenu, setShowingModuleMenu] = useState(false);

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
                        className="animate-overlay-in absolute inset-0 bg-[#203029]/35"
                        aria-label="Cerrar menu de modulos"
                        onClick={() => setShowingModuleMenu(false)}
                    />
                    <aside className="animate-drawer-in absolute left-0 top-0 flex h-full w-[min(23.5rem,calc(100vw-1.25rem))] flex-col border-r border-[#dfe8dc] bg-[#fbfcf8] shadow-[28px_0_70px_-48px_rgba(31,74,49,0.5)]">
                        <div className="border-b border-[#dfe8dc] bg-white px-5 py-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 min-w-28 items-center justify-center rounded-xl border border-[#d8e8d4] bg-[#f2f8ef] px-3">
                                        <ApplicationLogo className="h-8 w-auto" />
                                    </div>
                                    <div>
                                        <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                            Menu operativo
                                        </h2>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowingModuleMenu(false)}
                                    className="interactive-lift inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe8dc] bg-white text-[#5e7569] transition hover:bg-[#f8fbf6]"
                                    aria-label="Cerrar modulos"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M6 6L18 18"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M18 6L6 18"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-5 rounded-2xl border border-[#d8e8d4] bg-[linear-gradient(180deg,#f2f8ef_0%,#ffffff_100%)] px-4 py-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#356b3f]">
                                            {user.role?.name ?? 'Usuario'}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {user.name}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#427c46]">
                                        Activo
                                    </span>
                                </div>
                                <p className="mt-3 text-xs leading-5 text-[#66746d]">
                                    Accede rapidamente a las areas disponibles para tu rol.
                                </p>
                            </div>
                        </div>

                        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
                            {moduleLinks.map((module) => (
                                <Link
                                    key={module.href}
                                    href={module.href}
                                    onClick={() => setShowingModuleMenu(false)}
                                    className={`interactive-lift group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                        module.active
                                            ? 'bg-[#427c46] text-white shadow-[0_18px_34px_-28px_rgba(66,124,70,0.65)]'
                                            : 'border border-[#dfe8dc] bg-white text-[#42534a] hover:border-[#cbdac7] hover:bg-[#f8fbf6]'
                                    }`}
                                >
                                    <span className="inline-flex items-center gap-3">
                                        <span
                                            className={`h-2.5 w-2.5 rounded-full ${
                                                module.active
                                                    ? 'bg-white'
                                                    : 'bg-[#9fbd99] group-hover:bg-[#427c46]'
                                            }`}
                                        />
                                        {module.label}
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
