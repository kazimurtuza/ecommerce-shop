import Link from "next/link";

export default function CartPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { id: 1, name: "Premium Wireless Headset", price: 199.0, qty: 1 },
              { id: 2, name: "Minimalist Leather Backpack", price: 120.0, qty: 1 }
            ].map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-slate-400">{item.name.split(" ").map(w => w[0]).join("")}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-base">{item.name}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Electronics</p>
                    <p className="text-sm font-bold text-slate-900 mt-2">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden divide-x divide-slate-200">
                    <button className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 font-medium">-</button>
                    <span className="px-4 py-1.5 flex items-center justify-center bg-white text-sm font-medium text-slate-900 min-w-8">
                      {item.qty}
                    </span>
                    <button className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 font-medium">+</button>
                  </div>

                  <button className="text-sm text-red-500 hover:text-red-600 font-medium">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">$319.00</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Estimated Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tax</span>
                <span className="font-medium text-slate-900">$25.52</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-4">
                <span>Total</span>
                <span>$344.52</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-violet-200 text-sm"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
