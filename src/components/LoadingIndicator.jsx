import Spinner from "./Spinner";

export default function LoadingIndicator({ hideLabel }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <Spinner size={26} />
      {!hideLabel && <p className="-ml-4 text-sm">Loading</p>}
    </div>
  );
}
