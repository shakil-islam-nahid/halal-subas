"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { StoreProduct } from "@/lib/types";

export function FeaturedProductsClient() {
  const [products, setProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();
      setProducts(data.slice(0, 4));
    }

    loadProducts();
    window.addEventListener("halal-subas-products", loadProducts);
    return () => window.removeEventListener("halal-subas-products", loadProducts);
  }, []);

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
