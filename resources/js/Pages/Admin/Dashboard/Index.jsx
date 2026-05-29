import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Icons for metrics
const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
);

const TruckIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
);

const RouteIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
);

const WarningIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export default function AdminDashboard({ dashboardRole, dashboardData }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    
    // Deconstruct data safely
    const hero = dashboardData?.hero || {};
    const pills = dashboardData?.pills || [];
    const metrics = dashboardData?.metrics || [];
    const lists = dashboardData?.lists || [];
    const spotlight = dashboardData?.spotlight || {};

    const pendingVehiclesList = lists[0];
    const recentRoutesList = lists[1];

    const getIconForMetric = (index) => {
        switch(index) {
            case 0: return <UserIcon />; // Transportistas
            case 1: return <UserIcon />; // Productores
            case 2: return <WarningIcon />; // Vehículos Pendientes
            case 3: return <RouteIcon />; // Rutas publicadas
            default: return <UserIcon />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Panel de Administración" />

            <div className="min-h-screen bg-slate-50 pb-12">
                {/* Hero Section (Command Center Style) */}
                <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-10 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src="/assets/landing/logo_flety.png"
                                        alt="Flety"
                                        className="h-10 w-auto brightness-0 invert"
                                    />
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-[#c8f2bd] ring-1 ring-inset ring-emerald-500/30">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        {hero.badge}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                    Hola, {user.name.split(' ')[0]}
                                </h1>
                                <p className="mt-2 text-lg text-[#d9ead3]">
                                    {hero.subtitle}
                                </p>
                            </div>
                            
                            {/* Top right pills */}
                            <div className="flex flex-wrap gap-3">
                                {pills.map((pill, idx) => (
                                    <div key={idx} className="flex flex-col items-end px-4 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm shadow-[0_24px_50px_-42px_rgba(0,0,0,0.55)]">
                                        <span className="text-xs font-medium text-[#bfe6b5] uppercase tracking-wider">{pill.label}</span>
                                        <span className="text-xl font-bold text-white mt-1">{pill.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                    
                    {/* Flash messages */}
                    {flash.success && (
                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-emerald-800">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-rose-800">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KPI Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {metrics.map((metric, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
                                        {getIconForMetric(idx)}
                                    </div>
                                    <span className={`text-2xl font-bold ${idx === 2 && parseInt(metric.value) > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                                        {metric.value}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{metric.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Main Action Area (Pending Vehicles) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{pendingVehiclesList?.title || 'Pendientes'}</h3>
                                        <p className="text-sm text-slate-500 mt-1">Vehículos que requieren revisión de documentación</p>
                                    </div>
                                    {pendingVehiclesList?.items?.length > 0 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            {pendingVehiclesList.items.length} pendientes
                                        </span>
                                    )}
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {pendingVehiclesList?.items?.length > 0 ? (
                                        pendingVehiclesList.items.map((item, index) => (
                                            <div key={index} className="p-6 transition hover:bg-slate-50">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                                <TruckIcon />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                                                            <p className="text-sm text-slate-500 mt-1">{item.meta}</p>
                                                            
                                                            {/* Document Links */}
                                                            {item.links && item.links.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mt-3">
                                                                    {item.links.map((link, lidx) => (
                                                                        <a 
                                                                            key={lidx} 
                                                                            href={link.href} 
                                                                            target="_blank" 
                                                                            rel="noreferrer"
                                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
                                                                        >
                                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                                                                            </svg>
                                                                            {link.label}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    {item.actions && item.actions.length > 0 && (
                                                        <div className="flex items-center gap-2 sm:ml-4">
                                                            {item.actions.map((action, aidx) => (
                                                                <button
                                                                    key={aidx}
                                                                    onClick={() => router.post(action.href, {}, { preserveScroll: true })}
                                                                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${
                                                                        action.type === 'approve' 
                                                                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm' 
                                                                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    {action.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-900">Todo al día</h3>
                                            <p className="text-slate-500 mt-1">{pendingVehiclesList?.emptyMessage || 'No hay vehículos pendientes por revisar.'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Secondary Info */}
                        <div className="space-y-6">
                            
                            {/* Spotlight Card */}
                            <div className="bg-[#1e293b] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500 opacity-20 rounded-full blur-2xl"></div>
                                
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Atención Sugerida</span>
                                <h3 className="text-xl font-bold mt-2">{spotlight?.title || 'Validación'}</h3>
                                
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider">Objetivo</p>
                                        <p className="font-medium mt-1">{spotlight?.route}</p>
                                        <p className="text-sm text-slate-300">{spotlight?.dateLabel}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-700/50">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider">{spotlight?.infoLabel || 'Estado'}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="font-medium">{spotlight?.infoValue}</p>
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                                {spotlight?.statusLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Routes Timeline */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">{recentRoutesList?.title || 'Últimas rutas creadas'}</h3>
                                
                                <div className="space-y-0">
                                    {recentRoutesList?.items?.length > 0 ? (
                                        recentRoutesList.items.map((route, idx) => (
                                            <div key={idx} className="relative pl-6 pb-6 last:pb-0">
                                                {/* Timeline line */}
                                                {idx !== recentRoutesList.items.length - 1 && (
                                                    <div className="absolute top-2 left-2 bottom-0 w-px bg-slate-200"></div>
                                                )}
                                                {/* Timeline dot */}
                                                <div className="absolute top-1.5 left-0 w-4 h-4 rounded-full border-2 border-emerald-500 bg-white"></div>
                                                
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{route.title}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{route.meta}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 text-center py-4">{recentRoutesList?.emptyMessage || 'Aún no hay rutas registradas.'}</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
