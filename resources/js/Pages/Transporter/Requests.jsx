import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

const colombiaTimeZone = 'America/Bogota';

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
    return `animate-panel-rise rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-6 ${extra}`.trim();
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
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#427c46]">
                {eyebrow}
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
            {description ? (
                <p className="max-w-3xl text-sm leading-6 text-slate-600">
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
    return (
        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold text-slate-900">
                            {transportRequest.route?.origin} {'->'}{' '}
                            {transportRequest.route?.destination}
                        </h4>
                        <StatusBadge status={transportRequest.status} />
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                        Productor: {transportRequest.producer?.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Producto: {transportRequest.product_type} {' - '} Peso:{' '}
                        {transportRequest.cargo_weight_kg} kg
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Entrega: {transportRequest.delivery_destination}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Solicitado el {formatDate(transportRequest.requested_at)}
                    </p>
                    {transportRequest.route?.vehicle ? (
                        <p className="mt-1 text-sm text-slate-600">
                            Vehiculo: {transportRequest.route.vehicle.vehicle_type}{' '}
                            {' - '} {transportRequest.route.vehicle.plate}
                        </p>
                    ) : null}
                    {transportRequest.estimated_cost ? (
                        <p className="mt-1 text-sm text-slate-600">
                            Valor estimado:{' '}
                            {formatCurrency(transportRequest.estimated_cost)}
                        </p>
                    ) : null}
                </div>

                {transportRequest.status === 'pending' ? (
                    <div className="flex flex-wrap gap-3">
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
                            disabled={decisionForm.processing}
                            className="inline-flex rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                        >
                            Aceptar y habilitar contacto
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
                            className="inline-flex rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
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
}) {
    const decisionForm = useForm({});
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <SectionTitle
                    eyebrow="Operacion"
                    title="Solicitudes y contactos"
                    description="Gestiona solicitudes de productores y consulta los servicios que ya tienen contacto habilitado."
                />
            }
        >
            <Head title="Solicitudes y contactos" />

            <div className="bg-[linear-gradient(180deg,#eef7ec_0%,#f7faf4_100%)] py-5 sm:py-7">
                <div className="mx-auto flex max-w-[1540px] flex-col gap-5 px-3 sm:px-5 lg:px-8">
                    <FlashMessages success={flash.success} error={flash.error} />

                    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <article className={cardClassName()}>
                            <SectionTitle
                                eyebrow="Solicitudes"
                                title="Solicitudes recibidas"
                                description="Acepta o rechaza solicitudes de productores. Al aceptar, el servicio se confirma y el contacto queda habilitado para ambas partes."
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
                                    <EmptyState message="Todavia no has recibido solicitudes sobre tus rutas." />
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
        </AuthenticatedLayout>
    );
}
