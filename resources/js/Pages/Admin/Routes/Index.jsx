import RouteMap from '@/Components/RouteMap';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import colombiaPlaces from '@/Data/colombiaPlaces';

const statusLabels = {
    published: 'Publicada',
    in_progress: 'En camino',
    completed: 'Completada',
    cancelled: 'Cancelada',
    starting_soon: 'Arranca pronto',
    departure_due: 'Hora de salir',
    closed: 'Cerrada',
};

function StatusBadge({ status }) {
    const styles = {
        published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
        completed: 'bg-slate-100 text-slate-800 border-slate-200',
        cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
        starting_soon: 'bg-amber-100 text-amber-800 border-amber-200',
        departure_due: 'bg-amber-100 text-amber-800 border-amber-200',
        closed: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {statusLabels[status] ?? status}
        </span>
    );
}

function RouteCard({ route, isSelected, onSelect }) {
    const handleCancel = () => {
        if (confirm('¿Estás seguro de cancelar esta ruta administrativamente? Esto afectará al transportista.')) {
            router.post(route.cancel_url, {}, { preserveScroll: true });
        }
    };

    return (
        <div 
            onClick={() => onSelect(route)}
            className={`rounded-2xl border p-5 shadow-sm transition cursor-pointer relative overflow-hidden ${isSelected ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'}`}
        >
            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">#{route.id}</span>
                            <StatusBadge status={route.status} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {route.departure_at}
                        </p>
                    </div>
                    {['published', 'starting_soon', 'departure_due', 'in_progress'].includes(route.status) && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                            title="Suspender/Cancelar Ruta Administrativamente"
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:text-rose-700 transition"
                        >
                            Suspender
                        </button>
                    )}
                </div>
                
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origen</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destino</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="flex-1 text-[15px] font-bold text-slate-900 truncate" title={route.origin}>{route.origin}</p>
                        <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                        <p className="flex-1 text-[15px] font-bold text-slate-900 text-right truncate" title={route.destination}>{route.destination}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conductor</p>
                        <p className="text-sm font-bold text-slate-700 truncate" title={route.transporter_name}>{route.transporter_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehículo / Cap.</p>
                        <p className="text-sm font-bold text-emerald-700 truncate">{route.vehicle_plate} • {route.available_capacity_kg}kg</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterLocation({ label, selectedDepartment, selectedCity, onDepartmentChange, onCityChange }) {
    const department = colombiaPlaces.find(d => d.name === selectedDepartment);
    const municipalities = department?.municipalities || [];

    return (
        <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-xs font-black text-emerald-800 uppercase tracking-widest">{label}</label>
            <div className="flex gap-2">
                <select
                    value={selectedDepartment}
                    onChange={(e) => {
                        onDepartmentChange(e.target.value);
                        onCityChange('');
                    }}
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-xs text-slate-900 py-1.5"
                >
                    <option value="">Departamento</option>
                    {colombiaPlaces.map((d) => (
                        <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                </select>
                <select
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    disabled={!selectedDepartment}
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-xs text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 py-1.5"
                >
                    <option value="">{selectedDepartment ? 'Ciudad/Municipio' : 'Elija Dep.'}</option>
                    {municipalities.map((m) => (
                        <option key={m.code} value={m.name}>{m.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default function AdminRoutesIndex({ filters, routes = [] }) {
    const { flash } = usePage().props;
    const [selectedRoute, setSelectedRoute] = useState(null);

    // Filter states
    const [originDept, setOriginDept] = useState('');
    const [originCity, setOriginCity] = useState(filters.origin || '');
    const [destDept, setDestDept] = useState('');
    const [destCity, setDestCity] = useState(filters.destination || '');
    const [status, setStatus] = useState(filters.status || '');

    // Restore department on load based on filtered city names
    useMemo(() => {
        if (filters.origin && !originDept) {
            const dept = colombiaPlaces.find(d => d.municipalities.some(m => m.name === filters.origin));
            if (dept) setOriginDept(dept.name);
        }
        if (filters.destination && !destDept) {
            const dept = colombiaPlaces.find(d => d.municipalities.some(m => m.name === filters.destination));
            if (dept) setDestDept(dept.name);
        }
    }, [filters.origin, filters.destination]);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route('admin.routes.index'),
            { origin: originCity, destination: destCity, status },
            { preserveState: true, preserveScroll: true }
        );
        setSelectedRoute(null);
    };

    const clearFilters = () => {
        setOriginDept('');
        setOriginCity('');
        setDestDept('');
        setDestCity('');
        setStatus('');
        router.get(route('admin.routes.index'), {}, { preserveState: true, preserveScroll: true });
        setSelectedRoute(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Centro de Control Logístico" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-8 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4 shadow-sm">
                                Centro de Mando
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Mapa Interactivo Logístico
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                Monitorea y administra la flota nacional. Filtra, analiza y suspende rutas activas cuando sea necesario.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    
                    {/* Filters Bar */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
                        <form onSubmit={handleFilter} className="flex flex-col lg:flex-row gap-4 lg:items-end">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FilterLocation 
                                    label="Origen"
                                    selectedDepartment={originDept}
                                    selectedCity={originCity}
                                    onDepartmentChange={setOriginDept}
                                    onCityChange={setOriginCity}
                                />
                                <FilterLocation 
                                    label="Destino"
                                    selectedDepartment={destDept}
                                    selectedCity={destCity}
                                    onDepartmentChange={setDestDept}
                                    onCityChange={setDestCity}
                                />
                            </div>
                            
                            <div className="w-full lg:w-48 pb-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Estado</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-slate-900"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="published">Publicadas</option>
                                    <option value="in_progress">En progreso</option>
                                    <option value="completed">Completadas</option>
                                    <option value="cancelled">Canceladas</option>
                                </select>
                            </div>
                            <div className="flex gap-2 w-full lg:w-auto pb-1">
                                <button
                                    type="submit"
                                    className="flex-1 lg:flex-none justify-center inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none"
                                >
                                    Buscar
                                </button>
                                {(originCity || destCity || status) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm flex justify-between items-center">
                            <p className="text-sm font-bold text-emerald-800">{flash.success}</p>
                        </div>
                    )}

                    {/* Main Layout: List & Map side-by-side */}
                    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-380px)] min-h-[600px]">
                        
                        {/* Map View */}
                        <div className="w-full lg:w-2/3 h-[600px] lg:h-full relative overflow-hidden bg-white">
                            <RouteMap 
                                routes={(selectedRoute ? [selectedRoute] : routes).filter(r => r.origin_lat && r.origin_lng)}
                                height="600px"
                                markerDisplay="endpoint-labels"
                            />
                        </div>

                        {/* List View */}
                        <div className="w-full lg:w-1/3 flex flex-col h-full bg-slate-50/50 rounded-3xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Resultados ({routes.length})</h2>
                                {selectedRoute && (
                                    <button onClick={() => setSelectedRoute(null)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Ver Todas</button>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="grid gap-4">
                                    {routes.length > 0 ? (
                                        routes.map((route) => (
                                            <RouteCard
                                                key={route.id}
                                                route={route}
                                                isSelected={selectedRoute?.id === route.id}
                                                onSelect={(r) => setSelectedRoute(r)}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-1">Sin rutas encontradas</h3>
                                            <p className="text-xs text-slate-500 max-w-[200px] mx-auto">No hay rutas activas que coincidan con los filtros aplicados.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
