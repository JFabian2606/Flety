import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const colombiaTimeZone = 'America/Bogota';

function formatDate(value) {
    if (!value) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: colombiaTimeZone,
    }).format(new Date(value));
}

function formatCurrency(value) {
    if (!value) return 'Sin definir';
    return new Intl.NumberFormat('es-CO', {
        currency: 'COP',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(Number(value));
}

const Icons = {
    Truck: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="7" height="7" x="9" y="9" rx="1"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></svg>,
    MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
    Box: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
    Dollar: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    WhatsApp: () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
};

function StatusStepper({ status }) {
    const steps = [
        { key: 'pending', label: 'Solicitada' },
        { key: 'accepted', label: 'Aceptada' },
    ];

    let currentStepIndex = status === 'accepted' ? 1 : 0;
    
    if (status === 'rejected' || status === 'expired') {
        return (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-rose-100 shadow-sm w-max">
                <Icons.X />
                <span className="font-bold text-sm tracking-wide">
                    {status === 'expired' ? 'Expirada (Sin respuesta)' : 'Rechazada / Cancelada'}
                </span>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-[280px] mt-4 mb-2">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
            <div 
                className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
                style={{ width: currentStepIndex === 0 ? '0%' : '100%' }}
            />
            <div className="relative flex justify-between">
                {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    return (
                        <div key={step.key} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 bg-white ${
                                isCompleted 
                                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                                    : 'border-slate-200 text-slate-300'
                            }`}>
                                {isCompleted ? <Icons.Check /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />}
                            </div>
                            <span className={`text-[10px] font-extrabold uppercase tracking-[0.15em] ${
                                isCompleted ? 'text-emerald-800' : 'text-slate-400'
                            }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-emerald-100 bg-emerald-50/30 px-6 py-20 text-center transition-all hover:bg-emerald-50/50">
            <div className="rounded-full bg-emerald-100/50 p-6 text-emerald-600 mb-6 shadow-sm ring-8 ring-emerald-50">
                <Icons.Box />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sin solicitudes</h3>
            <p className="text-slate-500 max-w-sm leading-relaxed">
                {message}
            </p>
        </div>
    );
}

export default function Index({ requests }) {
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredRequests = requests.filter((req) => 
        filterStatus === 'all' ? true 
        : filterStatus === 'rejected' ? (req.status === 'rejected' || req.status === 'expired')
        : req.status === filterStatus
    );

    const filterOptions = [
        { key: 'all', label: 'Todas' },
        { key: 'pending', label: 'En negociación' },
        { key: 'accepted', label: 'Aceptadas' },
        { key: 'rejected', label: 'Cerradas / Expiradas' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Mis Solicitudes de Carga" />

            {/* Premium Hero Section */}
            <div className="relative bg-[#022c16] px-4 pb-20 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24 overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative max-w-7xl mx-auto z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-emerald-200 ring-1 ring-inset ring-emerald-400/30 mb-6 backdrop-blur-md">
                                Seguimiento en vivo
                            </span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4 drop-shadow-sm">
                                Tus Solicitudes
                            </h1>
                            <p className="text-lg text-emerald-100/80 leading-relaxed font-medium">
                                Administra el estado de tus ofertas de carga. Revisa las tarifas estimadas, visualiza las fechas de salida y ponte en contacto con los transportistas aprobados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-[#f8fafc] py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                    
                    {/* Modern Tabs */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 mb-10 w-max max-w-full overflow-x-auto ring-1 ring-slate-200/50">
                        <div className="flex gap-2 min-w-max">
                            {filterOptions.map((option) => {
                                const count = requests.filter((req) => 
                                    option.key === 'all' ? true 
                                    : option.key === 'rejected' ? (req.status === 'rejected' || req.status === 'expired')
                                    : req.status === option.key
                                ).length;
                                const isActive = filterStatus === option.key;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => setFilterStatus(option.key)}
                                        className={`relative rounded-[1.5rem] px-5 py-3 text-sm font-bold transition-all duration-300 flex items-center gap-3 overflow-hidden ${
                                            isActive
                                                ? 'text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-600/50'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500" />
                                        )}
                                        <span className="relative z-10 tracking-wide">{option.label}</span>
                                        <span
                                            className={`relative z-10 flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-xs font-black ${
                                                isActive
                                                    ? 'bg-white/20 text-white backdrop-blur-md'
                                                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:gap-8">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map(request => (
                                <div key={request.id} className="group relative bg-white rounded-[2rem] border border-slate-200/60 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1">
                                    <div className="flex flex-col xl:flex-row gap-8 xl:items-center xl:justify-between">
                                        
                                        {/* Left Side: Route and Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                                                <div className="flex-1">
                                                    <h4 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3 flex-wrap">
                                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                                            {request.route?.origin}
                                                        </span>
                                                        <span className="text-slate-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                                        </span>
                                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                                            {request.route?.destination}
                                                        </span>
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                                        <Icons.MapPin />
                                                        <span className="truncate">Entrega: {request.delivery_destination}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="hidden sm:block w-px h-16 bg-slate-100 mx-2" />
                                                
                                                <div className="sm:text-right shrink-0">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                                                        Creada el {formatDate(request.requested_at)}
                                                    </p>
                                                    <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
                                                        ID: #{request.id.toString().padStart(5, '0')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Grid Details */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 transition-colors group-hover:bg-emerald-50/30 group-hover:border-emerald-100/50">
                                                    <div className="text-slate-400 mb-3"><Icons.Box /></div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Carga</p>
                                                    <p className="font-bold text-slate-900">{request.product_type}</p>
                                                    <p className="text-sm font-medium text-slate-500">{request.cargo_weight_kg} kg</p>
                                                </div>
                                                
                                                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 transition-colors group-hover:bg-emerald-50/30 group-hover:border-emerald-100/50">
                                                    <div className="text-slate-400 mb-3"><Icons.Calendar /></div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Salida Ruta</p>
                                                    <p className="font-bold text-slate-900">{formatDate(request.route?.departure_at).split(',')[0]}</p>
                                                    <p className="text-sm font-medium text-slate-500">{formatDate(request.route?.departure_at).split(',')[1] || '-'}</p>
                                                </div>

                                                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 transition-colors group-hover:bg-emerald-50/30 group-hover:border-emerald-100/50">
                                                    <div className="text-slate-400 mb-3"><Icons.Truck /></div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Vehículo</p>
                                                    <p className="font-bold text-slate-900">{request.vehicle?.vehicle_type || 'Sin asignar'}</p>
                                                    <p className="text-sm font-medium text-slate-500 tracking-wider uppercase">{request.vehicle?.plate || '---'}</p>
                                                </div>

                                                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/60 shadow-[inset_0_2px_10px_rgba(16,185,129,0.03)]">
                                                    <div className="text-emerald-500 mb-3"><Icons.Dollar /></div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 mb-1">Valor Estimado</p>
                                                    <p className="text-lg font-black text-emerald-900">{formatCurrency(request.estimated_cost)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Status and Actions */}
                                        <div className="w-full xl:w-[320px] shrink-0 bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Estado de la Solicitud</p>
                                            
                                            <StatusStepper status={request.status} />

                                            {request.status === 'accepted' && request.transporter && (
                                                <div className="mt-6 pt-6 border-t border-slate-200/60">
                                                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        Contacto Transportista
                                                    </p>
                                                    <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm mb-3">
                                                        <p className="font-bold text-slate-900 mb-1">{request.transporter.name}</p>
                                                        <p className="text-sm font-medium text-slate-500">
                                                            {request.transporter.phone ? 'Listo para coordinar' : 'Sin número registrado'}
                                                        </p>
                                                    </div>
                                                    {request.transporter.phone && (
                                                        <a 
                                                            href={`https://wa.me/${request.transporter.phone.replace(/[^0-9]/g, '')}`} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="interactive-lift flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1DA851] px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#25D366]/30 transition-all hover:shadow-[#25D366]/40 hover:-translate-y-0.5"
                                                        >
                                                            <Icons.WhatsApp />
                                                            Contactar por WhatsApp
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="No hay solicitudes de carga bajo esta categoría. Vuelve al Mercado de Rutas para crear nuevas ofertas." />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
