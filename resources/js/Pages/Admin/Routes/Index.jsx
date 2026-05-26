import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const statusLabels = {
    published: 'Publicada',
    in_progress: 'En progreso',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

function StatusBadge({ status }) {
    const styles = {
        published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
        completed: 'bg-slate-100 text-slate-800 border-slate-200',
        cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}

function RouteCard({ route }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Route Path */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={route.status} />
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                RUTA #{route.id}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Origen</p>
                                <p className="text-lg font-bold text-slate-900">{route.origin}</p>
                                <p className="text-sm text-slate-500 mt-0.5">{route.departure_at}</p>
                            </div>
                            
                            <div className="px-4 flex flex-col items-center">
                                <div className="h-0.5 w-16 bg-emerald-200 rounded-full"></div>
                                <svg className="w-5 h-5 text-emerald-500 -mt-2.5 bg-white px-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Destino</p>
                                <p className="text-lg font-bold text-slate-900">{route.destination}</p>
                                <p className="text-sm text-slate-500 mt-0.5">{route.arrival_at}</p>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:w-64 shrink-0 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transportista / Vehículo</p>
                            <p className="mt-1 text-sm text-slate-900 font-bold">{route.transporter_name}</p>
                            <p className="text-sm text-slate-600">Placa: <span className="uppercase font-semibold">{route.vehicle_plate}</span></p>
                            <p className="text-sm text-slate-600">{route.transporter_phone}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detalles de carga</p>
                            <p className="mt-1 text-sm text-slate-900">Disponible: <span className="font-bold text-emerald-700">{route.available_capacity_kg} kg</span></p>
                            <p className="text-sm text-slate-900">Tarifa: <span className="font-bold">${route.price_per_kg}/kg</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminRoutesIndex({ routes = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Gestión de Rutas" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 py-8 sm:px-6 lg:px-8 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4">
                                Administración
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Monitoreo de Rutas
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                Visualiza y supervisa todas las rutas publicadas por los transportistas a nivel nacional en tiempo real.
                            </p>
                        </div>
                        
                        {/* Status Widget */}
                        <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-[#bfe6b5] uppercase tracking-wider font-semibold">Total Histórico</p>
                                <p className="text-2xl font-bold text-white">{routes.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Routes List */}
                    <div className="grid gap-6">
                        {routes.length ? (
                            routes.map((route) => (
                                <RouteCard
                                    key={route.id}
                                    route={route}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Sin rutas</h3>
                                <p className="text-slate-500 mt-1">Aún no hay rutas registradas en el sistema.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
