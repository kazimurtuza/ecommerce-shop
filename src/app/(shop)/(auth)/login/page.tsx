import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome Back</h2>
          <p className="text-slate-400 mt-2 text-sm">Sign in to manage your orders and wishlist</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-600">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-violet-600 hover:text-violet-500">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-violet-200 text-sm"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
