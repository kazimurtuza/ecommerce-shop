import Link from "next/link";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  
  // Format slug to a readable name for illustration
  const name = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 md:p-12">
        <div className="mb-6">
          <Link href="/products" className="text-sm font-medium text-violet-600 hover:text-violet-500">
            &larr; Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Gallery Placeholder */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
              <span className="text-5xl font-extrabold text-slate-300">
                {name.split(" ").map(w => w[0]).join("")}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-violet-500 transition-colors" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Premium Selection</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4">{name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-black text-slate-900">$199.00</span>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">
                  In Stock
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed mb-6">
                This is a premium product designed with user-centric engineering and refined aesthetics. Carefully manufactured using durable, high-quality materials to guarantee longevity and unmatched performance. Perfect for enhancing your modern lifestyle.
              </p>

              <div className="space-y-4 border-t border-b border-slate-100 py-6 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-slate-800 font-medium capitalize">{slug.includes("headset") ? "Electronics" : "General"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping:</span>
                  <span className="text-slate-800 font-medium">Free (Standard)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Returns:</span>
                  <span className="text-slate-800 font-medium">30-day Money-back Guarantee</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex border border-slate-200 rounded-xl overflow-hidden divide-x divide-slate-200">
                <button className="px-4 py-3 bg-slate-50 hover:bg-slate-100 font-medium">-</button>
                <span className="px-6 py-3 flex items-center justify-center bg-white font-medium text-slate-900 min-w-12">1</span>
                <button className="px-4 py-3 bg-slate-50 hover:bg-slate-100 font-medium">+</button>
              </div>
              <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-violet-200">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
