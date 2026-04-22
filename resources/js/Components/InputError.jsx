export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm font-medium text-rose-600 ' + className}
        >
            {message}
        </p>
    ) : null;
}
