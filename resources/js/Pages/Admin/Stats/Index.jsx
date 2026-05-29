import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminStatsIndex({ metrics, topCargoTypes, topOrigins, growthTrend }) {
    
    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Inteligencia de Negocios" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-8 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4">
                                Administración
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Inteligencia de Negocios
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                Análisis en tiempo real de volumen transaccional, tendencias de crecimiento y zonas calientes.
                            </p>
                        </div>

                        {/* Financial Volume Widget */}
                        <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-[#bfe6b5] uppercase tracking-wider font-semibold">Volumen Transaccional</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(metrics.financial_volume)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Usuarios Activos</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{metrics.total_users}</p>
                                <p className="text-xs font-semibold text-slate-400 mt-1">Prod: {metrics.producers_count} • Trans: {metrics.transporters_count}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Viajes Exitosos</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{metrics.completed_trips}</p>
                                <p className="text-xs font-semibold text-emerald-500 mt-1">&uarr; Crecimiento estable</p>
                            </div>
                        </div>
                        
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                                <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Zonas Calientes</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{topOrigins.length}</p>
                                <p className="text-xs font-semibold text-slate-400 mt-1">Con alta demanda</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Area Chart: Tendencia de Crecimiento */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Tendencia de Crecimiento (Viajes)</h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorViajes" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="viajes" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorViajes)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart: Tipos de Carga */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Demanda por Tipo de Carga</h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topCargoTypes} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <XAxis dataKey="product_type" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <Tooltip 
                                            cursor={{fill: '#f8fafc'}}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="total_requests" name="Solicitudes" fill="#0284c7" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Rankings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Hotspots */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-rose-50 rounded-lg">
                                    <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Zonas Calientes (Orígenes top)</h2>
                            </div>
                            <ul className="divide-y divide-slate-100">
                                {topOrigins.map((origin, idx) => (
                                    <li key={origin.origin} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-400 font-bold text-lg">#{idx + 1}</span>
                                            <span className="font-bold text-slate-900">{origin.origin}</span>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                            {origin.total_routes} rutas
                                        </span>
                                    </li>
                                ))}
                                {topOrigins.length === 0 && (
                                    <li className="px-6 py-8 text-center text-slate-500 text-sm">No hay datos suficientes para calcular hotspots.</li>
                                )}
                            </ul>
                        </div>

                        {/* Top Cargo Details */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Top Productos Movilizados</h2>
                            </div>
                            <ul className="divide-y divide-slate-100">
                                {topCargoTypes.map((cargo, idx) => (
                                    <li key={cargo.product_type} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition">
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-400 font-bold text-lg">#{idx + 1}</span>
                                            <span className="font-bold text-slate-900">{cargo.product_type}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-slate-500">{cargo.total_requests} viajes</span>
                                            <span className="font-bold text-emerald-700">{cargo.total_weight} kg</span>
                                        </div>
                                    </li>
                                ))}
                                {topCargoTypes.length === 0 && (
                                    <li className="px-6 py-8 text-center text-slate-500 text-sm">No hay datos de productos suficientes.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
