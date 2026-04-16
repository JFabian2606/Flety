import { Head, Link } from '@inertiajs/react';

const features = [
    {
        title: 'Encuentra Viajes',
        description:
            'Busca rutas de retorno con espacio disponible cerca de ti.',
        icon: '/assets/landing/icono_encuentra_viajes.png',
    },
    {
        title: 'Asegura Transporte',
        description:
            'Solicita transporte de forma simple y espera confirmacion.',
        icon: '/assets/landing/icono_asegura_transporte.png',
    },
    {
        title: 'Ahorra y Aprovecha',
        description:
            'Utiliza viajes vacios y reduce costos de transporte.',
        icon: '/assets/landing/icono_ahorra_aprovecha.png',
    },
];

function ArrowRightIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7 4L13 10L7 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TruckMiniIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 7.5H14V15H3V7.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14 10.5H18L20.5 13V15H14V10.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7 17.5C7 18.3284 6.32843 19 5.5 19C4.67157 19 4 18.3284 4 17.5C4 16.6716 4.67157 16 5.5 16C6.32843 16 7 16.6716 7 17.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M19 17.5C19 18.3284 18.3284 19 17.5 19C16.6716 19 16 18.3284 16 17.5C16 16.6716 16.6716 16 17.5 16C18.3284 16 19 16.6716 19 17.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M5 10H10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M5 12.5H8.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function LeafMiniIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M18.5 5C12.5 5.3 8 9.6 8 15V19C14.1 19 19 14.1 19 8V5.5C19 5.22386 18.7761 5 18.5 5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 19C8 13.5 5.2 10 2 8.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M8 14C5.2 14 3.2 12.9 2 11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function Welcome({ auth, canLogin, canRegister }) {
    const user = auth?.user;
    const registerUrl = route('register');
    const transporterRegisterUrl = route('register', { role: 'transportista' });
    const producerRegisterUrl = route('register', { role: 'productor' });

    return (
        <>
            <Head title="Flety" />

            <div className="min-h-screen bg-[#fbfaf6] text-[#29463d]">
                <header className="border-b border-[#ece7da] bg-white/95 shadow-[0_14px_40px_-34px_rgba(30,55,44,0.35)] backdrop-blur">
                    <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/assets/landing/logo_flety.png"
                                alt="Flety"
                                className="h-12 w-auto sm:h-14"
                            />
                        </Link>

                        <nav className="flex items-center gap-3 sm:gap-5">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center rounded-2xl bg-[#4f9547] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(79,149,71,0.65)] transition hover:bg-[#46863f]"
                                >
                                    Ir al panel
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium text-[#2b3f39] transition hover:text-[#4f9547]"
                                        >
                                            Iniciar sesion
                                        </Link>
                                    )}

                                    {canRegister && (
                                        <Link
                                            href={registerUrl}
                                            className="inline-flex items-center overflow-hidden rounded-2xl bg-[#4f9547] text-sm font-semibold text-white shadow-[0_16px_34px_-20px_rgba(79,149,71,0.7)] transition hover:bg-[#478640]"
                                        >
                                            <span className="px-5 py-3">Registrate</span>
                                            <span className="flex h-full items-center border-l border-white/25 px-3 py-3 text-white/90">
                                                <ArrowRightIcon />
                                            </span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
                    <section className="relative overflow-hidden rounded-[34px] shadow-[0_28px_80px_-42px_rgba(61,97,79,0.45)]">
                        <img
                            src="/assets/landing/hero_escena.png"
                            alt="Flety conecta rutas de retorno con productores"
                            className="block w-full rounded-[34px]"
                        />

                        {!user && canRegister && (
                            <Link
                                href={registerUrl}
                                aria-label="Registrate"
                                className="absolute left-[6.7%] top-[55.8%] block h-[8.2%] w-[17.8%] rounded-[18px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4f9547]/35"
                            />
                        )}

                        <a
                            href="#mas-informacion"
                            aria-label="Mas informacion"
                            className="absolute left-[25.8%] top-[55.8%] block h-[8.2%] w-[20.4%] rounded-[18px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4f9547]/25"
                        />
                    </section>

                    <section className="relative -mt-3 rounded-[34px] bg-white px-6 pb-12 pt-10 shadow-[0_28px_80px_-50px_rgba(61,97,79,0.32)] sm:px-8 lg:px-10">
                        <div className="grid gap-8 text-center md:grid-cols-3 md:gap-10">
                            {features.map((feature) => (
                                <article
                                    key={feature.title}
                                    className="flex flex-col items-center"
                                >
                                    <img
                                        src={feature.icon}
                                        alt={feature.title}
                                        className="h-[92px] w-auto object-contain"
                                    />
                                    <h2 className="mt-4 text-[2rem] font-semibold tracking-[-0.03em] text-[#4c8753] sm:text-[2.15rem] md:text-[2.05rem]">
                                        {feature.title}
                                    </h2>
                                    <p className="mt-3 max-w-[18rem] text-[1.05rem] leading-8 text-[#485953] sm:text-[1.15rem]">
                                        {feature.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section
                        id="mas-informacion"
                        className="relative mt-10 overflow-hidden rounded-[34px] border border-[#efe8dc] bg-[radial-gradient(circle_at_top,rgba(255,255,255,1),rgba(247,244,236,1)_62%,rgba(245,240,232,1)_100%)] px-6 py-14 shadow-[0_24px_70px_-48px_rgba(61,97,79,0.35)] sm:px-8 lg:px-12 lg:py-16"
                    >
                        <div className="absolute left-1/2 top-8 h-44 w-44 -translate-x-1/2 rounded-full bg-[#fff7d5] opacity-70 blur-3xl" />
                        <div className="relative text-center">
                            <h2 className="text-[2.45rem] font-semibold tracking-[-0.04em] text-[#23453c] sm:text-[2.9rem]">
                                Nuevo en Flety?
                            </h2>
                            <p className="mt-3 text-[2rem] font-semibold tracking-[-0.03em] text-[#2d4c43] sm:text-[2.35rem]">
                                Conecta y transporta en solo unos pasos
                            </p>
                            <p className="mt-5 text-[1.1rem] text-[#616660] sm:text-[1.25rem]">
                                Empieza creando una cuenta:
                            </p>

                            <div className="mt-8 grid gap-4 sm:mx-auto sm:max-w-[640px] sm:grid-cols-2">
                                <Link
                                    href={transporterRegisterUrl}
                                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[linear-gradient(180deg,#ffa73e_0%,#ff8a1d_100%)] px-6 py-4 text-[1.1rem] font-semibold text-white shadow-[0_18px_42px_-28px_rgba(255,138,29,0.8)] transition hover:translate-y-[-1px]"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12">
                                        <TruckMiniIcon />
                                    </span>
                                    Soy Transportista
                                </Link>

                                <Link
                                    href={producerRegisterUrl}
                                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[linear-gradient(180deg,#ffd24d_0%,#ffb92c_100%)] px-6 py-4 text-[1.1rem] font-semibold text-white shadow-[0_18px_42px_-28px_rgba(255,185,44,0.8)] transition hover:translate-y-[-1px]"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12">
                                        <LeafMiniIcon />
                                    </span>
                                    Soy Productor
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="mt-10 grid gap-5 md:grid-cols-3">
                        {features.map((feature) => (
                            <article
                                key={`${feature.title}-card`}
                                className="rounded-[26px] border border-[#eee8dc] bg-white p-6 shadow-[0_22px_60px_-48px_rgba(47,80,63,0.42)]"
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={feature.icon}
                                        alt=""
                                        className="h-14 w-14 flex-none object-contain"
                                    />
                                    <div>
                                        <h3 className="text-[2rem] font-semibold leading-tight tracking-[-0.04em] text-[#313d39]">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-4 text-[1.05rem] leading-8 text-[#4e5f59]">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                </main>
            </div>
        </>
    );
}
