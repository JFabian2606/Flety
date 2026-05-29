import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdatePaymentMethodsForm({ transporter, className = '' }) {
    // Inicializamos el formulario de Inertia leyendo lo que ya está guardado en la base de datos
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        payment_methods: transporter?.payment_methods || [],
    });

    // Definimos las opciones disponibles (Emojis ligeros y colores)
    const availableMethods = [
        { id: 'efectivo', name: 'Efectivo', icon: '💵' },
        { id: 'nequi', name: 'Nequi', icon: '📱' },
        { id: 'daviplata', name: 'Daviplata', icon: '📲' },
    ];

    // Función para agregar o quitar el método del arreglo cuando tocan el botón
    const toggleMethod = (methodId) => {
        if (data.payment_methods.includes(methodId)) {
            // Si ya lo tiene, lo quitamos
            setData('payment_methods', data.payment_methods.filter(m => m !== methodId));
        } else {
            // Si no lo tiene, lo agregamos
            setData('payment_methods', [...data.payment_methods, methodId]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Enviamos la petición al ProfileController que modificamos hace un rato
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-slate-900">Métodos de Pago Preferidos</h2>
                <p className="mt-1 text-sm text-slate-600">
                    Selecciona cómo prefieres que los productores te paguen al finalizar un flete. Puedes elegir más de una opción. Estas opciones se le mostrarán al productor cuando vaya a solicitar tu servicio.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Cuadrícula adaptable: 1 columna en móvil, 3 en pantallas grandes */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {availableMethods.map((method) => {
                        const isSelected = data.payment_methods.includes(method.id);
                        
                        return (
                            <button
                                type="button"
                                key={method.id}
                                onClick={() => toggleMethod(method.id)}
                                className={`relative flex cursor-pointer rounded-xl border-2 p-4 shadow-sm focus:outline-none transition-all duration-200 ${
                                    isSelected 
                                        ? `border-[#427c46] bg-[#f7faf4] ring-1 ring-[#427c46]` 
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-3">{method.icon}</div>
                                        <div className="text-left">
                                            <p className={`font-semibold text-lg ${isSelected ? 'text-[#427c46]' : 'text-slate-900'}`}>
                                                {method.name}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Icono de Check (Solo aparece si está seleccionado) */}
                                    {isSelected && (
                                        <div className="shrink-0 text-[#427c46] animate-panel-rise">
                                            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        disabled={processing}
                        className="inline-flex items-center rounded-md border border-transparent bg-[#427c46] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-[#326136] focus:bg-[#326136] focus:outline-none focus:ring-2 focus:ring-[#427c46] focus:ring-offset-2 active:bg-[#254928] disabled:opacity-50"
                    >
                        Guardar Preferencias
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-medium text-[#427c46]">¡Guardado correctamente!</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
} 