import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

function StatCard({ title, value, description, icon, highlight }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:shadow-md h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
                        {icon}
                    </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {title}
                </p>
                <p className={`text-4xl font-bold ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {value}
                </p>
            </div>
            {description && (
                <p className="mt-4 text-sm font-medium text-slate-400">
                    {description}
                </p>
            )}
        </div>
    );
}

export default function Index({ metrics, topCargoTypes }) {
    return (
        <AuthenticatedLayout>
            <Head title="Estadísticas de uso" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 py-8 sm:px-6 lg:px-8 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4">
                                Administración
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Estadísticas de Uso
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                Monitoriza el crecimiento, adopción de usuarios y volumen de carga transada en la plataforma.
                            </p>
                        </div>
                        
                        {/* Status Widget */}
                        <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-[#bfe6b5] uppercase tracking-wider font-semibold">Tendencia</p>
                                <p className="text-sm font-bold text-white">Sistema Activo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-slate-50 py-10 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-600 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-slate-900">Resumen General</h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            title="Total Usuarios"
                            value={metrics.total_users}
                            description={`${metrics.producers_count} productores y ${metrics.transporters_count} transportistas registrados.`}
                            icon={
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Viajes concretados"
                            value={metrics.completed_trips}
                            description="Servicios de transporte confirmados y operando actualmente."
                            highlight={true}
                            icon={
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Tasa de Crecimiento"
                            value="Activo"
                            description="La plataforma registra operaciones contínuas en rutas."
                            icon={
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                                </svg>
                            }
                        />
                    </div>

                    <div className="mt-14">
                        <div className="mb-6 flex items-center gap-2">
                            <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                            <h3 className="text-2xl font-bold text-slate-900">Demanda Logística (Top Cargas)</h3>
                        </div>
                        
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50/80">
                                    <tr>
                                        <th scope="col" className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Producto / Carga
                                        </th>
                                        <th scope="col" className="px-8 py-5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Total Solicitudes
                                        </th>
                                        <th scope="col" className="px-8 py-5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Volumen Transado (kg)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {topCargoTypes && topCargoTypes.length > 0 ? (
                                        topCargoTypes.map((cargo, idx) => (
                                            <tr key={idx} className="transition hover:bg-slate-50/60 group">
                                                <td className="whitespace-nowrap px-8 py-5">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-emerald-100 transition">
                                                            <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700">{idx + 1}</span>
                                                        </div>
                                                        <span className="font-bold text-slate-900 text-lg">{cargo.product_type}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-8 py-5 text-right">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                                                        {cargo.total_requests} req
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-8 py-5 text-right">
                                                    <span className="text-base font-bold text-emerald-700">
                                                        {Number(cargo.total_weight).toLocaleString('es-CO')} <span className="text-sm font-medium text-slate-500">kg</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-16 text-center">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                                                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <p className="text-lg font-bold text-slate-900">Aún no hay datos de carga</p>
                                                <p className="text-slate-500 mt-1">Las estadísticas aparecerán cuando los productores soliciten transporte.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
