import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const colombiaTimeZone = 'America/Bogota';

const statusLabels = {
    pending: 'En negociacion',
    accepted: 'Aceptada',
    rejected: 'Rechazada / Finalizada',
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

function formatCurrency(value) {
    if (value === null || value === undefined || value === '') {
        return 'Sin definir';
    }

    return new Intl.NumberFormat('es-CO', {
        currency: 'COP',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(Number(value));
}

function cardClassName(extra = '') {
    return `animate-panel-rise min-w-0 rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-6 ${extra}`.trim();
}

function StatusBadge({ status }) {
    const styles = {
        accepted: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-yellow-100 text-yellow-700',
        rejected: 'bg-slate-200 text-slate-700',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${styles[status] ?? 'bg-slate-100 text-slate-700'}`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}

function SectionTitle({ eyebrow, title, description }) {
    return (
        <div className="min-w-0 space-y-2">
            <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-[#427c46] sm:tracking-[0.22em]">
                {eyebrow}
            </p>
            <h3 className="break-words text-xl font-semibold text-slate-900 sm:text-2xl">
                {title}
            </h3>
            {description ? (
                <p className="max-w-3xl break-words text-sm leading-6 text-slate-600">
                    {description}
                </p>
            ) : null}
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="rounded-[1.3rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-sm text-slate-500 text-center">
            {message}
        </div>
    );
}

export default function Index({ requests }) {
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredRequests = requests.filter((req) => 
        filterStatus === 'all' ? true : req.status === filterStatus
    );

    const filterOptions = [
        { key: 'all', label: 'Todas' },
        { key: 'pending', label: 'En negociacion' },
        { key: 'accepted', label: 'Aceptadas' },
        { key: 'rejected', label: 'Cerradas / Rechazadas' },
    ];

    const renderRequestCard = (request) => (
        <div key={request.id} className={cardClassName()}>
            <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <StatusBadge status={request.status} />
                    </div>

                    <h4 className="mt-3 break-words text-lg font-bold leading-snug text-slate-950">
                        {request.route?.origin} {'->'}{' '}
                        {request.route?.destination}
                    </h4>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                                Carga ofrecida
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {request.product_type} - {request.cargo_weight_kg} kg
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Salida de ruta
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {formatDate(request.route?.departure_at)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-slate-600">
                        <p className="break-words">
                            Entrega: {request.delivery_destination}
                        </p>
                        <p>
                            Solicitado el {formatDate(request.requested_at)}
                        </p>
                        {request.route?.vehicle ? (
                            <p className="break-words">
                                Vehiculo: {request.route.vehicle.vehicle_type}{' '}
                                - {request.route.vehicle.plate}
                            </p>
                        ) : null}
                        {request.estimated_cost ? (
                            <p className="font-semibold text-slate-900">
                                Valor estimado:{' '}
                                {formatCurrency(request.estimated_cost)}
                            </p>
                        ) : null}
                    </div>
                </div>

                {request.status === 'accepted' && request.transporter ? (
                    <div className="flex min-w-[14rem] flex-col gap-2 mt-4 xl:mt-0 xl:ml-4">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">Contacto habilitado</p>
                            <p className="text-sm font-bold text-emerald-950 mb-3">{request.transporter.name}</p>
                            {request.transporter.phone ? (
                                <a 
                                    href={`https://wa.me/${request.transporter.phone.replace(/[^0-9]/g, '')}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="interactive-lift flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#22bf5b]"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    WhatsApp
                                </a>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Mis Solicitudes" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-10 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4">
                                Tus Ofertas
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Rutas Activas
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                Haz seguimiento a las ofertas de carga que has enviado a los transportistas y contacta con los que aceptaron tu carga.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-8">
                        <div className="flex w-max gap-2 overflow-x-auto pb-2 sm:pb-0 pr-1">
                            {filterOptions.map((option) => {
                                const count = requests.filter((req) => option.key === 'all' || req.status === option.key).length;
                                const isActive = filterStatus === option.key;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => setFilterStatus(option.key)}
                                        className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition sm:text-sm flex items-center gap-2 ${
                                            isActive
                                                ? 'bg-emerald-700 text-white shadow-sm'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                                        }`}
                                    >
                                        {option.label}
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                                isActive
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map(renderRequestCard)
                        ) : (
                            <EmptyState message="No hay solicitudes para mostrar con este filtro." />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
