import RouteMap from '@/Components/RouteMap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const colombiaTimeZone = 'America/Bogota';

const productOptions = [
    {
        value: 'Papa',
        category: 'resistant',
        description: 'Tuberculo apto para transporte convencional.',
    },
    {
        value: 'Platano',
        category: 'resistant',
        description: 'Carga apta para transporte convencional.',
    },
    {
        value: 'Yuca',
        category: 'resistant',
        description: 'Tuberculo apto para transporte convencional.',
    },
    {
        value: 'Cafe',
        category: 'resistant',
        description: 'Grano o carga empacada para transporte convencional.',
    },
    {
        value: 'Maiz',
        category: 'resistant',
        description: 'Grano o carga empacada para transporte convencional.',
    },
    {
        value: 'Frijol',
        category: 'resistant',
        description: 'Grano o carga empacada para transporte convencional.',
    },
    {
        value: 'Hortalizas',
        category: 'sensitive',
        description: 'Requiere cuidado adicional durante el cargue y trayecto.',
    },
    {
        value: 'Cebolla',
        category: 'sensitive',
        description: 'Requiere cuidado adicional durante el cargue y trayecto.',
    },
    {
        value: 'Banano',
        category: 'sensitive',
        description: 'Fruta que requiere evitar golpes y presion.',
    },
    {
        value: 'Tomate',
        category: 'delicate',
        description: 'Requiere evitar golpes, presion y apilado excesivo.',
    },
    {
        value: 'Aguacate',
        category: 'delicate',
        description: 'Requiere evitar golpes y exposicion prolongada al calor.',
    },
    {
        value: 'Mango',
        category: 'delicate',
        description: 'Requiere evitar golpes y presion durante el trayecto.',
    },
    {
        value: 'Lechuga',
        category: 'delicate',
        description: 'Requiere mayor cuidado por volumen y frescura.',
    },
    {
        value: 'Fresa',
        category: 'very_delicate',
        description: 'Requiere manejo cuidadoso por su alta fragilidad.',
    },
    {
        value: 'Mora',
        category: 'very_delicate',
        description: 'Requiere manejo cuidadoso por su alta fragilidad.',
    },
    {
        value: 'Uva',
        category: 'very_delicate',
        description: 'Requiere manejo cuidadoso por su alta fragilidad.',
    },
    {
        value: 'Flores',
        category: 'very_delicate',
        description: 'Requiere manejo cuidadoso por volumen y fragilidad.',
    },
];

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

function formatCurrency(value) {
    if (value === null || value === undefined || value === '') {
        return 'Sin estimacion';
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

function productFactor(productCategory) {
    const factors = {
        resistant: 1,
        sensitive: 1.05,
        delicate: 1.1,
        very_delicate: 1.15,
    };

    return factors[productCategory] ?? 1;
}

function weightPrice(cargoWeightKg) {
    const numericWeight = Number(cargoWeightKg);

    if (numericWeight <= 100) {
        return 15000;
    }

    if (numericWeight <= 300) {
        return numericWeight * 35;
    }

    if (numericWeight <= 700) {
        return numericWeight * 55;
    }

    return numericWeight * 70;
}

function estimateTransportCost(distanceKm, cargoWeightKg, productCategory) {
    if (
        !distanceKm ||
        !cargoWeightKg ||
        Number(cargoWeightKg) <= 0 ||
        !productCategory
    ) {
        return '';
    }

    const loadPrice =
        (50000 + Number(distanceKm) * 2300 + weightPrice(cargoWeightKg)) *
        productFactor(productCategory);
    const minimumProfitablePrice = Number(distanceKm) * 2500;
    const estimatedCost = Math.max(loadPrice, minimumProfitablePrice);

    return Math.ceil(estimatedCost / 1000) * 1000;
}

function hasRouteCoordinates(route) {
    return (
        Number.isFinite(Number(route?.origin_lat)) &&
        Number.isFinite(Number(route?.origin_lng)) &&
        Number.isFinite(Number(route?.destination_lat)) &&
        Number.isFinite(Number(route?.destination_lng))
    );
}

function safeValue(value, fallback = 'Sin dato') {
    return value === null || value === undefined || value === ''
        ? fallback
        : value;
}

function DetailItem({ label, value, featured = false }) {
    return (
        <div
            className={`flex min-w-0 gap-3 rounded-xl border px-4 py-3 shadow-[0_16px_36px_-32px_rgba(31,74,49,0.45)] ${
                featured
                    ? 'border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#eefbf1_100%)]'
                    : 'border-[#dfe8dc] bg-white'
            }`}
        >
            <span
                className={`mt-1 h-9 w-9 shrink-0 rounded-xl ${
                    featured ? 'bg-emerald-100' : 'bg-[#eef7ec]'
                }`}
            />
            <div className="min-w-0">
                <p
                    className={`text-xs font-semibold ${
                        featured ? 'text-emerald-700' : 'text-[#6f7b72]'
                    }`}
                >
                    {label}
                </p>
                <div className="mt-1 break-words text-sm font-bold leading-5 text-[#203029]">
                    {safeValue(value, featured ? 'Pendiente' : 'Sin dato')}
                </div>
            </div>
        </div>
    );
}

function FieldError({ message }) {
    if (!message) {
        return null;
    }

    return <p className="mt-2 break-words text-sm text-rose-600">{message}</p>;
}

export default function Show({ transportRoute, already_requested }) {
    const { flash } = usePage().props;
    const [isSubmitted, setIsSubmitted] = useState(already_requested ?? false);
    const hasMap = hasRouteCoordinates(transportRoute);
    const estimatedCostLabel = transportRoute.estimated_cost
        ? formatCurrency(transportRoute.estimated_cost)
        : 'Se calculara con el peso ingresado';
    const requestForm = useForm({
        transport_route_id: transportRoute.id,
        cargo_weight_kg: transportRoute.cost_estimate_weight_kg ?? '',
        product_category: transportRoute.cost_estimate_product_category ?? '',
        product_type: transportRoute.cost_estimate_product_type ?? '',
        delivery_destination: '',
        estimated_cost: transportRoute.estimated_cost ?? '',
    });
    const canSubmit =
        Number(requestForm.data.cargo_weight_kg) > 0 &&
        Number(requestForm.data.cargo_weight_kg) >=
            Number(transportRoute.min_cargo_weight_kg) &&
        Number(requestForm.data.cargo_weight_kg) <=
            Number(transportRoute.available_capacity_kg) &&
        requestForm.data.product_category &&
        requestForm.data.product_type.trim() &&
        requestForm.data.delivery_destination.trim();

    return (
        <AuthenticatedLayout>
            <Head title="Detalle de ruta" />

            <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#e5f5dc_0%,rgba(229,245,220,0)_34%),linear-gradient(180deg,#f8fbf6_0%,#eef7ec_100%)] px-3 pb-6 sm:px-5 lg:px-6">
                <div className="mx-auto max-w-[1480px] space-y-4">
                        {flash.success ? (
                            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                                {flash.success}
                            </section>
                        ) : null}
                        {flash.error ? (
                            <section className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
                                {flash.error}
                            </section>
                        ) : null}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                href={route('producer.dashboard')}
                                className="interactive-lift inline-flex w-full items-center justify-center rounded-xl border border-[#dce6d8] bg-white px-4 py-3 text-sm font-bold text-emerald-700 shadow-[0_14px_34px_-30px_rgba(31,74,49,0.45)] transition hover:bg-[#f4f8ef] sm:w-auto"
                            >
                                Volver al panel
                            </Link>

                            <Link
                                href={route('producer.routes.index')}
                                className="interactive-lift inline-flex w-full items-center justify-center rounded-xl border border-emerald-600 bg-white px-5 py-3 text-sm font-bold text-emerald-700 shadow-[0_14px_34px_-30px_rgba(31,74,49,0.45)] transition hover:bg-emerald-50 sm:w-auto"
                            >
                                Ver otras rutas
                            </Link>
                        </div>

                        <section className="animate-panel-rise rounded-2xl border border-[#d8e8d4] bg-white p-4 shadow-[0_20px_52px_-40px_rgba(31,74,49,0.45)] sm:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#008b55]">
                                        Mapa publicado
                                    </p>
                                    <h1 className="mt-3 break-words text-2xl font-bold leading-tight text-[#17221d] sm:text-3xl">
                                        Trayecto completo de la ruta
                                    </h1>
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#52615a]">
                                        Esta vista muestra una sola ruta para revisar el recorrido sin mezclar otras publicaciones.
                                    </p>
                                </div>
                                <span className="inline-flex w-fit items-center rounded-xl bg-[#edf7e9] px-4 py-3 text-sm font-bold text-[#427c46]">
                                    Publicada
                                </span>
                            </div>
                        </section>

                        <section className="animate-panel-rise overflow-hidden rounded-2xl border border-[#d8e8d4] bg-white shadow-[0_20px_52px_-40px_rgba(31,74,49,0.45)]">
                            {hasMap ? (
                                <div className="bg-[#f4f8ef] p-2">
                                    <RouteMap
                                        routes={[transportRoute]}
                                        height="clamp(320px, 50vh, 560px)"
                                        markerDisplay="endpoint-labels"
                                    />
                                </div>
                            ) : (
                                <div className="flex min-h-[340px] items-center justify-center border border-dashed border-[#cfe1cb] bg-[#f8fbf6] px-6 text-center text-sm text-[#647067]">
                                    Esta ruta no tiene puntos de mapa registrados.
                                </div>
                            )}
                        </section>

                        <section className="animate-panel-rise rounded-2xl border border-[#d8e8d4] bg-white p-4 shadow-[0_18px_44px_-36px_rgba(31,74,49,0.35)] sm:p-6">
                            <h2 className="text-xl font-bold text-[#203029]">
                                Datos completos de la publicacion
                            </h2>

                            <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                                <DetailItem
                                    label="Origen"
                                    value={transportRoute.origin}
                                />
                                <DetailItem
                                    label="Destino"
                                    value={transportRoute.destination}
                                />
                                <DetailItem
                                    label="Fecha de salida"
                                    value={formatDate(transportRoute.departure_at)}
                                />
                                <DetailItem
                                    label="Transportista"
                                    value={
                                        transportRoute.transporter?.id ? (
                                            <Link
                                                href={route(
                                                    'producer.transporters.show',
                                                    transportRoute.transporter.id,
                                                )}
                                                className="text-emerald-700 underline-offset-4 hover:underline"
                                            >
                                                {transportRoute.transporter?.name}
                                            </Link>
                                        ) : (
                                            transportRoute.transporter?.name
                                        )
                                    }
                                />
                                <DetailItem
                                    label="Vehiculo"
                                    value={
                                        transportRoute.vehicle
                                            ? `${transportRoute.vehicle.vehicle_type} - ${transportRoute.vehicle.plate}`
                                            : null
                                    }
                                />
                                <DetailItem
                                    label="Peso minimo"
                                    value={`${transportRoute.min_cargo_weight_kg} kg`}
                                />
                                <DetailItem
                                    label="Peso maximo disponible"
                                    value={`${transportRoute.available_capacity_kg} kg`}
                                />
                                <DetailItem
                                    label="Distancia"
                                    value={
                                        transportRoute.distance_km
                                            ? `${transportRoute.distance_km} km`
                                            : 'Pendiente'
                                    }
                                />
                                <DetailItem
                                    featured
                                    label="Tiempo aproximado"
                                    value={formatDuration(
                                        transportRoute.estimated_duration_minutes,
                                    )}
                                />
                            </div>
                        </section>

                        <section className="animate-panel-rise rounded-2xl border border-[#d8e8d4] bg-white p-4 shadow-[0_18px_44px_-36px_rgba(31,74,49,0.35)] sm:p-6">
                                <form
                                    className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.42fr)]"
                                noValidate
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    requestForm.post(
                                        route('producer.transport-requests.store'),
                                        {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                requestForm.reset(
                                                    'cargo_weight_kg',
                                                    'product_category',
                                                    'product_type',
                                                    'delivery_destination',
                                                    'estimated_cost',
                                                );
                                                setIsSubmitted(true);
                                            },
                                        },
                                    );
                                }}
                            >
                                <input
                                    type="hidden"
                                    value={requestForm.data.transport_route_id}
                                    name="transport_route_id"
                                />

                                <div className={`min-w-0 transition-opacity duration-300 ${isSubmitted ? 'pointer-events-none opacity-50' : ''}`}>
                                    <h2 className="text-xl font-bold text-[#203029]">
                                        Solicitar carga para esta ruta
                                    </h2>
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#52615a]">
                                        Completa los datos de tu carga. El contacto del transportista solo se habilita cuando la solicitud sea aceptada.
                                    </p>

                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="cargo_weight_kg"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Peso de la carga
                                            </label>
                                            <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                                                <input
                                                    id="cargo_weight_kg"
                                                    type="number"
                                                    required
                                                    inputMode="decimal"
                                                    min={
                                                        transportRoute.min_cargo_weight_kg
                                                    }
                                                    max={
                                                        transportRoute.available_capacity_kg
                                                    }
                                                    step="0.01"
                                                    value={
                                                        requestForm.data
                                                            .cargo_weight_kg
                                                    }
                                                    onChange={(event) => {
                                                        const cargoWeightKg =
                                                            event.target.value;

                                                        requestForm.setData({
                                                            ...requestForm.data,
                                                            cargo_weight_kg:
                                                                cargoWeightKg,
                                                            estimated_cost:
                                                                estimateTransportCost(
                                                                    transportRoute.distance_km,
                                                                    cargoWeightKg,
                                                                    requestForm.data
                                                                        .product_category,
                                                                ),
                                                        });
                                                    }}
                                                    className="block min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm focus:ring-0"
                                                    placeholder="Ej. 800"
                                                />
                                                <span className="grid w-14 shrink-0 place-items-center border-l border-slate-200 bg-white text-sm font-bold text-slate-600">
                                                    kg
                                                </span>
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500">
                                                Esta ruta acepta solicitudes entre{' '}
                                                {
                                                    transportRoute.min_cargo_weight_kg
                                                }{' '}
                                                kg y{' '}
                                                {
                                                    transportRoute.available_capacity_kg
                                                }{' '}
                                                kg.
                                            </p>
                                            <FieldError
                                                message={
                                                    requestForm.errors
                                                        .cargo_weight_kg
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="product_type"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Producto a enviar
                                            </label>
                                            <select
                                                id="product_type"
                                                required
                                                value={
                                                    requestForm.data.product_type
                                                }
                                                onChange={(event) => {
                                                    const selectedProduct =
                                                        productOptions.find(
                                                            (option) =>
                                                                option.value ===
                                                                event.target.value,
                                                        );

                                                    requestForm.setData({
                                                        ...requestForm.data,
                                                        product_type:
                                                            selectedProduct
                                                                ?.value ?? '',
                                                        product_category:
                                                            selectedProduct
                                                                ?.category ?? '',
                                                        estimated_cost:
                                                            estimateTransportCost(
                                                                transportRoute.distance_km,
                                                                requestForm.data
                                                                    .cargo_weight_kg,
                                                                selectedProduct
                                                                    ?.category,
                                                            ),
                                                    });
                                                }}
                                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            >
                                                <option value="">
                                                    Selecciona el producto
                                                </option>
                                                {productOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.value}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="hidden"
                                                name="product_category"
                                                value={
                                                    requestForm.data
                                                        .product_category
                                                }
                                            />
                                            {requestForm.data.product_type ? (
                                                <p className="mt-2 text-xs text-slate-500">
                                                    {
                                                        productOptions.find(
                                                            (option) =>
                                                                option.value ===
                                                                requestForm.data
                                                                    .product_type,
                                                        )?.description
                                                    }
                                                </p>
                                            ) : null}
                                            <FieldError
                                                message={
                                                    requestForm.errors
                                                        .product_type
                                                }
                                            />
                                            <FieldError
                                                message={
                                                    requestForm.errors
                                                        .product_category
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label
                                            htmlFor="delivery_destination"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Destino de entrega
                                        </label>
                                        <input
                                            id="delivery_destination"
                                            required
                                            maxLength="255"
                                            value={
                                                requestForm.data
                                                    .delivery_destination
                                            }
                                            onChange={(event) =>
                                                requestForm.setData(
                                                    'delivery_destination',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            placeholder="Ej. Corabastos, Bogota"
                                        />
                                        <FieldError
                                            message={
                                                requestForm.errors
                                                    .delivery_destination
                                            }
                                        />
                                    </div>

                                    <FieldError
                                        message={
                                            requestForm.errors.transport_route_id
                                        }
                                    />
                                    <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                        Una vez tu solicitud sea aceptada, se habilitara el contacto del transportista para coordinar los detalles.
                                    </p>
                                </div>

                                <aside className={`min-w-0 rounded-2xl border px-5 py-5 transition-all duration-500 ${
                                    isSubmitted
                                        ? 'border-emerald-400 bg-[linear-gradient(135deg,#d1fae5_0%,#a7f3d0_100%)] shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
                                        : 'border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#eefbf1_100%)]'
                                }`}>

                                    {/* Badge de confirmación — solo visible tras enviar */}
                                    {isSubmitted && (
                                        <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-[0_6px_18px_-6px_rgba(5,150,105,0.55)]">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
                                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold leading-tight">¡Tu solicitud fue enviada!</p>
                                                <p className="mt-0.5 text-xs text-emerald-100">Te avisamos cuando sea revisada.</p>
                                            </div>
                                        </div>
                                    )}

                                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isSubmitted ? 'text-emerald-800' : 'text-emerald-700'}`}>
                                        Costo estimado
                                    </p>
                                    <div className="mt-5 flex items-center gap-4">
                                        <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full text-2xl font-bold transition-all duration-500 ${
                                            isSubmitted
                                                ? 'bg-emerald-600 text-white shadow-[0_6px_18px_-6px_rgba(5,150,105,0.6)]'
                                                : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            $
                                        </span>
                                        <div className="min-w-0">
                                            <p className="break-words text-2xl font-bold leading-tight text-[#203029]">
                                                {requestForm.data.estimated_cost
                                                    ? formatCurrency(
                                                          requestForm.data
                                                              .estimated_cost,
                                                      )
                                                    : estimatedCostLabel}
                                            </p>
                                            <p className="mt-1 text-sm text-[#52615a]">
                                                Calculado con peso y distancia publicados.
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="estimated_cost"
                                        value={requestForm.data.estimated_cost}
                                    />

                                    {/* Nueva sección: Métodos de pago (HU14) */}
                                    {transportRoute.transporter?.payment_methods?.length > 0 && (
                                        <div className="mt-6 border-t border-emerald-300/60 pt-5">
                                            <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isSubmitted ? 'text-emerald-800' : 'text-emerald-700'}`}>
                                                Medios de pago aceptados
                                            </p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {transportRoute.transporter.payment_methods.map((method) => (
                                                    <span key={method} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/80 px-3 py-1.5 text-xs font-bold text-emerald-900 border border-emerald-200/50">
                                                        <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                        {method}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="mt-3 text-xs leading-5 text-emerald-800/80 font-medium">
                                                Acuerda el método de pago exacto directamente con el transportista una vez tu solicitud sea aceptada.
                                            </p>
                                        </div>
                                    )}

                                    {isSubmitted ? (
                                        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                            Oferta bloqueada · solo 1 por ruta
                                        </div>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={
                                                !canSubmit || requestForm.processing
                                            }
                                            className="interactive-lift mt-6 inline-flex w-full justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                                        >
                                            {requestForm.processing
                                                ? 'Enviando solicitud...'
                                                : 'Enviar solicitud de carga'}
                                        </button>
                                    )}
                                </aside>

                            </form>
                        </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
