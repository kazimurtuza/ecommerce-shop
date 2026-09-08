"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, saveProducts, Product, ProductVariant } from "@/lib/db";
import ImageCropperModal from "@/components/admin/ImageCropperModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewImage, setPreviewImage] = useState<{
    imageUrl: string;
    title: string;
    productId: number;
    variantId?: string;
    variantColor?: string;
    variantSize?: string;
    variants?: ProductVariant[];
  } | null>(null);

  // Image Cropper State in Admin Catalog
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<{
    productId: number;
    variantId?: string;
  } | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleUpdateProductOrVariantImage = (
    productId: number,
    newImageUrl: string,
    variantId?: string
  ) => {
    const updated = products.map((p) => {
      if (p.id !== productId) return p;
      if (variantId && p.variants) {
        const updatedVariants = p.variants.map((v) =>
          v.id === variantId ? { ...v, image: newImageUrl } : v
        );
        return { ...p, variants: updatedVariants };
      }
      return { ...p, image: newImageUrl };
    });

    setProducts(updated);
    saveProducts(updated);

    // Update current preview modal
    setPreviewImage((prev) =>
      prev
        ? {
            ...prev,
            imageUrl: newImageUrl,
            variants:
              updated.find((p) => p.id === productId)?.variants || prev.variants,
          }
        : null
    );

    setSuccessToast(
      variantId
        ? "Variant image updated successfully!"
        : "Product image updated successfully!"
    );
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOpenCropper = (
    imageUrl: string,
    productId: number,
    variantId?: string
  ) => {
    setImageToCrop(imageUrl);
    setCropTarget({ productId, variantId });
    setCropperOpen(true);
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    if (!cropTarget) return;
    handleUpdateProductOrVariantImage(
      cropTarget.productId,
      croppedDataUrl,
      cropTarget.variantId
    );
  };

  const handleModalFileUpload = (
    file: File,
    productId: number,
    variantId?: string
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      handleUpdateProductOrVariantImage(productId, dataUrl, variantId);
      // Also open cropper immediately so user can fine-tune crop size preset
      handleOpenCropper(dataUrl, productId, variantId);
    };
    reader.readAsDataURL(file);
  };

  const handleModalUrlPrompt = (productId: number, variantId?: string) => {
    const url = window.prompt("Paste image URL (e.g. https://images.unsplash.com/...):");
    if (url && url.trim()) {
      handleUpdateProductOrVariantImage(productId, url.trim(), variantId);
      handleOpenCropper(url.trim(), productId, variantId);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const categories = ["All", "Family Matching", "Mickey & Friends", "Outwear", "Accessories"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.tag === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30";
    }
    if (stock <= 5) {
      return "bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30";
    }
    return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30";
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Products Catalog</h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Manage products, stock levels, and store pricing details.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-all select-none self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          <div className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Catalog Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4.5 px-6 font-semibold">Product info</th>
                <th className="py-4.5 px-6 font-semibold">Category</th>
                <th className="py-4.5 px-6 font-semibold">Price</th>
                <th className="py-4.5 px-6 font-semibold">Stock Price</th>
                <th className="py-4.5 px-6 font-semibold text-center">Stock</th>
                <th className="py-4.5 px-6 font-semibold text-center">Status</th>
                <th className="py-4.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {/* Clickable Product Image */}
                        <div
                          onClick={() =>
                            setPreviewImage({
                              imageUrl: product.image,
                              title: product.name,
                              productId: product.id,
                              variants: product.variants,
                            })
                          }
                          className="relative group cursor-pointer h-12 w-12 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 hover:ring-2 hover:ring-violet-500 transition-all"
                          title="Click to view full image & variants"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>

                        <div>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 max-w-xs sm:max-w-sm hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                          >
                            {product.name}
                          </Link>
                          {product.variants && product.variants.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-md">
                                {product.variants.length} Variants
                              </span>
                              {product.variants.slice(0, 6).map((v) => (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() =>
                                    setPreviewImage({
                                      imageUrl: v.image || product.image,
                                      title: `${product.name} - ${v.color}`,
                                      productId: product.id,
                                      variantId: v.id,
                                      variantColor: v.color,
                                      variantSize: v.size,
                                      variants: product.variants,
                                    })
                                  }
                                  className="cursor-pointer hover:scale-125 transition-transform hover:ring-2 hover:ring-violet-500 rounded-full focus:outline-none relative"
                                  title={`${v.color} (${v.size}) - Click to preview/upload/crop`}
                                >
                                  {v.image ? (
                                    <img
                                      src={v.image}
                                      alt={v.color}
                                      className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                                    />
                                  ) : (
                                    <span
                                      style={{ backgroundColor: v.colorHex || "#a855f7" }}
                                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs"
                                      title={`No image for ${v.color} (${v.size}) - click to upload`}
                                    >
                                      +
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{product.tag || product.category}</span>
                        {product.subCategory && (
                          <span className="text-[11px] text-slate-400 font-medium">{product.subCategory}</span>
                        )}
                        {product.brand && (
                          <span className="text-[10px] text-violet-600 dark:text-violet-400 font-extrabold uppercase tracking-wider">{product.brand}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{product.price}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400">
                      {product.stockPrice || "—"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border ${getStockBadge(product.stock)}`}>
                        {product.stock === 0 ? "Out of Stock" : `${product.stock} items`}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                        product.status === "Published" 
                          ? "bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-900/30" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3.5">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Lightbox, Crop & Variant Upload Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {previewImage.title}
                </h3>
                {previewImage.variantColor ? (
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-bold mt-0.5 flex items-center gap-1.5">
                    <span>Variant: {previewImage.variantColor}</span>
                    {previewImage.variantSize && <span>({previewImage.variantSize})</span>}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    Main Catalog Image
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center bg-slate-50/50 dark:bg-slate-950/30 overflow-y-auto">
              {/* Display Image */}
              <div className="relative group max-h-[340px] max-w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-950 flex items-center justify-center">
                <img
                  src={previewImage.imageUrl}
                  alt={previewImage.title}
                  className="max-h-[320px] w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => handleOpenCropper(previewImage.imageUrl, previewImage.productId, previewImage.variantId)}
                  className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white cursor-pointer"
                  title="Click to Crop and Resize Size-Wise"
                >
                  <span className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M3.75 16.5V18A2.25 2.25 0 006 20.25h1.5M16.5 20.25H18A2.25 2.25 0 0020.25 18v-1.5M20.25 7.5V6A2.25 2.25 0 0018 3.75h-1.5" />
                    </svg>
                  </span>
                  <span className="text-xs font-bold tracking-wide">✂️ Crop & Resize Image</span>
                </button>
              </div>

              {/* Quick Image Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {/* Direct Crop Button */}
                <button
                  type="button"
                  onClick={() => handleOpenCropper(previewImage.imageUrl, previewImage.productId, previewImage.variantId)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-violet-600/30 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M3.75 16.5V18A2.25 2.25 0 006 20.25h1.5M16.5 20.25H18A2.25 2.25 0 0020.25 18v-1.5M20.25 7.5V6A2.25 2.25 0 0018 3.75h-1.5" />
                  </svg>
                  <span>Crop Size-Wise (1:1 / 3:4 / 4:5 / 16:9)</span>
                </button>

                {/* Direct Upload Image Button */}
                <label
                  htmlFor="catalog-modal-file-upload"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span>Upload Image File</span>
                  <input
                    id="catalog-modal-file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleModalFileUpload(file, previewImage.productId, previewImage.variantId);
                      e.target.value = "";
                    }}
                  />
                </label>

                {/* Paste URL Button */}
                <button
                  type="button"
                  onClick={() => handleModalUrlPrompt(previewImage.productId, previewImage.variantId)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span>Paste URL</span>
                </button>

                {/* Remove Image Button (if variant has image) */}
                {previewImage.variantId && previewImage.imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateProductOrVariantImage(previewImage.productId, "", previewImage.variantId);
                      setPreviewImage((prev) => (prev ? { ...prev, imageUrl: "" } : null));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>Remove Image</span>
                  </button>
                )}
              </div>

              {/* Variant swatches switcher */}
              {previewImage.variants && previewImage.variants.length > 0 && (
                <div className="mt-4 flex items-center gap-2 overflow-x-auto max-w-full py-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Select Variant:
                  </span>
                  {previewImage.variants.map((v) => {
                    const isSelected = previewImage.variantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() =>
                          setPreviewImage((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  imageUrl: v.image || prev.imageUrl,
                                  variantId: v.id,
                                  variantColor: v.color,
                                  variantSize: v.size,
                                }
                              : null
                          )
                        }
                        className={`p-1 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                          isSelected
                            ? "border-violet-600 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                            : "border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100"
                        }`}
                        title={`${v.color} (${v.size})`}
                      >
                        {v.image ? (
                          <img
                            src={v.image}
                            alt={v.color}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                        ) : (
                          <span
                            style={{ backgroundColor: v.colorHex || "#a855f7" }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
                          >
                            +
                          </span>
                        )}
                        <span className="text-[11px] pr-1">{v.color}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                href={`/admin/products/${previewImage.productId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <span>Full Product Editor</span>
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Size-Wise Image Cropper Modal in Catalog */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageUrl={imageToCrop}
        initialRatio="3:4"
        onCropComplete={handleCropComplete}
        title={
          cropTarget?.variantId
            ? "Crop Variant Image (Size-Wise)"
            : "Crop Product Image (Size-Wise)"
        }
      />

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-2">
          <span className="text-emerald-400 dark:text-emerald-600 font-black">✓</span>
          <span>{successToast}</span>
        </div>
      )}
    </div>
  );
}
