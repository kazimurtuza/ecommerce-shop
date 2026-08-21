import Link from "next/link";

export default function ProductsPage() {
  const dummyProducts = [
    { id: 1, name: "Premium Wireless Headset", price: 199.0, category: "electronics", slug: "premium-wireless-headset", desc: "Noise cancelling studio headphones" },
    { id: 2, name: "Minimalist Leather Backpack", price: 120.0, category: "fashion", slug: "minimalist-leather-backpack", desc: "Handcrafted full-grain leather backpack" },
    { id: 3, name: "Smart Ergonomic Desk Lamp", price: 85.0, category: "home-living", slug: "smart-ergonomic-desk-lamp", desc: "LED eye-friendly lamp with phone charger" },
    { id: 4, name: "Hydrating Botanic Face Serum", price: 45.0, category: "beauty", slug: "hydrating-botanic-face-serum", desc: "All-natural organic rosehip face serum" },
    { id: 5, name: "Mechanical Mechanical Keyboard", price: 159.0, category: "electronics", slug: "mechanical-keyboard", desc: "Hot-swappable tactile mechanical keyboard" },
    { id: 6, name: "Classic Cotton White Tee", price: 29.0, category: "fashion", slug: "cotton-white-tee", desc: "100% organic cotton breathable tee" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Explore Products</h1>
        <p className="text-slate-500 mb-10">Find premium quality items curated just for you.</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Filters</h3>
            
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Categories</h4>
              <div className="space-y-2">
                {["Electronics", "Fashion", "Home & Living", "Beauty & Wellness"].map((c) => (
                  <label key={c} className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                    <input type="checkbox" className="rounded text-violet-600 focus:ring-violet-500 border-slate-300" />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Price Range</h4>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                <span className="text-slate-400">-</span>
                <input type="number" placeholder="Max" className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>

            <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-xl text-sm transition-colors shadow-sm">
              Apply Filters
            </button>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyProducts.map((product) => (
                <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100">
                  <div className="aspect-square bg-slate-100 relative flex items-center justify-center p-8 group-hover:bg-slate-200/50 transition-colors">
                    <span className="text-slate-400 font-bold text-lg">{product.name.split(" ").map(w => w[0]).join("")}</span>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded text-slate-900 border border-slate-100">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-1">
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.desc}</p>
                      <p className="text-lg font-bold mt-3 text-slate-900">${product.price.toFixed(2)}</p>
                    </div>
                    <button className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-xl text-sm transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
