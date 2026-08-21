import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Account</h1>
        <p className="text-slate-500 mb-8">Manage your profile, order history, and preferences.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/account/profile" className="p-6 border border-slate-100 hover:border-violet-500 rounded-2xl bg-slate-50 transition-colors">
            <h2 className="font-bold text-lg text-slate-880">Edit Profile</h2>
            <p className="text-sm text-slate-400 mt-1">Update your email, password, and contact info</p>
          </Link>
          <Link href="/account/orders" className="p-6 border border-slate-100 hover:border-violet-500 rounded-2xl bg-slate-50 transition-colors">
            <h2 className="font-bold text-lg text-slate-880">My Orders</h2>
            <p className="text-sm text-slate-400 mt-1">View your order history and track deliveries</p>
          </Link>
          <Link href="/account/wishlist" className="p-6 border border-slate-100 hover:border-violet-500 rounded-2xl bg-slate-50 transition-colors">
            <h2 className="font-bold text-lg text-slate-880">Wishlist</h2>
            <p className="text-sm text-slate-400 mt-1">Check the items you have saved for later</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
