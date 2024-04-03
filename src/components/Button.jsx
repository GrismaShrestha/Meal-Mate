import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

export default function Button({ className, loading, disabled, children }) {
  return (
    <button
      className={twMerge(
        "px-8 py-2 bg-primary hover:bg-primary-hover transition-colors rounded-md flex items-center disabled:bg-primary-disabled",
        className
      )}
      disabled={disabled}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
