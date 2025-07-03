export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center w-full pt-6" role="status">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
        <div className="absolute inset-1 rounded-full bg-gray-900"></div>
      </div>
      <span className="mt-3 text-sm text-gray-400 animate-pulse">Loading, please wait...</span>
    </div>
  );
}
