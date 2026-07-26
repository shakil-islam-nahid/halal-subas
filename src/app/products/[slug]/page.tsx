import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded bg-stone-100">
            <Image
              src={product.imageUrl}
              alt={product.nameEn}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              {product.sizeLabel}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-emerald-950">
              {product.nameBn}
            </h1>
            <p className="mt-1 text-xl font-semibold text-zinc-600">{product.nameEn}</p>
            <p className="mt-5 text-3xl font-extrabold text-emerald-950">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-5 max-w-xl leading-8 text-zinc-600">{product.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded border border-emerald-950/15 px-5 font-bold text-emerald-950"
              >
                Back to products
              </Link>
              <Link
                href="/checkout"
                className="inline-flex h-12 items-center justify-center rounded bg-emerald-950 px-5 font-bold text-amber-100"
              >
                Go to checkout
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold text-emerald-950">You may also like</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  ...item,
                  compareAtPrice: item.compareAtPrice ?? undefined,
                  sizeLabel: item.sizeLabel ?? undefined,
                }}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
