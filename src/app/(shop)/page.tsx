"use client";

import React, { useState } from "react";
import Link from "next/link";
import CategoryBar from "@/components/layout/CategoryBar";
import PromoBanner from "@/components/layout/PromoBanner";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";

interface Product {
  id: number;
  name: string;
  price: string;
  tag: string;
  slug: string;
  image: string;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Matching Family Sleeveless Floral Outfits Black",
    price: "$18.99",
    tag: "Family Matching",
    slug: "matching-family-sleeveless-floral-outfits-black",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Matching Family Polo Collar Sleeveless Floral Outfits",
    price: "$18.99",
    tag: "Family Matching",
    slug: "matching-family-polo-collar-sleeveless-floral-outfits",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Disney Matching Family Stripe Outfits",
    price: "$15.99",
    tag: "Mickey & Friends",
    slug: "disney-matching-family-stripe-outfits",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Matching Family Tropical Outfits Deep Blue",
    price: "$15.99",
    tag: "Family Matching",
    slug: "matching-family-tropical-outfits-deep-blue",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Matching Family Sunflower Sleeveless Outfits",
    price: "$16.99",
    tag: "Family Matching",
    slug: "matching-family-sunflower-sleeveless-outfits",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Matching Family Sleeveless Floral Outfits Black",
    price: "$18.99",
    tag: "Family Matching",
    slug: "matching-family-sleeveless-floral-outfits-black",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Matching Family Polo Collar Sleeveless Floral Outfits",
    price: "$18.99",
    tag: "Family Matching",
    slug: "matching-family-polo-collar-sleeveless-floral-outfits",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 8,
    name: "Disney Matching Family Stripe Outfits",
    price: "$15.99",
    tag: "Mickey & Friends",
    slug: "disney-matching-family-stripe-outfits",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 9,
    name: "Matching Family Tropical Outfits Deep Blue",
    price: "$15.99",
    tag: "Family Matching",
    slug: "matching-family-tropical-outfits-deep-blue",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=450&h=560&fit=crop&q=80"
  },
  {
    id: 10,
    name: "Matching Family Sunflower Sleeveless Outfits",
    price: "$16.99",
    tag: "Family Matching",
    slug: "matching-family-sunflower-sleeveless-outfits",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=450&h=560&fit=crop&q=80"
  }
];

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between">
      <CategoryBar />
      <PromoBanner />

      {/* Featured Products */}
      <section className="py-16 bg-white px-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Featured Products</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
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
      </section>

      {/* Quick View Product Customizer Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
