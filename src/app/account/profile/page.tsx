import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12">
        <div className="mb-6">
          <Link href="/account" className="text-sm font-medium text-violet-600 hover:text-violet-500">
            &larr; Back to Account
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Profile Details</h1>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
            <input type="text" defaultValue="John Doe" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Email Address</label>
            <input type="email" defaultValue="you@example.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
          </div>
          <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
