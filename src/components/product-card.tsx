"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format";

type ProductCardProps = {
  product: {
    id: string;
    nameBn: string;
    nameEn: string;
    slug: string;
    shortDescription: string;
    price: number;
    compareAtPrice?: number;
    sizeLabel?: string;
    imageUrl: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const [addedQuantity, setAddedQuantity] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timeout = window.setTimeout(() => setShowToast(false), 2600);
    return () => window.clearTimeout(timeout);
  }, [showToast]);

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("halal-subas-cart") ?? "[]");
    const existing = cart.find((item: { productId: string }) => item.productId === product.id);
    let nextQuantity = 1;

    if (existing) {
      existing.quantity += 1;
      nextQuantity = existing.quantity;
    } else {
      cart.push({
        productId: product.id,
        productName: product.nameEn,
        nameBn: product.nameBn,
        unitPrice: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      });
    }

    localStorage.setItem("halal-subas-cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("halal-subas-cart"));
    setAddedQuantity(nextQuantity);
    setShowToast(true);
  }

  return (
    <article className="overflow-hidden rounded border border-emerald-950/10 bg-white shadow-sm">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-stone-100">
          <Image
            src={product.imageUrl}
            alt={product.nameEn}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            {product.sizeLabel}
          </p>
          <h3 className="mt-1 text-lg font-bold text-emerald-950">{product.nameBn}</h3>
          <p className="text-sm font-semibold text-zinc-600">{product.nameEn}</p>
        </div>
        <p className="min-h-10 text-sm leading-6 text-zinc-600">{product.shortDescription}</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-emerald-950">{formatCurrency(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-xs text-zinc-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <button
            onClick={addToCart}
            className="inline-flex h-11 items-center gap-2 rounded bg-emerald-950 px-4 text-sm font-bold text-amber-100 transition-colors hover:bg-emerald-900"
          >
            {addedQuantity > 0 ? <Check size={16} /> : <ShoppingBag size={16} />}
            {addedQuantity > 0 ? "Added" : "Add"}
          </button>
        </div>
        {addedQuantity > 0 ? (
          <div className="flex items-center justify-between gap-3 rounded bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-950">
            <span>Cart e added: {addedQuantity}</span>
            <Link href="/checkout" className="text-amber-700 underline underline-offset-4">
              Checkout
            </Link>
          </div>
        ) : null}
      </div>
      {showToast ? (
        <div className="fixed bottom-4 left-4 right-4 z-[80] rounded border border-emerald-950/10 bg-white p-4 shadow-2xl sm:left-auto sm:right-5 sm:w-80">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-emerald-950 text-amber-200">
              <Check size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-emerald-950">Added to cart</p>
              <p className="mt-1 text-sm text-zinc-600">
                {product.nameEn} cart e ache. Quantity: {addedQuantity}
              </p>
              <Link
                href="/checkout"
                className="mt-3 inline-flex h-9 items-center justify-center rounded bg-amber-400 px-3 text-sm font-bold text-emerald-950"
              >
                Go to checkout
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
