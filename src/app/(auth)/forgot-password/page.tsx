import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Forgot Password</h2>
          <p className="text-slate-400 mt-2 text-sm">Enter your email to receive a password reset link</p>
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
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-violet-200 text-sm"
          >
            Send Reset Link
          </button>
        </form>
        <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-500">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
