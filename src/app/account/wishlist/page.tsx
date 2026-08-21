import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12">
        <div className="mb-6">
          <Link href="/account" className="text-sm font-medium text-violet-600 hover:text-violet-500">
            &larr; Back to Account
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Wishlist</h1>
        <p className="text-slate-500">Your wishlist is empty.</p>
      </div>
    </div>
  );
}
