"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts, saveProducts, Product, ProductVariant } from "@/lib/db";
import ImageCropperModal from "@/components/admin/ImageCropperModal";
import ColorCombobox from "@/components/admin/ColorCombobox";
import SizeCombobox from "@/components/admin/SizeCombobox";
import RichTextEditor from "@/components/admin/RichTextEditor";

const CATEGORIES = [
  "Women",
  "Men",
  "Kids",
  "Teens",
  "Family Matching",
  "Mickey & Friends",
  "Outwear",
  "Accessories"
];

const SUBCATEGORIES = [
  "Kurti Tunic And Tops",
  "3pc Salwar Kameez",
  "2pc Salwar Kameez",
  "Palazzo",
  "T-Shirt",
  "Pajamas",
  "Comfy Trouser",
  "Hoodie",
  "Sweatshirt",
  "Cargo Pants",
  "Shrug",
  "Co-ords",
  "Tops",
  "Kurti",
  "Denim Pants",
  "Panjabi",
  "Polo Shirt",
  "Baby Onesies",
  "Frocks & Dresses",
  "Matching Outfits"
];

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "0-3M", "3-6M", "12-18M", "2T", "3T", "Free Size"];

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Women",
    subCategory: "Kurti Tunic And Tops",
    brand: "",
    price: "",
    stockPrice: "",
    stock: "10",
    image: "",
    description: "",
    status: "Published" as "Published" | "Draft",
  });

  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: Date.now().toString(),
      color: "Black",
      colorHex: "#000000",
      size: "M",
      sku: "SKU-VAR-1",
      price: "",
      stockPrice: "",
      stock: 10,
      image: "",
      isDefault: true,
    },
  ]);

  // Image Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<
    { type: "variant"; id: string } | { type: "gallery"; index: number } | null
  >(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // Multi-image gallery state
  const [productImages, setProductImages] = useState<string[]>([]);
  const [defaultImageIndex, setDefaultImageIndex] = useState<number>(0);

  const handleVariantFileChange = (vId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      handleUpdateVariant(vId, "image", dataUrl);
      setImageToCrop(dataUrl);
      setCropTarget({ type: "variant", id: vId });
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Add multiple images to gallery
  const handleAddGalleryImages = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setProductImages((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Add image by URL to gallery
  const handleAddGalleryUrl = () => {
    const url = window.prompt("Paste image URL (e.g. https://images.unsplash.com/...):");
    if (url && url.trim()) {
      setProductImages((prev) => [...prev, url.trim()]);
    }
  };

  // Remove an image from gallery
  const handleRemoveGalleryImage = (index: number) => {
    setProductImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // adjust default index
      if (defaultImageIndex >= next.length) {
        setDefaultImageIndex(Math.max(0, next.length - 1));
      } else if (index < defaultImageIndex) {
        setDefaultImageIndex((d) => d - 1);
      }
      return next;
    });
  };

  // Set default/primary image
  const handleSetDefaultImage = (index: number) => {
    setDefaultImageIndex(index);
  };

  // Open cropper for gallery image
  const handleCropGalleryImage = (index: number) => {
    setImageToCrop(productImages[index]);
    setCropTarget({ type: "gallery", index });
    setCropperOpen(true);
  };

  const handleSetVariantImageUrl = (vId: string) => {
    const url = window.prompt("Paste image URL for this variant (e.g. https://images.unsplash.com/...):");
    if (url && url.trim()) {
      handleUpdateVariant(vId, "image", url.trim());
      setImageToCrop(url.trim());
      setCropTarget({ type: "variant", id: vId });
      setCropperOpen(true);
    }
  };

  const handleOpenCropperForExisting = (
    imageUrl: string,
    target: { type: "variant"; id: string } | { type: "gallery"; index: number }
  ) => {
    setImageToCrop(imageUrl);
    setCropTarget(target);
    setCropperOpen(true);
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    if (!cropTarget) return;

    if (cropTarget.type === "variant") {
      handleUpdateVariant(cropTarget.id, "image", croppedDataUrl);
    } else if (cropTarget.type === "gallery") {
      setProductImages((prev) =>
        prev.map((img, i) => (i === cropTarget.index ? croppedDataUrl : img))
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-sync selling price to variants when main price changes
      if (name === "price") {
        setVariants((prevVariants) =>
          prevVariants.map((v) =>
            v.price === "" || v.price === prev.price
              ? { ...v, price: value }
              : v
          )
        );
      }

      // Auto-sync stock price to variants when main stock price changes
      if (name === "stockPrice") {
        setVariants((prevVariants) =>
          prevVariants.map((v) =>
            v.stockPrice === "" || v.stockPrice === prev.stockPrice
              ? { ...v, stockPrice: value }
              : v
          )
        );
      }

      return updated;
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug,
    }));
  };

  // Variant Actions
  const handleAddVariant = () => {
    const defaultSku = formData.slug
      ? `${formData.slug.toUpperCase().slice(0, 8)}-V${variants.length + 1}`
      : `SKU-VAR-${variants.length + 1}`;

    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      color: "Black",
      colorHex: "#000000",
      size: "M",
      sku: defaultSku,
      price: "",
      stockPrice: "",
      stock: 10,
      image: "",
      isDefault: variants.length === 0,
    };
    setVariants((prev) => [...prev, newVariant]);
  };

  const handleSetDefaultVariant = (id: string) => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        isDefault: v.id === id,
      }))
    );
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => {
      const remaining = prev.filter((v) => v.id !== id);
      // If the removed variant was the default, make the first remaining variant default
      if (remaining.length > 0 && !remaining.some((v) => v.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });
  };

  const handleUpdateVariant = (
    id: string,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  // Total stock from variants
  const totalVariantStock = variants.reduce(
    (sum, v) => sum + (Number(v.stock) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentProducts = getProducts();
    const newId =
      currentProducts.length > 0
        ? Math.max(...currentProducts.map((p) => p.id)) + 1
        : 1;

    const priceVal = parseFloat(formData.price.replace("$", ""));
    const priceFormatted = isNaN(priceVal) ? "$0.00" : `$${priceVal.toFixed(2)}`;

    const stockPriceVal = parseFloat(formData.stockPrice.replace("$", ""));
    const stockPriceFormatted = isNaN(stockPriceVal)
      ? undefined
      : `$${stockPriceVal.toFixed(2)}`;

    const finalStock =
      variants.length > 0 ? totalVariantStock : parseInt(formData.stock) || 0;

    // Determine primary image from gallery
    const primaryImage =
      productImages.length > 0
        ? productImages[defaultImageIndex] || productImages[0]
        : "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=450&h=560&fit=crop&q=80";

    const newProduct: Product = {
      id: newId,
      name: formData.name,
      tag: formData.category,
      category: formData.category,
      subCategory: formData.subCategory.trim() || undefined,
      brand: formData.brand.trim() || undefined,
      price: priceFormatted,
      stockPrice: stockPriceFormatted,
      stock: finalStock,
      status: formData.status,
      image: primaryImage,
      images: productImages.length > 0 ? productImages : undefined,
      description: formData.description,
      variants: variants.length > 0
        ? variants.map((v) => ({
            ...v,
            price: v.price || formData.price || "0.00",
            stockPrice: v.stockPrice || formData.stockPrice || "0.00",
          }))
        : undefined,
    };

    saveProducts([...currentProducts, newProduct]);
    alert(`Product "${formData.name}" successfully created!`);
    router.push("/admin/products");
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto transition-colors duration-200 pb-12">
      {/* Header & Back Link */}
      <div className="space-y-2">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <svg
            className="w-4.5 h-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>Back to products catalog</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Add New Product
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Fill in details below to configure pricing, inventory, category hierarchy, and product variants.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            1. Basic Information
          </h2>

          {/* Name and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Embroidered Floral Kurti Tunic"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Product Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. embroidered-floral-kurti-tunic"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Category, Subcategory, and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Subcategory
              </label>
              <input
                type="text"
                name="subCategory"
                list="subcategories-list"
                value={formData.subCategory}
                onChange={handleChange}
                placeholder="e.g. Kurti Tunic And Tops"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              <datalist id="subcategories-list">
                {SUBCATEGORIES.map((sub) => (
                  <option key={sub} value={sub} />
                ))}
              </datalist>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Aarong, Yellow, Zara, Own Brand"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Stock Inventory */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            2. Pricing & Stock Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Selling Price */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Selling Price ($) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="38.99"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Price visible to customers on store</p>
            </div>

            {/* Stock Price (Cost Price) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Stock Price / Cost ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <input
                  type="text"
                  name="stockPrice"
                  value={formData.stockPrice}
                  onChange={handleChange}
                  placeholder="22.50"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Product acquisition/manufacturing cost</p>
            </div>

            {/* Stock Inventory */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Stock Inventory <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={variants.length > 0 ? totalVariantStock : formData.stock}
                onChange={handleChange}
                disabled={variants.length > 0}
                placeholder="10"
                className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${variants.length > 0 ? "opacity-75 cursor-not-allowed bg-slate-100 dark:bg-slate-900" : ""
                  }`}
                min="0"
                required
              />
              {variants.length > 0 && (
                <p className="text-[10px] text-violet-600 dark:text-violet-400 mt-1 font-semibold">
                  Auto-calculated from variants: {totalVariantStock} total items
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Product Variants (Color, Size, SKU, Variant Price & Stock) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span>3. Product Variants</span>
                {variants.length > 0 && (
                  <span className="bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage options by color, size, SKU, variant selling price, stock cost, and inventory.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900/40 rounded-xl text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add Variant</span>
            </button>
          </div>

          {variants.length === 0 ? (
            /* Empty State */
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-950/30">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 mx-auto flex items-center justify-center mb-3">
                <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No variants added yet
              </p>
              <p className="text-[11px] text-slate-400 mt-1 mb-4">
                Does this product have different sizes or colors? Click &quot;Add Variant&quot; to set them up.
              </p>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-all cursor-pointer shadow-sm"
              >
                + Add First Variant
              </button>
            </div>
          ) : (
            /* Variants List Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Image</th>
                    <th className="py-3 px-3">Color</th>
                    <th className="py-3 px-3">Size</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">Selling ($)</th>
                    <th className="py-3 px-3">Stock Price ($)</th>
                    <th className="py-3 px-3">Stock Qty</th>
                    <th className="py-3 px-3 text-center">Default / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {variants.map((v, vIdx) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      {/* Variant Image & Crop Option */}
                      <td className="py-3 px-3 min-w-[150px]">
                        {v.image ? (
                          <div className="flex items-center gap-2.5">
                            {/* Thumbnail with red X remove badge */}
                            <div className="relative shrink-0">
                              <div
                                onClick={() => handleOpenCropperForExisting(v.image!, { type: "variant", id: v.id })}
                                className="relative group w-12 h-12 rounded-xl overflow-hidden border-2 border-violet-400 dark:border-violet-600 bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-xs hover:scale-105 transition-all"
                                title="Click image to Crop & Resize"
                              >
                                <img
                                  src={v.image}
                                  alt={v.color}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenCropperForExisting(v.image!, { type: "variant", id: v.id });
                                    }}
                                    className="p-1 text-white hover:text-violet-300 transition-colors cursor-pointer"
                                    title="Crop & Resize"
                                  >
                                    <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M3.75 16.5V18A2.25 2.25 0 006 20.25h1.5M16.5 20.25H18A2.25 2.25 0 0020.25 18v-1.5M20.25 7.5V6A2.25 2.25 0 0018 3.75h-1.5" />
                                    </svg>
                                  </button>
                                  <label
                                    htmlFor={`var-file-change-${v.id}`}
                                    className="p-1 text-white hover:text-violet-300 transition-colors cursor-pointer"
                                    title="Change Image"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7" />
                                    </svg>
                                    <input
                                      id={`var-file-change-${v.id}`}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleVariantFileChange(v.id, file);
                                        e.target.value = "";
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                              {/* 1-Click Red X remove badge */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateVariant(v.id, "image", "");
                                }}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-110 z-10"
                                title="Remove this image"
                              >
                                <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            {/* Action links */}
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenCropperForExisting(v.image!, { type: "variant", id: v.id })}
                                className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer flex items-center gap-1 text-left"
                              >
                                <span>✂️ Crop Size</span>
                              </button>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <label
                                  htmlFor={`var-file-sub-${v.id}`}
                                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer font-medium hover:underline"
                                >
                                  Change
                                  <input
                                    id={`var-file-sub-${v.id}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleVariantFileChange(v.id, file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                                <span className="text-slate-300 dark:text-slate-700">|</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateVariant(v.id, "image", "")}
                                  className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-semibold cursor-pointer hover:underline flex items-center gap-0.5"
                                  title="Remove variant image"
                                >
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <label
                              htmlFor={`var-file-add-${vIdx}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border-2 border-dashed border-violet-400 dark:border-violet-600 bg-violet-50/80 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 cursor-pointer transition-all text-[11px] font-bold shadow-xs hover:border-violet-600"
                              title="Click to select image file from computer"
                            >
                              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              <span>Upload Image</span>
                              <input
                                id={`var-file-add-${vIdx}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleVariantFileChange(v.id, file);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleSetVariantImageUrl(v.id)}
                              className="px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 text-[10px] font-bold cursor-pointer"
                              title="Or paste image URL"
                            >
                              URL
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Color */}
                      <td className="py-3 px-3 min-w-[170px]">
                        <ColorCombobox
                          value={v.color}
                          hexValue={v.colorHex}
                          onChange={(colorName, hexCode) => {
                            setVariants((prev) =>
                              prev.map((variant) =>
                                variant.id === v.id
                                  ? { ...variant, color: colorName, colorHex: hexCode }
                                  : variant
                              )
                            );
                          }}
                        />
                      </td>

                      {/* Size */}
                      <td className="py-3 px-3 min-w-[120px]">
                        <SizeCombobox
                          value={v.size}
                          onChange={(newSize) => {
                            handleUpdateVariant(v.id, "size", newSize);
                          }}
                        />
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 min-w-[120px]">
                        <input
                          type="text"
                          value={v.sku || ""}
                          onChange={(e) =>
                            handleUpdateVariant(v.id, "sku", e.target.value)
                          }
                          placeholder="e.g. KRT-01-S"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-3 min-w-[95px]">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-bold">$</span>
                          <input
                            type="text"
                            value={v.price || formData.price || ""}
                            onChange={(e) => {
                              handleUpdateVariant(v.id, "price", e.target.value);
                            }}
                            placeholder={formData.price || "38.99"}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-5 pr-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </td>

                      {/* Stock Price / Cost */}
                      <td className="py-3 px-3 min-w-[95px]">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-bold">$</span>
                          <input
                            type="text"
                            value={v.stockPrice || formData.stockPrice || ""}
                            onChange={(e) => {
                              handleUpdateVariant(v.id, "stockPrice", e.target.value);
                            }}
                            placeholder={formData.stockPrice || "22.50"}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-5 pr-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </td>

                      {/* Stock Qty */}
                      <td className="py-3 px-3 min-w-[85px]">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) =>
                            handleUpdateVariant(
                              v.id,
                              "stock",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </td>

                      {/* Default Checkbox & Remove Button */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <label
                            className="inline-flex items-center gap-1 cursor-pointer select-none text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
                            title={v.isDefault ? "Default Variant" : "Mark as Default Variant"}
                          >
                            <input
                              type="checkbox"
                              checked={!!v.isDefault}
                              onChange={() => handleSetDefaultVariant(v.id)}
                              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-violet-600 focus:ring-violet-500 cursor-pointer accent-violet-600"
                            />
                            <span className={`text-[10px] ${v.isDefault ? "text-violet-600 dark:text-violet-400 font-bold" : "text-slate-400 font-normal"}`}>
                              Default
                            </span>
                          </label>

                          <span className="text-slate-300 dark:text-slate-700">|</span>

                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(v.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove variant"
                          >
                            <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 4: Media, Description & Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            4. Media & Display Details
          </h2>

          {/* Multi-Image Gallery Upload */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Product Images Gallery
                  {productImages.length > 0 && (
                    <span className="ml-2 bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full normal-case tracking-normal">
                      {productImages.length} {productImages.length === 1 ? "image" : "images"}
                    </span>
                  )}
                </label>
                <p className="text-[10px] text-slate-400 mt-0.5">Upload multiple images. Click the star ★ to set the primary/default image shown on the store.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span>Add URL</span>
                </button>
                <label
                  htmlFor="gallery-image-upload"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900/40 rounded-xl text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span>Upload Images</span>
                  <input
                    id="gallery-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleAddGalleryImages(e.target.files);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Gallery Grid */}
            {productImages.length === 0 ? (
              <label
                htmlFor="gallery-image-upload-empty"
                className="flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 dark:hover:bg-violet-950/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-10.5 6h19.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H2.25a.75.75 0 00-.75.75v11.25c0 .414.336.75.75.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload product images</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP — Multiple files supported</p>
                </div>
                <input
                  id="gallery-image-upload-empty"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleAddGalleryImages(e.target.files);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${
                      defaultImageIndex === index
                        ? "border-violet-500 dark:border-violet-400 shadow-md shadow-violet-200 dark:shadow-violet-900/40"
                        : "border-slate-200 dark:border-slate-800 hover:border-violet-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product image ${index + 1}`}
                      className="w-full aspect-[3/4] object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                    />

                    {/* Default badge */}
                    {defaultImageIndex === index && (
                      <div className="absolute top-1.5 left-1.5 bg-violet-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wide">
                        ★ DEFAULT
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                      {/* Set as default */}
                      {defaultImageIndex !== index && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultImage(index)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          title="Set as primary/default image"
                        >
                          ★ Set Default
                        </button>
                      )}
                      {/* Crop */}
                      <button
                        type="button"
                        onClick={() => handleCropGalleryImage(index)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                        title="Crop & resize image"
                      >
                        ✂️ Crop
                      </button>
                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add more images tile */}
                <label
                  htmlFor="gallery-image-upload-more"
                  className="flex flex-col items-center justify-center gap-2 aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-violet-400 hover:bg-violet-50/40 dark:hover:bg-violet-950/20 cursor-pointer transition-all text-slate-400 hover:text-violet-500"
                  title="Add more images"
                >
                  <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-[10px] font-bold">Add More</span>
                  <input
                    id="gallery-image-upload-more"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleAddGalleryImages(e.target.files);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Product Description
              </label>
              <span className="text-[11px] text-slate-400">
                Rich Text & HTML Supported
              </span>
            </div>
            <RichTextEditor
              value={formData.description}
              onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))}
              placeholder="Describe product highlights, fabric quality, styling tips, fit, and care..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Publish Status
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  value="Published"
                  checked={formData.status === "Published"}
                  onChange={handleChange}
                  className="text-violet-600 focus:ring-violet-500"
                />
                <span>Published (Live on storefront)</span>
              </label>
              <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={formData.status === "Draft"}
                  onChange={handleChange}
                  className="text-violet-600 focus:ring-violet-500"
                />
                <span>Draft (Hidden in store)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-7 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer"
          >
            Save Product
          </button>
        </div>
      </form>


      {/* Size-Wise Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageUrl={imageToCrop}
        initialRatio="3:4"
        onCropComplete={handleCropComplete}
        title={
          cropTarget?.type === "gallery"
            ? "Crop Product Gallery Image"
            : "Crop Variant Image"
        }
      />
    </div>
  );
}
