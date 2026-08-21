import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
      <h1 className="text-6xl font-black text-violet-600">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-2">Page Not Found</h2>
      <p className="text-slate-500 max-w-sm mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl shadow-md hover:bg-violet-700 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
