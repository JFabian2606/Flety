import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ roles, selectedRole }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        role: selectedRole ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Crea tu cuenta y entra al flujo de Flety"
            description="Registra tu perfil como transportista o productor para empezar a publicar rutas o solicitar capacidad de carga."
            eyebrow="Registro"
            asideTitle="Un acceso bien creado simplifica toda la operacion posterior"
            asideDescription="Desde aqui definimos el rol que determina la experiencia dentro del sistema y las acciones permitidas."
            imageSrc="/assets/landing/transportador.png"
            imageAlt="Transportador de Flety"
            footer={
                <span>
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        href={route('login')}
                        className="font-semibold text-emerald-700 transition hover:text-emerald-600"
                    >
                        Inicia sesion aqui
                    </Link>
                </span>
            }
        >
            <Head title="Crear cuenta" />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nombre completo" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        placeholder="Escribe tu nombre completo"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Correo electronico" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        autoComplete="username"
                        placeholder="nombre@correo.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Telefono" />

                    <TextInput
                        id="phone"
                        type="text"
                        name="phone"
                        value={data.phone}
                        className="mt-2 block w-full"
                        autoComplete="tel"
                        placeholder="3001234567"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />

                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Tipo de cuenta" />

                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900 shadow-sm transition focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                        onChange={(e) => setData('role', e.target.value)}
                        required
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map((role) => (
                            <option key={role.slug} value={role.slug}>
                                {role.name}
                            </option>
                        ))}
                    </select>

                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contrasena" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        placeholder="Minimo 8 caracteres"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar contrasena"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        placeholder="Repite tu contrasena"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end pt-2">
                    <PrimaryButton className="min-w-[180px]" disabled={processing}>
                        Crear cuenta
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
