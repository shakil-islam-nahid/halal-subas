"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { contact } from "@/lib/contact";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function syncCartCount() {
      const cart = JSON.parse(localStorage.getItem("halal-subas-cart") ?? "[]");
      setCartCount(
        cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0),
      );
    }

    syncCartCount();
    window.addEventListener("storage", syncCartCount);
    window.addEventListener("halal-subas-cart", syncCartCount);
    return () => {
      window.removeEventListener("storage", syncCartCount);
      window.removeEventListener("halal-subas-cart", syncCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-12 w-12 overflow-hidden rounded bg-[#76742b] ring-1 ring-emerald-950/10">
            <Image
              src="/logo.png"
              alt="Halal Subas logo"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold text-emerald-950">Halal Subas</span>
            <span className="block text-xs font-medium text-zinc-600">Premium Halal Ator</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-zinc-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-emerald-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={contact.phone === "TO_BE_ADDED" ? "#contact" : `tel:${contact.phone}`}
            className="inline-flex h-10 items-center gap-2 rounded border border-emerald-950/15 px-3 text-sm font-semibold text-emerald-950"
          >
            <Phone size={16} />
            Call
          </a>
          <Link
            href="/checkout"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded bg-emerald-950 text-amber-200"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-emerald-950">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-emerald-950/15 text-emerald-950 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-emerald-950/10 px-4 py-4 md:hidden">
          <nav className="grid gap-3 text-base font-semibold text-zinc-800">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded bg-emerald-950 px-4 py-3 text-amber-100"
            >
              <ShoppingBag size={18} />
              Cart / Checkout {cartCount ? `(${cartCount})` : ""}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
