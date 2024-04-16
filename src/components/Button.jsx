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
        "flex items-center justify-center rounded-md bg-primary px-8 py-2 text-gray-100 transition-colors hover:bg-primary-hover",
        loading && color == undefined && "disabled:bg-primary-disabled",
        color == "white" &&
          "bg-white text-primary hover:bg-gray-100",
        color == "purple" &&
          "bg-[#DCE6FE] text-gray-500 hover:bg-[#B5C1E6] hover:text-gray-100",
        loading && color == undefined && "disabled:bg-[#EBF1FE]",
        !!error && "bg-red-400 hover:bg-red-300",
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <Spinner
          className={twMerge(
            color == "white" && "text-gray-400",
            color == "purple" && "text-white",
          )}
        />
      )}
      {children}
    </button>
  );
}
