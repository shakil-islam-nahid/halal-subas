import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-950/10 bg-emerald-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="relative h-14 w-14 overflow-hidden rounded bg-[#76742b] ring-1 ring-amber-200/30">
              <Image
                src="/logo.png"
                alt="Halal Subas logo"
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <h2 className="text-2xl font-bold text-amber-200">Halal Subas</h2>
          </div>
          <p className="mt-3 max-w-md text-sm leading-7 text-stone-200">
            Premium halal ator and fragrance products delivered across Bangladesh.
            Authentic scents, simple ordering, and careful support.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-amber-200">Quick Links</h3>
          <div className="mt-4 grid gap-2 text-sm text-stone-200">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
            <Link href="/checkout">Checkout</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-amber-200">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-stone-200">
            <p className="flex gap-2">
              <Phone size={16} className="mt-0.5 shrink-0" />
              {contact.phone}
            </p>
            <p className="flex gap-2">
              <Mail size={16} className="mt-0.5 shrink-0" />
              {contact.email}
            </p>
            <p className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              {contact.address}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-stone-300">
        © {new Date().getFullYear()} Halal Subas. Delivery across Bangladesh.
      </div>
    </footer>
  );
}
