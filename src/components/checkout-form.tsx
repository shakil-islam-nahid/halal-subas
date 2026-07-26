"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";

type CartItem = {
  productId: string;
  productName: string;
  nameBn: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
};

export function CheckoutForm() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(120);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("halal-subas-cart") ?? "[]"));
    async function loadDeliverySettings() {
      const response = await fetch("/api/settings/delivery", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const settings = await response.json();
      setDeliveryCharge(settings.deliveryCharge);
      setIsFreeDelivery(settings.isFreeDelivery);
    }

    loadDeliverySettings();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );
  const total = Math.max(0, subtotal + deliveryCharge - discount);

  function updateQuantity(productId: string, quantity: number) {
    const nextItems = items
      .map((item) => (item.productId === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    setItems(nextItems);
    localStorage.setItem("halal-subas-cart", JSON.stringify(nextItems));
    window.dispatchEvent(new Event("halal-subas-cart"));
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    });
    const result = await response.json();
    setDiscount(result.discountAmount ?? 0);
    setMessage(result.message);
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Submitting order...");
    const formData = new FormData(event.currentTarget);
    const payload = {
      customerName: String(formData.get("customerName")),
      customerPhone: String(formData.get("customerPhone")),
      customerAddress: String(formData.get("customerAddress")),
      district: String(formData.get("district")),
      note: String(formData.get("note") ?? ""),
      couponCode,
      items,
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (response.ok) {
      localStorage.removeItem("halal-subas-cart");
      window.dispatchEvent(new Event("halal-subas-cart"));
      setItems([]);
      setMessage(`Order received. Order number: ${result.orderNumber}`);
      event.currentTarget.reset();
    } else {
      setMessage(result.error ?? "Order submit failed.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submitOrder} className="rounded border border-emerald-950/10 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Checkout</h1>
        <p className="mt-2 text-sm text-zinc-600">Account lagbe na. Details din, amra confirm korbo.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-zinc-700">
            Name
            <input name="customerName" required className="h-12 rounded border border-zinc-200 px-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-zinc-700">
            Phone
            <input name="customerPhone" required className="h-12 rounded border border-zinc-200 px-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-zinc-700">
            District
            <input name="district" required className="h-12 rounded border border-zinc-200 px-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-zinc-700 sm:col-span-2">
            Full address
            <textarea name="customerAddress" required className="min-h-24 rounded border border-zinc-200 p-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-zinc-700 sm:col-span-2">
            Note
            <textarea name="note" className="min-h-20 rounded border border-zinc-200 p-3" />
          </label>
        </div>

        <button
          disabled={!items.length}
          className="mt-6 h-12 w-full rounded bg-emerald-950 px-5 font-bold text-amber-100 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          Place Order
        </button>
        {message ? <p className="mt-4 rounded bg-amber-50 p-3 text-sm font-semibold text-emerald-950">{message}</p> : null}
      </form>

      <aside className="rounded border border-emerald-950/10 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-emerald-950">Order Summary</h2>
        <div className="mt-5 grid gap-4">
          {items.length ? (
            items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-stone-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-emerald-950">{item.nameBn}</p>
                  <p className="text-sm text-zinc-600">{formatCurrency(item.unitPrice)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="h-8 w-8 rounded border">-</button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="h-8 w-8 rounded border">+</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-600">Cart empty.</p>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
            placeholder="Coupon"
            className="h-11 min-w-0 flex-1 rounded border border-zinc-200 px-3"
          />
          <button type="button" onClick={applyCoupon} className="h-11 rounded bg-amber-400 px-4 text-sm font-bold text-emerald-950">
            Apply
          </button>
        </div>

        <div className="mt-6 grid gap-2 border-t pt-5 text-sm">
          <p className="flex justify-between"><span>Subtotal</span><b>{formatCurrency(subtotal)}</b></p>
          <p className="flex justify-between">
            <span>Delivery {isFreeDelivery ? "(Free)" : ""}</span>
            <b>{deliveryCharge === 0 ? "Free" : formatCurrency(deliveryCharge)}</b>
          </p>
          <p className="flex justify-between"><span>Discount</span><b>-{formatCurrency(discount)}</b></p>
          <p className="flex justify-between text-lg text-emerald-950"><span>Total</span><b>{formatCurrency(total)}</b></p>
        </div>
      </aside>
    </div>
  );
}
