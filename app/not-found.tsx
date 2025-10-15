export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-12">
      <div className="text-center">
        <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gray-100 grid place-items-center">
          <svg viewBox="0 0 24 24" className="h-12 w-12 text-gray-400"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6h6v-2h-4V7z"/></svg>
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-gray-600 mt-2">Let’s get you back on track.</p>
        <a href="/" className="mt-4 inline-block px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800">Go home</a>
      </div>
    </div>
  );
}