import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

export default function Button({
  className,
  loading,
  disabled,
  error,
  color,
  children,
  ...props
}) {
  return (
    <button
      className={twMerge(
        "flex items-center justify-center rounded-md bg-primary px-8 py-2 text-gray-100 transition-colors hover:bg-primary-hover disabled:bg-primary-disabled",
        color == "white" &&
          "bg-white text-primary hover:bg-white hover:text-black",
        !!error && "bg-red-400 hover:bg-red-300",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
