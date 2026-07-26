import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Truck, WalletCards } from "lucide-react";
import { FeaturedProductsClient } from "@/components/featured-products-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/lib/sample-data";
import { contact } from "@/lib/contact";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-emerald-950 text-stone-50">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">Halal Subas</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
                Premium halal ator for everyday elegance.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-stone-200">
                ইসলামিক প্রিমিয়াম ঘ্রাণ, modern luxury packaging, আর সহজ order flow.
                Delivery across Bangladesh.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="inline-flex h-12 items-center justify-center gap-2 rounded bg-amber-300 px-5 font-bold text-emerald-950">
                  Shop Products <ArrowRight size={18} />
                </Link>
                <Link href="/checkout" className="inline-flex h-12 items-center justify-center rounded border border-white/25 px-5 font-bold text-white">
                  Go to Cart
                </Link>
              </div>
            </div>
            <div className="grid content-end rounded border border-white/10 bg-white/8 p-5">
              <div className="grid gap-3 rounded bg-stone-50 p-5 text-emerald-950">
                <div className="relative mx-auto h-44 w-44 overflow-hidden rounded bg-[#76742b] sm:h-56 sm:w-56">
                  <Image
                    src="/logo.png"
                    alt="Halal Subas logo"
                    fill
                    sizes="(min-width: 640px) 224px, 176px"
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="text-sm font-bold text-amber-700">Premium Collection</p>
                <h2 className="text-2xl font-extrabold">Authentic halal fragrance</h2>
                <p className="text-sm leading-6 text-zinc-600">
                  Carefully selected ator products with simple ordering and support across Bangladesh.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: BadgeCheck, title: "Authentic fragrance", text: "Carefully selected halal ator products." },
            { icon: Truck, title: "All Bangladesh", text: "Simple delivery support across Bangladesh." },
            { icon: WalletCards, title: "No online gateway", text: "Order now, confirm manually/COD." },
          ].map((item) => (
            <div key={item.title} className="rounded border border-emerald-950/10 bg-white p-5">
              <item.icon className="text-amber-700" />
              <h3 className="mt-3 font-bold text-emerald-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Categories</p>
              <h2 className="mt-2 text-3xl font-extrabold text-emerald-950">Shop by fragrance mood</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.id} href="/products" className="rounded border border-emerald-950/10 bg-white p-5">
                <p className="text-xl font-bold text-emerald-950">{category.nameBn}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-600">{category.nameEn}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Featured</p>
              <h2 className="mt-2 text-3xl font-extrabold text-emerald-950">Popular ator picks</h2>
            </div>
            <Link href="/products" className="hidden font-bold text-emerald-950 sm:inline-flex">View all</Link>
          </div>
          <FeaturedProductsClient />
        </section>

        <section id="about" className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-emerald-950">About Halal Subas</h2>
            <p className="mt-4 max-w-3xl leading-8 text-zinc-600">
              Halal Subas is planned as a premium Islamic fragrance brand with a clean customer
              ordering experience and a powerful admin panel for managing products, orders,
              coupons, customers, and sales reports.
            </p>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded bg-emerald-950 p-6 text-stone-50 md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Contact</p>
            <h2 className="mt-2 text-3xl font-extrabold">Order support</h2>
            <div className="mt-5 grid gap-3 text-sm text-stone-200 sm:grid-cols-2">
              <p>Phone: {contact.phone}</p>
              <p>Email: {contact.email}</p>
              <p>WhatsApp: {contact.whatsapp}</p>
              <p>Address: {contact.address}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
