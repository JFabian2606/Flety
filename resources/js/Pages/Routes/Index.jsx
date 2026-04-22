import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

const statusLabels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    published: 'Publicada',
    closed: 'Cerrada',
    cancelled: 'Cancelada',
    accepted: 'Aceptada',
};

function formatDate(value) {
    if (!value) {
        return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function StatusBadge({ status }) {
    const styles = {
        approved: 'bg-emerald-100 text-emerald-700',
        published: 'bg-emerald-100 text-emerald-700',
        accepted: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
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

    return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}

function SectionTitle({ eyebrow, title, description }) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
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

export default function RoutesIndex({
    role,
    transporterProfile,
    vehicles,
    myRoutes,
    availableRoutes,
    myRequests,
}) {
    const { flash } = usePage().props;

    const vehicleForm = useForm({
        plate: '',
        vehicle_type: '',
        capacity_kg: '',
    });

    const routeForm = useForm({
        vehicle_id: vehicles[0]?.id ?? '',
        origin: '',
        destination: '',
        departure_at: '',
        available_capacity_kg: '',
        permitted_cargo_type: '',
    });

    const requestForm = useForm({
        transport_route_id: availableRoutes[0]?.id ?? '',
        cargo_weight_kg: '',
        product_type: '',
        delivery_destination: '',
        estimated_cost: '',
    });

    const isTransporter = role === 'transportista';
    const isProducer = role === 'productor';
    const canCreateRoutes = transporterProfile?.validation_status === 'approved';

    return (
        <AuthenticatedLayout
            header={
                <SectionTitle
                    eyebrow="TH3 operativo"
                    title="Usuarios, rutas y solicitudes"
                    description="La base de datos ya no queda solo documentada: desde esta vista se prueba el registro persistente de vehiculos, rutas y solicitudes con reglas por rol."
                />
            }
        >
            <Head title="Rutas y solicitudes" />

            <div className="py-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    {flash.success ? (
                        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                            {flash.success}
                        </section>
                    ) : null}

                    {isTransporter ? (
                        <section className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">
                                        Estado de validacion del transportista
                                    </p>
                                    <div className="mt-3">
                                        <StatusBadge
                                            status={
                                                transporterProfile?.validation_status
                                            }
                                        />
                                    </div>
                                </div>
                                <p className="max-w-xl text-sm leading-6 text-slate-600">
                                    Solo los transportistas aprobados pueden
                                    publicar rutas. La regla queda reforzada en
                                    backend para evitar manipulacion directa de
                                    la solicitud.
                                </p>
                            </div>
                        </section>
                    ) : null}

                    {isTransporter ? (
                        <section className="grid gap-6 lg:grid-cols-2">
                            <article className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-sm">
                                <SectionTitle
                                    eyebrow="Paso 1"
                                    title="Registrar vehiculo"
                                    description="Una ruta siempre queda amarrada a un vehiculo del mismo transportista."
                                />

                                <form
                                    className="mt-6 space-y-4"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        vehicleForm.post(
                                            route('transporter.vehicles.store'),
                                            {
                                            preserveScroll: true,
                                            onSuccess: () => vehicleForm.reset(),
                                            },
                                        );
                                    }}
                                >
                                    <div>
                                        <label
                                            htmlFor="plate"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Placa
                                        </label>
                                        <input
                                            id="plate"
                                            value={vehicleForm.data.plate}
                                            onChange={(event) =>
                                                vehicleForm.setData(
                                                    'plate',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            placeholder="ABC123"
                                        />
                                        <FieldError
                                            message={vehicleForm.errors.plate}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="vehicle_type"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Tipo de vehiculo
                                        </label>
                                        <input
                                            id="vehicle_type"
                                            value={vehicleForm.data.vehicle_type}
                                            onChange={(event) =>
                                                vehicleForm.setData(
                                                    'vehicle_type',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            placeholder="Camion, camioneta, furgon"
                                        />
                                        <FieldError
                                            message={
                                                vehicleForm.errors.vehicle_type
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="capacity_kg"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Capacidad en kg
                                        </label>
                                        <input
                                            id="capacity_kg"
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={vehicleForm.data.capacity_kg}
                                            onChange={(event) =>
                                                vehicleForm.setData(
                                                    'capacity_kg',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            placeholder="1500"
                                        />
                                        <FieldError
                                            message={
                                                vehicleForm.errors.capacity_kg
                                            }
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={vehicleForm.processing}
                                        className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        Guardar vehiculo
                                    </button>
                                </form>
                            </article>

                            <article className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-sm">
                                <SectionTitle
                                    eyebrow="Paso 2"
                                    title="Publicar ruta"
                                    description="La capacidad no puede exceder la del vehiculo y el transportista debe estar aprobado."
                                />

                                {!canCreateRoutes ? (
                                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                        Tu perfil sigue en validacion. Puedes
                                        registrar vehiculos, pero la publicacion
                                        de rutas queda bloqueada hasta que un
                                        administrador te apruebe.
                                    </div>
                                ) : null}

                                <form
                                    className="mt-6 space-y-4"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        routeForm.post(
                                            route('transporter.routes.store'),
                                            {
                                            preserveScroll: true,
                                            onSuccess: () =>
                                                routeForm.reset(
                                                    'origin',
                                                    'destination',
                                                    'departure_at',
                                                    'available_capacity_kg',
                                                    'permitted_cargo_type',
                                                ),
                                            },
                                        );
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
                                            value={routeForm.data.vehicle_id}
                                            onChange={(event) =>
                                                routeForm.setData(
                                                    'vehicle_id',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="">
                                                Selecciona un vehiculo
                                            </option>
                                            {vehicles.map((vehicle) => (
                                                <option
                                                    key={vehicle.id}
                                                    value={vehicle.id}
                                                >
                                                    {vehicle.plate} -{' '}
                                                    {vehicle.vehicle_type} -{' '}
                                                    {vehicle.capacity_kg} kg
                                                </option>
                                            ))}
                                        </select>
                                        <FieldError
                                            message={
                                                routeForm.errors.vehicle_id
                                            }
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="origin"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Origen
                                            </label>
                                            <input
                                                id="origin"
                                                value={routeForm.data.origin}
                                                onChange={(event) =>
                                                    routeForm.setData(
                                                        'origin',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                            <FieldError
                                                message={routeForm.errors.origin}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="destination"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Destino
                                            </label>
                                            <input
                                                id="destination"
                                                value={
                                                    routeForm.data.destination
                                                }
                                                onChange={(event) =>
                                                    routeForm.setData(
                                                        'destination',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                            <FieldError
                                                message={
                                                    routeForm.errors.destination
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
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
                                                value={
                                                    routeForm.data.departure_at
                                                }
                                                onChange={(event) =>
                                                    routeForm.setData(
                                                        'departure_at',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                            <FieldError
                                                message={
                                                    routeForm.errors
                                                        .departure_at
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="available_capacity_kg"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Capacidad disponible
                                            </label>
                                            <input
                                                id="available_capacity_kg"
                                                type="number"
                                                min="1"
                                                step="0.01"
                                                value={
                                                    routeForm.data
                                                        .available_capacity_kg
                                                }
                                                onChange={(event) =>
                                                    routeForm.setData(
                                                        'available_capacity_kg',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                            <FieldError
                                                message={
                                                    routeForm.errors
                                                        .available_capacity_kg
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="permitted_cargo_type"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Tipo de carga permitida
                                        </label>
                                        <input
                                            id="permitted_cargo_type"
                                            value={
                                                routeForm.data
                                                    .permitted_cargo_type
                                            }
                                            onChange={(event) =>
                                                routeForm.setData(
                                                    'permitted_cargo_type',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            placeholder="Papa, cafe, insumos, perecederos"
                                        />
                                        <FieldError
                                            message={
                                                routeForm.errors
                                                    .permitted_cargo_type
                                            }
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            routeForm.processing ||
                                            !canCreateRoutes
                                        }
                                        className="inline-flex rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                                    >
                                        Publicar ruta
                                    </button>
                                </form>
                            </article>
                        </section>
                    ) : null}

                    {!isTransporter ? (
                        <section className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-sm">
                            <SectionTitle
                                eyebrow="Lectura"
                                title="Rutas publicadas"
                                description="Aqui se consultan las rutas activas que cumplen con transportista validado y fecha futura."
                            />

                            <div className="mt-6 grid gap-4">
                                {availableRoutes.length ? (
                                    availableRoutes.map((transportRoute) => (
                                        <article
                                            key={transportRoute.id}
                                            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h4 className="text-lg font-semibold text-slate-900">
                                                            {transportRoute.origin}{' '}
                                                            →{' '}
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
                                                    <p className="text-sm text-slate-600">
                                                        Salida:{' '}
                                                        {formatDate(
                                                            transportRoute.departure_at,
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        Carga permitida:{' '}
                                                        {
                                                            transportRoute.permitted_cargo_type
                                                        }
                                                        . Capacidad disponible:{' '}
                                                        {
                                                            transportRoute.available_capacity_kg
                                                        }{' '}
                                                        kg.
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        Transportista:{' '}
                                                        {
                                                            transportRoute
                                                                .transporter
                                                                ?.name
                                                        }
                                                        {' · '}
                                                        {
                                                            transportRoute
                                                                .transporter
                                                                ?.phone
                                                        }
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        Vehiculo:{' '}
                                                        {
                                                            transportRoute
                                                                .vehicle
                                                                ?.vehicle_type
                                                        }
                                                        {' · '}
                                                        {
                                                            transportRoute
                                                                .vehicle?.plate
                                                        }
                                                    </p>
                                                </div>
                                                {isProducer ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            requestForm.setData(
                                                                'transport_route_id',
                                                                transportRoute.id,
                                                            )
                                                        }
                                                        className="inline-flex rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                                                    >
                                                        Usar esta ruta
                                                    </button>
                                                ) : null}
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-500">
                                        No hay rutas publicadas en este momento.
                                    </div>
                                )}
                            </div>
                        </section>
                    ) : null}

                    {isProducer ? (
                        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                            <article className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-sm">
                                <SectionTitle
                                    eyebrow="Escritura"
                                    title="Registrar solicitud"
                                    description="Solo se admiten solicitudes sobre rutas publicadas, futuras y con capacidad suficiente."
                                />

                                <form
                                    className="mt-6 space-y-4"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        requestForm.post(
                                            route(
                                                'producer.transport-requests.store',
                                            ),
                                            {
                                                preserveScroll: true,
                                                onSuccess: () =>
                                                    requestForm.reset(
                                                        'cargo_weight_kg',
                                                        'product_type',
                                                        'delivery_destination',
                                                        'estimated_cost',
                                                    ),
                                            },
                                        );
                                    }}
                                >
                                    <div>
                                        <label
                                            htmlFor="transport_route_id"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Ruta
                                        </label>
                                        <select
                                            id="transport_route_id"
                                            value={
                                                requestForm.data
                                                    .transport_route_id
                                            }
                                            onChange={(event) =>
                                                requestForm.setData(
                                                    'transport_route_id',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="">
                                                Selecciona una ruta
                                            </option>
                                            {availableRoutes.map(
                                                (transportRoute) => (
                                                    <option
                                                        key={transportRoute.id}
                                                        value={transportRoute.id}
                                                    >
                                                        {transportRoute.origin}{' '}
                                                        →{' '}
                                                        {
                                                            transportRoute.destination
                                                        }{' '}
                                                        -{' '}
                                                        {formatDate(
                                                            transportRoute.departure_at,
                                                        )}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <FieldError
                                            message={
                                                requestForm.errors
                                                    .transport_route_id
                                            }
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="cargo_weight_kg"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Peso de la carga
                                            </label>
                                            <input
                                                id="cargo_weight_kg"
                                                type="number"
                                                min="1"
                                                step="0.01"
                                                value={
                                                    requestForm.data
                                                        .cargo_weight_kg
                                                }
                                                onChange={(event) =>
                                                    requestForm.setData(
                                                        'cargo_weight_kg',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                            <FieldError
                                                message={
                                                    requestForm.errors
                                                        .cargo_weight_kg
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="estimated_cost"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Costo estimado
                                            </label>
                                            <input
                                                id="estimated_cost"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={
                                                    requestForm.data
                                                        .estimated_cost
                                                }
                                                onChange={(event) =>
                                                    requestForm.setData(
                                                        'estimated_cost',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                            <FieldError
                                                message={
                                                    requestForm.errors
                                                        .estimated_cost
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="product_type"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Tipo de producto
                                        </label>
                                        <input
                                            id="product_type"
                                            value={
                                                requestForm.data.product_type
                                            }
                                            onChange={(event) =>
                                                requestForm.setData(
                                                    'product_type',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                        <FieldError
                                            message={
                                                requestForm.errors.product_type
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="delivery_destination"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Destino de entrega
                                        </label>
                                        <input
                                            id="delivery_destination"
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
                                            className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                        <FieldError
                                            message={
                                                requestForm.errors
                                                    .delivery_destination
                                            }
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            requestForm.processing ||
                                            !availableRoutes.length
                                        }
                                        className="inline-flex rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                                    >
                                        Crear solicitud
                                    </button>
                                </form>
                            </article>

                            <article className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-sm">
                                <SectionTitle
                                    eyebrow="Seguimiento"
                                    title="Mis solicitudes"
                                    description="Quedan almacenadas con estado, fecha y referencia directa a la ruta seleccionada."
                                />

                                <div className="mt-6 grid gap-4">
                                    {myRequests.length ? (
                                        myRequests.map((transportRequest) => (
                                            <article
                                                key={transportRequest.id}
                                                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                            >
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h4 className="text-lg font-semibold text-slate-900">
                                                        {
                                                            transportRequest.route
                                                                ?.origin
                                                        }{' '}
                                                        →{' '}
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
                                                    Solicitado el{' '}
                                                    {formatDate(
                                                        transportRequest.requested_at,
                                                    )}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    Producto:{' '}
                                                    {
                                                        transportRequest.product_type
                                                    }
                                                    {' · '}
                                                    Peso:{' '}
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
                                                    Transportista:{' '}
                                                    {
                                                        transportRequest.route
                                                            ?.transporter?.name
                                                    }
                                                </p>
                                            </article>
                                        ))
                                    ) : (
                                        <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-500">
                                            Todavia no has creado solicitudes.
                                        </div>
                                    )}
                                </div>
                            </article>
                        </section>
                    ) : null}

                    {isTransporter ? (
                        <section className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-sm">
                            <SectionTitle
                                eyebrow="Persistencia"
                                title="Mis rutas registradas"
                                description="Consulta de las rutas almacenadas para el transportista autenticado."
                            />

                            <div className="mt-6 grid gap-4">
                                {myRoutes.length ? (
                                    myRoutes.map((transportRoute) => (
                                        <article
                                            key={transportRoute.id}
                                            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                        >
                                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h4 className="text-lg font-semibold text-slate-900">
                                                            {transportRoute.origin}{' '}
                                                            →{' '}
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
                                                    <p className="mt-3 text-sm text-slate-600">
                                                        Salida:{' '}
                                                        {formatDate(
                                                            transportRoute.departure_at,
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        Vehiculo:{' '}
                                                        {
                                                            transportRoute
                                                                .vehicle
                                                                ?.vehicle_type
                                                        }
                                                        {' · '}
                                                        {
                                                            transportRoute
                                                                .vehicle?.plate
                                                        }
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        Capacidad:{' '}
                                                        {
                                                            transportRoute.available_capacity_kg
                                                        }{' '}
                                                        kg. Solicitudes:{' '}
                                                        {
                                                            transportRoute.transport_requests_count
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-500">
                                        Aun no has publicado rutas.
                                    </div>
                                )}
                            </div>
                        </section>
                    ) : null}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
