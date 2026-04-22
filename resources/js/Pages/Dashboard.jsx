import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ dashboardRole, entryRoute }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const role = dashboardRole ?? user.role?.slug;
    const isTransporter = role === 'transportista';
    const isProducer = role === 'productor';
    const isAdmin = role === 'administrador';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                        Centro de operaciones
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-slate-900">
                        {user.role?.name ? `Panel ${user.role.name}` : 'Panel Flety'}
                    </h2>
                </div>
            }
        >
            <Head title="Panel" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <section className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-[radial-gradient(circle_at_top_left,#ecfccb_0%,#f8fafc_45%,#ffffff_100%)] shadow-[0_30px_80px_-40px_rgba(20,83,45,0.35)]">
                        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.5fr_1fr] lg:px-10">
                            <div className="space-y-5">
                                <div className="inline-flex rounded-full border border-emerald-300 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                                    Sesion activa
                                </div>
                                <div>
                                    <h3 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-900">
                                        {user.name}, ya tienes lista la base React de Flety para construir rutas, solicitudes y servicios.
                                    </h3>
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                        La autenticacion, los roles y la arquitectura inicial ya estan acoplados al modelo del negocio. El siguiente paso es convertir este panel en la operacion real del marketplace.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <div className="rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rol</p>
                                        <p className="mt-1 font-semibold text-slate-900">
                                            {user.role?.name ?? 'Usuario'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Contacto</p>
                                        <p className="mt-1 font-semibold text-slate-900">{user.phone}</p>
                                    </div>
                                    {entryRoute ? (
                                        <Link
                                            href={entryRoute}
                                            className="inline-flex items-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-28px_rgba(4,120,87,0.8)] transition hover:bg-emerald-600"
                                        >
                                            {isTransporter
                                                ? 'Gestionar vehiculos y rutas'
                                                : isProducer
                                                  ? 'Explorar rutas y solicitar'
                                                  : 'Ver rutas activas'}
                                        </Link>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                                <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
                                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Modulo</p>
                                    <p className="mt-3 text-xl font-semibold">Usuarios y roles</p>
                                    <p className="mt-2 text-sm text-slate-300">
                                        Operativo con React, Inertia, Breeze y perfiles base.
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                                    <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Base de datos</p>
                                    <p className="mt-3 text-xl font-semibold text-slate-900">Arquitectura inicial</p>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Tablas de rutas, vehiculos, solicitudes, servicios, contacto y calificaciones.
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-emerald-700 p-5 text-white shadow-lg">
                                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Proximo frente</p>
                                    <p className="mt-3 text-xl font-semibold">
                                        {isAdmin ? 'Control operativo' : 'Flujo logistico'}
                                    </p>
                                    <p className="mt-2 text-sm text-emerald-50">
                                        {isAdmin
                                            ? 'Validacion de transportistas, supervision del sistema y seguimiento de actividad.'
                                            : 'Publicacion de rutas, match de carga y confirmacion del servicio.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                01
                            </p>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                {isAdmin ? 'Validacion documental' : 'Publicacion de rutas'}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {isAdmin
                                    ? 'Revision de transportistas, documentos y estados de aprobacion.'
                                    : 'Panel para que el transportista publique origen, destino, fecha y capacidad disponible.'}
                            </p>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                02
                            </p>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                {isAdmin
                                    ? 'Seguimiento del marketplace'
                                    : 'Solicitudes de transporte'}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {isAdmin
                                    ? 'Vista de actividad general, uso de rutas y comportamiento de solicitudes.'
                                    : 'Flujo para que el productor solicite espacio de carga con peso, producto y destino.'}
                            </p>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                03
                            </p>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                {isAdmin
                                    ? 'Seguridad por roles'
                                    : 'Operacion y confianza'}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {isAdmin
                                    ? 'Separacion estricta entre vistas y rutas de transportista, productor y administrador.'
                                    : 'Validacion documental, contacto habilitado y sistema de calificaciones al cierre del servicio.'}
                            </p>
                        </article>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
