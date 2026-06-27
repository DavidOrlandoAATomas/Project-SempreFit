export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="loading-spinner"></div>
      <p className="mt-4 text-gray-500 animate-pulse">Carregando...</p>
    </div>
  );
}