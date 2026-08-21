import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Steps/Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">1. Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">First Name</label>
                  <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Last Name</label>
                  <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Street Address</label>
                  <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">City</label>
                  <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Postal Code</label>
                  <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">2. Payment Method</h2>

              <div className="space-y-4">
                {[
                  { id: "credit-card", name: "Credit/Debit Card", desc: "Pay securely with Visa, Mastercard, or Amex" },
                  { id: "paypal", name: "PayPal", desc: "Redirect to PayPal to complete your purchase" }
                ].map((pay) => (
                  <label key={pay.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-violet-500 cursor-pointer transition-colors">
                    <input type="radio" name="payment" defaultChecked={pay.id === "credit-card"} className="mt-1 text-violet-600 focus:ring-violet-500" />
                    <div>
                      <span className="block font-semibold text-slate-800 text-sm">{pay.name}</span>
                      <span className="block text-xs text-slate-400 mt-1">{pay.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
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

            <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-violet-200 text-sm">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
