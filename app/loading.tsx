export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center pt-24 pb-24" role="status" aria-live="polite" aria-label="Cargando contenido">
      <div className="w-16 h-16 border-4 border-dais-red border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      <p className="font-black text-2xl text-dais-dark uppercase tracking-widest mt-6">
        Cargando
      </p>
      <p className="text-gray-500 mt-2">Preparando el verdadero sabor...</p>
    </div>
  );
}
