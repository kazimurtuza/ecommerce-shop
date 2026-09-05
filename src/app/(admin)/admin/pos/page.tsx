"use client";

import React, { useState, useEffect, useRef } from "react";
import { getProducts, saveProducts, getOrders, saveOrders, getUsers, saveUsers, Product, Order, User } from "@/lib/db";

export default function POSPage() {
  // DB states
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Checkout states
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [cashAmountPaid, setCashAmountPaid] = useState<string>("");

  // Customer creation modal states
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  // Invoice success modal states
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [changeReturned, setChangeReturned] = useState<number>(0);

  // Time state for POS screen
  const [currentTime, setCurrentTime] = useState("");

  // Mount logic
  useEffect(() => {
    setProducts(getProducts());
    setCustomers(getUsers().filter((u) => u.role === "Customer"));

    // Tick current time
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter products
  const categories = ["All", "Family Matching", "Mickey & Friends", "Outwear", "Accessories"];
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || p.tag === selectedCategory;
    const isPublished = p.status === "Published";
    return matchesSearch && matchesCategory && isPublished;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    const existingIdx = cart.findIndex((item) => item.product.id === product.id);
    if (existingIdx !== -1) {
      const currentQty = cart[existingIdx].quantity;
      if (currentQty >= product.stock) {
        alert(`Only ${product.stock} items are available in stock.`);
        return;
      }
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, increment: boolean) => {
    const idx = cart.findIndex((item) => item.product.id === productId);
    if (idx === -1) return;

    const currentQty = cart[idx].quantity;
    const maxStock = cart[idx].product.stock;

    if (increment) {
      if (currentQty >= maxStock) {
        alert(`Cannot add more. Stock limit is ${maxStock} items.`);
        return;
      }
      const updated = [...cart];
      updated[idx].quantity += 1;
      setCart(updated);
    } else {
      if (currentQty <= 1) {
        // Remove item
        setCart(cart.filter((item) => item.product.id !== productId));
      } else {
        const updated = [...cart];
        updated[idx].quantity -= 1;
        setCart(updated);
      }
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    if (confirm("Are you sure you want to clear the current sale?")) {
      setCart([]);
      setSelectedCustomerId("");
      setDiscountValue(0);
      setCashAmountPaid("");
    }
  };

  // Calculations
  const getSubtotal = () => {
    return cart.reduce((sum, item) => {
      const priceNum = parseFloat(item.product.price.replace("$", ""));
      return sum + (isNaN(priceNum) ? 0 : priceNum) * item.quantity;
    }, 0);
  };

  const getDiscountAmount = () => {
    const sub = getSubtotal();
    if (discountType === "flat") {
      return Math.min(discountValue, sub);
    } else {
      return (sub * Math.min(discountValue, 100)) / 100;
    }
  };

  const getTaxAmount = () => {
    const sub = getSubtotal();
    const disc = getDiscountAmount();
    // 5% VAT rate
    return (sub - disc) * 0.05;
  };

  const getGrandTotal = () => {
    const sub = getSubtotal();
    const disc = getDiscountAmount();
    const tax = getTaxAmount();
    return Math.max(0, sub - disc + tax);
  };

  // Add Customer Action
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) {
      alert("Name and email are required.");
      return;
    }

    const allUsers = getUsers();
    const newId = allUsers.length > 0 ? Math.max(...allUsers.map((u) => u.id)) + 1 : 1;
    const newCustUser: User = {
      id: newId,
      name: newCustomer.name,
      email: newCustomer.email,
      role: "Customer",
      registeredDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "Active",
    };

    const updatedUsers = [...allUsers, newCustUser];
    saveUsers(updatedUsers);
    
    // Refresh states
    setCustomers(updatedUsers.filter((u) => u.role === "Customer"));
    setSelectedCustomerId(String(newId));
    setNewCustomer({ name: "", email: "", phone: "" });
    setShowAddCustomerModal(false);
    alert(`Customer "${newCustUser.name}" successfully registered!`);
  };

  // Place Order Checkout action
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty. Add products to checkout.");
      return;
    }

    // Customer
    const matchedCustomer = customers.find((c) => String(c.id) === selectedCustomerId);
    const customerName = matchedCustomer ? matchedCustomer.name : "Walk-in Customer";
    const customerEmail = matchedCustomer ? matchedCustomer.email : "walkin@example.com";
    const customerPhone = matchedCustomer ? (matchedCustomer.phone || "N/A") : "N/A";

    const grandTotal = getGrandTotal();

    // Cash Change verification
    let cashPaid = grandTotal;
    if (paymentMethod === "Cash") {
      const parsedPaid = parseFloat(cashAmountPaid);
      if (isNaN(parsedPaid) || parsedPaid < grandTotal) {
        alert(`Insufficient cash payment. Must pay at least $${grandTotal.toFixed(2)}`);
        return;
      }
      cashPaid = parsedPaid;
    }

    // 1. Deduct Stock catalog in localStorage
    const currentProducts = getProducts();
    const updatedProducts = currentProducts.map((p) => {
      const cartItem = cart.find((item) => item.product.id === p.id);
      if (cartItem) {
        return {
          ...p,
          stock: Math.max(0, p.stock - cartItem.quantity),
        };
      }
      return p;
    });
    saveProducts(updatedProducts);
    setProducts(updatedProducts); // sync local page state

    // 2. Format Order item lists
    const orderItems = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    // 3. Create POS order
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-POS-${randomNum}`;
    const dateFormatted = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      date: dateFormatted,
      subtotal: `$${getSubtotal().toFixed(2)}`,
      shipping: "$0.00",
      discount: `$${getDiscountAmount().toFixed(2)}`,
      total: `$${grandTotal.toFixed(2)}`,
      status: "Completed",
      itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      shippingAddress: "In-store Pickup",
      paymentMethod,
      paymentStatus: "Paid",
      items: orderItems,
    };

    // Save order in orders list
    const currentOrders = getOrders();
    saveOrders([newOrder, ...currentOrders]);

    // Setup success modal
    setCompletedOrder(newOrder);
    setChangeReturned(paymentMethod === "Cash" ? Math.max(0, cashPaid - grandTotal) : 0);
  };

  const startNewSale = () => {
    setCart([]);
    setSelectedCustomerId("");
    setDiscountValue(0);
    setCashAmountPaid("");
    setCompletedOrder(null);
    setChangeReturned(0);
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12 transition-colors duration-200">
      {/* POS Top Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-violet-600 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full">
              LIVE SYSTEM
            </span>
            <span className="text-[11px] font-bold text-slate-400">Cashier: Admin Session</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1">POS Checkout Terminal</h1>
        </div>
        <div className="flex items-center gap-4 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-2.5 text-right self-start sm:self-auto shadow-inner">
          <svg className="w-5 h-5 text-violet-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Time</p>
            <p className="text-sm font-black font-mono tracking-wide text-violet-300 mt-0.5">{currentTime || "--:--:--"}</p>
          </div>
        </div>
      </div>

      {/* POS Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Product Grid (Col Span 7) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or tag..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              <div className="absolute left-3.5 top-3 text-slate-450">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Select tabs */}
            <div className="overflow-x-auto flex gap-1 bg-slate-50 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/30">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-1.5 px-3.5 text-[10px] font-bold rounded-lg transition-all shrink-0 cursor-pointer select-none ${
                    selectedCategory === cat
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/40 dark:border-slate-700/40"
                      : "text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-250"
                  }`}
                >
                  {cat === "All" ? "All Items" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 5;
                const cartQty = cart.find((item) => item.product.id === p.id)?.quantity || 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`group relative overflow-hidden bg-white dark:bg-slate-900 border rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all select-none flex flex-col justify-between h-64 ${
                      isOutOfStock ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    } ${
                      cartQty > 0 ? "ring-2 ring-violet-500 dark:ring-violet-450 border-transparent dark:border-transparent bg-violet-500/[0.01]" : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {/* Item count in cart badge */}
                    {cartQty > 0 && (
                      <span className="absolute top-2.5 right-2.5 z-10 bg-violet-600 text-white font-black text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-md">
                        {cartQty}
                      </span>
                    )}

                    {/* Stock status indicator */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      {isOutOfStock ? (
                        <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-rose-250 dark:border-rose-900/30">
                          OUT OF STOCK
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-100 dark:bg-amber-955/40 text-amber-700 dark:text-amber-400 text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-amber-250 dark:border-amber-900/30">
                          {p.stock} LEFT
                        </span>
                      ) : null}
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Meta */}
                    <div className="mt-3 flex-1 flex flex-col justify-between">
                      <h3 className="text-[11px] font-extrabold text-slate-850 dark:text-slate-150 leading-snug line-clamp-2">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-wide">
                          {p.tag}
                        </span>
                        <span className="text-xs font-black text-violet-600 dark:text-violet-400">
                          {p.price}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
                No active products found matching filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Billing Pane (Col Span 5) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-6 space-y-6 flex flex-col justify-between min-h-[600px]">
            {/* Customer selector bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Select Customer
                </label>
                <button
                  onClick={() => setShowAddCustomerModal(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-450 hover:underline cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Quick Add Customer</span>
                </button>
              </div>

              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
              >
                <option value="">Walk-in Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Cart item listing */}
            <div className="flex-1 flex flex-col justify-between py-4 border-t border-b border-slate-100 dark:border-slate-800">
              <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-350">
                {cart.length > 0 ? (
                  cart.map((item) => {
                    const itemTotal = parseFloat(item.product.price.replace("$", "")) * item.quantity;
                    return (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850/50 group"
                      >
                        {/* Image */}
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-850 shrink-0"
                        />

                        {/* Title and Price */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 truncate leading-snug">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] font-black text-violet-600 dark:text-violet-455 mt-0.5">
                            {item.product.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, false)}
                            className="h-6 w-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center font-bold text-xs cursor-pointer select-none transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200 w-5 text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, true)}
                            className="h-6 w-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center font-bold text-xs cursor-pointer select-none transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-20 text-center text-slate-400 dark:text-slate-500 font-semibold flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-slate-300 dark:text-slate-650" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    <span>Shopping Cart is empty</span>
                  </div>
                )}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-4 pt-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Subtotal</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">${getSubtotal().toFixed(2)}</span>
                </div>

                {/* Discount input row */}
                <div className="flex justify-between items-center gap-4 py-1.5 border-t border-b border-slate-100 dark:border-slate-850">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Apply Discount</span>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl">
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "flat" | "percent")}
                      className="bg-transparent border-none text-[10px] font-extrabold focus:outline-none text-slate-700 dark:text-slate-350 cursor-pointer"
                    >
                      <option value="flat">USD ($)</option>
                      <option value="percent">Percentage (%)</option>
                    </select>
                    <input
                      type="number"
                      value={discountValue || ""}
                      onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="0"
                      className="w-12 text-right bg-transparent border-none text-xs font-black focus:outline-none text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Discount Amount</span>
                  <span className="text-rose-600 dark:text-rose-455 font-bold">-${getDiscountAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Tax (5% VAT)</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">${getTaxAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-900 dark:text-white font-extrabold text-sm border-t border-slate-100 dark:border-slate-800 pt-3.5">
                  <span>Grand Total</span>
                  <span className="text-violet-650 dark:text-violet-400 font-black text-base">
                    ${getGrandTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Cash", "Card", "bKash / Nagad"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2.5 px-2 text-[10px] font-extrabold rounded-xl border transition-all text-center cursor-pointer select-none ${
                        paymentMethod === method
                          ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-550/15"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Paid input (only displays when payment method is Cash) */}
              {paymentMethod === "Cash" && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">
                    Cash Paid ($)
                  </label>
                  <input
                    type="number"
                    value={cashAmountPaid}
                    onChange={(e) => setCashAmountPaid(e.target.value)}
                    placeholder={`Min. $${getGrandTotal().toFixed(2)}`}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-black font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={clearCart}
                  className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-850 px-4 py-3.5 text-xs font-bold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer select-none"
                >
                  Hold / Reset
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-750 transition-colors disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  <span>Checkout / Collect Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Quick Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">Quick Register Customer</h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="e.g. Shakib Al Hasan"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="e.g. shakib@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="e.g. +880 1700 000000"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-850 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-750 transition-colors cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Completed Order Invoice Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md">
          {/* Modal Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl space-y-6 print:absolute print:inset-0 print:m-0 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black print:dark:bg-white print:dark:text-black">
            {/* Header layout */}
            <div className="text-center pb-5 border-b border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-md">
                <span className="text-sm font-black text-white">HB</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-widest text-slate-900 dark:text-white print:text-black uppercase">
                HATBAZAR SHOP
              </h2>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">
                Sales Transaction Receipt
              </p>
            </div>

            {/* Receipt metadata details */}
            <div className="text-xs space-y-2.5 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/50 print:bg-transparent print:border-none print:p-0">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-550 font-semibold uppercase tracking-wide">Receipt ID:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 print:text-black">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-550 font-semibold uppercase tracking-wide">Date Time:</span>
                <span className="font-extrabold text-slate-850 dark:text-slate-100 print:text-black">{completedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-550 font-semibold uppercase tracking-wide">Customer:</span>
                <span className="font-extrabold text-slate-850 dark:text-slate-100 print:text-black">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-550 font-semibold uppercase tracking-wide">Fulfillment:</span>
                <span className="font-extrabold text-emerald-650 dark:text-emerald-450 uppercase">STORE PICKUP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-550 font-semibold uppercase tracking-wide">Payment:</span>
                <span className="font-extrabold text-slate-850 dark:text-slate-100 print:text-black uppercase">{completedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Invoiced items list */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest pb-1 border-b border-slate-100 dark:border-slate-850">
                Purchased Items
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-52 overflow-y-auto">
                {completedOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 text-xs">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate print:text-black leading-snug">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-0.5">
                        {item.quantity} x {item.price}
                      </p>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white print:text-black shrink-0">
                      ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash returned breakdown details */}
            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-450 dark:text-slate-500 font-semibold">
                <span>Subtotal:</span>
                <span>{completedOrder.subtotal}</span>
              </div>
              {completedOrder.discount !== "$0.00" && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{completedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-450 dark:text-slate-500 font-semibold">
                <span>Tax (VAT):</span>
                <span>
                  ${(
                    (parseFloat((completedOrder.subtotal || "$0.00").replace("$", "")) - 
                     parseFloat((completedOrder.discount || "$0.00").replace("$", ""))) * 
                    0.05
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white font-extrabold pt-2 border-t border-slate-100 dark:border-slate-850 text-sm print:text-black">
                <span>Grand Total:</span>
                <span className="text-violet-600 dark:text-violet-405 print:text-black font-black text-base">
                  {completedOrder.total}
                </span>
              </div>

              {completedOrder.paymentMethod === "Cash" && (
                <>
                  <div className="flex justify-between text-slate-450 dark:text-slate-500 font-semibold">
                    <span>Cash Amount Tended:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      ${(parseFloat(completedOrder.total.replace("$", "")) + changeReturned).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-extrabold text-sm border-t border-dashed border-slate-200 dark:border-slate-855 pt-2">
                    <span>Change Returned:</span>
                    <span>${changeReturned.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Receipt footer notice */}
            <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider space-y-1">
              <p>Thank You For Shopping At Hatbazar!</p>
              <p className="font-normal lowercase">Visit us again: www.hatbazar.com</p>
            </div>

            {/* Print & close buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-850 py-3 text-xs font-bold text-slate-750 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer select-none"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0a2.25 2.25 0 01-2.25 2.25H8.59a2.25 2.25 0 01-2.25-2.25M6.34 18H17.66M18 14V8.25A2.25 2.25 0 0015.75 6H8.25A2.25 2.25 0 006 8.25V14m12 0a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25m-12 0a2.25 2.25 0 01-2.25-2.25v-1.5A2.25 2.25 0 016 14m12-5.25L12 9m0 0L7.5 8.75" />
                </svg>
                <span>Print Receipt</span>
              </button>
              <button
                onClick={startNewSale}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-750 transition-colors cursor-pointer select-none"
              >
                <span>Start New Sale</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
