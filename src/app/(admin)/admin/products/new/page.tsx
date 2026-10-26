"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts, saveProducts, Product, ProductVariant, getAttributes, getUnits, Attribute, Unit, ProductAttribute, VariantAttributeValue } from "@/lib/db";
import ImageCropperModal from "@/components/admin/ImageCropperModal";
import ColorCombobox, { INITIAL_COLORS } from "@/components/admin/ColorCombobox";
import SizeCombobox, { INITIAL_SIZES } from "@/components/admin/SizeCombobox";
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

const SUGGESTED_TAGS = [
  "New Arrival",
  "Best Seller",
  "Trending",
  "Summer Collection",
  "Winter",
  "Discount",
  "Cotton",
  "Premium",
  "Party Wear",
  "Family Matching"
];

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

  // Multi-tags state
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (rawTag: string) => {
    const trimmed = rawTag.trim().replace(/^#/, "");
    if (!trimmed) return;
    const parts = trimmed.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);
    setTags((prev) => {
      const next = [...prev];
      for (const part of parts) {
        if (!next.some((t) => t.toLowerCase() === part.toLowerCase())) {
          next.push(part);
        }
      }
      return next;
    });
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase()));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // --- Attribute & Unit System ---
  const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<number[]>([]);

  const variantsRef = useRef<ProductVariant[]>([]);
  useEffect(() => { variantsRef.current = variants; }, [variants]);

  // Variant attribute values: variantId -> { attributeId -> valueId }
  const [variantAttrValues, setVariantAttrValues] = useState<
    Record<string, Record<number, number>>
  >({});
  const variantAttrValuesRef = useRef<Record<string, Record<number, number>>>({});
  useEffect(() => { variantAttrValuesRef.current = variantAttrValues; }, [variantAttrValues]);

  // Variant unit assignments: variantId -> { unit_id, unit_quantity }
  const [variantUnits, setVariantUnits] = useState<
    Record<string, { unit_id: number; unit_quantity: number }>
  >({});
  const variantUnitsRef = useRef<Record<string, { unit_id: number; unit_quantity: number }>>({});
  useEffect(() => { variantUnitsRef.current = variantUnits; }, [variantUnits]);

  // Load attributes and units on mount
  useEffect(() => {
    setAllAttributes(getAttributes());
    setAllUnits(getUnits());
  }, []);

  const handleToggleAttributeId = (attrId: number) => {
    setSelectedAttributeIds((prev) =>
      prev.includes(attrId) ? prev.filter((id) => id !== attrId) : [...prev, attrId]
    );
  };

  const handleVariantAttrValueChange = (variantId: string, attrId: number, valueId: number) => {
    setVariantAttrValues((prev) => ({
      ...prev,
      [variantId]: { ...(prev[variantId] || {}), [attrId]: valueId },
    }));
  };

  const handleVariantUnitChange = (variantId: string, field: "unit_id" | "unit_quantity", val: number) => {
    setVariantUnits((prev) => ({
      ...prev,
      [variantId]: { ...(prev[variantId] || { unit_id: allUnits[0]?.id || 1, unit_quantity: 1 }), [field]: val },
    }));
  };

  // --- Bulk Generator (Attribute Combinator) State ---
  const [dynBulkSelections, setDynBulkSelections] = useState<Record<number, number[]>>({});
  const [showVariantsList, setShowVariantsList] = useState(true);
  // Dropdown open/search state for Step 1 & Step 2
  const [attrDropOpen, setAttrDropOpen] = useState(false);
  const [attrSearch, setAttrSearch] = useState("");
  const [valueDropOpen, setValueDropOpen] = useState<Record<number, boolean>>({});
  const [valueSearch, setValueSearch] = useState<Record<number, string>>({});

  // --- Dynamic Attribute Combinator Generator ---
  const handleGenerateDynamicCombinations = () => {
    // Collect attributes that have at least one value selected
    const attrEntries = selectedAttributeIds
      .map(attrId => ({
        attrId,
        attr: allAttributes.find(a => a.id === attrId)!,
        valueIds: dynBulkSelections[attrId] || [],
      }))
      .filter(e => e.attr && e.valueIds.length > 0);

    if (attrEntries.length === 0) return;

    // Cartesian product of value-ID arrays
    const cartesian = (arrays: number[][]): number[][] =>
      arrays.reduce<number[][]>(
        (acc, arr) => acc.flatMap(combo => arr.map(val => [...combo, val])),
        [[]]
      );

    const combinations = cartesian(attrEntries.map(e => e.valueIds));

    const baseSlug = formData.slug ? formData.slug.toUpperCase().slice(0, 6) : "SKU";
    const resultVariants: ProductVariant[] = [];
    const newAttrValueMap: Record<string, Record<number, number>> = {};
    const newVariantUnits: Record<string, { unit_id: number; unit_quantity: number }> = {};
    const usedExistingIds = new Set<string>();

    combinations.forEach((combo, comboIdx) => {
      const comboAttrMap: Record<number, number> = {};
      attrEntries.forEach((e, i) => {
        comboAttrMap[e.attrId] = combo[i];
      });

      // Check if an existing variant matches this exact combination
      const matchedVariant = variantsRef.current.find(v => {
        if (usedExistingIds.has(v.id)) return false;
        const existingAttrs = variantAttrValuesRef.current[v.id] || {};
        const keys = Object.keys(existingAttrs);
        if (keys.length !== attrEntries.length) return false;
        return attrEntries.every((e, i) => existingAttrs[e.attrId] === combo[i]);
      });

      if (matchedVariant) {
        usedExistingIds.add(matchedVariant.id);
        resultVariants.push(matchedVariant);
        newAttrValueMap[matchedVariant.id] = variantAttrValuesRef.current[matchedVariant.id] || comboAttrMap;
        if (variantUnitsRef.current[matchedVariant.id]) {
          newVariantUnits[matchedVariant.id] = variantUnitsRef.current[matchedVariant.id];
        } else if (allUnits.length > 0) {
          newVariantUnits[matchedVariant.id] = { unit_id: allUnits[0].id, unit_quantity: 1 };
        }
        return;
      }

      // Build short SKU label from selected value names
      const labelParts = attrEntries.map((e, i) => {
        const val = e.attr.values.find(v => v.id === combo[i]);
        return val ? val.value.replace(/\s+/g, "").slice(0, 5).toUpperCase() : "?";
      });

      // Auto-map color / size from attribute type / name
      let color = "—";
      let colorHex = "#94a3b8";
      let size = "—";
      attrEntries.forEach((e, i) => {
        const val = e.attr.values.find(v => v.id === combo[i]);
        if (!val) return;
        if (e.attr.type === "color") {
          color = val.value;
          colorHex = val.color_hex || "#94a3b8";
        }
        if (e.attr.name.toLowerCase().includes("size")) {
          size = val.value;
        }
      });

      const idx = comboIdx + 1;
      const variantId = `dyn-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`;

      resultVariants.push({
        id: variantId,
        color,
        colorHex,
        size,
        sku: `${baseSlug}-${labelParts.join("-")}`,
        price: "",
        stockPrice: "",
        stock: 10,
        image: "",
        isDefault: false,
      });

      newAttrValueMap[variantId] = comboAttrMap;
      if (allUnits.length > 0) {
        newVariantUnits[variantId] = { unit_id: allUnits[0].id, unit_quantity: 1 };
      }
    });

    if (resultVariants.length > 0) {
      if (!resultVariants.some(v => v.isDefault)) {
        resultVariants[0] = { ...resultVariants[0], isDefault: true };
      }
    }

    setVariants(resultVariants);
    setVariantAttrValues(newAttrValueMap);
    setVariantUnits(newVariantUnits);
    setShowVariantsList(true);
  };

  // Image Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<
    { type: "variant"; id: string } | { type: "gallery"; index: number } | null
  >(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // Multi-image gallery state
  const [productImages, setProductImages] = useState<string[]>([]);
  const [defaultImageIndex, setDefaultImageIndex] = useState<number>(0);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlInputVal, setUrlInputVal] = useState("");
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Compress image helper using offscreen canvas to avoid localStorage quota crash
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            resolve(dataUrl);
          } else {
            resolve(event.target?.result as string || "");
          }
        };
        img.onerror = () => {
          resolve(event.target?.result as string || "");
        };
        img.src = (event.target?.result as string) || "";
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  const handleVariantFileChange = async (vId: string, file: File) => {
    const dataUrl = await compressImageFile(file);
    if (dataUrl) {
      handleUpdateVariant(vId, "image", dataUrl);
      setImageToCrop(dataUrl);
      setCropTarget({ type: "variant", id: vId });
      setCropperOpen(true);
    }
  };

  // Add multiple images to gallery
  const handleAddGalleryImages = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;
    const newUrls: string[] = [];
    for (const file of fileArray) {
      const dataUrl = await compressImageFile(file);
      if (dataUrl) newUrls.push(dataUrl);
    }
    if (newUrls.length > 0) {
      setProductImages((prev) => [...prev, ...newUrls]);
    }
  };

  // Add image by URL to gallery
  const handleAddGalleryUrl = () => {
    setUrlInputVal("");
    setUrlModalOpen(true);
  };

  const handleConfirmAddUrl = () => {
    if (urlInputVal && urlInputVal.trim()) {
      setProductImages((prev) => [...prev, urlInputVal.trim()]);
      setUrlInputVal("");
      setUrlModalOpen(false);
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
      color: "",
      colorHex: "",
      size: "",
      sku: defaultSku,
      price: "",
      stockPrice: "",
      stock: 10,
      image: "",
      isDefault: false,
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

    const productAttrs: ProductAttribute[] = selectedAttributeIds.map((attrId, idx) => ({
      id: idx + 1,
      product_id: newId,
      attribute_id: attrId,
      sort_order: idx,
    }));

    const newProduct: Product = {
      id: newId,
      name: formData.name,
      tag: tags.length > 0 ? tags[0] : formData.category,
      tags: tags.length > 0 ? tags : undefined,
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
      product_attributes: productAttrs.length > 0 ? productAttrs : undefined,
      variants: variants.length > 0
        ? variants.map((v) => {
            const attrVals: VariantAttributeValue[] = selectedAttributeIds.flatMap((attrId, i) => {
              const valueId = variantAttrValues[v.id]?.[attrId];
              if (!valueId) return [];
              return [{ id: i + 1, variant_id: v.id, attribute_id: attrId, attribute_value_id: valueId }];
            });
            const unitData = variantUnits[v.id];
            return {
              ...v,
              price: v.price || formData.price || "0.00",
              stockPrice: v.stockPrice || formData.stockPrice || "0.00",
              attribute_values: attrVals.length > 0 ? attrVals : undefined,
              unit_id: unitData?.unit_id || undefined,
              unit_quantity: unitData?.unit_quantity || undefined,
            };
          })
        : undefined,
    };

    saveProducts([...currentProducts, newProduct]);
    alert(`Product "${formData.name}" successfully created!`);
    router.push("/admin/products");
  };

  return (
    <div className="space-y-8 font-sans w-full transition-colors duration-200 pb-12">
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

          {/* Multi-Tags Input Form */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Product Tags
                {tags.length > 0 && (
                  <span className="ml-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full normal-case tracking-normal border border-slate-200 dark:border-slate-700">
                    {tags.length} {tags.length === 1 ? "tag" : "tags"}
                  </span>
                )}
              </label>
              <span className="text-[11px] text-slate-400">Press Enter or comma to add</span>
            </div>

            {/* Tags Container */}
            <div className="min-h-[48px] w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-xs group"
                >
                  <span className="text-violet-600 dark:text-violet-400">#</span>
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                    title={`Remove ${tag}`}
                  >
                    <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-2 flex-grow min-w-[180px]">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Type tag name and press Enter or comma (e.g. Summer, Sale, Featured)..." : "Add more tags..."}
                  className="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-400 py-1.5 px-2"
                />
                {tagInput.trim() && (
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="shrink-0 px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Suggestions:</span>
              {SUGGESTED_TAGS.map((stag) => {
                const isAdded = tags.some((t) => t.toLowerCase() === stag.toLowerCase());
                return (
                  <button
                    key={stag}
                    type="button"
                    onClick={() => (isAdded ? handleRemoveTag(stag) : handleAddTag(stag))}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      isAdded
                        ? "bg-violet-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    <span>{isAdded ? "✓" : "+"}</span>
                    <span>{stag}</span>
                  </button>
                );
              })}
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



        {/* Section 4: Product Variants (Color, Size, SKU, Variant Price & Stock) */}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span>3. Product Variants</span>
                {variants.length > 0 && (
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage options by color, size, SKU, variant selling price, stock cost, and inventory.
              </p>
            </div>

          </div>

          {/* ── Attribute Bulk Generator Panel (always visible) ── */}
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-5 md:p-6 space-y-5">
            {/* Header */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                ⚡ Bulk Variant Generator
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Select attributes → pick values → generate all combinations as variants.
              </p>
            </div>

              {/* Step 1: Select Attributes — multi-select dropdown */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Step 1 — Select Attributes
                  </span>
                  {selectedAttributeIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => { setSelectedAttributeIds([]); setDynBulkSelections({}); }}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {allAttributes.length === 0 ? (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-semibold">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    No attributes found.{" "}
                    <a href="/admin/attributes" className="underline font-bold ml-1">Create attributes →</a>
                  </div>
                ) : (
                  <>
                    {/* Trigger */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => { setAttrDropOpen(v => !v); setValueDropOpen({}); }}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAttrDropOpen(v => !v); setValueDropOpen({}); } }}
                      className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                        {selectedAttributeIds.length === 0 ? (
                          <span className="text-slate-400 font-normal">Select attributes...</span>
                        ) : (
                          selectedAttributeIds.map(id => {
                            const a = allAttributes.find(x => x.id === id);
                            return (
                              <span key={id} className="inline-flex items-center gap-1 pl-2 pr-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                {a?.name ?? `#${id}`}
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleToggleAttributeId(id);
                                    setDynBulkSelections(prev => { const n = {...prev}; delete n[id]; return n; });
                                  }}
                                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer ml-0.5"
                                >
                                  <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            );
                          })
                        )}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform ${attrDropOpen ? "rotate-180 text-slate-600 dark:text-slate-300" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Dropdown panel */}
                    {attrDropOpen && (
                      <div className="absolute z-30 mt-1 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="relative">
                            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                              type="text"
                              value={attrSearch}
                              onChange={e => setAttrSearch(e.target.value)}
                              placeholder="Search attribute..."
                              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                              autoFocus
                            />
                          </div>
                        </div>
                        {/* List */}
                        <div className="max-h-52 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50">
                          {allAttributes.filter(a =>
                            !attrSearch.trim() || a.name.toLowerCase().includes(attrSearch.toLowerCase())
                          ).length === 0 ? (
                            <p className="py-4 text-center text-[11px] text-slate-400">No attributes found</p>
                          ) : (
                            allAttributes
                              .filter(a => !attrSearch.trim() || a.name.toLowerCase().includes(attrSearch.toLowerCase()))
                              .map(attr => {
                                const isSelected = selectedAttributeIds.includes(attr.id);
                                const typeIcon = attr.type === "color" ? "🎨" : attr.type === "text" ? "✏️" : "📋";
                                return (
                                  <button
                                    key={attr.id}
                                    type="button"
                                    onClick={() => {
                                      handleToggleAttributeId(attr.id);
                                      if (isSelected) setDynBulkSelections(prev => { const n = {...prev}; delete n[attr.id]; return n; });
                                    }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                                      isSelected ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                    }`}
                                  >
                                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                      isSelected ? "border-violet-600 bg-violet-600" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                                    }`}>
                                      {isSelected && (
                                        <svg className="w-2.5 h-2.5 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                      )}
                                    </span>
                                    <span className="text-sm">{typeIcon}</span>
                                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">{attr.name}</span>
                                    <span className="text-[10px] text-slate-400 shrink-0">{attr.values.length} values</span>
                                  </button>
                                );
                              })
                          )}
                        </div>
                        {/* Footer */}
                        <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">{selectedAttributeIds.length} selected</span>
                          <button
                            type="button"
                            onClick={() => { setAttrDropOpen(false); setAttrSearch(""); }}
                            className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Step 2: Pick Values per Attribute — 2 columns per row */}
              {selectedAttributeIds.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Step 2 — Pick Values
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedAttributeIds.map(attrId => {
                      const attr = allAttributes.find(a => a.id === attrId);
                      if (!attr) return null;
                      if (attr.values.length === 0) return (
                        <div key={attrId} className="flex items-center gap-2 text-[11px] text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-slate-500 not-italic">{attr.name}</span>
                          — no values defined.{" "}
                          <a href="/admin/attributes" className="underline font-bold text-violet-600 not-italic">Add values →</a>
                        </div>
                      );
                      const selected = dynBulkSelections[attrId] || [];
                      const isOpen = !!valueDropOpen[attrId];
                      const search = valueSearch[attrId] ?? "";
                      const filteredVals = attr.values.filter(v =>
                        !search.trim() || v.value.toLowerCase().includes(search.toLowerCase())
                      );
                      const typeColor = "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80";
                      return (
                        <div key={attrId} className={`relative ${isOpen ? "z-30" : "z-10"}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">{attr.name}</span>
                          <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded uppercase tracking-wider ${typeColor}`}>{attr.type}</span>
                          <span className="text-[10px] text-slate-400">{selected.length}/{attr.values.length} selected</span>
                          <div className="flex items-center gap-2 ml-auto">
                            {selected.length < attr.values.length && (
                              <button type="button"
                                onClick={() => setDynBulkSelections(prev => ({ ...prev, [attrId]: attr.values.map(v => v.id) }))}
                                className="text-[10px] text-violet-600 dark:text-violet-400 hover:text-violet-800 font-bold cursor-pointer"
                              >Select All</button>
                            )}
                            {selected.length > 0 && (
                              <button type="button"
                                onClick={() => setDynBulkSelections(prev => ({ ...prev, [attrId]: [] }))}
                                className="text-[10px] text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                              >Clear</button>
                            )}
                          </div>
                        </div>

                        {/* Trigger */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setValueDropOpen(prev => ({ ...prev, [attrId]: !prev[attrId] }));
                            setAttrDropOpen(false);
                          }}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setValueDropOpen(prev => ({ ...prev, [attrId]: !prev[attrId] })); setAttrDropOpen(false); } }}
                          className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer select-none"
                        >
                          <span className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                            {selected.length === 0 ? (
                              <span className="text-slate-400 font-normal">Select {attr.name} values...</span>
                            ) : (
                              selected.map(vid => {
                                const v = attr.values.find(x => x.id === vid);
                                return (
                                  <span key={vid} className="inline-flex items-center gap-1 pl-2 pr-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                    {attr.type === "color" && v?.color_hex && (
                                      <span className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: v.color_hex }} />
                                    )}
                                    {v?.value ?? `#${vid}`}
                                    <button
                                      type="button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setDynBulkSelections(prev => ({ ...prev, [attrId]: (prev[attrId]||[]).filter(id => id !== vid) }));
                                      }}
                                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer ml-0.5"
                                    >
                                      <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </span>
                                );
                              })
                            )}
                          </span>
                          <svg
                            className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-slate-600 dark:text-slate-300" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {/* Dropdown panel */}
                        {isOpen && (
                          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
                            {/* Search */}
                            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                              <div className="relative">
                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                  type="text"
                                  value={search}
                                  onChange={e => setValueSearch(prev => ({ ...prev, [attrId]: e.target.value }))}
                                  placeholder={`Search ${attr.name}...`}
                                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                  autoFocus
                                />
                              </div>
                            </div>
                            {/* List */}
                            <div className="max-h-48 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50">
                              {filteredVals.length === 0 ? (
                                <p className="py-4 text-center text-[11px] text-slate-400">No values found</p>
                              ) : (
                                filteredVals.map(val => {
                                  const isActive = selected.includes(val.id);
                                  return (
                                    <button
                                      key={val.id}
                                      type="button"
                                      onClick={() => setDynBulkSelections(prev => {
                                        const cur = prev[attrId] || [];
                                        return { ...prev, [attrId]: isActive ? cur.filter(id => id !== val.id) : [...cur, val.id] };
                                      })}
                                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                                        isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                      }`}
                                    >
                                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                        isActive ? "border-violet-600 bg-violet-600" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                                      }`}>
                                        {isActive && (
                                          <svg className="w-2.5 h-2.5 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                          </svg>
                                        )}
                                      </span>
                                      {attr.type === "color" && val.color_hex && (
                                        <span className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs" style={{ backgroundColor: val.color_hex }} />
                                      )}
                                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">{val.value}</span>
                                      {val.color_hex && (
                                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{val.color_hex}</span>
                                      )}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                            {/* Footer */}
                            <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">{selected.length} selected</span>
                              <button
                                type="button"
                                onClick={() => { setValueDropOpen(prev => ({ ...prev, [attrId]: false })); setValueSearch(prev => ({ ...prev, [attrId]: "" })); }}
                                className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}

              {/* Step 3: Preview & Generate */}
              {selectedAttributeIds.length > 0 && (() => {
                const activeEntries = selectedAttributeIds
                  .map(id => ({
                    id,
                    attr: allAttributes.find(a => a.id === id),
                    valueIds: dynBulkSelections[id] || [],
                  }))
                  .filter(e => e.attr && e.valueIds.length > 0);

                if (activeEntries.length === 0) return (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic border-t border-slate-200 dark:border-slate-800 pt-4">
                    ↑ Select at least one value above to preview combinations.
                  </p>
                );

                const totalCombos = activeEntries.reduce((acc, e) => acc * e.valueIds.length, 1);
                const cartesianStr = (arrays: string[][]): string[][] =>
                  arrays.reduce<string[][]>(
                    (acc, arr) => acc.flatMap(x => arr.map(y => [...x, y])),
                    [[]]
                  );
                const labelArrays = activeEntries.map(e =>
                  e.valueIds.map(vid => e.attr!.values.find(v => v.id === vid)?.value ?? "?")
                );
                const previewCombos = cartesianStr(labelArrays);

                return (
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Step 3 — Generate
                      </span>
                      {activeEntries.length < selectedAttributeIds.length && (
                        <span className="text-[10px] text-slate-400 italic">attributes with no values selected are skipped</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2">
                          <span className="font-black text-slate-900 dark:text-white text-xs">{totalCombos}</span>{" "}
                          combination{totalCombos !== 1 ? "s" : ""} will be generated:
                        </p>
                        <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                          {previewCombos.slice(0, 40).map((combo, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                            >
                              {combo.join(" / ")}
                            </span>
                          ))}
                          {previewCombos.length > 40 && (
                            <span className="text-[10px] text-slate-400 self-center">+{previewCombos.length - 40} more…</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateDynamicCombinations}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black shadow-md shadow-violet-600/25 transition-all cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
                      >
                        <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        Generate {totalCombos} Variant{totalCombos !== 1 ? "s" : ""}
                      </button>
                    </div>
                  </div>
                );
              })()}
          </div>

          {variants.length > 0 && (
            <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {variants.length} {variants.length === 1 ? "Variant" : "Variants"} Generated
              </span>
              <button
                type="button"
                onClick={() => setShowVariantsList(v => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <svg
                  className={`w-3.5 h-3.5 stroke-[2.5] transition-transform ${showVariantsList ? "" : "rotate-180"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {showVariantsList ? "Hide Variants" : "Show Variants"}
              </button>
            </div>
          )}

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
                Select attributes &amp; values above, then click &quot;Generate Variants&quot;.
              </p>
            </div>
          ) : showVariantsList ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Image</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">Selling ($)</th>
                    <th className="py-3 px-3">Stock Price ($)</th>
                    <th className="py-3 px-3">Stock</th>
                    {/* Dynamic Attribute Headers */}
                    {selectedAttributeIds.map((attrId) => {
                      const attr = allAttributes.find((a) => a.id === attrId);
                      return attr ? (
                        <th key={attrId} className="py-3 px-3">
                          {attr.name}
                        </th>
                      ) : null;
                    })}
                    {/* Unit Header */}
                    {allUnits.length > 0 && (
                      <th className="py-3 px-3">Unit</th>
                    )}
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
                                  alt="variant"
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

                      {/* Dynamic Attribute Value Dropdowns */}
                      {selectedAttributeIds.map((attrId) => {
                        const attr = allAttributes.find((a) => a.id === attrId);
                        if (!attr) return null;
                        const currentValId = variantAttrValues[v.id]?.[attrId];
                        return (
                          <td key={attrId} className="py-3 px-3 min-w-[120px]">
                            <select
                              value={currentValId || ""}
                              onChange={(e) =>
                                handleVariantAttrValueChange(v.id, attrId, Number(e.target.value))
                              }
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                            >
                              <option value="">-- Select --</option>
                              {attr.values.map((val) => (
                                <option key={val.id} value={val.id}>
                                  {val.value}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })}

                      {/* Unit */}
                      {allUnits.length > 0 && (
                        <td className="py-3 px-3 min-w-[110px]">
                          <select
                            value={variantUnits[v.id]?.unit_id || ""}
                            onChange={(e) =>
                              handleVariantUnitChange(v.id, "unit_id", Number(e.target.value))
                            }
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                          >
                            <option value="">-- Unit --</option>
                            {allUnits.map((unit) => (
                              <option key={unit.id} value={unit.id}>
                                {unit.name} ({unit.symbol})
                              </option>
                            ))}
                          </select>
                        </td>
                      )}

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
          ) : null}

        </div>

        {/* Section 4: Media, Description & Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            4. Media & Display Details
          </h2>

          {/* Multi-Image Gallery Upload */}
          <div>
            {/* Hidden Single File Input controlled via Ref */}
            <input
              ref={galleryInputRef}
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

            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Product Images Gallery
                  {productImages.length > 0 && (
                    <span className="ml-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full normal-case tracking-normal border border-slate-200 dark:border-slate-700">
                      {productImages.length} {productImages.length === 1 ? "image" : "images"}
                    </span>
                  )}
                </label>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Upload multiple photos or drag & drop. Set a default primary image for the catalog using the star badge.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span>Add URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span>Upload Images</span>
                </button>
              </div>
            </div>

            {/* Gallery Grid or Empty Dropzone */}
            {productImages.length === 0 ? (
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingGallery(true); }}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingGallery(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingGallery(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingGallery(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleAddGalleryImages(e.dataTransfer.files);
                  }
                }}
                onClick={() => galleryInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all group ${
                  isDraggingGallery
                    ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20 scale-[0.99]"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-10.5 6h19.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H2.25a.75.75 0 00-.75.75v11.25c0 .414.336.75.75.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isDraggingGallery ? "Drop images here to add" : "Click or drag & drop product images here"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP, GIF — Multiple files supported</p>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingGallery(true); }}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingGallery(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingGallery(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingGallery(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleAddGalleryImages(e.dataTransfer.files);
                  }
                }}
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-2 rounded-2xl border-2 transition-all ${
                  isDraggingGallery
                    ? "border-violet-500 bg-violet-50/20 dark:bg-violet-950/20"
                    : "border-transparent"
                }`}
              >
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all bg-slate-100 dark:bg-slate-800 ${
                      defaultImageIndex === index
                        ? "border-violet-500 dark:border-violet-400 shadow-md shadow-violet-200 dark:shadow-violet-900/40"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product image ${index + 1}`}
                      className="w-full aspect-[3/4] object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                    />

                    {/* Default badge / Set default button */}
                    {defaultImageIndex === index ? (
                      <div className="absolute top-1.5 left-1.5 bg-violet-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wide shadow">
                        ★ DEFAULT
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultImage(index)}
                        className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 bg-slate-900/80 hover:bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all cursor-pointer shadow"
                        title="Make this primary default image"
                      >
                        ☆ Set Default
                      </button>
                    )}

                    {/* Action buttons overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCropGalleryImage(index)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-white text-[10px] font-semibold rounded-lg transition-colors cursor-pointer"
                        title="Crop & adjust image"
                      >
                        ✂️ Crop
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] font-semibold rounded-lg transition-colors cursor-pointer"
                        title="Delete image"
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add more images tile */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer transition-all text-slate-500 dark:text-slate-400 group"
                  title="Add more images"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold">Add More</span>
                </button>
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

      {/* Gallery Add Image by URL Modal */}
      {urlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Image by URL</h3>
              <button
                type="button"
                onClick={() => setUrlModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Image Web Address (URL)
              </label>
              <input
                type="url"
                autoFocus
                placeholder="https://images.unsplash.com/... or any image link"
                value={urlInputVal}
                onChange={(e) => setUrlInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAddUrl();
                  }
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            {urlInputVal.trim() && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center max-h-48">
                <img
                  src={urlInputVal.trim()}
                  alt="Preview"
                  className="max-h-40 rounded object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = "block";
                  }}
                />
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setUrlModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!urlInputVal.trim()}
                onClick={handleConfirmAddUrl}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
