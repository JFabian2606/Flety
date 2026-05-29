import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const statusLabels = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado',
};

const documentTypeLabels = {
    identity_document: 'Documento de identidad',
    driver_license: 'Licencia de conducción',
};

function FieldError({ message }) {
    if (!message) {
        return null;
    }
    return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}

function StatusBadge({ status }) {
    const styles = {
        approved: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
        rejected: 'bg-rose-100 text-rose-700',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles[status] ?? 'bg-slate-100 text-slate-700'}`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}

function panelClassName(extra = '') {
    return `animate-panel-rise rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-6 ${extra}`.trim();
}

function FileField({ id, label, error, onChange, required = false }) {
    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                id={id}
                type="file"
                accept="image/*,application/pdf"
                required={required}
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#427c46] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-emerald-500 focus:ring-emerald-500"
            />
            <FieldError message={error} />
        </div>
    );
}

function DocumentForm() {
    const form = useForm({
        document_type: 'identity_document',
        document_number: '',
        document_file: null,
        identity_document_expedition_date: '',
        identity_document_expedition_place: '',
        driver_license_category: '',
        driver_license_expiration_date: '',
    });

    const isIdentity = form.data.document_type === 'identity_document';
    const isLicense = form.data.document_type === 'driver_license';

    return (
        <article className={panelClassName()}>
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#427c46]">
                    Subida
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                    Cargar o actualizar documento
                </h3>
                <p className="max-w-3xl text-sm leading-6 text-slate-600">
                    Sube tu Cédula de Ciudadanía o Licencia de Conducción. La imagen adjunta servirá únicamente como soporte para verificar los datos ingresados.
                </p>
            </div>

            <form
                className="mt-6 space-y-4"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(route('transporter.documents.store'), {
                        forceFormData: true,
                        preserveScroll: true,
                        onSuccess: () => form.reset(),
                    });
                }}
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="document_type"
                            className="text-sm font-medium text-slate-700"
                        >
                            Tipo de documento
                        </label>
                        <select
                            id="document_type"
                            required
                            value={form.data.document_type}
                            onChange={(event) =>
                                form.setData('document_type', event.target.value)
                            }
                            className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        >
                            <option value="identity_document">Cédula de ciudadanía</option>
                            <option value="driver_license">Licencia de conducción</option>
                        </select>
                        <FieldError message={form.errors.document_type} />
                    </div>

                    <div>
                        <label
                            htmlFor="document_number"
                            className="text-sm font-medium text-slate-700"
                        >
                            Número de documento
                        </label>
                        <input
                            id="document_number"
                            required
                            value={form.data.document_number}
                            onChange={(event) =>
                                form.setData('document_number', event.target.value)
                            }
                            className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            placeholder="Ej. 1010202030"
                        />
                        <FieldError message={form.errors.document_number} />
                    </div>
                </div>

                {isIdentity && (
                    <div className="grid gap-4 md:grid-cols-2 animate-panel-rise">
                        <div>
                            <label
                                htmlFor="identity_document_expedition_date"
                                className="text-sm font-medium text-slate-700"
                            >
                                Fecha de expedición
                            </label>
                            <input
                                id="identity_document_expedition_date"
                                type="date"
                                required={isIdentity}
                                value={form.data.identity_document_expedition_date}
                                onChange={(event) =>
                                    form.setData('identity_document_expedition_date', event.target.value)
                                }
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            />
                            <FieldError message={form.errors.identity_document_expedition_date} />
                        </div>
                        <div>
                            <label
                                htmlFor="identity_document_expedition_place"
                                className="text-sm font-medium text-slate-700"
                            >
                                Lugar de expedición
                            </label>
                            <input
                                id="identity_document_expedition_place"
                                required={isIdentity}
                                value={form.data.identity_document_expedition_place}
                                onChange={(event) =>
                                    form.setData('identity_document_expedition_place', event.target.value)
                                }
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                placeholder="Ej. Bogotá D.C."
                            />
                            <FieldError message={form.errors.identity_document_expedition_place} />
                        </div>
                    </div>
                )}

                {isLicense && (
                    <div className="grid gap-4 md:grid-cols-2 animate-panel-rise">
                        <div>
                            <label
                                htmlFor="driver_license_category"
                                className="text-sm font-medium text-slate-700"
                            >
                                Categoría
                            </label>
                            <input
                                id="driver_license_category"
                                required={isLicense}
                                value={form.data.driver_license_category}
                                onChange={(event) =>
                                    form.setData('driver_license_category', event.target.value)
                                }
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                placeholder="Ej. C2"
                            />
                            <FieldError message={form.errors.driver_license_category} />
                        </div>
                        <div>
                            <label
                                htmlFor="driver_license_expiration_date"
                                className="text-sm font-medium text-slate-700"
                            >
                                Fecha de vencimiento
                            </label>
                            <input
                                id="driver_license_expiration_date"
                                type="date"
                                required={isLicense}
                                value={form.data.driver_license_expiration_date}
                                onChange={(event) =>
                                    form.setData('driver_license_expiration_date', event.target.value)
                                }
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                            />
                            <FieldError message={form.errors.driver_license_expiration_date} />
                        </div>
                    </div>
                )}

                <FileField
                    id="document_file"
                    label="Imagen para verificación (Foto o PDF)"
                    required
                    error={form.errors.document_file}
                    onChange={(file) => form.setData('document_file', file)}
                />

                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Al guardar, los datos y la imagen de soporte serán enviados a revisión. Asegúrate de que la información coincida exactamente con la foto para que te aprueben rápidamente.
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="interactive-lift inline-flex w-full justify-center rounded-xl bg-[#427c46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#356b3f] disabled:opacity-60 sm:w-auto"
                >
                    {form.processing ? 'Enviando...' : 'Guardar y enviar'}
                </button>
            </form>
        </article>
    );
}

function DocumentList({ documents, transporter }) {
    const identityDoc = documents.find(d => d.document_type === 'identity_document');
    const licenseDoc = documents.find(d => d.document_type === 'driver_license');

    return (
        <article className={panelClassName()}>
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#427c46]">
                    Estado actual
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                    Tus documentos
                </h3>
            </div>

            <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <p className="font-semibold text-slate-900">Cédula de ciudadanía</p>
                            <p className="mt-1 text-sm text-slate-600 font-medium">
                                {transporter.identity_document ? `Número: ${transporter.identity_document}` : 'No se ha registrado número'}
                            </p>
                            {transporter.identity_document_expedition_date && (
                                <p className="mt-1 text-xs text-slate-500">
                                    Expedida el {transporter.identity_document_expedition_date} en {transporter.identity_document_expedition_place}
                                </p>
                            )}
                            {identityDoc?.uploaded_at ? (
                                <p className="mt-2 text-xs text-slate-400">
                                    Soporte subido el {identityDoc.uploaded_at}
                                </p>
                            ) : null}
                            {identityDoc?.review_notes ? (
                                <p className="mt-2 text-sm text-rose-600">
                                    Nota: {identityDoc.review_notes}
                                </p>
                            ) : null}
                        </div>
                        {identityDoc ? (
                            <StatusBadge status={identityDoc.review_status} />
                        ) : (
                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] bg-slate-200 text-slate-700">Faltante</span>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <p className="font-semibold text-slate-900">Licencia de conducción</p>
                            <p className="mt-1 text-sm text-slate-600 font-medium">
                                {transporter.driver_license ? `Número: ${transporter.driver_license}` : 'No se ha registrado número'}
                            </p>
                            {transporter.driver_license_category && (
                                <p className="mt-1 text-xs text-slate-500">
                                    Categoría {transporter.driver_license_category} • Vence el {transporter.driver_license_expiration_date}
                                </p>
                            )}
                            {licenseDoc?.uploaded_at ? (
                                <p className="mt-2 text-xs text-slate-400">
                                    Soporte subido el {licenseDoc.uploaded_at}
                                </p>
                            ) : null}
                            {licenseDoc?.review_notes ? (
                                <p className="mt-2 text-sm text-rose-600">
                                    Nota: {licenseDoc.review_notes}
                                </p>
                            ) : null}
                        </div>
                        {licenseDoc ? (
                            <StatusBadge status={licenseDoc.review_status} />
                        ) : (
                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] bg-slate-200 text-slate-700">Faltante</span>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function Documents({ transporter, documents = [] }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Validación de documentos" />

            <div className="w-full min-h-screen bg-slate-50">
                {/* Edge-to-Edge Hero */}
                <div className="bg-[linear-gradient(135deg,#06451f_0%,#083f24_48%,#02552c_100%)] px-4 pb-12 pt-28 sm:pt-32 sm:px-6 lg:px-8 text-white -mt-20 sm:-mt-24">
                    <div className="mx-auto max-w-[1560px]">
                        {flash.success ? (
                            <section className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                                {flash.success}
                            </section>
                        ) : null}
                        {flash.error ? (
                            <section className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
                                {flash.error}
                            </section>
                        ) : null}
                        
                        <div className="mt-4 flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2 sm:px-4">
                            <div className="min-w-0 max-w-3xl">
                                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#bfe6b5] mb-4">
                                    <span className="grid h-6 w-6 place-items-center rounded-lg border border-white/15 bg-white/10 text-sm">
                                        +
                                    </span>
                                    Validación de identidad
                                </p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
                                    Documentos del transportista
                                </h1>
                                <p className="mt-4 text-lg text-[#d9ead3] max-w-2xl leading-relaxed">
                                    Mantén tus documentos actualizados para seguir operando sin interrupciones. La administración revisará y aprobará tus credenciales.
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <Link
                                    href={route('transporter.dashboard')}
                                    className="interactive-lift inline-flex justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20 backdrop-blur-sm"
                                >
                                    Volver al panel
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50">
                    <div className="mx-auto max-w-[1560px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] items-start">
                            <DocumentForm />
                            <DocumentList documents={documents} transporter={transporter} />
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
