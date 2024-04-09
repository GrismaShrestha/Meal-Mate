import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

export default function Button({
  className,
  loading,
  disabled,
  error,
  color,
  children,
  type,
  ...props
}) {
  return (
    <button
      className={twMerge(
        "flex items-center justify-center rounded-md bg-primary px-8 py-2 text-gray-100 transition-colors hover:bg-primary-hover disabled:bg-primary-disabled",
        color == "white" &&
          "bg-white text-primary hover:bg-white hover:text-black",
        color == "purple" &&
          "bg-[#DCE6FE] text-gray-500 hover:bg-[#B5C1E6] hover:text-gray-100",
        !!error && "bg-red-400 hover:bg-red-300",
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
