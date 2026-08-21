import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Create Account</h2>
          <p className="text-slate-400 mt-2 text-sm">Join us for a personalized shopping experience</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              required
            />
          </div>

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
            <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="terms" className="rounded text-violet-600 focus:ring-violet-500 border-slate-300" required />
            <label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer">
              I agree to the{" "}
              <Link href="#" className="font-semibold text-violet-600 hover:text-violet-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-semibold text-violet-600 hover:text-violet-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-violet-200 text-sm"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
