import "./select.module.css";

export default function Select({
  id,
  label,
  autoFocus,
  defaultValue,
  children,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-normal text-gray-400">
        {label}
      </label>
      <select
        id={id}
        autoFocus={autoFocus}
        className="rounded-md border border-gray-300 bg-transparent px-4 py-3 text-gray-500 placeholder-gray-300 outline-none transition-all focus:border-gray-600"
        defaultValue={defaultValue}
        required
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
