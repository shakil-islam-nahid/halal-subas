import { ProductsClient } from "@/components/products-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/lib/sample-data";

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Products
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-emerald-950">
              Halal Subas collection
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
              Browse premium ator and fragrance products. Cart and checkout are
              mobile-first, so ordering from phone feels easy.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <span
                key={category.id}
                className="whitespace-nowrap rounded border border-emerald-950/10 bg-white px-3 py-2 text-sm font-semibold text-emerald-950"
              >
                {category.nameBn}
              </span>
            ))}
          </div>
        </div>

        <ProductsClient />
      </main>
      <SiteFooter />
    </>
  );
}
