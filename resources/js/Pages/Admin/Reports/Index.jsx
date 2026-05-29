import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminReportsIndex({ filters, available_products, summary, reports }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [productType, setProductType] = useState(filters.product_type || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route('admin.reports.index'),
            { date_from: dateFrom, date_to: dateTo, product_type: productType },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setProductType('');
        router.get(route('admin.reports.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const exportToCSV = () => {
        if (!reports.length) return;
        
        const headers = ['Fecha / Servicio ID', 'Origen', 'Destino', 'Producto', 'Peso (kg)', 'Transportista', 'Productor', 'Monto Acordado (COP)'];
        const rows = reports.map(r => [
            `${r.confirmed_at} (ID: ${r.id})`,
            r.origin,
            r.destination,
            r.product_type,
            r.weight_kg,
            r.transporter,
            r.producer,
            r.amount
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `reporte_flety_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reportes Operativos" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-8 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4">
                                Administración
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Reportes Operativos
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                Analiza los viajes concretados, exporta datos y obtén métricas exactas del rendimiento económico de la plataforma.
                            </p>
                        </div>

                        {/* Summary Widgets */}
                        <div className="flex flex-wrap lg:flex-nowrap gap-4">
                            <div className="flex-1 lg:flex-none items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm min-w-48 flex">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l6-6-6-6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-[#bfe6b5] uppercase tracking-wider font-semibold">Viajes (Filtro)</p>
                                    <p className="text-2xl font-bold text-white">{summary.total_trips}</p>
                                </div>
                            </div>
                            <div className="flex-1 lg:flex-none items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm min-w-48 flex">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-[#bfe6b5] uppercase tracking-wider font-semibold">Peso Total</p>
                                    <p className="text-2xl font-bold text-white">{new Intl.NumberFormat('es-CO').format(summary.total_weight_kg)} <span className="text-sm font-medium text-[#c8f2bd]">kg</span></p>
                                </div>
                            </div>
                            <div className="flex-1 lg:flex-none items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm min-w-48 flex">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-[#bfe6b5] uppercase tracking-wider font-semibold">Valor Transado</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(summary.total_amount)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Filters Bar & Actions */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-8 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-end">
                        <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 items-end flex-1 w-full">
                            <div className="w-full sm:flex-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Desde</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition text-slate-900"
                                />
                            </div>
                            <div className="w-full sm:flex-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Hasta</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition text-slate-900"
                                />
                            </div>
                            <div className="w-full sm:w-64">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Tipo de Producto</label>
                                <select
                                    value={productType}
                                    onChange={(e) => setProductType(e.target.value)}
                                    className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition text-slate-900"
                                >
                                    <option value="">Todos los productos</option>
                                    {available_products.map((pt) => (
                                        <option key={pt} value={pt}>{pt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    type="submit"
                                    className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filtrar
                                </button>
                                {(dateFrom || dateTo || productType) && (
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
                        
                        <div className="w-full xl:w-auto flex xl:block">
                            <button
                                type="button"
                                onClick={exportToCSV}
                                disabled={reports.length === 0}
                                className="w-full justify-center inline-flex items-center gap-2 rounded-xl border-2 border-emerald-600 bg-emerald-50 px-6 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Exportar CSV
                            </button>
                        </div>
                    </div>

                    {/* Report Data Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha / Servicio ID</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ruta (Origen &rarr; Destino)</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Producto y Peso</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actores</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acuerdo Comercial</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {reports.length > 0 ? (
                                        reports.map((report) => (
                                            <tr key={report.id} className="hover:bg-emerald-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-slate-900">{report.confirmed_at}</div>
                                                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">ID: #{report.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-slate-900">{report.origin}</div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                        {report.destination}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800 mb-1">
                                                        {report.product_type}
                                                    </span>
                                                    <div className="text-sm font-bold text-slate-700">{report.weight_kg} kg</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-900"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">T:</span> {report.transporter}</div>
                                                    <div className="text-sm text-slate-900 mt-1"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">P:</span> {report.producer}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="text-sm font-bold text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-lg border border-emerald-100">
                                                        {formatCurrency(report.amount)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                                                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900">Sin resultados</h3>
                                                    <p className="text-slate-500 mt-1 max-w-md mx-auto">No se encontraron viajes concretados que coincidan con los filtros aplicados.</p>
                                                </div>
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
