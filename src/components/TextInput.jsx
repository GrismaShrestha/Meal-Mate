export default function TextInput({
  placeholder,
  id,
  label,
  type,
  autoFocus,
  defaultValue,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-normal text-gray-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoFocus={autoFocus}
        className="rounded-md border border-gray-300 px-4 py-3 text-gray-500 placeholder-gray-300 outline-none transition-all focus:border-gray-600"
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...props}
      />
    </div>
  );
}
