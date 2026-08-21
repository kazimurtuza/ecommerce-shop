"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

interface Product {
  id: number;
  name: string;
  price: string;
  tag: string;
  slug: string;
  image: string;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Format slug to category title
  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // High-quality mock products with Unsplash apparel images (10 items)
  const dummyProducts: Product[] = [
    {
      id: 1,
      name: `${categoryName} Premium Floral Apparel`,
      price: "$22.99",
      tag: categoryName,
      slug: `${slug}-item-1`,
      image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 2,
      name: `${categoryName} Cozy Family Outfits`,
      price: "$18.99",
      tag: categoryName,
      slug: `${slug}-item-2`,
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 3,
      name: `${categoryName} Classic Stripe Tops`,
      price: "$15.99",
      tag: categoryName,
      slug: `${slug}-item-3`,
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 4,
      name: `${categoryName} Tropical Blue Rompers`,
      price: "$15.99",
      tag: categoryName,
      slug: `${slug}-item-4`,
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 5,
      name: `${categoryName} Sunflower Sleeveless Dress`,
      price: "$16.99",
      tag: categoryName,
      slug: `${slug}-item-5`,
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 6,
      name: `${categoryName} Casual Linen Set`,
      price: "$24.99",
      tag: categoryName,
      slug: `${slug}-item-6`,
      image: "https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 7,
      name: `${categoryName} Knit Cotton Sweater`,
      price: "$29.99",
      tag: categoryName,
      slug: `${slug}-item-7`,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 8,
      name: `${categoryName} Summer Breeze Jumpsuit`,
      price: "$19.99",
      tag: categoryName,
      slug: `${slug}-item-8`,
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 9,
      name: `${categoryName} Everyday Cotton Tees`,
      price: "$12.99",
      tag: categoryName,
      slug: `${slug}-item-9`,
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=450&h=560&fit=crop&q=80"
    },
    {
      id: 10,
      name: `${categoryName} Pastel Shorts Set`,
      price: "$14.99",
      tag: categoryName,
      slug: `${slug}-item-10`,
      image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=450&h=560&fit=crop&q=80"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
            &larr; Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">{categoryName} Collection</h1>
        <p className="text-slate-500 mb-10 font-medium">Discover handpicked items for the {categoryName} collection.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dummyProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              price={product.price}
              tag={product.tag}
              image={product.image}
              slug={product.slug}
              onAddToBag={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      {/* Quick View Product Customizer Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
