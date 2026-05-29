import RouteMap from '@/Components/RouteMap';
import colombiaPlaces from '@/Data/colombiaPlaces';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const colombiaTimeZone = 'America/Bogota';

const productOptions = [
    'Papa',
    'Platano',
    'Yuca',
    'Cafe',
    'Maiz',
    'Frijol',
    'Hortalizas',
    'Cebolla',
    'Banano',
    'Tomate',
    'Aguacate',
    'Mango',
    'Lechuga',
    'Fresa',
    'Mora',
    'Uva',
    'Flores',
];

const statusLabels = {
    accepted: 'Aceptada',
    approved: 'Aprobado',
    available: 'Aprobado',
    cancelled: 'Cancelada',
    closed: 'Cerrada',
    confirmed: 'Confirmado',
    completed: 'Ruta completa',
    departure_due: 'Hora de salir',
    pending: 'Pendiente',
    published: 'Publicada',
    in_progress: 'En camino',
    rejected: 'Rechazada',
    starting_soon: 'Arranca pronto',
};

function formatDate(value) {
    if (!value) {
        return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeZone: colombiaTimeZone,
        timeStyle: 'short',
    }).format(new Date(value));
}

function toDateTimeLocal(value) {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const parts = new Intl.DateTimeFormat('en-CA', {
        day: '2-digit',
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        month: '2-digit',
        timeZone: colombiaTimeZone,
        year: 'numeric',
    })
        .formatToParts(date)
        .reduce((values, part) => {
            values[part.type] = part.value;

            return values;
        }, {});

    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function formatCurrency(value) {
    if (value === null || value === undefined || value === '') {
        return 'Sin definir';
    }

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatDuration(minutes) {
    const numericMinutes = Number(minutes);

    if (!Number.isFinite(numericMinutes) || numericMinutes <= 0) {
        return 'Pendiente';
    }

    const roundedMinutes = Math.round(numericMinutes);
    const hours = Math.floor(roundedMinutes / 60);
    const remainingMinutes = roundedMinutes % 60;

    if (hours <= 0) {
        return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
        return `${hours} h`;
    }

    return `${hours} h ${remainingMinutes} min`;
}

const routeColors = [
    '#1677ff',
    '#f97316',
    '#8b5cf6',
    '#dc2626',
    '#0891b2',
    '#65a30d',
    '#be123c',
    '#7c3aed',
    '#0f766e',
    '#ca8a04',
];

function routeColor(index) {
    return routeColors[index % routeColors.length];
}

function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function findDepartment(departmentCode) {
    return colombiaPlaces.find(
        (department) => department.code === departmentCode,
    );
}

function findMunicipality(departmentCode, municipalityCode) {
    const department = findDepartment(departmentCode);

    return department?.municipalities.find(
        (municipality) => municipality.code === municipalityCode,
    );
}

function formatPlaceLabel(department, municipality) {
    return `${municipality.name}, ${department.name}`;
}

function findPlaceSelection(label, lat, lng) {
    const normalizedLabel = normalizeText(label);
    const numericLat = Number(lat);
    const numericLng = Number(lng);
    let nearest = null;

    for (const department of colombiaPlaces) {
        for (const municipality of department.municipalities) {
            const municipalityName = normalizeText(municipality.name);
            const departmentName = normalizeText(department.name);

            if (
                normalizedLabel.includes(municipalityName) &&
                (!normalizedLabel.includes(',') ||
                    normalizedLabel.includes(departmentName))
            ) {
                return {
                    departmentCode: department.code,
                    municipalityCode: municipality.code,
                };
            }

            if (Number.isFinite(numericLat) && Number.isFinite(numericLng)) {
                const distance =
                    Math.abs(Number(municipality.lat) - numericLat) +
                    Math.abs(Number(municipality.lng) - numericLng);

                if (!nearest || distance < nearest.distance) {
                    nearest = {
                        departmentCode: department.code,
                        distance,
                        municipalityCode: municipality.code,
                    };
                }
            }
        }
    }

    return nearest && nearest.distance < 0.35
        ? {
              departmentCode: nearest.departmentCode,
              municipalityCode: nearest.municipalityCode,
          }
        : {
              departmentCode: '',
              municipalityCode: '',
          };
}

function hasRouteCoordinates(route) {
    return (
        Number.isFinite(Number(route.origin_lat)) &&
        Number.isFinite(Number(route.origin_lng)) &&
        Number.isFinite(Number(route.destination_lat)) &&
        Number.isFinite(Number(route.destination_lng))
    );
}

function mapPointFromData(data, prefix) {
    const lat = data[`${prefix}_lat`];
    const lng = data[`${prefix}_lng`];

    return lat && lng
        ? {
              lat: Number(lat),
              lng: Number(lng),
          }
        : null;
}

function hasRealRouteGeometry(routePreview) {
    return (
        Array.isArray(routePreview?.route_geometry) &&
        routePreview.route_geometry.length >= 2
    );
}

function buildDraftRoute(formData, routePreview) {
    if (!hasRealRouteGeometry(routePreview)) {
        return null;
    }

    return {
        id: 'preview',
        origin: formData.origin,
        origin_lat: formData.origin_lat,
        origin_lng: formData.origin_lng,
        destination: formData.destination,
        destination_lat: formData.destination_lat,
        destination_lng: formData.destination_lng,
        route_geometry: routePreview.route_geometry,
        available_capacity_kg: formData.available_capacity_kg,
        min_cargo_weight_kg: formData.min_cargo_weight_kg,
    };
}

function routePreviewMessage(state, error, routePreview) {
    if (state === 'loading') {
        return 'Calculando trayecto real por carretera...';
    }

    if (state === 'ready' && routePreview) {
        const distance = routePreview.distance_km
            ? `${routePreview.distance_km} km`
            : 'distancia calculada';
        const duration = routePreview.estimated_duration_minutes
            ? ` - Tiempo aprox. ${formatDuration(routePreview.estimated_duration_minutes)}`
            : '';

        return `Trayecto real calculado: ${distance}${duration}`;
    }

    if (state === 'error') {
        return error || 'No se pudo calcular el trayecto real.';
    }

    return 'Selecciona salida y llegada dentro de Colombia para calcular el trayecto real.';
}

function useRealRoutePreview(formData, initialRoutePreview = null) {
    const [routePreview, setRoutePreview] = useState(initialRoutePreview);
    const [routePreviewState, setRoutePreviewState] = useState(
        hasRealRouteGeometry(initialRoutePreview) ? 'ready' : 'idle',
    );
    const [routePreviewError, setRoutePreviewError] = useState('');
    const originPoint = mapPointFromData(formData, 'origin');
    const destinationPoint = mapPointFromData(formData, 'destination');
    const hasMapPoints = Boolean(originPoint && destinationPoint);

    useEffect(() => {
        setRoutePreview(null);
        setRoutePreviewError('');

        if (!hasMapPoints) {
            setRoutePreviewState('idle');

            return;
        }

        let active = true;
        const timeoutId = window.setTimeout(async () => {
            setRoutePreviewState('loading');

            try {
                const response = await window.axios.post(
                    route('transporter.routes.preview'),
                    {
                        origin_lat: formData.origin_lat,
                        origin_lng: formData.origin_lng,
                        destination_lat: formData.destination_lat,
                        destination_lng: formData.destination_lng,
                    },
                );

                if (!active) {
                    return;
                }

                setRoutePreview(response.data);
                setRoutePreviewState('ready');
            } catch (error) {
                if (!active) {
                    return;
                }

                const errors = error.response?.data?.errors;
                setRoutePreviewError(
                    errors?.origin_lat?.[0] ||
                        errors?.destination_lat?.[0] ||
                        error.response?.data?.message ||
                        'No se pudo calcular el trayecto real por carretera.',
                );
                setRoutePreviewState('error');
            }
        }, 500);

        return () => {
            active = false;
            window.clearTimeout(timeoutId);
        };
    }, [
        formData.destination_lat,
        formData.destination_lng,
        formData.origin_lat,
        formData.origin_lng,
        hasMapPoints,
    ]);

    return {
        destinationPoint,
        hasMapPoints,
        originPoint,
        routePreview,
        routePreviewError,
        routePreviewState,
    };
}

function cardClassName(extra = '') {
    return `animate-panel-rise min-w-0 max-w-full rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-6 ${extra}`.trim();
}

function StatusBadge({ status }) {
    const styles = {
        accepted: 'bg-emerald-100 text-emerald-700',
        approved: 'bg-emerald-100 text-emerald-700',
        available: 'bg-emerald-100 text-emerald-700',
        confirmed: 'bg-emerald-100 text-emerald-700',
        completed: 'bg-slate-900 text-white',
        departure_due: 'bg-orange-100 text-orange-700',
        in_progress: 'bg-sky-100 text-sky-700',
        pending: 'bg-amber-100 text-amber-700',
        published: 'bg-emerald-100 text-emerald-700',
        starting_soon: 'bg-amber-100 text-amber-700',
        rejected: 'bg-rose-100 text-rose-700',
        cancelled: 'bg-rose-100 text-rose-700',
        closed: 'bg-slate-200 text-slate-700',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles[status] ?? 'bg-slate-100 text-slate-700'}`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}

function FieldError({ message }) {
    if (!message) {
        return null;
    }

    return <p className="mt-2 break-words text-sm text-rose-600">{message}</p>;
}

function SectionTitle({ eyebrow, title, description }) {
    return (
        <div className="min-w-0 max-w-full space-y-2">
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

function DepartureConfirmationPanel({
    mode,
    onStart,
    onAskLater,
    onCancelRoute,
    onWait,
    processing,
}) {
    return (
        <section className="mb-5 overflow-hidden rounded-2xl border-2 border-orange-300 bg-white shadow-[0_22px_52px_-30px_rgba(194,65,12,0.7)]">
            <div className="flex">
                <div className="w-2 shrink-0 bg-gradient-to-b from-orange-500 to-emerald-700" />
                <div className="flex flex-1 flex-col gap-4 bg-gradient-to-r from-orange-50 via-white to-emerald-50 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-orange-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm">
                            Hora de salir
                        </span>
                        <span className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            Confirmacion requerida
                        </span>
                    </div>
                    <p className="mt-3 text-xl font-bold text-slate-950">
                        Confirma el comienzo del trayecto.
                    </p>
                    <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-slate-700">
                        La ruta solo cambiara a En camino cuando confirmes la
                        salida.
                    </p>
                </div>

                <div className="w-full lg:w-auto">
                    {mode === 'delay' ? (
                        <div className="mb-3 rounded-2xl border border-amber-200 bg-white/80 px-4 py-3 text-sm leading-6 text-amber-900">
                            Deseas cancelar la ruta o esperar un poco mas?
                        </div>
                    ) : null}

                    {mode === 'delay' ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
                            <button
                                type="button"
                                onClick={onWait}
                                disabled={processing}
                                className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                Esperar un poco mas
                            </button>
                            <button
                                type="button"
                                onClick={onCancelRoute}
                                disabled={processing}
                                className="inline-flex justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
                            >
                                Cancelar ruta
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
                            <button
                                type="button"
                                onClick={onStart}
                                disabled={processing}
                                className="inline-flex justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_26px_-18px_rgba(21,128,61,0.8)] transition hover:bg-emerald-600 disabled:opacity-60"
                            >
                                Si, iniciar ruta
                            </button>
                            <button
                                type="button"
                                onClick={onAskLater}
                                disabled={processing}
                                className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                No, revisar opciones
                            </button>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </section>
    );
}

function RouteConflictFloatingCard({
    conflict,
    onCancelPreviousRoute,
    onChooseAnotherVehicle,
    onClose,
    processing,
}) {
    if (!conflict) {
        return null;
    }

    const vehicleLabel = [
        conflict.vehicle?.vehicle_type,
        conflict.vehicle?.plate,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="fixed inset-x-3 bottom-4 z-[950] mx-auto max-w-xl sm:inset-x-auto sm:right-5">
            <section className="animate-panel-rise overflow-hidden rounded-[1.5rem] border border-amber-200 bg-white shadow-[0_24px_70px_-28px_rgba(15,23,42,0.75)]">
                <div className="bg-amber-50 px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Cruce de horario
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-950">
                                Ya tienes una ruta pendiente en este intervalo
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-amber-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-amber-100"
                        >
                            Cerrar
                        </button>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-amber-900">
                        Con el vehiculo {vehicleLabel || 'seleccionado'} ya hay
                        una ruta publicada en otro lugar. Cancela la ruta
                        anterior o selecciona otro vehiculo para publicarla.
                    </p>
                </div>

                <div className="space-y-4 px-5 py-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={conflict.status} />
                            <span className="text-sm font-semibold text-slate-800">
                                {vehicleLabel || 'Vehiculo seleccionado'}
                            </span>
                        </div>
                        <p className="mt-3 text-base font-semibold text-slate-950">
                            {conflict.origin} {'->'} {conflict.destination}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                            Salida: {formatDate(conflict.departure_at)}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                            Tiempo estimado:{' '}
                            {formatDuration(conflict.estimated_duration_minutes)}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={onCancelPreviousRoute}
                            disabled={processing}
                            className="inline-flex justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
                        >
                            Cancelar ruta anterior
                        </button>
                        <button
                            type="button"
                            onClick={onChooseAnotherVehicle}
                            disabled={processing}
                            className="inline-flex justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                        >
                            Elegir otro vehiculo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function LocationSelector({
    error,
    idPrefix,
    label,
    selectedDepartmentCode,
    selectedMunicipalityCode,
    onDepartmentChange,
    onMunicipalityChange,
}) {
    const selectedDepartment = findDepartment(selectedDepartmentCode);
    const municipalities = selectedDepartment?.municipalities ?? [];

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor={`${idPrefix}_department`}
                        className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                    >
                        Departamento
                    </label>
                    <select
                        id={`${idPrefix}_department`}
                        value={selectedDepartmentCode}
                        onChange={(event) => onDepartmentChange(event.target.value)}
                        className="mt-2 block w-full rounded-2xl border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    >
                        <option value="">Selecciona departamento</option>
                        {colombiaPlaces.map((department) => (
                            <option key={department.code} value={department.code}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor={`${idPrefix}_municipality`}
                        className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                    >
                        Ciudad o municipio
                    </label>
                    <select
                        id={`${idPrefix}_municipality`}
                        value={selectedMunicipalityCode}
                        onChange={(event) => onMunicipalityChange(event.target.value)}
                        disabled={!selectedDepartmentCode}
                        className="mt-2 block w-full rounded-2xl border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:text-sm"
                    >
                        <option value="">
                            {selectedDepartmentCode
                                ? 'Selecciona ciudad o municipio'
                                : 'Primero elige departamento'}
                        </option>
                        {municipalities.map((municipality) => (
                            <option key={municipality.code} value={municipality.code}>
                                {municipality.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <FieldError message={error} />
        </div>
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
                        Producto: {service.request?.product_type} · Peso:{' '}
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
                            Vehiculo: {service.route.vehicle.vehicle_type} ·{' '}
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
                    <p className="mt-1">
                        {service.counterpart?.role === 'transportista'
                            ? 'Transportista asignado'
                            : 'Productor asignado'}
                    </p>
                    <p className="mt-3 text-base font-semibold text-slate-900">
                        {service.counterpart?.phone}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Visible solo para las partes involucradas en este
                        servicio confirmado.
                    </p>
                    <ContactActions service={service} />
                </div>
            </div>
        </article>
    );
}

function PublishRouteForm({ vehicles, transporterProfile }) {
    const { routeConflict } = usePage().props;
    const approvedVehicles = vehicles.filter(
        (vehicle) => vehicle.status === 'available',
    );
    const routeForm = useForm({
        vehicle_id: approvedVehicles[0]?.id ?? '',
        origin: '',
        origin_lat: '',
        origin_lng: '',
        destination: '',
        destination_lat: '',
        destination_lng: '',
        departure_at: '',
        min_cargo_weight_kg: '',
        available_capacity_kg: '',
    });
    const conflictActionForm = useForm({});
    const vehicleSelectRef = useRef(null);

    const [selectionMode, setSelectionMode] = useState('origin');
    const [hideRouteConflict, setHideRouteConflict] = useState(false);
    const [originDepartmentCode, setOriginDepartmentCode] = useState('');
    const [originMunicipalityCode, setOriginMunicipalityCode] = useState('');
    const [destinationDepartmentCode, setDestinationDepartmentCode] =
        useState('');
    const [destinationMunicipalityCode, setDestinationMunicipalityCode] =
        useState('');
    const {
        destinationPoint,
        originPoint,
        routePreview,
        routePreviewError,
        routePreviewState,
    } = useRealRoutePreview(routeForm.data);

    const selectPlace = (prefix, departmentCode, municipalityCode) => {
        const department = findDepartment(departmentCode);
        const municipality = findMunicipality(departmentCode, municipalityCode);

        if (!department || !municipality) {
            routeForm.setData({
                ...routeForm.data,
                [prefix]: '',
                [`${prefix}_lat`]: '',
                [`${prefix}_lng`]: '',
            });

            return;
        }

        routeForm.setData({
            ...routeForm.data,
            [prefix]: formatPlaceLabel(department, municipality),
            [`${prefix}_lat`]: municipality.lat,
            [`${prefix}_lng`]: municipality.lng,
        });
    };

    const selectedVehicle = vehicles.find(
        (vehicle) => String(vehicle.id) === String(routeForm.data.vehicle_id),
    );
    const canCreateRoutes = transporterProfile?.validation_status === 'approved';
    const canSubmitRoute =
        canCreateRoutes &&
        approvedVehicles.length > 0 &&
        routeForm.data.vehicle_id &&
        routeForm.data.origin.trim() &&
        routeForm.data.destination.trim() &&
        routeForm.data.departure_at &&
        Number(routeForm.data.min_cargo_weight_kg) > 0 &&
        Number(routeForm.data.available_capacity_kg) > 0 &&
        Number(routeForm.data.min_cargo_weight_kg) <=
            Number(routeForm.data.available_capacity_kg) &&
        (!selectedVehicle ||
            Number(routeForm.data.available_capacity_kg) <=
                Number(selectedVehicle.capacity_kg)) &&
        routePreviewState === 'ready' &&
        hasRealRouteGeometry(routePreview);
    const visibleRouteConflict =
        routeConflict && !hideRouteConflict ? routeConflict : null;

    useEffect(() => {
        if (routeConflict) {
            setHideRouteConflict(false);
        }
    }, [routeConflict]);

    const chooseAnotherVehicle = () => {
        const alternativeVehicle = approvedVehicles.find(
            (vehicle) =>
                String(vehicle.id) !==
                String(visibleRouteConflict?.vehicle?.id ?? ''),
        );

        if (alternativeVehicle) {
            routeForm.setData('vehicle_id', alternativeVehicle.id);
            routeForm.clearErrors('vehicle_id');
        }

        setHideRouteConflict(true);
        vehicleSelectRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
        vehicleSelectRef.current?.focus();
    };

    return (
        <article className={cardClassName()}>
            <RouteConflictFloatingCard
                conflict={visibleRouteConflict}
                processing={conflictActionForm.processing}
                onCancelPreviousRoute={() => {
                    if (!visibleRouteConflict) {
                        return;
                    }

                    conflictActionForm.patch(
                        route(
                            'transporter.routes.cancel',
                            visibleRouteConflict.id,
                        ),
                        {},
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                routeForm.clearErrors('vehicle_id');
                                setHideRouteConflict(true);
                            },
                        },
                    );
                }}
                onChooseAnotherVehicle={chooseAnotherVehicle}
                onClose={() => setHideRouteConflict(true)}
            />

            <SectionTitle
                eyebrow="Rutas"
                title="Publicar ruta de retorno"
                description="Registra origen, destino, fecha y rango de peso disponible para ofrecer espacio de carga a productores."
            />

            {!canCreateRoutes ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Tu perfil aun no esta aprobado. Puedes registrar vehiculos,
                    pero no publicar rutas.
                </div>
            ) : null}

            {!approvedVehicles.length ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Necesitas al menos un vehiculo aprobado por administracion
                    para publicar rutas.
                </div>
            ) : null}

            <form
                className="mt-6 space-y-4"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    routeForm.post(route('transporter.routes.store'), {
                        preserveScroll: true,
                        onSuccess: () => {
                            alert('Ruta publicada correctamente');
                            setOriginDepartmentCode('');
                            setOriginMunicipalityCode('');
                            setDestinationDepartmentCode('');
                            setDestinationMunicipalityCode('');

                            routeForm.reset(
                                'origin',
                                'origin_lat',
                                'origin_lng',
                                'destination',
                                'destination_lat',
                                'destination_lng',
                                'departure_at',
                                'min_cargo_weight_kg',
                                'available_capacity_kg',
                            );
                        },
                        onError: () => {
                            setHideRouteConflict(false);
                        },
                    });
                }}
            >
                <div>
                    <label
                        htmlFor="vehicle_id"
                        className="text-sm font-medium text-slate-700"
                    >
                        Vehiculo
                    </label>
                    <select
                        id="vehicle_id"
                        ref={vehicleSelectRef}
                        required
                        value={routeForm.data.vehicle_id}
                        onChange={(event) =>
                            routeForm.setData('vehicle_id', event.target.value)
                        }
                        className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    >
                        <option value="">Selecciona un vehiculo</option>
                        {approvedVehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.plate} - {vehicle.vehicle_type} -{' '}
                                {vehicle.capacity_kg} kg
                            </option>
                        ))}
                    </select>
                    {selectedVehicle ? (
                        <p className="mt-2 text-xs text-slate-500">
                            Capacidad maxima del vehiculo:{' '}
                            {selectedVehicle.capacity_kg} kg
                        </p>
                    ) : null}
                    <FieldError message={routeForm.errors.vehicle_id} />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <LocationSelector
                        idPrefix="origin"
                        label="Origen"
                        selectedDepartmentCode={originDepartmentCode}
                        selectedMunicipalityCode={originMunicipalityCode}
                        error={routeForm.errors.origin}
                        onDepartmentChange={(departmentCode) => {
                            setOriginDepartmentCode(departmentCode);
                            setOriginMunicipalityCode('');
                            routeForm.setData({
                                ...routeForm.data,
                                origin: '',
                                origin_lat: '',
                                origin_lng: '',
                            });
                        }}
                        onMunicipalityChange={(municipalityCode) => {
                            setOriginMunicipalityCode(municipalityCode);
                            selectPlace(
                                'origin',
                                originDepartmentCode,
                                municipalityCode,
                            );
                        }}
                    />

                    <LocationSelector
                        idPrefix="destination"
                        label="Destino"
                        selectedDepartmentCode={destinationDepartmentCode}
                        selectedMunicipalityCode={destinationMunicipalityCode}
                        error={routeForm.errors.destination}
                        onDepartmentChange={(departmentCode) => {
                            setDestinationDepartmentCode(departmentCode);
                            setDestinationMunicipalityCode('');
                            routeForm.setData({
                                ...routeForm.data,
                                destination: '',
                                destination_lat: '',
                                destination_lng: '',
                            });
                        }}
                        onMunicipalityChange={(municipalityCode) => {
                            setDestinationMunicipalityCode(municipalityCode);
                            selectPlace(
                                'destination',
                                destinationDepartmentCode,
                                municipalityCode,
                            );
                        }}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                        <label
                            htmlFor="departure_at"
                            className="text-sm font-medium text-slate-700"
                        >
                            Fecha y hora de salida
                        </label>
                        <input
                            id="departure_at"
                            type="datetime-local"
                            required
                            value={routeForm.data.departure_at}
                            onChange={(event) =>
                                routeForm.setData(
                                    'departure_at',
                                    event.target.value,
                                )
                            }
                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        />
                        <FieldError message={routeForm.errors.departure_at} />
                    </div>

                    <div>
                        <label
                            htmlFor="min_cargo_weight_kg"
                            className="text-sm font-medium text-slate-700"
                        >
                            Peso minimo a llevar
                        </label>
                        <input
                            id="min_cargo_weight_kg"
                            type="number"
                            required
                            inputMode="decimal"
                            min="1"
                            max={routeForm.data.available_capacity_kg || selectedVehicle?.capacity_kg}
                            step="0.01"
                            value={routeForm.data.min_cargo_weight_kg}
                            onChange={(event) =>
                                routeForm.setData(
                                    'min_cargo_weight_kg',
                                    event.target.value,
                                )
                            }
                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            placeholder="Ej. 300"
                        />
                        <FieldError
                            message={routeForm.errors.min_cargo_weight_kg}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="available_capacity_kg"
                            className="text-sm font-medium text-slate-700"
                        >
                            Peso maximo disponible
                        </label>
                        <input
                            id="available_capacity_kg"
                            type="number"
                            required
                            inputMode="decimal"
                            min="1"
                            max={selectedVehicle?.capacity_kg}
                            step="0.01"
                            value={routeForm.data.available_capacity_kg}
                            onChange={(event) =>
                                routeForm.setData(
                                    'available_capacity_kg',
                                    event.target.value,
                                )
                            }
                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            placeholder="Ej. 1500"
                        />
                        <FieldError
                            message={routeForm.errors.available_capacity_kg}
                        />
                    </div>
                </div>
                
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Ubicación en mapa
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                                Selecciona primero el punto de salida y luego el punto de llegada.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectionMode('origin')}
                                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                    selectionMode === 'origin'
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-white text-slate-700'
                                }`}
                            >
                                Marcar salida
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectionMode('destination')}
                                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                    selectionMode === 'destination'
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-white text-slate-700'
                                }`}
                            >
                                Marcar llegada
                            </button>
                        </div>
                    </div>

                    <RouteMap
                        selectable
                        selectionMode={selectionMode}
                        originPoint={originPoint}
                        destinationPoint={destinationPoint}
                        draftRoute={buildDraftRoute(routeForm.data, routePreview)}
                        onSelectPoint={(point) => {
                            if (point.type === 'origin') {
                                routeForm.setData({
                                    ...routeForm.data,
                                    origin_lat: point.lat,
                                    origin_lng: point.lng,
                                });
                                setSelectionMode('destination');
                            }

                            if (point.type === 'destination') {
                                routeForm.setData({
                                    ...routeForm.data,
                                    destination_lat: point.lat,
                                    destination_lng: point.lng,
                                });
                            }
                        }}
                    />

                    <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white px-4 py-3">
                            <strong>Salida:</strong>{' '}
                            {routeForm.data.origin_lat && routeForm.data.origin_lng
                                ? `${routeForm.data.origin_lat}, ${routeForm.data.origin_lng}`
                                : 'Sin seleccionar'}
                        </div>

                        <div className="rounded-2xl bg-white px-4 py-3">
                            <strong>Llegada:</strong>{' '}
                            {routeForm.data.destination_lat && routeForm.data.destination_lng
                                ? `${routeForm.data.destination_lat}, ${routeForm.data.destination_lng}`
                                : 'Sin seleccionar'}
                        </div>
                    </div>

                    <FieldError message={routeForm.errors.origin_lat} />
                    <FieldError message={routeForm.errors.destination_lat} />

                    <div
                        className={`mt-3 rounded-2xl px-4 py-3 text-sm ${
                            routePreviewState === 'ready'
                                ? 'bg-emerald-100 text-emerald-800'
                                : routePreviewState === 'error'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-white text-slate-600'
                        }`}
                    >
                        {routePreviewMessage(
                            routePreviewState,
                            routePreviewError,
                            routePreview,
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!canSubmitRoute || routeForm.processing}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    {routeForm.processing ? 'Publicando...' : 'Publicar ruta'}
                </button>
            </form>
        </article>
    );
}

function EditRouteForm({ transportRoute, vehicles, onCancel, onSuccess }) {
    const currentVehicleId = transportRoute.vehicle?.id ?? '';
    const baseVehicleOptions = vehicles.filter(
        (vehicle) =>
            vehicle.status === 'available' ||
            String(vehicle.id) === String(currentVehicleId),
    );
    const hasCurrentVehicle = baseVehicleOptions.some(
        (vehicle) => String(vehicle.id) === String(currentVehicleId),
    );
    const vehicleOptions =
        transportRoute.vehicle?.id && !hasCurrentVehicle
            ? [
                  {
                      id: transportRoute.vehicle.id,
                      plate: transportRoute.vehicle.plate,
                      vehicle_type: transportRoute.vehicle.vehicle_type,
                      capacity_kg: transportRoute.vehicle.capacity_kg,
                      status: 'available',
                  },
                  ...baseVehicleOptions,
              ]
            : baseVehicleOptions;

    const editForm = useForm({
        vehicle_id: currentVehicleId,
        origin: transportRoute.origin ?? '',
        origin_lat: transportRoute.origin_lat ?? '',
        origin_lng: transportRoute.origin_lng ?? '',
        destination: transportRoute.destination ?? '',
        destination_lat: transportRoute.destination_lat ?? '',
        destination_lng: transportRoute.destination_lng ?? '',
        departure_at: toDateTimeLocal(transportRoute.departure_at),
        min_cargo_weight_kg: transportRoute.min_cargo_weight_kg ?? '',
        available_capacity_kg: transportRoute.available_capacity_kg ?? '',
    });
    const [selectionMode, setSelectionMode] = useState('origin');
    const initialOriginSelection = findPlaceSelection(
        transportRoute.origin,
        transportRoute.origin_lat,
        transportRoute.origin_lng,
    );
    const initialDestinationSelection = findPlaceSelection(
        transportRoute.destination,
        transportRoute.destination_lat,
        transportRoute.destination_lng,
    );
    const [originDepartmentCode, setOriginDepartmentCode] = useState(
        initialOriginSelection.departmentCode,
    );
    const [originMunicipalityCode, setOriginMunicipalityCode] = useState(
        initialOriginSelection.municipalityCode,
    );
    const [destinationDepartmentCode, setDestinationDepartmentCode] = useState(
        initialDestinationSelection.departmentCode,
    );
    const [destinationMunicipalityCode, setDestinationMunicipalityCode] =
        useState(initialDestinationSelection.municipalityCode);
    const initialRoutePreview = hasRealRouteGeometry(transportRoute)
        ? {
              distance_km: transportRoute.distance_km,
              estimated_duration_minutes:
                  transportRoute.estimated_duration_minutes,
              route_geometry: transportRoute.route_geometry,
          }
        : null;
    const {
        destinationPoint,
        originPoint,
        routePreview,
        routePreviewError,
        routePreviewState,
    } = useRealRoutePreview(editForm.data, initialRoutePreview);

    const selectedVehicle = vehicleOptions.find(
        (vehicle) => String(vehicle.id) === String(editForm.data.vehicle_id),
    );
    const selectPlace = (prefix, departmentCode, municipalityCode) => {
        const department = findDepartment(departmentCode);
        const municipality = findMunicipality(departmentCode, municipalityCode);

        if (!department || !municipality) {
            editForm.setData({
                ...editForm.data,
                [prefix]: '',
                [`${prefix}_lat`]: '',
                [`${prefix}_lng`]: '',
            });

            return;
        }

        editForm.setData({
            ...editForm.data,
            [prefix]: formatPlaceLabel(department, municipality),
            [`${prefix}_lat`]: municipality.lat,
            [`${prefix}_lng`]: municipality.lng,
        });
    };
    const canSubmit =
        editForm.data.vehicle_id &&
        editForm.data.origin.trim() &&
        editForm.data.destination.trim() &&
        editForm.data.departure_at &&
        Number(editForm.data.min_cargo_weight_kg) > 0 &&
        Number(editForm.data.available_capacity_kg) > 0 &&
        Number(editForm.data.min_cargo_weight_kg) <=
            Number(editForm.data.available_capacity_kg) &&
        (!selectedVehicle ||
            Number(editForm.data.available_capacity_kg) <=
                Number(selectedVehicle.capacity_kg)) &&
        routePreviewState === 'ready' &&
        hasRealRouteGeometry(routePreview);

    return (
        <form
            className="mt-5 space-y-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
            noValidate
            onSubmit={(event) => {
                event.preventDefault();

                editForm.patch(
                    route('transporter.routes.update', transportRoute.id),
                    {
                        preserveScroll: true,
                        onSuccess,
                    },
                );
            }}
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                        Editar ruta
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Actualiza origen, destino, fecha y rango de peso disponible.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Cancelar
                </button>
            </div>

            <div>
                <label
                    htmlFor={`edit_vehicle_id_${transportRoute.id}`}
                    className="text-sm font-medium text-slate-700"
                >
                    Vehiculo
                </label>
                <select
                    id={`edit_vehicle_id_${transportRoute.id}`}
                    required
                    value={editForm.data.vehicle_id}
                    onChange={(event) =>
                        editForm.setData('vehicle_id', event.target.value)
                    }
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                >
                    <option value="">Selecciona un vehiculo</option>
                    {vehicleOptions.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.plate} - {vehicle.vehicle_type} -{' '}
                            {vehicle.capacity_kg} kg
                        </option>
                    ))}
                </select>
                {selectedVehicle ? (
                    <p className="mt-2 text-xs text-slate-500">
                        Capacidad maxima del vehiculo:{' '}
                        {selectedVehicle.capacity_kg} kg
                    </p>
                ) : null}
                <FieldError message={editForm.errors.vehicle_id} />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <LocationSelector
                    idPrefix={`edit_origin_${transportRoute.id}`}
                    label="Origen"
                    selectedDepartmentCode={originDepartmentCode}
                    selectedMunicipalityCode={originMunicipalityCode}
                    error={editForm.errors.origin}
                    onDepartmentChange={(departmentCode) => {
                        setOriginDepartmentCode(departmentCode);
                        setOriginMunicipalityCode('');
                        editForm.setData({
                            ...editForm.data,
                            origin: '',
                            origin_lat: '',
                            origin_lng: '',
                        });
                    }}
                    onMunicipalityChange={(municipalityCode) => {
                        setOriginMunicipalityCode(municipalityCode);
                        selectPlace(
                            'origin',
                            originDepartmentCode,
                            municipalityCode,
                        );
                    }}
                />

                <LocationSelector
                    idPrefix={`edit_destination_${transportRoute.id}`}
                    label="Destino"
                    selectedDepartmentCode={destinationDepartmentCode}
                    selectedMunicipalityCode={destinationMunicipalityCode}
                    error={editForm.errors.destination}
                    onDepartmentChange={(departmentCode) => {
                        setDestinationDepartmentCode(departmentCode);
                        setDestinationMunicipalityCode('');
                        editForm.setData({
                            ...editForm.data,
                            destination: '',
                            destination_lat: '',
                            destination_lng: '',
                        });
                    }}
                    onMunicipalityChange={(municipalityCode) => {
                        setDestinationMunicipalityCode(municipalityCode);
                        selectPlace(
                            'destination',
                            destinationDepartmentCode,
                            municipalityCode,
                        );
                    }}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <label
                        htmlFor={`edit_departure_at_${transportRoute.id}`}
                        className="text-sm font-medium text-slate-700"
                    >
                        Fecha y hora de salida
                    </label>
                    <input
                        id={`edit_departure_at_${transportRoute.id}`}
                        type="datetime-local"
                        required
                        value={editForm.data.departure_at}
                        onChange={(event) =>
                            editForm.setData('departure_at', event.target.value)
                        }
                        className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    />
                    <FieldError message={editForm.errors.departure_at} />
                </div>

                <div>
                    <label
                        htmlFor={`edit_min_cargo_weight_${transportRoute.id}`}
                        className="text-sm font-medium text-slate-700"
                    >
                        Peso minimo a llevar
                    </label>
                    <input
                        id={`edit_min_cargo_weight_${transportRoute.id}`}
                        type="number"
                        required
                        inputMode="decimal"
                        min="1"
                        max={
                            editForm.data.available_capacity_kg ||
                            selectedVehicle?.capacity_kg
                        }
                        step="0.01"
                        value={editForm.data.min_cargo_weight_kg}
                        onChange={(event) =>
                            editForm.setData(
                                'min_cargo_weight_kg',
                                event.target.value,
                            )
                        }
                        className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    />
                    <FieldError message={editForm.errors.min_cargo_weight_kg} />
                </div>

                <div>
                    <label
                        htmlFor={`edit_available_capacity_${transportRoute.id}`}
                        className="text-sm font-medium text-slate-700"
                    >
                        Peso maximo disponible
                    </label>
                    <input
                        id={`edit_available_capacity_${transportRoute.id}`}
                        type="number"
                        required
                        inputMode="decimal"
                        min="1"
                        max={selectedVehicle?.capacity_kg}
                        step="0.01"
                        value={editForm.data.available_capacity_kg}
                        onChange={(event) =>
                            editForm.setData(
                                'available_capacity_kg',
                                event.target.value,
                            )
                        }
                        className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    />
                    <FieldError message={editForm.errors.available_capacity_kg} />
                </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Puntos de mapa
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                            Puedes conservar los puntos actuales o marcarlos de nuevo.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectionMode('origin')}
                            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                selectionMode === 'origin'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-white text-slate-700'
                            }`}
                        >
                            Marcar salida
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectionMode('destination')}
                            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                selectionMode === 'destination'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-white text-slate-700'
                            }`}
                        >
                            Marcar llegada
                        </button>
                    </div>
                </div>

                <RouteMap
                    selectable
                    selectionMode={selectionMode}
                    originPoint={originPoint}
                    destinationPoint={destinationPoint}
                    draftRoute={buildDraftRoute(editForm.data, routePreview)}
                    height="300px"
                    onSelectPoint={(point) => {
                        if (point.type === 'origin') {
                            editForm.setData({
                                ...editForm.data,
                                origin_lat: point.lat,
                                origin_lng: point.lng,
                            });
                            setSelectionMode('destination');
                        }

                        if (point.type === 'destination') {
                            editForm.setData({
                                ...editForm.data,
                                destination_lat: point.lat,
                                destination_lng: point.lng,
                            });
                        }
                    }}
                />

                <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white px-4 py-3">
                        <strong>Salida:</strong>{' '}
                        {originPoint
                            ? `${editForm.data.origin_lat}, ${editForm.data.origin_lng}`
                            : 'Sin seleccionar'}
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3">
                        <strong>Llegada:</strong>{' '}
                        {destinationPoint
                            ? `${editForm.data.destination_lat}, ${editForm.data.destination_lng}`
                            : 'Sin seleccionar'}
                    </div>
                </div>

                <FieldError message={editForm.errors.origin_lat} />
                <FieldError message={editForm.errors.destination_lat} />

                <div
                    className={`mt-3 rounded-2xl px-4 py-3 text-sm ${
                        routePreviewState === 'ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : routePreviewState === 'error'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-white text-slate-600'
                    }`}
                >
                    {routePreviewMessage(
                        routePreviewState,
                        routePreviewError,
                        routePreview,
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="submit"
                    disabled={!canSubmit || editForm.processing}
                    className="inline-flex justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {editForm.processing ? 'Guardando...' : 'Guardar cambios'}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Cerrar edicion
                </button>
            </div>
        </form>
    );
}

function TransporterView({
    transporterProfile,
    vehicles,
    myRoutes,
}) {
    const routeLifecycleForm = useForm({});
    const [editingRouteId, setEditingRouteId] = useState(null);
    const [dismissedDepartureRouteIds, setDismissedDepartureRouteIds] =
        useState([]);
    const [departurePromptMode, setDeparturePromptMode] = useState('confirm');
    const [showPublishForm, setShowPublishForm] = useState(false);
    const [routeStatusFilter, setRouteStatusFilter] = useState('all');
    const activeMapRoutes = myRoutes.filter(
        (transportRoute) =>
            transportRoute.stored_status !== 'cancelled' &&
            transportRoute.origin_lat &&
            transportRoute.origin_lng &&
            transportRoute.destination_lat &&
            transportRoute.destination_lng,
    );
    const routeFilterOptions = [
        {
            key: 'all',
            label: 'Todas',
            matches: () => true,
        },
        {
            key: 'published',
            label: 'Publicadas',
            matches: (transportRoute) =>
                transportRoute.stored_status === 'published' &&
                !['starting_soon', 'departure_due'].includes(
                    transportRoute.status,
                ),
        },
        {
            key: 'starting_soon',
            label: 'Arrancan pronto',
            matches: (transportRoute) =>
                transportRoute.status === 'starting_soon',
        },
        {
            key: 'departure_due',
            label: 'Hora de salir',
            matches: (transportRoute) =>
                transportRoute.status === 'departure_due',
        },
        {
            key: 'in_progress',
            label: 'En camino',
            matches: (transportRoute) =>
                transportRoute.stored_status === 'in_progress',
        },
        {
            key: 'completed',
            label: 'Completadas',
            matches: (transportRoute) =>
                transportRoute.stored_status === 'completed',
        },
        {
            key: 'cancelled',
            label: 'Canceladas',
            matches: (transportRoute) =>
                transportRoute.stored_status === 'cancelled',
        },
    ];
    const selectedRouteFilter =
        routeFilterOptions.find((option) => option.key === routeStatusFilter) ??
        routeFilterOptions[0];
    const filteredRoutes = myRoutes.filter((transportRoute) =>
        selectedRouteFilter.matches(transportRoute),
    );
    const routeSummaryCards = [
        {
            label: 'Publicadas',
            value: myRoutes.filter(
                (transportRoute) => transportRoute.stored_status === 'published',
            ).length,
            tone: 'emerald',
        },
        {
            label: 'En camino',
            value: myRoutes.filter(
                (transportRoute) =>
                    transportRoute.stored_status === 'in_progress',
            ).length,
            tone: 'sky',
        },
        {
            label: 'Completadas',
            value: myRoutes.filter(
                (transportRoute) => transportRoute.stored_status === 'completed',
            ).length,
            tone: 'slate',
        },
        {
            label: 'Canceladas',
            value: myRoutes.filter(
                (transportRoute) => transportRoute.stored_status === 'cancelled',
            ).length,
            tone: 'rose',
        },
    ];

    const dismissDeparturePrompt = (routeId) => {
        const nextIds = [...new Set([...dismissedDepartureRouteIds, routeId])];

        setDismissedDepartureRouteIds(nextIds);
        setDeparturePromptMode('confirm');
    };

    const deleteRoute = (transportRoute) => {
        if (
            !window.confirm(
                `Eliminar definitivamente la ruta ${transportRoute.origin} -> ${transportRoute.destination}?`,
            )
        ) {
            return;
        }

        router.delete(route('transporter.routes.destroy', transportRoute.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (editingRouteId === transportRoute.id) {
                    setEditingRouteId(null);
                }
            },
        });
    };

    const completeRoute = (transportRoute) => {
        if (
            !window.confirm(
                `Marcar como completa la ruta ${transportRoute.origin} -> ${transportRoute.destination}? Los productores ya no la veran como disponible.`,
            )
        ) {
            return;
        }

        router.patch(
            route('transporter.routes.complete', transportRoute.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (editingRouteId === transportRoute.id) {
                        setEditingRouteId(null);
                    }
                },
            },
        );
    };

    const startRoute = (transportRoute) => {
        routeLifecycleForm.patch(
            route('transporter.routes.start', transportRoute.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (editingRouteId === transportRoute.id) {
                        setEditingRouteId(null);
                    }
                },
            },
        );
    };

    const cancelRoute = (transportRoute) => {
        if (
            !window.confirm(
                `Cancelar la ruta ${transportRoute.origin} -> ${transportRoute.destination}? Los productores ya no la veran como disponible.`,
            )
        ) {
            return;
        }

        routeLifecycleForm.patch(
            route('transporter.routes.cancel', transportRoute.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (editingRouteId === transportRoute.id) {
                        setEditingRouteId(null);
                    }
                },
            },
        );
    };

    return (
        <>
            {false ? (
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
                                <article
                                    key={transportRequest.id}
                                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h4 className="text-lg font-semibold text-slate-900">
                                                    {transportRequest.route?.origin}{' '}
                                                    {'->'}{' '}
                                                    {
                                                        transportRequest.route
                                                            ?.destination
                                                    }
                                                </h4>
                                                <StatusBadge
                                                    status={
                                                        transportRequest.status
                                                    }
                                                />
                                            </div>
                                            <p className="mt-3 text-sm text-slate-600">
                                                Productor:{' '}
                                                {
                                                    transportRequest.producer
                                                        ?.name
                                                }
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Producto:{' '}
                                                {
                                                    transportRequest.product_type
                                                }{' '}
                                                · Peso:{' '}
                                                {
                                                    transportRequest.cargo_weight_kg
                                                }{' '}
                                                kg
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Entrega:{' '}
                                                {
                                                    transportRequest.delivery_destination
                                                }
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Solicitado el{' '}
                                                {formatDate(
                                                    transportRequest.requested_at,
                                                )}
                                            </p>
                                            {transportRequest.estimated_cost ? (
                                                <p className="mt-1 text-sm text-slate-600">
                                                    Valor estimado:{' '}
                                                    {formatCurrency(
                                                        transportRequest.estimated_cost,
                                                    )}
                                                </p>
                                            ) : null}
                                        </div>

                                        {transportRequest.status === 'pending' ? (
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        requestDecisionForm.post(
                                                            route(
                                                                'transporter.transport-requests.accept',
                                                                transportRequest.id,
                                                            ),
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                    disabled={
                                                        requestDecisionForm.processing
                                                    }
                                                    className="inline-flex rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                                                >
                                                    Aceptar y habilitar contacto
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        requestDecisionForm.post(
                                                            route(
                                                                'transporter.transport-requests.reject',
                                                                transportRequest.id,
                                                            ),
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                    disabled={
                                                        requestDecisionForm.processing
                                                    }
                                                    className="inline-flex rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </article>
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
                                <ServiceCard key={service.id} service={service} />
                            ))
                        ) : (
                            <EmptyState message="Aun no tienes servicios confirmados con contacto habilitado." />
                        )}
                    </div>
                </article>
            </section>
            ) : null}

            <section className={cardClassName('overflow-hidden')}>
                <SectionTitle
                    eyebrow="Mapa operativo"
                    title="Visualización de mis rutas"
                    description="Aquí puedes ver en el mapa las rutas de retorno que tienen puntos de salida y llegada registrados. Cada ruta usa un color distinto para identificarla mejor."
                />

                <div className="mt-6">
                    {activeMapRoutes.length ? (
                        <div className="space-y-4">
                            <RouteMap routes={activeMapRoutes} height="420px" />
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {activeMapRoutes.map((transportRoute, index) => (
                                    <div
                                        key={transportRoute.id}
                                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                                    >
                                        <span
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow"
                                            style={{
                                                backgroundColor:
                                                    routeColor(index),
                                            }}
                                        >
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">
                                                {transportRoute.origin} {'->'}{' '}
                                                {transportRoute.destination}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {formatDate(
                                                    transportRoute.departure_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyState message="Todavía no tienes rutas con puntos seleccionados en el mapa." />
                    )}
                </div>
            </section>

            <section className={cardClassName()}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <SectionTitle
                        eyebrow="Publicacion"
                        title="Publicar nueva ruta"
                        description="Despliega el formulario solo cuando necesites registrar un nuevo trayecto."
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowPublishForm((currentValue) => !currentValue)
                        }
                        className="inline-flex justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                        {showPublishForm
                            ? 'Ocultar formulario'
                            : 'Publicar nueva ruta'}
                    </button>
                </div>
            </section>

            {showPublishForm ? (
                <section>
                    <PublishRouteForm
                        vehicles={vehicles}
                        transporterProfile={transporterProfile}
                    />
                </section>
            ) : null}

            <section className={cardClassName()}>
                <SectionTitle
                    eyebrow="Persistencia"
                    title="Mis rutas registradas"
                    description="Consulta las rutas por estado para revisar rapidamente cuales estan publicadas, canceladas, en camino o completadas."
                />

                <div className="mt-6 overflow-x-auto">
                    <div className="inline-flex min-w-full gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                        {routeFilterOptions.map((option) => {
                            const count = myRoutes.filter((transportRoute) =>
                                option.matches(transportRoute),
                            ).length;
                            const isActive = routeStatusFilter === option.key;

                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() => setRouteStatusFilter(option.key)}
                                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                        isActive
                                            ? 'bg-emerald-700 text-white shadow-[0_12px_28px_-22px_rgba(21,128,61,0.75)]'
                                            : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                    }`}
                                >
                                    {option.label}
                                    <span
                                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                                            isActive
                                                ? 'bg-white/20 text-white'
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

                <div className="mt-6 grid gap-4">
                    {myRoutes.length ? (
                        filteredRoutes.length ? (
                        filteredRoutes.map((transportRoute) => {
                            const mapRouteIndex = activeMapRoutes.findIndex(
                                (mapRoute) => mapRoute.id === transportRoute.id,
                            );
                            const isShownInMap = mapRouteIndex >= 0;
                            const showDeparturePrompt =
                                transportRoute.status === 'departure_due' &&
                                !dismissedDepartureRouteIds.includes(
                                    transportRoute.id,
                                );

                            return (
                            <div key={transportRoute.id}>
                            <article
                                className="interactive-lift rounded-3xl border border-slate-200 bg-slate-50 p-5 transition"
                            >
                                {showDeparturePrompt ? (
                                    <DepartureConfirmationPanel
                                        mode={departurePromptMode}
                                        processing={routeLifecycleForm.processing}
                                        onStart={() =>
                                            startRoute(transportRoute)
                                        }
                                        onAskLater={() =>
                                            setDeparturePromptMode('delay')
                                        }
                                        onCancelRoute={() =>
                                            cancelRoute(transportRoute)
                                        }
                                        onWait={() =>
                                            dismissDeparturePrompt(
                                                transportRoute.id,
                                            )
                                        }
                                    />
                                ) : null}

                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow"
                                                style={{
                                                    backgroundColor: isShownInMap
                                                        ? routeColor(mapRouteIndex)
                                                        : '#94a3b8',
                                                }}
                                                title={
                                                    isShownInMap
                                                        ? `Ruta ${mapRouteIndex + 1} en el mapa`
                                                        : 'Esta ruta no se muestra en el mapa'
                                                }
                                            >
                                                {isShownInMap
                                                    ? mapRouteIndex + 1
                                                    : '-'}
                                            </span>
                                            <h4 className="text-lg font-semibold text-slate-900">
                                                {transportRoute.origin} {'->'}{' '}
                                                {transportRoute.destination}
                                            </h4>
                                            <StatusBadge
                                                status={transportRoute.status}
                                            />
                                        </div>
                                        <p className="mt-3 text-sm text-slate-600">
                                            Salida:{' '}
                                            {formatDate(
                                                transportRoute.departure_at,
                                            )}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Vehiculo:{' '}
                                            {
                                                transportRoute.vehicle
                                                    ?.vehicle_type
                                            }{' '}
                                            ·{' '}
                                            {transportRoute.vehicle?.plate}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Peso minimo:{' '}
                                            {
                                                transportRoute.min_cargo_weight_kg
                                            }{' '}
                                            kg · Peso maximo:{' '}
                                            {
                                                transportRoute.available_capacity_kg
                                            }{' '}
                                            kg
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Solicitudes:{' '}
                                            {
                                                transportRoute.transport_requests_count
                                            }
                                        </p>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                                    Tiempo aprox.
                                                </p>
                                                <p className="mt-1 text-xl font-semibold text-slate-900">
                                                    {formatDuration(
                                                        transportRoute.estimated_duration_minutes,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                    Distancia
                                                </p>
                                                <p className="mt-1 text-xl font-semibold text-slate-900">
                                                    {transportRoute.distance_km
                                                        ? `${transportRoute.distance_km} km`
                                                        : 'Pendiente'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                                        {transportRoute.status ===
                                        'departure_due' ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    startRoute(transportRoute)
                                                }
                                                disabled={
                                                    routeLifecycleForm.processing
                                                }
                                                className="inline-flex justify-center rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
                                            >
                                                Iniciar ruta
                                            </button>
                                        ) : null}

                                        {transportRoute.stored_status ===
                                        'in_progress' ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    completeRoute(
                                                        transportRoute,
                                                    )
                                                }
                                                className="inline-flex justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                                            >
                                                Ruta completa
                                            </button>
                                        ) : null}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingRouteId(
                                                    editingRouteId ===
                                                        transportRoute.id
                                                        ? null
                                                        : transportRoute.id,
                                                )
                                            }
                                            className="inline-flex justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                                        >
                                            {editingRouteId === transportRoute.id
                                                ? 'Ocultar'
                                                : 'Editar'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteRoute(transportRoute)
                                            }
                                            className="inline-flex justify-center rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                {editingRouteId === transportRoute.id ? (
                                    <EditRouteForm
                                        transportRoute={transportRoute}
                                        vehicles={vehicles}
                                        onCancel={() => setEditingRouteId(null)}
                                        onSuccess={() => setEditingRouteId(null)}
                                    />
                                ) : null}
                            </article>
                            </div>
                            );
                        })
                        ) : (
                            <EmptyState
                                message={`No hay rutas en la categoria ${selectedRouteFilter.label.toLowerCase()}.`}
                            />
                        )
                    ) : (
                        <EmptyState message="Aun no has publicado rutas." />
                    )}
                </div>
            </section>
        </>
    );
}

function TransporterRoutesExperience({ transporterProfile, vehicles, myRoutes }) {
    const routeLifecycleForm = useForm({});
    const [editingRouteId, setEditingRouteId] = useState(null);
    const [dismissedDepartureRouteIds, setDismissedDepartureRouteIds] =
        useState([]);
    const [departurePromptMode, setDeparturePromptMode] = useState('confirm');
    const [showPublishForm, setShowPublishForm] = useState(false);
    const [routeStatusFilter, setRouteStatusFilter] = useState('all');
    const activeMapRoutes = myRoutes.filter(
        (transportRoute) =>
            transportRoute.stored_status !== 'cancelled' &&
            transportRoute.origin_lat &&
            transportRoute.origin_lng &&
            transportRoute.destination_lat &&
            transportRoute.destination_lng,
    );
    const filterOptions = [
        { key: 'all', label: 'Todas', matches: () => true },
        {
            key: 'published',
            label: 'Publicadas',
            matches: (routeItem) =>
                routeItem.stored_status === 'published' &&
                !['starting_soon', 'departure_due'].includes(routeItem.status),
        },
        {
            key: 'departure_due',
            label: 'Hora de salir',
            matches: (routeItem) => routeItem.status === 'departure_due',
        },
        {
            key: 'in_progress',
            label: 'En camino',
            matches: (routeItem) => routeItem.stored_status === 'in_progress',
        },
        {
            key: 'completed',
            label: 'Completadas',
            matches: (routeItem) => routeItem.stored_status === 'completed',
        },
        {
            key: 'cancelled',
            label: 'Canceladas',
            matches: (routeItem) => routeItem.stored_status === 'cancelled',
        },
    ];
    const selectedFilter =
        filterOptions.find((option) => option.key === routeStatusFilter) ??
        filterOptions[0];
    const filteredRoutes = myRoutes.filter((routeItem) =>
        selectedFilter.matches(routeItem),
    );
    const closeEditing = (transportRoute) => {
        if (editingRouteId === transportRoute.id) {
            setEditingRouteId(null);
        }
    };

    const deleteRoute = (transportRoute) => {
        if (
            !window.confirm(
                `Eliminar definitivamente la ruta ${transportRoute.origin} -> ${transportRoute.destination}?`,
            )
        ) {
            return;
        }

        router.delete(route('transporter.routes.destroy', transportRoute.id), {
            preserveScroll: true,
            onSuccess: () => closeEditing(transportRoute),
        });
    };

    const completeRoute = (transportRoute) => {
        if (
            !window.confirm(
                `Marcar como completa la ruta ${transportRoute.origin} -> ${transportRoute.destination}? Los productores ya no la veran como disponible.`,
            )
        ) {
            return;
        }

        router.patch(
            route('transporter.routes.complete', transportRoute.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => closeEditing(transportRoute),
            },
        );
    };

    const startRoute = (transportRoute) => {
        routeLifecycleForm.patch(
            route('transporter.routes.start', transportRoute.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => closeEditing(transportRoute),
            },
        );
    };

    const cancelRoute = (transportRoute) => {
        if (
            !window.confirm(
                `Cancelar la ruta ${transportRoute.origin} -> ${transportRoute.destination}? Los productores ya no la veran como disponible.`,
            )
        ) {
            return;
        }

        routeLifecycleForm.patch(
            route('transporter.routes.cancel', transportRoute.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => closeEditing(transportRoute),
            },
        );
    };

    const scrollToSection = (sectionId, options = {}) => {
        if (options.showPublishForm) {
            setShowPublishForm(true);
        }

        window.requestAnimationFrame(() => {
            document.getElementById(sectionId)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    };

    return (
        <>
            <section className="animate-panel-rise max-w-full overflow-hidden rounded-2xl border border-[#dfe8dc] bg-white shadow-[0_24px_70px_-52px_rgba(31,74,49,0.55)] sm:rounded-[1.75rem]">
                <div className="grid min-w-0 gap-5 px-4 py-5 sm:px-5 sm:py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center lg:px-7">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                            Gestion de rutas
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
                            Administra tus rutas
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            Publica rutas, consulta el mapa operativo y administra
                            el estado de cada trayecto registrado.
                        </p>
                    </div>

                    <div className="grid min-w-0 gap-3 sm:grid-cols-3">
                        {[
                            {
                                title: 'Nueva ruta',
                                body: 'Publica un nuevo trayecto',
                                action: () =>
                                    scrollToSection('publish-route-panel', {
                                        showPublishForm: true,
                                    }),
                            },
                            {
                                title: 'Ver mapa',
                                body: 'Visualiza rutas activas',
                                action: () => scrollToSection('route-map-panel'),
                            },
                            {
                                title: 'Filtrar rutas',
                                body: 'Organiza por estado',
                                action: () =>
                                    scrollToSection('route-filter-panel'),
                            },
                        ].map((actionItem) => (
                            <button
                                key={actionItem.title}
                                type="button"
                                onClick={actionItem.action}
                                className="interactive-lift group min-w-0 rounded-2xl border border-emerald-600 bg-emerald-700 px-4 py-3 text-left text-white shadow-[0_18px_34px_-28px_rgba(21,128,61,0.85)] transition hover:border-emerald-500 hover:bg-emerald-600 sm:py-4"
                            >
                                <p className="flex items-center justify-between gap-3 text-sm font-semibold">
                                    <span>{actionItem.title}</span>
                                    <span className="text-white/85 transition group-hover:translate-x-0.5">
                                        {'>'}
                                    </span>
                                </p>
                                <p className="mt-1 text-xs leading-5 text-white/78">
                                    {actionItem.body}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="publish-route-panel"
                className={cardClassName('scroll-mt-24 overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f2f8ef_100%)]')}
            >
                <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <SectionTitle
                        eyebrow="Publicacion"
                        title="Publicar nueva ruta"
                        description="Despliega el formulario solo cuando necesites registrar un nuevo trayecto."
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowPublishForm((currentValue) => !currentValue)
                        }
                        className="inline-flex w-full justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_-24px_rgba(21,128,61,0.85)] transition hover:bg-emerald-600 sm:w-auto"
                    >
                        {showPublishForm
                            ? 'Ocultar formulario'
                            : 'Publicar nueva ruta'}
                    </button>
                </div>
            </section>

            {showPublishForm ? (
                <section className="min-w-0 max-w-full scroll-mt-24 overflow-hidden">
                    <PublishRouteForm
                        vehicles={vehicles}
                        transporterProfile={transporterProfile}
                    />
                </section>
            ) : null}

            <section className="grid min-w-0 max-w-full gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
                <article
                    id="registered-routes-panel"
                    className={cardClassName('scroll-mt-24')}
                >
                    <SectionTitle
                        eyebrow="Registros"
                        title="Mis rutas registradas"
                        description="Consulta tus rutas por estado para revisar rapidamente su progreso."
                    />

                    <div
                        id="route-filter-panel"
                        className="mt-5 max-w-full scroll-mt-24 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-2 [scrollbar-width:thin]"
                    >
                        <div className="flex w-max gap-2 pr-1">
                            {filterOptions.map((option) => {
                                const count = myRoutes.filter((routeItem) =>
                                    option.matches(routeItem),
                                ).length;
                                const isActive = routeStatusFilter === option.key;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() =>
                                            setRouteStatusFilter(option.key)
                                        }
                                        className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                                            isActive
                                                ? 'bg-emerald-700 text-white shadow-[0_12px_28px_-22px_rgba(21,128,61,0.75)]'
                                                : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                        }`}
                                    >
                                        {option.label}
                                        <span
                                            className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                                                isActive
                                                    ? 'bg-white/20 text-white'
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

                    <div className="mt-5 grid max-h-[28rem] gap-3 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#15803d_#f1f5f9] [scrollbar-width:thin] sm:max-h-[34rem] xl:max-h-[42rem]">
                        {myRoutes.length ? (
                            filteredRoutes.length ? (
                                filteredRoutes.map((transportRoute) => {
                                    const mapRouteIndex = activeMapRoutes.findIndex(
                                        (mapRoute) =>
                                            mapRoute.id === transportRoute.id,
                                    );
                                    const isShownInMap = mapRouteIndex >= 0;
                                    const color = isShownInMap
                                        ? routeColor(mapRouteIndex)
                                        : '#94a3b8';
                                    const showDeparturePrompt =
                                        transportRoute.status === 'departure_due' &&
                                        !dismissedDepartureRouteIds.includes(
                                            transportRoute.id,
                                        );

                                    return (
                                        <article
                                            key={transportRoute.id}
                                            className="interactive-lift min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_16px_36px_-34px_rgba(15,23,42,0.65)] transition sm:p-4"
                                            style={{
                                                borderLeftColor: color,
                                                borderLeftWidth: 4,
                                            }}
                                        >
                                            {showDeparturePrompt ? (
                                                <DepartureConfirmationPanel
                                                    mode={departurePromptMode}
                                                    processing={
                                                        routeLifecycleForm.processing
                                                    }
                                                    onStart={() =>
                                                        startRoute(transportRoute)
                                                    }
                                                    onAskLater={() =>
                                                        setDeparturePromptMode(
                                                            'delay',
                                                        )
                                                    }
                                                    onCancelRoute={() =>
                                                        cancelRoute(transportRoute)
                                                    }
                                                    onWait={() => {
                                                        setDismissedDepartureRouteIds([
                                                            ...new Set([
                                                                ...dismissedDepartureRouteIds,
                                                                transportRoute.id,
                                                            ]),
                                                        ]);
                                                        setDeparturePromptMode(
                                                            'confirm',
                                                        );
                                                    }}
                                                />
                                            ) : null}

                                            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex min-w-0 flex-wrap items-center gap-3">
                                                        <span
                                                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow"
                                                            style={{
                                                                backgroundColor:
                                                                    color,
                                                            }}
                                                        >
                                                            {isShownInMap
                                                                ? mapRouteIndex + 1
                                                                : '-'}
                                                        </span>
                                                        <h4 className="min-w-0 max-w-full break-words text-sm font-semibold leading-snug text-slate-950 sm:text-base">
                                                            {transportRoute.origin}{' '}
                                                            {'->'}{' '}
                                                            {
                                                                transportRoute.destination
                                                            }
                                                        </h4>
                                                        <StatusBadge
                                                            status={
                                                                transportRoute.status
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mt-3 grid min-w-0 gap-2 text-xs text-slate-600 sm:grid-cols-2 sm:text-sm">
                                                        <p className="min-w-0 break-words">
                                                            Salida:{' '}
                                                            {formatDate(
                                                                transportRoute.departure_at,
                                                            )}
                                                        </p>
                                                        <p className="min-w-0 break-words">
                                                            Vehiculo:{' '}
                                                            {
                                                                transportRoute.vehicle
                                                                    ?.vehicle_type
                                                            }{' '}
                                                            -{' '}
                                                            {
                                                                transportRoute
                                                                    .vehicle
                                                                    ?.plate
                                                            }
                                                        </p>
                                                        <p className="min-w-0 break-words">
                                                            Peso maximo:{' '}
                                                            {
                                                                transportRoute.available_capacity_kg
                                                            }{' '}
                                                            kg
                                                        </p>
                                                        <p className="min-w-0 break-words">
                                                        Carga elegida por el productor
                                                    </p>
                                                    </div>

                                                    <div className="mt-4 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                                                        <div className="min-w-0 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3">
                                                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                                                Tiempo aprox.
                                                            </p>
                                                            <p className="mt-1 font-semibold text-slate-950">
                                                                {formatDuration(
                                                                    transportRoute.estimated_duration_minutes,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                                Distancia
                                                            </p>
                                                            <p className="mt-1 font-semibold text-slate-950">
                                                                {transportRoute.distance_km
                                                                    ? `${transportRoute.distance_km} km`
                                                                    : 'Pendiente'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                                                    {transportRoute.status ===
                                                    'departure_due' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startRoute(
                                                                    transportRoute,
                                                                )
                                                            }
                                                            disabled={
                                                                routeLifecycleForm.processing
                                                            }
                                                            className="inline-flex w-full justify-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60 sm:w-auto"
                                                        >
                                                            Iniciar ruta
                                                        </button>
                                                    ) : null}

                                                    {transportRoute.stored_status ===
                                                    'in_progress' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                completeRoute(
                                                                    transportRoute,
                                                                )
                                                            }
                                                            className="inline-flex w-full justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
                                                        >
                                                            Ruta completa
                                                        </button>
                                                    ) : null}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingRouteId(
                                                                editingRouteId ===
                                                                    transportRoute.id
                                                                    ? null
                                                                    : transportRoute.id,
                                                            )
                                                        }
                                                        className="inline-flex w-full justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 sm:w-auto"
                                                    >
                                                        {editingRouteId ===
                                                        transportRoute.id
                                                            ? 'Ocultar'
                                                            : 'Editar'}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteRoute(
                                                                transportRoute,
                                                            )
                                                        }
                                                        className="inline-flex w-full justify-center rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 sm:w-auto"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>

                                            {editingRouteId ===
                                            transportRoute.id ? (
                                                <EditRouteForm
                                                    transportRoute={transportRoute}
                                                    vehicles={vehicles}
                                                    onCancel={() =>
                                                        setEditingRouteId(null)
                                                    }
                                                    onSuccess={() =>
                                                        setEditingRouteId(null)
                                                    }
                                                />
                                            ) : null}
                                        </article>
                                    );
                                })
                            ) : (
                                <EmptyState
                                    message={`No hay rutas en la categoria ${selectedFilter.label.toLowerCase()}.`}
                                />
                            )
                        ) : (
                            <EmptyState message="Aun no has publicado rutas." />
                        )}
                    </div>
                </article>

                <article
                    id="route-map-panel"
                    className={cardClassName('scroll-mt-24 overflow-hidden')}
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <SectionTitle
                            eyebrow="Mapa operativo"
                            title="Mapa operativo"
                            description="Cada color representa una ruta visible en el mapa."
                        />
                        <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            {activeMapRoutes.length} rutas
                        </span>
                    </div>

                    <div className="mt-5">
                        {activeMapRoutes.length ? (
                            <div className="space-y-4">
                                <div className="max-w-full overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/50 p-2">
                                    <RouteMap
                                        routes={activeMapRoutes}
                                        height="clamp(300px, 62vh, 430px)"
                                    />
                                </div>
                                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                                    {activeMapRoutes.map(
                                        (transportRoute, index) => (
                                            <div
                                                key={transportRoute.id}
                                                className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-[0_12px_28px_-26px_rgba(15,23,42,0.55)]"
                                            >
                                                <span
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow"
                                                    style={{
                                                        backgroundColor:
                                                            routeColor(index),
                                                    }}
                                                >
                                                    {index + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                        {transportRoute.origin}{' '}
                                                        {'->'}{' '}
                                                        {
                                                            transportRoute.destination
                                                        }
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {formatDate(
                                                            transportRoute.departure_at,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        ) : (
                            <EmptyState message="Todavia no tienes rutas con puntos seleccionados en el mapa." />
                        )}
                    </div>
                </article>
            </section>

        </>
    );
}

function ProducerView({ availableRoutes, routeFilters = {} }) {
    const [searchFilters, setSearchFilters] = useState({
        origin: routeFilters.origin ?? '',
        destination: routeFilters.destination ?? '',
        cargo_weight_kg: routeFilters.cargo_weight_kg ?? '',
        product_type: routeFilters.product_type ?? '',
    });
    const hasActiveSearch =
        Boolean(routeFilters.origin) ||
        Boolean(routeFilters.destination) ||
        Boolean(routeFilters.cargo_weight_kg) ||
        Boolean(routeFilters.product_type);

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(
            route('producer.routes.index'),
            {
                origin: searchFilters.origin.trim() || undefined,
                destination: searchFilters.destination.trim() || undefined,
                cargo_weight_kg:
                    Number(searchFilters.cargo_weight_kg) > 0
                        ? searchFilters.cargo_weight_kg
                        : undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearSearch = () => {
        setSearchFilters({
            origin: '',
            destination: '',
            cargo_weight_kg: '',
        });

        router.get(
            route('producer.routes.index'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <section className={cardClassName()}>
                <SectionTitle
                    eyebrow="Busqueda"
                    title="Buscar rutas cercanas"
                    description="Filtra rutas activas por tu zona de salida y zona de llegada para encontrar transportistas disponibles para tu carga."
                />

                <form
                    className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr_0.8fr_auto]"
                    noValidate
                    onSubmit={submitSearch}
                >
                    <div>
                        <label
                            htmlFor="search_origin"
                            className="text-sm font-medium text-slate-700"
                        >
                            Zona de salida o interes
                        </label>
                        <input
                            id="search_origin"
                            value={searchFilters.origin}
                            onChange={(event) =>
                                setSearchFilters((current) => ({
                                    ...current,
                                    origin: event.target.value,
                                }))
                            }
                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            placeholder="Ej. Tunja"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="search_destination"
                            className="text-sm font-medium text-slate-700"
                        >
                            Zona de llegada o destino
                        </label>
                        <input
                            id="search_destination"
                            value={searchFilters.destination}
                            onChange={(event) =>
                                setSearchFilters((current) => ({
                                    ...current,
                                    destination: event.target.value,
                                }))
                            }
                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            placeholder="Ej. Bogota"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="search_cargo_weight"
                            className="text-sm font-medium text-slate-700"
                        >
                            Peso de carga
                        </label>
                        <input
                            id="search_cargo_weight"
                            type="number"
                            inputMode="decimal"
                            min="1"
                            step="0.01"
                            value={searchFilters.cargo_weight_kg}
                            onChange={(event) =>
                                setSearchFilters((current) => ({
                                    ...current,
                                    cargo_weight_kg: event.target.value,
                                }))
                            }
                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            placeholder="Ej. 800 kg"
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row xl:items-end">
                        <button
                            type="submit"
                            className="interactive-lift inline-flex justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                            Buscar rutas cercanas
                        </button>

                        {hasActiveSearch ? (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="interactive-lift inline-flex justify-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                            >
                                Limpiar
                            </button>
                        ) : null}
                    </div>
                </form>

                <p className="mt-4 text-sm text-slate-600">
                    {availableRoutes.length === 1
                        ? '1 ruta disponible encontrada.'
                        : `${availableRoutes.length} rutas disponibles encontradas.`}
                </p>
            </section>

            <section className={cardClassName()}>
                    <SectionTitle
                        eyebrow="Rutas disponibles"
                        title="Resultados de busqueda"
                        description="Revisa una vista previa de cada ruta cercana. Para enviar tu carga, abre el detalle de la ruta seleccionada."
                    />

                    <div className="mt-6 grid gap-4">
                        {availableRoutes.length ? (
                            availableRoutes.map((transportRoute) => (
                                <article
                                    key={transportRoute.id}
                                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                >
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h4 className="text-lg font-semibold text-slate-900">
                                            {transportRoute.origin} {'->'}{' '}
                                            {transportRoute.destination}
                                        </h4>
                                        <StatusBadge
                                            status={transportRoute.status}
                                        />
                                    </div>
                                    <p className="mt-3 text-sm text-slate-600">
                                        Salida:{' '}
                                        {formatDate(transportRoute.departure_at)}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Transportista:{' '}
                                        {transportRoute.transporter?.name}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Vehiculo:{' '}
                                        {
                                            transportRoute.vehicle
                                                ?.vehicle_type
                                        }{' '}
                                        · {transportRoute.vehicle?.plate}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Peso minimo:{' '}
                                        {transportRoute.min_cargo_weight_kg} kg ·
                                        Peso maximo:{' '}
                                        {transportRoute.available_capacity_kg} kg
                                    </p>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                                Tiempo aprox.
                                            </p>
                                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                                {formatDuration(
                                                    transportRoute.estimated_duration_minutes,
                                                )}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                Distancia
                                            </p>
                                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                                {transportRoute.distance_km
                                                    ? `${transportRoute.distance_km} km`
                                                    : 'Pendiente'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                            Costo estimado
                                        </p>
                                        <p className="mt-2 text-xl font-semibold text-slate-900">
                                            {transportRoute.estimated_cost
                                                ? formatCurrency(
                                                    transportRoute.estimated_cost,
                                                )
                                                : 'Ingresa el peso para estimar'}
                                        </p>
                                    </div>
                                    <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white p-2">
                                        {hasRouteCoordinates(transportRoute) ? (
                                            <RouteMap
                                                routes={[transportRoute]}
                                                height="240px"
                                            />
                                        ) : (
                                            <div className="flex min-h-[210px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500">
                                                Esta ruta aun no tiene puntos de mapa registrados.
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        href={route(
                                            'producer.routes.show',
                                            {
                                                transportRoute:
                                                    transportRoute.id,
                                                cargo_weight_kg:
                                                    routeFilters.cargo_weight_kg ||
                                                    undefined,
                                            },
                                        )}
                                        className="interactive-lift mt-4 inline-flex rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                                    >
                                        Solicitar carga
                                    </Link>
                                </article>
                            ))
                        ) : (
                            <EmptyState message="No hay rutas cercanas disponibles con esos filtros." />
                        )}
                    </div>
            </section>
        </>
    );
}

function ProducerRoutesMarketplaceView({ availableRoutes: paginatedRoutes, routeFilters = {} }) {
    const availableRoutes = paginatedRoutes?.data || paginatedRoutes;
    const [searchFilters, setSearchFilters] = useState({
        origin: routeFilters.origin ?? '',
        destination: routeFilters.destination ?? '',
        cargo_weight_kg: routeFilters.cargo_weight_kg ?? '',
    });
    const [selectedRouteId, setSelectedRouteId] = useState(
        availableRoutes[0]?.id ?? null,
    );
    const hasActiveSearch =
        Boolean(routeFilters.origin) ||
        Boolean(routeFilters.destination) ||
        Boolean(routeFilters.cargo_weight_kg);
    const selectedRoute =
        availableRoutes.find(
            (transportRoute) =>
                String(transportRoute.id) === String(selectedRouteId),
        ) ??
        availableRoutes[0] ??
        null;
    const selectedRouteIndex = selectedRoute
        ? Math.max(
              0,
              availableRoutes.findIndex(
                  (transportRoute) => transportRoute.id === selectedRoute.id,
              ),
          )
        : 0;

    useEffect(() => {
        if (!availableRoutes.length) {
            setSelectedRouteId(null);

            return;
        }

        const stillAvailable = availableRoutes.some(
            (transportRoute) =>
                String(transportRoute.id) === String(selectedRouteId),
        );

        if (!stillAvailable) {
            setSelectedRouteId(availableRoutes[0].id);
        }
    }, [availableRoutes, selectedRouteId]);

    const routeDetailHref = (transportRoute) =>
        route('producer.routes.show', {
            transportRoute: transportRoute.id,
            cargo_weight_kg: routeFilters.cargo_weight_kg || undefined,
            product_type: routeFilters.product_type || undefined,
        });

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(
            route('producer.routes.index'),
            {
                origin: searchFilters.origin.trim() || undefined,
                destination: searchFilters.destination.trim() || undefined,
                cargo_weight_kg:
                    Number(searchFilters.cargo_weight_kg) > 0
                        ? searchFilters.cargo_weight_kg
                        : undefined,
                product_type: searchFilters.product_type || undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearSearch = () => {
        setSearchFilters({
            origin: '',
            destination: '',
            cargo_weight_kg: '',
            product_type: '',
        });

        router.get(
            route('producer.routes.index'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <div className="min-w-0 space-y-6">
            <section className={cardClassName('overflow-hidden')}>
                    <SectionTitle
                        eyebrow="Busqueda"
                        title="Buscar rutas cercanas"
                        description="Encuentra transportistas disponibles para tu carga y selecciona una ruta para ver el mapa."
                    />

                    <form
                        className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.72fr)_auto]"
                        noValidate
                        onSubmit={submitSearch}
                    >
                        <div className="min-w-0">
                            <label
                                htmlFor="search_origin"
                                className="text-sm font-medium text-slate-700"
                            >
                                Origen
                            </label>
                            <input
                                id="search_origin"
                                value={searchFilters.origin}
                                onChange={(event) =>
                                    setSearchFilters((current) => ({
                                        ...current,
                                        origin: event.target.value,
                                    }))
                                }
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                placeholder="Ej. Araquita, Arauca"
                            />
                        </div>

                        <div className="min-w-0">
                            <label
                                htmlFor="search_destination"
                                className="text-sm font-medium text-slate-700"
                            >
                                Destino
                            </label>
                            <input
                                id="search_destination"
                                value={searchFilters.destination}
                                onChange={(event) =>
                                    setSearchFilters((current) => ({
                                        ...current,
                                        destination: event.target.value,
                                    }))
                                }
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                placeholder="Ej. Arauca, Arauca"
                            />
                        </div>

                        <div className="min-w-0">
                            <label
                                htmlFor="search_cargo_weight"
                                className="text-sm font-medium text-slate-700"
                            >
                                Peso de carga
                            </label>
                            <input
                                id="search_cargo_weight"
                                type="number"
                                inputMode="decimal"
                                min="1"
                                step="0.01"
                                value={searchFilters.cargo_weight_kg}
                                onChange={(event) =>
                                    setSearchFilters((current) => ({
                                        ...current,
                                        cargo_weight_kg: event.target.value,
                                    }))
                                }
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                placeholder="Ej. 500 kg"
                            />
                        </div>

                        <div className="min-w-0">
                            <label
                                htmlFor="search_product_type"
                                className="text-sm font-medium text-slate-700"
                            >
                                Producto
                            </label>
                            <select
                                id="search_product_type"
                                value={searchFilters.product_type}
                                onChange={(event) =>
                                    setSearchFilters((current) => ({
                                        ...current,
                                        product_type: event.target.value,
                                    }))
                                }
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            >
                                <option value="">Selecciona producto</option>
                                {productOptions.map((product) => (
                                    <option key={product} value={product}>
                                        {product}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row xl:items-end">
                            <button
                                type="submit"
                                className="interactive-lift inline-flex w-full justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_34px_-26px_rgba(21,128,61,0.75)] transition hover:bg-emerald-600 xl:w-auto"
                            >
                                Buscar rutas
                            </button>

                            {hasActiveSearch ? (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="interactive-lift inline-flex w-full justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 xl:w-auto"
                                >
                                    Limpiar
                                </button>
                            ) : null}
                        </div>
                    </form>

                    <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {availableRoutes.length === 1
                            ? '1 ruta disponible encontrada cerca de tu trayecto.'
                            : `${availableRoutes.length} rutas disponibles encontradas cerca de tu trayecto.`}
                    </p>
                </section>

            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(450px,0.95fr)] items-start">
                <div className="min-w-0 space-y-5">
                    <section className={cardClassName()}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <SectionTitle
                            eyebrow="Rutas disponibles"
                            title="Selecciona una ruta"
                            description="Compara tiempo, distancia, capacidad y costo estimado antes de enviar tu solicitud."
                        />
                        <span className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                            Ordenadas por salida
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4">
                        {availableRoutes.length ? (
                            availableRoutes.map((transportRoute, index) => {
                                const isSelected =
                                    selectedRoute?.id === transportRoute.id;
                                const color = routeColor(index);

                                return (
                                    <article
                                        key={transportRoute.id}
                                        className={`min-w-0 overflow-hidden rounded-2xl border bg-white p-4 shadow-[0_16px_36px_-34px_rgba(15,23,42,0.65)] transition ${
                                            isSelected
                                                ? 'border-emerald-300 ring-2 ring-emerald-100'
                                                : 'border-slate-200 hover:border-emerald-200'
                                        }`}
                                        style={{
                                            borderLeftColor: color,
                                            borderLeftWidth: 4,
                                        }}
                                    >
                                        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(190px,0.42fr)]">
                                            <div className="min-w-0">
                                                <div className="flex min-w-0 flex-wrap items-center gap-3">
                                                    <span
                                                        className="h-8 w-2 shrink-0 rounded-full"
                                                        style={{
                                                            backgroundColor: color,
                                                        }}
                                                        aria-hidden="true"
                                                    />
                                                    <h4 className="min-w-0 break-words text-base font-bold leading-snug text-slate-950 sm:text-lg">
                                                        {transportRoute.origin}{' '}
                                                        {'->'}{' '}
                                                        {transportRoute.destination}
                                                    </h4>
                                                    <StatusBadge
                                                        status={transportRoute.status}
                                                    />
                                                </div>

                                                <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                                    <p className="break-words">
                                                        Transportista:{' '}
                                                        {transportRoute
                                                            .transporter?.id ? (
                                                            <Link
                                                                href={route(
                                                                    'producer.transporters.show',
                                                                    transportRoute
                                                                        .transporter
                                                                        .id,
                                                                )}
                                                                className="font-semibold text-emerald-700 underline-offset-4 hover:underline"
                                                            >
                                                                {
                                                                    transportRoute
                                                                        .transporter
                                                                        ?.name
                                                                }
                                                            </Link>
                                                        ) : (
                                                            transportRoute
                                                                .transporter?.name
                                                        )}
                                                    </p>
                                                    <p className="break-words">
                                                        Vehiculo:{' '}
                                                        {
                                                            transportRoute.vehicle
                                                                ?.vehicle_type
                                                        }{' '}
                                                        - {transportRoute.vehicle?.plate}
                                                    </p>
                                                    <p>
                                                        Peso minimo:{' '}
                                                        {
                                                            transportRoute.min_cargo_weight_kg
                                                        }{' '}
                                                        kg · Peso maximo:{' '}
                                                        {
                                                            transportRoute.available_capacity_kg
                                                        }{' '}
                                                        kg
                                                    </p>
                                                    <p className="break-words">
                                                        La carga la define el productor al solicitar.
                                                    </p>
                                                    <p className="sm:col-span-2">
                                                        Salida:{' '}
                                                        {formatDate(
                                                            transportRoute.departure_at,
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedRouteId(
                                                                transportRoute.id,
                                                            )
                                                        }
                                                        className={`interactive-lift inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                                            isSelected
                                                                ? 'bg-emerald-700 text-white'
                                                                : 'border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                                                        }`}
                                                    >
                                                        {isSelected
                                                            ? 'Ruta seleccionada'
                                                            : 'Ver en mapa'}
                                                    </button>
                                                    <Link
                                                        href={routeDetailHref(
                                                            transportRoute,
                                                        )}
                                                        className="interactive-lift inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Ver detalles
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="min-w-0 border-t border-slate-200 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                                                <p className="text-sm text-slate-600">
                                                    Tiempo aprox.
                                                </p>
                                                <p className="mt-1 text-xl font-bold text-slate-950">
                                                    {formatDuration(
                                                        transportRoute.estimated_duration_minutes,
                                                    )}
                                                </p>
                                                <div className="my-4 h-px bg-slate-200" />
                                                <p className="text-sm text-slate-600">
                                                    Distancia
                                                </p>
                                                <p className="mt-1 text-xl font-bold text-slate-950">
                                                    {transportRoute.distance_km
                                                        ? `${transportRoute.distance_km} km`
                                                        : 'Pendiente'}
                                                </p>
                                                <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3">
                                                    <p className="text-sm text-slate-600">
                                                        Costo estimado
                                                    </p>
                                                    <p className="mt-1 text-sm font-bold text-slate-950">
                                                        {transportRoute.estimated_cost
                                                            ? formatCurrency(
                                                                  transportRoute.estimated_cost,
                                                              )
                                                            : 'Ingresa el peso para estimar'}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={routeDetailHref(
                                                        transportRoute,
                                                    )}
                                                    className="interactive-lift mt-4 inline-flex w-full justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-500"
                                                >
                                                    Solicitar carga
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <EmptyState message="No hay rutas cercanas disponibles con esos filtros." />
                        )}
                    </div>

                    {paginatedRoutes?.links && paginatedRoutes.total > 0 && (
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <span className="text-sm text-slate-600">
                                Mostrando {paginatedRoutes.from || 0} a {paginatedRoutes.to || 0} de {paginatedRoutes.total} rutas
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {paginatedRoutes.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                                            link.active
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : link.url
                                                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                                                    : 'cursor-not-allowed bg-slate-50 text-slate-400 border border-slate-100'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        Los tiempos y costos son estimados. El valor final sera
                        confirmado por el transportista.
                    </p>
                    </section>
                </div>

                <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
                    <section className={cardClassName('overflow-hidden')}>
                    {selectedRoute ? (
                        <>
                            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-950">
                                        Ruta seleccionada
                                    </p>
                                    <div className="mt-4 flex min-w-0 flex-wrap items-center gap-3">
                                        <span
                                            className="h-9 w-2 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor: routeColor(
                                                    selectedRouteIndex,
                                                ),
                                            }}
                                            aria-hidden="true"
                                        />
                                        <h3 className="min-w-0 break-words text-xl font-bold leading-snug text-slate-950">
                                            {selectedRoute.origin} {'->'}{' '}
                                            {selectedRoute.destination}
                                        </h3>
                                    </div>
                                </div>
                                <StatusBadge status={selectedRoute.status} />
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
                                    <p className="text-xs text-slate-500">
                                        Tiempo aprox.
                                    </p>
                                    <p className="mt-1 font-bold text-slate-950">
                                        {formatDuration(
                                            selectedRoute.estimated_duration_minutes,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-slate-50 px-4 py-3">
                                    <p className="text-xs text-slate-500">
                                        Distancia
                                    </p>
                                    <p className="mt-1 font-bold text-slate-950">
                                        {selectedRoute.distance_km
                                            ? `${selectedRoute.distance_km} km`
                                            : 'Pendiente'}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-slate-50 px-4 py-3">
                                    <p className="text-xs text-slate-500">
                                        Peso minimo
                                    </p>
                                    <p className="mt-1 font-bold text-slate-950">
                                        {selectedRoute.min_cargo_weight_kg} kg
                                    </p>
                                </div>
                                <div className="rounded-xl bg-slate-50 px-4 py-3">
                                    <p className="text-xs text-slate-500">
                                        Peso maximo
                                    </p>
                                    <p className="mt-1 font-bold text-slate-950">
                                        {selectedRoute.available_capacity_kg} kg
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50 p-2">
                                {hasRouteCoordinates(selectedRoute) ? (
                                    <RouteMap
                                        routes={[selectedRoute]}
                                        height="clamp(320px, 58vh, 520px)"
                                    />
                                ) : (
                                    <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500">
                                        Esta ruta aun no tiene puntos de mapa registrados.
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                                <p className="font-bold text-emerald-800">
                                    Ruta verificada
                                </p>
                                <p className="mt-1 text-sm leading-6 text-emerald-900/80">
                                    Esta ruta fue publicada por el transportista
                                    y esta disponible para solicitudes.
                                </p>
                            </div>

                            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                                <p className="font-bold text-slate-950">
                                    Informacion del transportista
                                </p>
                                <div className="mt-4 flex min-w-0 items-center gap-3">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                                        T
                                    </span>
                                    <div className="min-w-0">
                                        {selectedRoute.transporter?.id ? (
                                            <Link
                                                href={route(
                                                    'producer.transporters.show',
                                                    selectedRoute.transporter.id,
                                                )}
                                                className="truncate font-bold text-emerald-700 underline-offset-4 hover:underline"
                                            >
                                                {selectedRoute.transporter?.name}
                                            </Link>
                                        ) : (
                                            <p className="truncate font-bold text-slate-950">
                                                {selectedRoute.transporter?.name}
                                            </p>
                                        )}
                                        <p className="text-sm text-slate-500">
                                            Cuenta verificada
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={routeDetailHref(selectedRoute)}
                                className="interactive-lift mt-4 inline-flex w-full justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_34px_-26px_rgba(21,128,61,0.75)] transition hover:bg-emerald-600"
                            >
                                Solicitar esta carga
                            </Link>
                            <p className="mt-3 text-center text-sm text-slate-500">
                                Se enviara una solicitud al transportista para esta ruta.
                            </p>
                        </>
                    ) : (
                        <EmptyState message="Selecciona una ruta disponible para ver el mapa y sus detalles." />
                    )}
                </section>
            </aside>
            </div>
        </div>
    );
}

export default function RoutesIndex({
    role,
    transporterProfile,
    vehicles,
    myRoutes,
    availableRoutes,
    routeFilters = {},
    myRequests,
}) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Rutas y solicitudes" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-10 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                <div className="max-w-[1540px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4">
                                {role === 'productor' ? 'Mercado de rutas' : 'Tus rutas'}
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {role === 'productor' ? 'Rutas Disponibles' : 'Gestionar Rutas'}
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                {role === 'productor' 
                                    ? 'Busca transportistas con capacidad disponible para llevar tus productos al destino.'
                                    : 'Publica nuevas rutas, revisa solicitudes de carga y administra tus viajes en curso.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full min-h-screen overflow-x-hidden bg-slate-50 py-8">
                <div className="mx-auto flex min-w-0 max-w-[1540px] flex-col gap-8 px-3 sm:px-5 lg:px-8">
                    <FlashMessages success={flash.success} error={flash.error} />

                    {role === 'transportista' ? (
                        <TransporterRoutesExperience
                            transporterProfile={transporterProfile}
                            vehicles={vehicles}
                            myRoutes={myRoutes}
                        />
                    ) : null}

                    {role === 'productor' ? (
                        <ProducerRoutesMarketplaceView
                            availableRoutes={availableRoutes}
                            routeFilters={routeFilters}
                            myRequests={myRequests}
                        />
                    ) : null}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
