import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500 ' +
                className
            }
            ref={localRef}
        />
    );
});
