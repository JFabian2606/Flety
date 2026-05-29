import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const statusLabels = {
    available: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado',
    in_transit: 'En tránsito',
    maintenance: 'Mantenimiento',
};

function StatusBadge({ status }) {
    const styles = {
        available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        rejected: 'bg-rose-100 text-rose-800 border-rose-200',
        in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
        maintenance: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}

const DocumentIcon = () => (
    <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const TruckIcon = () => (
    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
);

function VehicleCard({ vehicle }) {
    const submitDecision = (href) => {
        router.post(href, {}, { preserveScroll: true });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Vehicle Info */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="hidden sm:flex w-12 h-12 rounded-full bg-slate-50 border border-slate-200 items-center justify-center flex-shrink-0">
                            <TruckIcon />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-slate-900 uppercase">
                                    {vehicle.plate}
                                </h3>
                                <StatusBadge status={vehicle.status ?? 'pending'} />
                            </div>
                            
                            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transportista</p>
                                    <p className="mt-1 text-sm text-slate-700 font-bold">{vehicle.transporter_name}</p>
                                    <p className="text-sm text-slate-600">{vehicle.transporter_phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detalles</p>
                                    <p className="mt-1 text-sm text-slate-700 font-medium">{vehicle.brand} {vehicle.model}</p>
                                    <p className="text-sm text-slate-600">Tipo: <span className="capitalize">{vehicle.vehicle_type}</span></p>
                                    <p className="text-sm text-slate-600">Carga: {vehicle.capacity_kg} kg</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vencimientos</p>
                                    <p className="mt-1 text-sm text-slate-700">SOAT: <span className="font-medium">{vehicle.insurance_expires_at}</span></p>
                                    <p className="text-sm text-slate-700">Tecno: <span className="font-medium">{vehicle.technical_review_expires_at}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-3 justify-end shrink-0">
                        <button
                            type="button"
                            onClick={() => submitDecision(vehicle.approve_url)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Aprobar Vehículo
                        </button>
                        <button
                            type="button"
                            onClick={() => submitDecision(vehicle.reject_url)}
                            className="flex items-center justify-center gap-2 rounded-xl border-2 border-rose-100 bg-white px-6 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 hover:border-rose-200"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Rechazar
                        </button>
                    </div>
                </div>
            </div>

            {/* Documents Section */}
            <div className="bg-slate-50 border-t border-slate-100 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Documentos del Vehículo</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {vehicle.links && vehicle.links.length > 0 ? (
                        vehicle.links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-emerald-300 hover:shadow-sm"
                            >
                                <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                                    <DocumentIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 truncate transition-colors">
                                        {link.label}
                                    </p>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white/50 px-4 py-6 text-center text-sm text-slate-500">
                            No se adjuntaron documentos o enlaces para este vehículo.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminVehiclesIndex({ vehicles = [], filters = {} }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'pending');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.vehicles.index'), { search, status }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Validar Vehículos" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 py-8 sm:px-6 lg:px-8 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4">
                                Administración
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Validación de Vehículos
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                Revisa la documentación obligatoria (SOAT, Técnico-mecánica, Licencia de tránsito) antes de permitir que un vehículo opere.
                            </p>
                        </div>
                        
                        {/* Status Widget */}
                        <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                <TruckIcon />
                            </div>
                            <div>
                                <p className="text-xs text-[#bfe6b5] uppercase tracking-wider font-semibold">Mostrando</p>
                                <p className="text-2xl font-bold text-white">{vehicles.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Buscar Vehículo</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Placa, marca o nombre del transportista..."
                                className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-slate-900"
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Estado</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-slate-900"
                            >
                                <option value="">Todos</option>
                                <option value="pending">Pendientes</option>
                                <option value="available">Aprobados</option>
                                <option value="rejected">Rechazados</option>
                                <option value="in_transit">En tránsito</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none">
                                Filtrar
                            </button>
                        </div>
                    </form>
                    
                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-bold text-emerald-800">{flash.success}</p>
                            </div>
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-bold text-rose-800">{flash.error}</p>
                            </div>
                        </div>
                    )}

                    {/* Vehicles List */}
                    <div className="grid gap-6">
                        {vehicles.length ? (
                            vehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Bandeja limpia</h3>
                                <p className="text-slate-500 mt-1">No hay vehículos pendientes de validación en este momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
