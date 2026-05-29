import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

const colombiaTimeZone = 'America/Bogota';

const productCategoryLabels = {
    resistant: 'Resistente',
    sensitive: 'Sensible',
    delicate: 'Delicado',
    very_delicate: 'Muy delicado',
};

const statusLabels = {
    accepted: 'Aceptada',
    cancelled: 'Cancelada',
    closed: 'Cerrada',
    confirmed: 'Confirmado',
    pending: 'Pendiente',
    published: 'Publicada',
    rejected: 'Rechazada',
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
        cancelled: 'bg-rose-100 text-rose-700',
        closed: 'bg-slate-200 text-slate-700',
        confirmed: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
        published: 'bg-emerald-100 text-emerald-700',
        rejected: 'bg-rose-100 text-rose-700',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles[status] ?? 'bg-slate-100 text-slate-700'}`}
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
        <div className="rounded-[1.3rem] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-sm text-slate-500">
            {message}
        </div>
    );
}

function FlashMessages({ success, error }) {
    return (
        <>
            {success ? (
                <section className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                    {success}
                </section>
            ) : null}
            {error ? (
                <section className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
                    {error}
                </section>
            ) : null}
        </>
    );
}

function ContactActions({ service }) {
    const counterpart = service.counterpart;

    if (!counterpart?.phone_url && !counterpart?.whatsapp_url) {
        return null;
    }

    return (
        <div className="mt-5 flex flex-wrap gap-3">
            {counterpart.whatsapp_url ? (
                <a
                    href={counterpart.whatsapp_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                    Contactar por WhatsApp
                </a>
            ) : null}
            {counterpart.phone_url ? (
                <a
                    href={counterpart.phone_url}
                    className="inline-flex rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                >
                    Llamar ahora
                </a>
            ) : null}
        </div>
    );
}

function TransportRequestCard({ transportRequest, decisionForm }) {
    const canAccept = transportRequest.can_accept !== false;

    return (
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_36px_-34px_rgba(15,23,42,0.65)] sm:p-5">
            <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        {transportRequest.is_new ? (
                            <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-lime-700">
                                Nueva
                            </span>
                        ) : null}
                        <StatusBadge status={transportRequest.status} />
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
                                canAccept
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                            {canAccept ? 'Compatible' : 'Revisar capacidad'}
                        </span>
                    </div>

                    <h4 className="mt-3 break-words text-lg font-bold leading-snug text-slate-950">
                        {transportRequest.route?.origin} {'->'}{' '}
                        {transportRequest.route?.destination}
                    </h4>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Productor
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {transportRequest.producer?.name ?? 'Sin nombre'}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Salida de ruta
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {formatDate(transportRequest.route?.departure_at)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                                Carga solicitada
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {transportRequest.product_type} -{' '}
                                {transportRequest.cargo_weight_kg} kg
                            </p>
                            <p className="mt-1 text-xs font-semibold text-emerald-700">
                                {productCategoryLabels[
                                    transportRequest.product_category
                                ] ?? 'Categoria sin definir'}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Capacidad disponible
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                {transportRequest.route?.available_capacity_kg ?? 0} kg
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-slate-600">
                        <p className="break-words">
                            Entrega: {transportRequest.delivery_destination}
                        </p>
                        <p>
                            Solicitado el {formatDate(transportRequest.requested_at)}
                        </p>
                        {transportRequest.route?.vehicle ? (
                            <p className="break-words">
                                Vehiculo: {transportRequest.route.vehicle.vehicle_type}{' '}
                                - {transportRequest.route.vehicle.plate}
                            </p>
                        ) : null}
                        {transportRequest.estimated_cost ? (
                            <p className="font-semibold text-slate-900">
                                Valor estimado:{' '}
                                {formatCurrency(transportRequest.estimated_cost)}
                            </p>
                        ) : null}
                    </div>
                </div>

                {transportRequest.status === 'pending' ? (
                    <div className="flex min-w-[14rem] flex-col gap-2">
                        {!canAccept ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
                                La carga supera la capacidad restante. Puedes
                                rechazarla o actualizar tu ruta si corresponde.
                            </div>
                        ) : null}
                        <button
                            type="button"
                            onClick={() =>
                                decisionForm.post(
                                    route(
                                        'transporter.transport-requests.accept',
                                        transportRequest.id,
                                    ),
                                    { preserveScroll: true },
                                )
                            }
                            disabled={decisionForm.processing || !canAccept}
                            className="inline-flex w-full justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Aceptar solicitud
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                decisionForm.post(
                                    route(
                                        'transporter.transport-requests.reject',
                                        transportRequest.id,
                                    ),
                                    { preserveScroll: true },
                                )
                            }
                            disabled={decisionForm.processing}
                            className="inline-flex w-full justify-center rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                        >
                            Rechazar
                        </button>
                    </div>
                ) : null}
            </div>
        </article>
    );
}

function ServiceCard({ service }) {
    return (
        <article className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold text-slate-900">
                            {service.route?.origin} {'->'} {service.route?.destination}
                        </h4>
                        <StatusBadge status={service.status} />
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                        Confirmado el {formatDate(service.confirmed_at)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Producto: {service.request?.product_type} {' - '} Peso:{' '}
                        {service.request?.cargo_weight_kg} kg
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Categoria:{' '}
                        {productCategoryLabels[
                            service.request?.product_category
                        ] ?? 'Sin definir'}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Entrega: {service.request?.delivery_destination}
                    </p>
                    {service.request?.estimated_cost ? (
                        <p className="mt-1 text-sm text-slate-600">
                            Valor estimado:{' '}
                            {formatCurrency(service.request.estimated_cost)}
                        </p>
                    ) : null}
                    {service.route?.vehicle ? (
                        <p className="mt-1 text-sm text-slate-600">
                            Vehiculo: {service.route.vehicle.vehicle_type} {' - '}{' '}
                            {service.route.vehicle.plate}
                        </p>
                    ) : null}
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-white px-4 py-4 text-sm text-slate-600 lg:max-w-xs">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Contacto habilitado
                    </p>
                    <p className="mt-3 font-semibold text-slate-900">
                        {service.counterpart?.name}
                    </p>
                    <p className="mt-1">Productor asignado</p>
                    <p className="mt-3 text-base font-semibold text-slate-900">
                        {service.counterpart?.phone}
                    </p>
                    <ContactActions service={service} />
                </div>
            </div>
        </article>
    );
}

export default function TransporterRequests({
    incomingRequests = [],
    confirmedServices = [],
    requestSummary = {},
}) {
    const decisionForm = useForm({});
    const { flash } = usePage().props;
    const summaryCards = [
        {
            label: 'Solicitudes pendientes',
            value: requestSummary.pending_count ?? incomingRequests.length,
        },
        {
            label: 'Nuevas en 24 h',
            value: requestSummary.new_count ?? 0,
        },
        {
            label: 'Compatibles',
            value: requestSummary.compatible_count ?? 0,
        },
        {
            label: 'Rutas activas',
            value: requestSummary.active_route_count ?? 0,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Solicitudes y contactos" />

            <div className="w-full min-h-screen bg-slate-50">
                {/* Edge-to-Edge Hero */}
                <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-12 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                    <div className="mx-auto max-w-[1560px]">
                        <FlashMessages success={flash.success} error={flash.error} />
                        
                        <div className="mt-4 flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2 sm:px-4">
                            <div className="min-w-0 max-w-3xl">
                                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#bfe6b5] mb-4">
                                    <span className="grid h-6 w-6 place-items-center rounded-lg border border-white/15 bg-white/10 text-sm">
                                        +
                                    </span>
                                    HU11 - Solicitudes de carga
                                </p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
                                    Recibe y decide solicitudes vinculadas a tus rutas activas
                                </h1>
                                <p className="mt-4 text-lg text-[#d9ead3] max-w-2xl leading-relaxed">
                                    Revisa productores, peso, producto y destino antes de aceptar. Al confirmar, el contacto queda habilitado para coordinar el servicio.
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="rounded-2xl border border-white/16 bg-white/10 px-6 py-5 text-sm text-white shadow-[0_24px_48px_-42px_rgba(0,0,0,0.6)] backdrop-blur-sm text-right lg:min-w-[200px]">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bfe6b5]">
                                        Alerta actual
                                    </p>
                                    <p className="mt-2 text-4xl font-bold">
                                        {requestSummary.new_count ?? 0}
                                    </p>
                                    <p className="mt-1 text-white/75 font-semibold">
                                        solicitudes nuevas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50">
                    <div className="mx-auto max-w-[1560px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        <section className="animate-panel-rise overflow-hidden">
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {summaryCards.map((item) => (
                                    <div
                                        key={item.label}
                                        className="min-w-0 rounded-2xl bg-[#084826] p-5 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.65)] text-white relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#106c3a]/50 to-transparent"></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9ce388]">
                                                {item.label}
                                            </p>
                                            <p className="mt-3 text-3xl font-bold">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                            <article className={cardClassName()}>
                                <SectionTitle
                                    eyebrow="Solicitudes"
                                    title="Solicitudes recibidas"
                                    description="Solo se muestran solicitudes pendientes asociadas a tus rutas publicadas, futuras y disponibles."
                                />

                                <div className="mt-6 grid gap-4">
                                    {incomingRequests.length ? (
                                        incomingRequests.map((transportRequest) => (
                                            <TransportRequestCard
                                                key={transportRequest.id}
                                                transportRequest={transportRequest}
                                                decisionForm={decisionForm}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="No hay solicitudes pendientes para tus rutas activas." />
                                    )}
                                </div>
                            </article>

                            <article className={cardClassName()}>
                                <SectionTitle
                                    eyebrow="Confirmacion"
                                    title="Servicios con contacto activo"
                                    description="Desde aqui puedes llamar o abrir WhatsApp con un solo clic una vez aceptada la solicitud."
                                />

                                <div className="mt-6 grid gap-4">
                                    {confirmedServices.length ? (
                                        confirmedServices.map((service) => (
                                            <ServiceCard
                                                key={service.id}
                                                service={service}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message="Aun no tienes servicios confirmados con contacto habilitado." />
                                    )}
                                </div>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
