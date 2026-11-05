export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
      <p className="mt-4 text-gray-500 font-medium">Loading...</p>
    </div>
  );
}