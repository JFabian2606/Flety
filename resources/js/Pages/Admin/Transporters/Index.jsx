import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const statusLabels = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado',
};

function StatusBadge({ status }) {
    const styles = {
        approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        rejected: 'bg-rose-100 text-rose-800 border-rose-200',
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

const UserIcon = () => (
    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

function TransporterCard({ transporter }) {
    const submitDecision = (href) => {
        router.post(href, {}, { preserveScroll: true });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="hidden sm:flex w-12 h-12 rounded-full bg-slate-50 border border-slate-200 items-center justify-center flex-shrink-0">
                            <UserIcon />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {transporter.name}
                                </h3>
                                <StatusBadge status={transporter.validation_status} />
                            </div>
                            
                            <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contacto</p>
                                    <p className="mt-1 text-sm text-slate-700 font-medium">{transporter.email ?? 'Sin correo'}</p>
                                    <p className="text-sm text-slate-700">{transporter.phone ?? 'Sin teléfono'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identificación</p>
                                    <p className="mt-1 text-sm text-slate-700 font-medium">CC: {transporter.identity_document ?? 'No registrado'}</p>
                                    <p className="text-sm text-slate-700">Licencia: {transporter.driver_license ?? 'No registrada'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-3 justify-end shrink-0">
                        <button
                            type="button"
                            onClick={() => submitDecision(transporter.approve_url)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Aprobar Perfil
                        </button>
                        <button
                            type="button"
                            onClick={() => submitDecision(transporter.reject_url)}
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
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Documentación adjunta</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {transporter.documents.length ? (
                        transporter.documents.map((document) => (
                            <a
                                key={document.id}
                                href={document.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-emerald-300 hover:shadow-sm"
                            >
                                <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                                    <DocumentIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 truncate transition-colors">
                                        {document.label}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Estado: {statusLabels[document.review_status] ?? document.review_status}
                                    </p>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white/50 px-4 py-6 text-center text-sm text-slate-500">
                            El usuario aún no ha subido su documentación reglamentaria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminTransportersIndex({ transporters = [], filters = {} }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'pending');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.transporters.index'), { search, status }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Validar Transportistas" />

            {/* Command Center Hero */}
            <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-8 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c8f2bd] ring-1 ring-inset ring-white/20 mb-4">
                                Administración
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Validación de Perfiles
                            </h1>
                            <p className="mt-2 text-lg text-[#d9ead3] max-w-2xl">
                                Revisa los documentos de identidad y licencias de conducción antes de autorizar a nuevos transportistas a operar en la plataforma.
                            </p>
                        </div>
                        
                        {/* Status Widget */}
                        <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-[#bfe6b5] uppercase tracking-wider font-semibold">Mostrando</p>
                                <p className="text-2xl font-bold text-white">{transporters.length}</p>
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
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Buscar Transportista</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nombre, correo o documento..."
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
                                <option value="approved">Aprobados</option>
                                <option value="rejected">Rechazados</option>
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

                    {/* Transporters List */}
                    <div className="grid gap-6">
                        {transporters.length ? (
                            transporters.map((transporter) => (
                                <TransporterCard
                                    key={transporter.id}
                                    transporter={transporter}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Bandeja limpia</h3>
                                <p className="text-slate-500 mt-1">No hay transportistas pendientes de validación en este momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
