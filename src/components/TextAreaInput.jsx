import { twMerge } from "tailwind-merge";

export default function TextAreaInput({
  placeholder,
  id,
  label,
  type,
  autoFocus,
  defaultValue,
  className,
  rootClassName,
  ...props
}) {
  return (
    <div className={twMerge("flex flex-col gap-1", rootClassName)}>
      <label htmlFor={id} className="font-normal text-gray-400">
        {label}
      </label>
      <textarea
        id={id}
        type={type}
        autoFocus={autoFocus}
        className={twMerge(
          "rounded-md border border-gray-300 px-4 py-3 text-gray-500 placeholder-gray-300 outline-none transition-all focus:border-gray-600",
          className,
        )}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...props}
      />
    </div>
  );
}
