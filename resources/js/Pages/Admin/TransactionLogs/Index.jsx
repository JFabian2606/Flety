import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function StatusBadge({ status }) {
    if (!status) return <span className="text-gray-500">-</span>;

    const styles = {
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    };

    const labels = {
        pending: 'Pendiente',
        accepted: 'Aceptado',
        rejected: 'Rechazado',
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {labels[status] || status}
        </span>
    );
}

function ActionBadge({ action }) {
    const styles = {
        created: 'bg-blue-100 text-blue-800',
        status_changed: 'bg-purple-100 text-purple-800',
        failed: 'bg-red-100 text-red-800 animate-pulse ring-2 ring-red-500/50',
    };

    const labels = {
        created: 'Creación',
        status_changed: 'Cambio de Estado',
        failed: 'Falla Técnica',
    };

    return (
        <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${styles[action] || 'bg-gray-100 text-gray-800'}`}>
            {labels[action] || action}
        </span>
    );
}

export default function Index({ logs, filters, stats }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.transaction-logs.index'),
            { search: searchQuery, start_date: startDate, end_date: endDate },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Auditoría de Transacciones" />

            <div className="-mt-16 sm:-mt-20 bg-[linear-gradient(135deg,#1f2937_0%,#111827_100%)] px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8">
                <div className="mx-auto max-w-[1480px]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-300">
                                Consola de Monitoreo
                            </p>
                            <h1 className="mt-3 break-words text-2xl font-bold leading-tight text-white sm:text-4xl">
                                Auditoría de Transacciones
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-300">
                                Monitorea los eventos de estado, cambios en el ciclo de vida y posibles fallas en las solicitudes de fletes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="-mt-12 min-h-screen px-3 pb-12 sm:px-5 lg:px-6">
                <div className="mx-auto max-w-[1480px] space-y-4">
                    {/* STATS CARDS */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">Transacciones Hoy</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.total_today || 0}</p>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                            <p className="text-sm font-medium text-emerald-600">Aceptadas Hoy</p>
                            <p className="mt-2 text-3xl font-bold text-emerald-900">{stats?.accepted_today || 0}</p>
                        </div>
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
                            <p className="text-sm font-medium text-rose-600">Rechazadas Hoy</p>
                            <p className="mt-2 text-3xl font-bold text-rose-900">{stats?.rejected_today || 0}</p>
                        </div>
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
                            <p className="text-sm font-medium text-red-600">Errores / Fallas Hoy</p>
                            <p className="mt-2 text-3xl font-bold text-red-900">{stats?.failed_today || 0}</p>
                        </div>
                    </div>

                    <section className="animate-panel-rise rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-8">
                        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                Historial de Eventos Técnicos
                            </h2>
                            <form onSubmit={handleSearch} className="flex w-full max-w-3xl flex-col sm:flex-row items-center gap-3">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full sm:w-auto rounded-xl border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    title="Fecha de inicio"
                                />
                                <span className="text-gray-400">a</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full sm:w-auto rounded-xl border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    title="Fecha de fin"
                                />
                                <input
                                    type="text"
                                    placeholder="Buscar por ID o Usuario..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:flex-1 rounded-xl border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <button type="submit" className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">
                                    Filtrar
                                </button>
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="border-b-2 border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">ID Ref.</th>
                                        <th className="px-4 py-3 font-semibold">Fecha y Hora</th>
                                        <th className="px-4 py-3 font-semibold">Acción</th>
                                        <th className="px-4 py-3 font-semibold">Usuario Actor</th>
                                        <th className="px-4 py-3 font-semibold">Estado Nuevo</th>
                                        <th className="px-4 py-3 font-semibold">Rastreo (IP / Disp.)</th>
                                        <th className="px-4 py-3 font-semibold">Detalles Técnicos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className={`transition hover:bg-gray-50 ${log.action === 'failed' ? 'bg-red-50/50' : ''}`}>
                                            <td className="px-4 py-4 font-bold text-gray-900">#{log.transport_request_id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString('es-CO')}
                                            </td>
                                            <td className="px-4 py-4">
                                                <ActionBadge action={log.action} />
                                            </td>
                                            <td className="px-4 py-4">
                                                {log.user ? (
                                                    <span className="font-medium text-indigo-700">{log.user.name}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Sistema</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <StatusBadge status={log.new_status} />
                                                    {log.old_status && (
                                                        <span className="text-[10px] text-gray-400">Antes: {log.old_status}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 max-w-xs">
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-xs text-gray-600">{log.ip_address || 'No IP'}</span>
                                                    <span className="text-[10px] text-gray-400 truncate" title={log.user_agent}>
                                                        {log.user_agent ? log.user_agent.split(' ').slice(0, 3).join(' ') + '...' : '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 max-w-xs truncate">
                                                {log.details ? (
                                                    <button 
                                                        className="text-xs font-bold text-indigo-600 underline"
                                                        onClick={() => alert(JSON.stringify(log.details, null, 2))}
                                                    >
                                                        Ver JSON
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {logs.data.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                                No se encontraron registros de auditoría.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Mostrando {logs.from || 0} a {logs.to || 0} de {logs.total} registros
                            </span>
                            <div className="flex gap-1">
                                {logs.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-lg px-3 py-1 text-sm font-medium ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'cursor-not-allowed bg-gray-50 text-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
