import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const colombiaTimeZone = 'America/Bogota';

const statusLabels = {
    approved: 'Cuenta verificada',
    available: 'Disponible',
    pending: 'Pendiente',
    rejected: 'Rechazado',
    unavailable: 'No disponible',
};

function formatDate(value) {
    if (!value) {
        return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: colombiaTimeZone,
    }).format(new Date(value));
}

function StatusBadge({ status }) {
    const styles = {
        approved: 'bg-emerald-100 text-emerald-700',
        available: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
        rejected: 'bg-rose-100 text-rose-700',
        unavailable: 'bg-slate-100 text-slate-700',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
                styles[status] ?? 'bg-slate-100 text-slate-700'
            }`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}

function cardClassName(extra = '') {
    return `animate-panel-rise rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-6 ${extra}`.trim();
}

export default function TransporterProfile({ transporter }) {
    const initials = String(transporter.name ?? 'T')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <AuthenticatedLayout>
            <Head title={`Transportista ${transporter.name ?? ''}`} />

            <div className="min-h-screen bg-[linear-gradient(180deg,#eef7ec_0%,#f7faf4_100%)] py-5 sm:py-7">
                <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-3 sm:px-5 lg:px-8">
                    <Link
                        href={route('producer.routes.index')}
                        className="inline-flex w-fit rounded-xl border border-[#dfe8dc] bg-white px-4 py-2 text-sm font-bold text-[#356b3f] transition hover:bg-[#f8fbf6]"
                    >
                        Volver a rutas
                    </Link>

                    <section className="animate-panel-rise overflow-hidden rounded-2xl border border-[#0d4f2a]/20 bg-[linear-gradient(135deg,#06451f_0%,#083f24_58%,#0f6b38_100%)] p-5 text-white shadow-[0_28px_70px_-52px_rgba(4,59,31,0.85)] sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-white/20 bg-white/12 text-xl font-bold">
                                    {initials || 'T'}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bfe6b5]">
                                        Informacion del transportista
                                    </p>
                                    <h1 className="mt-2 break-words text-3xl font-bold leading-tight">
                                        {transporter.name}
                                    </h1>
                                    <div className="mt-3">
                                        <StatusBadge
                                            status={transporter.validation_status}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:min-w-[18rem]">
                                <div className="rounded-2xl border border-white/16 bg-white/8 px-4 py-3">
                                    <p className="text-xs text-white/70">
                                        Rutas activas
                                    </p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {transporter.active_routes_count}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/16 bg-white/8 px-4 py-3">
                                    <p className="text-xs text-white/70">
                                        Vehiculos
                                    </p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {transporter.vehicles_count}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                        <article className={cardClassName()}>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#427c46]">
                                Flota
                            </p>
                            <h2 className="mt-2 text-xl font-bold text-slate-950">
                                Vehiculos registrados
                            </h2>

                            <div className="mt-5 grid gap-3">
                                {transporter.vehicles?.length ? (
                                    transporter.vehicles.map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <p className="font-bold text-slate-950">
                                                    {vehicle.vehicle_type} -{' '}
                                                    {vehicle.plate}
                                                </p>
                                                <StatusBadge status={vehicle.status} />
                                            </div>
                                            <p className="mt-2 text-sm text-slate-600">
                                                Capacidad: {vehicle.capacity_kg} kg
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                        Este transportista aun no tiene vehiculos
                                        visibles.
                                    </p>
                                )}
                            </div>
                        </article>

                        <article className={cardClassName()}>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#427c46]">
                                Rutas activas
                            </p>
                            <h2 className="mt-2 text-xl font-bold text-slate-950">
                                Publicaciones disponibles
                            </h2>

                            <div className="mt-5 grid gap-3">
                                {transporter.active_routes?.length ? (
                                    transporter.active_routes.map((activeRoute) => (
                                        <Link
                                            key={activeRoute.id}
                                            href={route(
                                                'producer.routes.show',
                                                activeRoute.id,
                                            )}
                                            className="interactive-lift rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50"
                                        >
                                            <p className="font-bold text-slate-950">
                                                {activeRoute.origin} {'->'}{' '}
                                                {activeRoute.destination}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Salida:{' '}
                                                {formatDate(
                                                    activeRoute.departure_at,
                                                )}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Capacidad:{' '}
                                                {
                                                    activeRoute.available_capacity_kg
                                                }{' '}
                                                kg
                                            </p>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                        No hay rutas activas de este transportista
                                        en este momento.
                                    </p>
                                )}
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
