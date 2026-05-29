import { Link } from '@inertiajs/react';

const highlights = [
    'Roles separados para productor, transportista y administrador.',
    'Flujo de rutas y solicitudes pensado para operación rural.',
    'Base visual alineada con la experiencia principal de Flety.',
];

export default function GuestLayout({
    children,
    title,
    description,
    eyebrow = 'Acceso Flety',
    asideTitle = 'Marketplace logístico para transporte agrícola',
    asideDescription = 'Conecta viajes de retorno con productores que necesitan mover carga de forma simple, clara y confiable.',
    imageSrc = '/assets/landing/hero_escena.png',
    imageAlt = 'Ilustración principal de Flety',
    footer = null,
}) {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Sección Izquierda - Branding (Oculto en móviles) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                {/* Imagen de fondo a pantalla completa con overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="w-full h-full object-cover opacity-40 grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-slate-900/80 to-slate-900/40"></div>
                </div>

                <div className="relative z-10 w-full flex flex-col justify-between p-12 lg:p-16 xl:p-24">
                    <Link href="/">
                        <img
                            src="/assets/landing/logo_flety.png"
                            alt="Flety"
                            className="h-10 w-auto brightness-0 invert" // Logo en blanco
                        />
                    </Link>

                    <div className="mt-auto space-y-6">
                        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                            Plataforma PWA
                        </p>
                        <h1 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight text-white">
                            {asideTitle}
                        </h1>
                        <p className="max-w-lg text-lg text-slate-300 leading-relaxed">
                            {asideDescription}
                        </p>
                        
                        <div className="pt-8 grid gap-4">
                            {highlights.map((highlight, index) => (
                                <div key={index} className="flex items-start gap-3 text-slate-300">
                                    <svg className="w-6 h-6 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm font-medium">{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección Derecha - Formulario */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 bg-slate-50 relative">
                {/* Botón Volver (Móvil) */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/">
                        <img
                            src="/assets/landing/logo_flety.png"
                            alt="Flety"
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-2">
                            {eyebrow}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-3">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-base text-slate-600 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
                        {children}
                    </div>

                    {footer && (
                        <div className="mt-8 text-center text-sm text-slate-600">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
