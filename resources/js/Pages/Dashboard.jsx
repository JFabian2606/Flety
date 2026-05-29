import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RouteMap from '@/Components/RouteMap';
import { Head, Link, router, usePage } from '@inertiajs/react';

function SearchIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M20 20L16.2 16.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 21C15.5 17.2 18 14.1 18 10.5C18 6.91015 15.3137 4 12 4C8.68629 4 6 6.91015 6 10.5C6 14.1 8.5 17.2 12 21Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 12.3C13.2147 12.3 14.2 11.3147 14.2 10.1C14.2 8.88529 13.2147 7.9 12 7.9C10.7853 7.9 9.8 8.88529 9.8 10.1C9.8 11.3147 10.7853 12.3 12 12.3Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7 4.5V7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M17 4.5V7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M5 9H19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M5.5 6.5H18.5C19.3284 6.5 20 7.17157 20 8V18C20 18.8284 19.3284 19.5 18.5 19.5H5.5C4.67157 19.5 4 18.8284 4 18V8C4 7.17157 4.67157 6.5 5.5 6.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TrendLine() {
    return (
        <svg
            aria-hidden="true"
            className="h-[180px] w-full"
            viewBox="0 0 420 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M24 148C72 145 106 142 138 132C178 118 207 86 242 78C278 70 300 90 334 84C361 79 382 53 396 30"
                stroke="url(#trend)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="24" cy="148" r="6" fill="#3F7E40" />
            <circle cx="138" cy="132" r="6" fill="#6AA46A" />
            <circle cx="242" cy="78" r="6" fill="#4F9547" />
            <circle cx="334" cy="84" r="6" fill="#6AA46A" />
            <circle cx="396" cy="30" r="7" fill="#4F9547" />
            <defs>
                <linearGradient
                    id="trend"
                    x1="24"
                    y1="148"
                    x2="396"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#7FAF75" />
                    <stop offset="1" stopColor="#2F6D3E" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function DataList({ section }) {
    const actionStyles = {
        approve: 'bg-emerald-700 text-white hover:bg-emerald-600',
        reject: 'border border-rose-200 text-rose-700 hover:bg-rose-50',
    };

    return (
        <article className="animate-panel-rise rounded-2xl border border-[#dfe8dc] bg-white p-5 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-6">
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#203029]">
                {section.title}
            </h3>

            <div className="mt-5 space-y-3">
                {section.items?.length ? (
                    section.items.map((item, index) => (
                        <div
                            key={`${section.title}-${index}`}
                            className="rounded-xl border border-[#e1e9de] bg-[#f8fbf6] px-4 py-3"
                        >
                            <p className="font-semibold text-[#203029]">
                                {item.title}
                            </p>
                            <p className="mt-1 text-sm text-[#626a65]">
                                {item.meta}
                            </p>
                            {item.links?.length ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {item.links.map((link) =>
                                        link.inertia ? (
                                            <Link
                                                key={link.label}
                                                href={link.href}
                                                className="rounded-xl border border-[#dce6d8] px-3 py-2 text-xs font-semibold text-[#3f6f4b] transition hover:bg-[#f4f8ef]"
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl border border-[#dce6d8] px-3 py-2 text-xs font-semibold text-[#3f6f4b] transition hover:bg-[#f4f8ef]"
                                            >
                                                {link.label}
                                            </a>
                                        ),
                                    )}
                                </div>
                            ) : null}
                            {item.actions?.length ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {item.actions.map((action) => (
                                        <button
                                            key={action.label}
                                            type="button"
                                            onClick={() =>
                                                router.post(action.href, {}, {
                                                    preserveScroll: true,
                                                })
                                            }
                                            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${actionStyles[action.type] ?? actionStyles.approve}`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#d8ddd2] px-4 py-6 text-sm text-[#69706b]">
                        {section.emptyMessage}
                    </div>
                )}
            </div>
        </article>
    );
}

function hasRouteCoordinates(route) {
    return (
        Number.isFinite(Number(route?.origin_lat)) &&
        Number.isFinite(Number(route?.origin_lng)) &&
        Number.isFinite(Number(route?.destination_lat)) &&
        Number.isFinite(Number(route?.destination_lng))
    );
}

function TransporterOperations({
    user,
    data,
    entryRoute,
    flash,
    spotlightMapRoute,
}) {
    const primaryMetrics = data.metrics ?? [];
    const routeList = data.lists?.[0];
    const requestList = data.lists?.[1];
    const userInitials = user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
    const isVerified =
        data.pills?.some(
            (pill) =>
                pill.label?.toLowerCase() === 'estado' &&
                pill.value?.toLowerCase().includes('aprob'),
        ) ?? false;
    const metricIconStyles = [
        'bg-white/12 text-[#dff3d5]',
        'bg-white/12 text-[#dff3d5]',
        'bg-white/12 text-[#dff3d5]',
        'bg-white/12 text-[#dff3d5]',
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Panel Transportista" />

            <div className="w-full min-h-screen bg-slate-50">
                {/* Edge-to-Edge Hero */}
                <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-12 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                    <div className="mx-auto max-w-[1560px]">
                        {flash.success ? (
                            <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                                {flash.success}
                            </section>
                        ) : null}
                        {flash.error ? (
                            <section className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
                                {flash.error}
                            </section>
                        ) : null}

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2 sm:px-4 pt-4">
                            <div className="min-w-0 max-w-3xl">
                                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#bfe6b5] mb-4">
                                    <span className="grid h-6 w-6 place-items-center rounded-lg border border-white/15 bg-white/10 text-sm">
                                        +
                                    </span>
                                    Panel transportista
                                </p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
                                    Gestiona tus rutas y solicitudes en un solo lugar
                                </h1>
                                <p className="mt-4 text-lg text-[#d9ead3] max-w-2xl leading-relaxed">
                                    Consulta rutas activas, solicitudes de carga y servicios confirmados. Todo lo que necesitas, en Flety.
                                </p>
                                
                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                    {entryRoute ? (
                                        <Link
                                            href={entryRoute}
                                            className="interactive-lift inline-flex justify-center rounded-xl bg-[#83ce55] px-5 py-3.5 text-sm font-bold text-[#123420] shadow-[0_18px_40px_-30px_rgba(131,206,85,0.8)] transition hover:bg-[#91da65]"
                                        >
                                            Gestionar rutas y solicitudes
                                        </Link>
                                    ) : null}
                                    <Link
                                        href={route('transporter.vehicles.create')}
                                        className="interactive-lift inline-flex justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/20 backdrop-blur-sm"
                                    >
                                        Registrar vehiculo
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <div className="flex flex-wrap items-center gap-3 bg-black/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center gap-3 px-2">
                                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#8fd56d] bg-[#0d6b36] text-sm font-bold text-white">
                                            {userInitials || 'TF'}
                                        </span>
                                        <div className="min-w-0 text-left">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {user.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-white/70">
                                                Transportista
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('transporter.documents.index')}
                                        className={`interactive-lift inline-flex rounded-xl px-4 py-2 text-sm font-medium backdrop-blur-sm border transition ${
                                            isVerified
                                                ? 'bg-emerald-500/20 border-emerald-400/30 text-[#c8f2bd] hover:bg-emerald-500/30'
                                                : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20'
                                        }`}
                                    >
                                        {isVerified ? '✓ Verificado' : '⚠ En revisión (Validar documentos)'}
                                    </Link>
=======
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50">
                    <div className="mx-auto max-w-[1560px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        {/* Layout for Metrics, Lists and Spotlight */}
                        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] items-start">
                            {/* LEFT COLUMN: Metrics & Lists */}
                            <div className="min-w-0 space-y-6">
                                
                                {/* Metrics Grid (2x2) */}
                                <section className="animate-panel-rise overflow-hidden">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {primaryMetrics.map((metric, index) => (
                                            <article
                                                key={metric.title}
                                                className="min-w-0 rounded-2xl bg-[#084826] p-5 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.65)] text-white relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#106c3a]/50 to-transparent"></div>
                                                <div className="relative z-10 flex flex-col h-full">
                                                    <div className="flex items-center justify-between">
                                                        <div
                                                            className="grid h-12 w-12 place-items-center rounded-full bg-[#05321a] border border-[#1b7f48]/40 text-[#c8f2bd]"
                                                        >
                                                            <span className="text-lg font-bold">
                                                                {metric.value}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9ce388]">
                                                            {metric.eyebrow}
                                                        </p>
                                                    </div>
                                                    <p className="mt-4 text-sm leading-5 text-[#e6f4e1] font-medium">
                                                        {metric.title}
                                                    </p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>

                                {/* Lists */}
                                <div className="min-w-0 grid gap-5 grid-cols-1">
                                    <article className="animate-panel-rise rounded-2xl border border-[#dfe8dc] bg-white p-5 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#42534a]">
                                        Ultimas publicaciones
                                    </p>
                                    <h3 className="mt-2 text-xl font-bold text-[#203029]">
                                        Rutas registradas
                                    </h3>
                                </div>
                                {entryRoute ? (
                                    <Link
                                        href={entryRoute}
                                        className="inline-flex justify-center rounded-xl border border-[#dce6d8] bg-white px-4 py-3 text-sm font-bold text-[#3f6f4b] transition hover:bg-[#f4f8ef]"
                                    >
                                        Ver todas las rutas
                                    </Link>
                                ) : null}
                            </div>

                            <div className="mt-5 space-y-3">
                                {routeList?.items?.length ? (
                                    routeList.items.map((item, index) => (
                                        <div
                                            key={`${routeList.title}-${index}`}
                                            className="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-[#e1e9de] bg-white px-4 py-3 shadow-[0_14px_34px_-32px_rgba(31,74,49,0.35)]"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef7e8] text-sm font-bold text-[#427c46]">
                                                    {index + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-[#203029]">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 truncate text-sm text-[#626a65]">
                                                        {item.meta}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-[#d8ddd2] px-4 py-7 text-sm text-[#69706b]">
                                        {routeList?.emptyMessage}
                                    </div>
                                )}
                            </div>
                        </article>

                        <article className="animate-panel-rise rounded-2xl border border-[#dfe8dc] bg-white p-5 shadow-[0_22px_50px_-42px_rgba(31,74,49,0.4)] sm:p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#42534a]">
                                        Productores esperando respuesta
                                    </p>
                                    <h3 className="mt-2 text-xl font-bold text-[#203029]">
                                        Solicitudes recientes
                                    </h3>
                                </div>
                                <Link
                                    href={route('transporter.requests.index')}
                                    className="inline-flex justify-center rounded-xl border border-[#dce6d8] bg-white px-4 py-3 text-sm font-bold text-[#3f6f4b] transition hover:bg-[#f4f8ef]"
                                >
                                    Ver todas
                                </Link>
                            </div>

                            <div className="mt-5 space-y-3">
                                {requestList?.items?.length ? (
                                    requestList.items.map((item, index) => (
                                        <div
                                            key={`${requestList.title}-${index}`}
                                            className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[#e1e9de] bg-white px-4 py-3 shadow-[0_14px_34px_-32px_rgba(31,74,49,0.35)] sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef7e8] text-sm font-bold text-[#427c46]">
                                                    {index + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-[#203029]">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 truncate text-sm text-[#626a65]">
                                                        {item.meta}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="w-fit rounded-xl bg-[#fff4df] px-4 py-2 text-xs font-bold text-[#c47a16]">
                                                Pendiente
                                            </span>
                                            {item.actions?.length ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.actions.map((action) => (
                                                        <button
                                                            key={action.label}
                                                            type="button"
                                                            onClick={() =>
                                                                router.post(action.href, {}, {
                                                                    preserveScroll: true,
                                                                })
                                                            }
                                                            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                                                action.type === 'reject'
                                                                    ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                                                                    : 'bg-emerald-700 text-white hover:bg-emerald-600'
                                                            }`}
                                                        >
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-[#d8ddd2] bg-white px-4 py-7 text-sm text-[#69706b]">
                                        {requestList?.emptyMessage}
                                    </div>
                                )}
                            </div>

                            {requestList?.items?.length ? (
                                <div className="mt-5 flex justify-center">
                                    <Link
                                        href={route('transporter.requests.index')}
                                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-[#0f5c31] transition hover:bg-[#f4f8ef]"
                                    >
                                        Ver todas las solicitudes
                                        <span>{'>'}</span>
                                    </Link>
                                </div>
                            ) : null}
                                </article>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Spotlight Map */}
                        <aside className="min-w-0 xl:sticky xl:top-24 rounded-[1.25rem] border border-[#dfe8dc] bg-white p-5 text-[#203029] shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-6">
                            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#42534a]">
                                        {data.spotlight.title}
                                    </p>
                                    <h2 className="mt-4 break-words text-2xl font-bold leading-tight tracking-[-0.02em] text-[#163b29]">
                                        {data.spotlight.route}
                                        <span className="mx-2 text-[#2f8b45]">
                                            {'->'}
                                        </span>
                                        {data.spotlight.routeTo}
                                    </h2>
                                    <p className="mt-3 text-sm font-medium text-[#66746d]">
                                        {data.spotlight.dateLabel}
                                    </p>
                                </div>
                                <span className="inline-flex w-fit rounded-xl bg-[#edf7e8] px-4 py-2 text-sm font-semibold text-[#427c46]">
                                    {data.spotlight.statusLabel}
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-[#e5ebdf] bg-white px-4 py-3 shadow-[0_16px_34px_-32px_rgba(31,74,49,0.4)]">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b746d]">
                                        Capacidad
                                    </p>
                                    <p className="mt-2 font-bold text-[#203029]">
                                        {data.spotlight.infoValue}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#e5ebdf] bg-white px-4 py-3 shadow-[0_16px_34px_-32px_rgba(31,74,49,0.4)]">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b746d]">
                                        Vehiculo
                                    </p>
                                    <p className="mt-2 break-words font-bold text-[#203029]">
                                        {data.spotlight.vehicleLabel}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#e5ebdf] bg-white px-4 py-3 shadow-[0_16px_34px_-32px_rgba(31,74,49,0.4)]">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b746d]">
                                        Solicitudes
                                    </p>
                                    <p className="mt-2 font-bold text-[#203029]">
                                        {data.spotlight.requestsLabel}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 overflow-hidden rounded-2xl border border-[#dce8d8] bg-[#f4f8ef] p-2">
                                {spotlightMapRoute ? (
                                    <RouteMap
                                        routes={[spotlightMapRoute]}
                                        height="clamp(230px, 32vh, 320px)"
                                    />
                                ) : (
                                    <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-dashed border-[#cfe1cb] bg-[#f8fbf6] px-6 text-center text-sm text-[#647067]">
                                        Publica una ruta con puntos de mapa para ver el trayecto aqui.
                                    </div>
                                )}
                            </div>

                            <p className="mt-4 rounded-xl bg-[#edf7e8] px-4 py-3 text-sm font-semibold text-[#3f6f4b]">
                                La carga se define cuando el productor envia la solicitud.
                            </p>
                        </aside>
                    </div>
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default function Dashboard({ dashboardRole, entryRoute, dashboardData }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const role = dashboardRole ?? user.role?.slug;
    const data = dashboardData ?? {
        hero: {
            badge: `Panel ${role ?? 'Flety'}`,
            title: 'Panel operativo',
            subtitle: 'Aun no hay informacion suficiente para mostrar.',
        },
        pills: [],
        spotlight: {
            title: 'Resumen',
            route: 'Sin datos',
            routeTo: 'disponibles',
            dateLabel: 'Sin actividad',
            infoLabel: 'Estado',
            infoValue: 'Pendiente',
            statusLabel: 'Base',
            mapRoute: null,
        },
        metrics: [],
        lists: [],
    };
    const spotlightMapRoute = hasRouteCoordinates(data.spotlight.mapRoute)
        ? data.spotlight.mapRoute
        : null;

    if (role === 'transportista') {
        return (
            <TransporterOperations
                user={user}
                data={data}
                entryRoute={entryRoute}
                flash={flash}
                spotlightMapRoute={spotlightMapRoute}
            />
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Panel" />

            <div className="w-full min-h-screen bg-slate-50">
                {/* Edge-to-Edge Hero */}
                <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-12 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                    <div className="mx-auto max-w-[1560px]">
                        {flash.success ? (
                            <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                                {flash.success}
                            </section>
                        ) : null}
                        {flash.error ? (
                            <section className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
                                {flash.error}
                            </section>
                        ) : null}

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2 sm:px-4 pt-4">
                            <div className="min-w-0 max-w-3xl">
                                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#bfe6b5] mb-4">
                                    <span className="grid h-6 w-6 place-items-center rounded-lg border border-white/15 bg-white/10 text-sm">
                                        +
                                    </span>
                                    {data.hero.badge}
                                </p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
                                    {user.role?.name ? `Panel ${user.role.name}` : 'Panel Flety'}
                                </h1>
                                <p className="mt-4 text-lg text-[#d9ead3] max-w-2xl leading-relaxed">
                                    Informacion funcional cargada desde la base de datos
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 bg-black/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="flex flex-wrap items-center gap-2">
                                    {data.pills.slice(0, 3).map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                                        >
                                            <span className="text-white/70">
                                                {item.label}:{' '}
                                            </span>
                                            {item.value}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 backdrop-blur-sm"
                                    >
                                        <SearchIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50">
                            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                                <div className="grid items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
                                    <div className="space-y-4 xl:sticky xl:top-24">
                                        <div className="animate-panel-rise rounded-2xl border border-[#d8e8d4] bg-white/82 p-5 shadow-[0_18px_44px_-36px_rgba(31,74,49,0.4)]">
                                            <h3 className="text-3xl font-semibold leading-tight text-[#203029] sm:text-[2.25rem]">
                                                Bienvenido,{' '}
                                                {user.name.split(' ')[0]}
                                            </h3>
                                            <p className="mt-3 text-sm leading-6 text-[#52615a]">
                                                {data.hero.subtitle}
                                            </p>
                                        </div>

                                        <div className="animate-panel-rise stagger-1 rounded-2xl border border-[#d8e8d4] bg-white p-2 shadow-[0_18px_44px_-36px_rgba(31,74,49,0.4)]">
                                            <div className="flex items-center justify-between rounded-xl border-b border-[#edf2e9] px-4 py-3 text-[#52615a]">
                                                <span className="inline-flex items-center gap-3">
                                                    <LocationIcon />
                                                    {data.spotlight.route}
                                                </span>
                                                <span className="text-xl text-[#8a968f]">
                                                    {'>'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-3 text-[#52615a]">
                                                <span className="inline-flex items-center gap-3">
                                                    <CalendarIcon />
                                                    {data.spotlight.routeTo}
                                                </span>
                                                <span className="text-xl text-[#8a968f]">
                                                    {'>'}
                                                </span>
                                            </div>
                                        </div>

                                        {entryRoute ? (
                                            <Link
                                                href={entryRoute}
                                                className="interactive-lift inline-flex w-full justify-center rounded-xl bg-[#427c46] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_38px_-30px_rgba(66,124,70,0.75)] transition hover:bg-[#356b3f]"
                                            >
                                                Ir al modulo operativo
                                            </Link>
                                        ) : null}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="animate-panel-rise stagger-1 rounded-2xl border border-[#d8e8d4] bg-white p-4 shadow-[0_18px_44px_-36px_rgba(31,74,49,0.4)] lg:p-5">
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-[#2f6d3e]">
                                                        {data.spotlight.title}
                                                    </p>
                                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[#25322d]">
                                                        <LocationIcon />
                                                        <p className="text-2xl font-semibold leading-tight sm:text-[1.8rem]">
                                                            {data.spotlight.route}
                                                            <span className="mx-2 text-[#86a98b]">
                                                                {'->'}
                                                            </span>
                                                            {data.spotlight.routeTo}
                                                        </p>
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-3 text-[#5f6963]">
                                                        <CalendarIcon />
                                                        <p className="font-medium">
                                                            {data.spotlight.dateLabel}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl bg-[#edf4e8] px-3 py-2 text-sm font-semibold text-[#4c7d4f]">
                                                    {data.spotlight.statusLabel}
                                                </div>
                                            </div>

                                            <div className="mt-4 overflow-hidden rounded-xl border border-[#dce8d8] bg-[#f4f8ef] p-2">
                                                {spotlightMapRoute ? (
                                                    <RouteMap
                                                        routes={[spotlightMapRoute]}
                                                        height="250px"
                                                    />
                                                ) : (
                                                    <TrendLine />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                            {data.metrics.map((metric) => (
                                                <article
                                                    key={metric.title}
                                                    className="interactive-lift animate-panel-rise rounded-xl border border-[#d8e8d4] bg-white p-4 shadow-[0_16px_36px_-30px_rgba(31,74,49,0.35)]"
                                                >
                                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d856e]">
                                                        {metric.eyebrow}
                                                    </p>
                                                    <h3 className="mt-3 text-sm font-semibold leading-tight text-[#203029]">
                                                        {metric.title}
                                                    </h3>
                                                    <p className="mt-3 text-2xl font-semibold text-[#2f6d3e]">
                                                        {metric.value}
                                                    </p>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <section className="grid gap-4 lg:grid-cols-2">
                                    {data.lists.map((section) => (
                                        <DataList
                                            key={section.title}
                                            section={section}
                                        />
                                    ))}
                                </section>
                            </div>
                        </div>
                    </div>
        </AuthenticatedLayout>
    );
}
