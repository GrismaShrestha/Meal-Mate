import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

export default function Button({
  className,
  loading,
  disabled,
  color,
  children,
  ...props
}) {
  return (
    <button
      className={twMerge(
        "flex items-center justify-center rounded-md bg-primary px-8 py-2 transition-colors hover:bg-primary-hover disabled:bg-primary-disabled text-gray-100",
        color == "white" &&
          "bg-white text-primary hover:bg-white hover:text-black",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
