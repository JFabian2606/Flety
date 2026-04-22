export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-2xl border border-transparent bg-[linear-gradient(180deg,#4f9547_0%,#3f7e40_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-24px_rgba(63,126,64,0.75)] transition duration-150 ease-in-out hover:translate-y-[-1px] hover:brightness-[1.03] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:translate-y-0 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
