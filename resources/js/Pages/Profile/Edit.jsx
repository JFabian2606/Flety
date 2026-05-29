import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePaymentMethodsForm from './Partials/UpdatePaymentMethodsForm'; // <-- 1. Importamos el nuevo formulario

export default function Edit({ mustVerifyEmail, status, transporter }) { // <-- 2. Recibimos al transportista
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#427c46]">
                        Cuenta
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-900">
                        Perfil
                    </h2>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="bg-[linear-gradient(180deg,#eef7ec_0%,#f7faf4_100%)] py-5 sm:py-7">
                <div className="mx-auto max-w-[1540px] space-y-5 px-3 sm:px-5 lg:px-8">
                    <div className="animate-panel-rise rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* NUEVA SECCIÓN: Solo se muestra si el usuario es transportista */}
                    {transporter && (
                        <div className="animate-panel-rise stagger-1 rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-8">
                            <UpdatePaymentMethodsForm 
                                transporter={transporter} 
                                className="max-w-xl" 
                            />
                        </div>
                    )}

                    <div className="animate-panel-rise stagger-2 rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="animate-panel-rise stagger-3 rounded-2xl border border-[#dfe8dc] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(31,74,49,0.35)] sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}