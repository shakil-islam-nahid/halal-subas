"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { StoreProduct } from "@/lib/types";

export function ProductsClient() {
  const [products, setProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    async function syncProducts() {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();
      setProducts(data);
    }

    syncProducts();
    window.addEventListener("halal-subas-products", syncProducts);
    return () => window.removeEventListener("halal-subas-products", syncProducts);
  }, []);

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
