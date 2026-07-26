"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Package, ReceiptText, Tags, Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { StoreOrder, StoreProduct } from "@/lib/types";

type Coupon = {
  id: string;
  code: string;
  discountValue: number;
  minimumOrderAmount: number;
  isActive: boolean;
  usedCount: number;
};

type DeliverySettings = {
  deliveryCharge: number;
  isFreeDelivery: boolean;
};

const statuses: StoreOrder["status"][] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    deliveryCharge: 120,
    isFreeDelivery: false,
  });
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const session = await fetch("/api/admin/me", { cache: "no-store" });
      if (!session.ok) {
        router.replace("/admin/login");
        return;
      }

      const [productsResponse, ordersResponse, couponsResponse, deliveryResponse] =
        await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/admin/orders", { cache: "no-store" }),
        fetch("/api/admin/coupons", { cache: "no-store" }),
        fetch("/api/admin/settings/delivery", { cache: "no-store" }),
      ]);
      setProducts(await productsResponse.json());
      setOrders(await ordersResponse.json());
      setCoupons(await couponsResponse.json());
      setDeliverySettings(await deliveryResponse.json());
      setReady(true);
    }

    loadDashboard();
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const deliveredSales = useMemo(
    () =>
      orders
        .filter((order) => order.status === "DELIVERED")
        .reduce((total, order) => total + order.totalAmount, 0),
    [orders],
  );

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving product...");
    const formData = new FormData(event.currentTarget);
    const payload = {
      nameBn: String(formData.get("nameBn")),
      nameEn: String(formData.get("nameEn")),
      shortDescription: String(formData.get("shortDescription")),
      price: Number(formData.get("price")),
      compareAtPrice: Number(formData.get("compareAtPrice") || 0) || undefined,
      sizeLabel: String(formData.get("sizeLabel") || "6ml"),
      imageUrl: String(formData.get("imageUrl")),
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Product save failed.");
      return;
    }

    const product = await response.json();
    setProducts([product, ...products]);
    setMessage("Product saved.");
    event.currentTarget.reset();
  }

  async function deleteProduct(productId: string) {
    const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Product delete failed.");
      return;
    }
    setProducts(products.filter((product) => product.id !== productId));
  }

  async function updateOrderStatus(orderNumber: string, status: StoreOrder["status"]) {
    const response = await fetch(`/api/admin/orders/${orderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setMessage("Order status update failed.");
      return;
    }
    const updatedOrder = await response.json();
    setOrders(
      orders.map((order) => (order.orderNumber === orderNumber ? updatedOrder : order)),
    );
  }

  async function addCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving coupon...");
    const formData = new FormData(event.currentTarget);
    const payload = {
      code: String(formData.get("code")),
      discountValue: Number(formData.get("discountValue")),
      minimumOrderAmount: Number(formData.get("minimumOrderAmount") || 0),
    };

    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Coupon save failed.");
      return;
    }

    const coupon = await response.json();
    setCoupons([coupon, ...coupons.filter((item) => item.id !== coupon.id)]);
    setMessage("Coupon saved.");
    event.currentTarget.reset();
  }

  async function deleteCoupon(couponId: string) {
    const response = await fetch(`/api/admin/coupons/${couponId}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Coupon delete failed.");
      return;
    }
    setCoupons(coupons.filter((coupon) => coupon.id !== couponId));
  }

  async function saveDelivery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving delivery setting...");
    const formData = new FormData(event.currentTarget);
    const payload = {
      deliveryCharge: Number(formData.get("deliveryCharge") || 0),
      isFreeDelivery: formData.get("isFreeDelivery") === "on",
    };

    const response = await fetch("/api/admin/settings/delivery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Delivery setting save failed.");
      return;
    }

    setDeliverySettings(await response.json());
    setMessage("Delivery setting saved.");
  }

  const cards = [
    { title: "Total Orders", value: String(orders.length), icon: ReceiptText },
    {
      title: "Pending",
      value: String(orders.filter((order) => order.status === "PENDING").length),
      icon: Package,
    },
    { title: "Delivered Sales", value: formatCurrency(deliveredSales), icon: BarChart3 },
    {
      title: "Customers",
      value: String(new Set(orders.map((order) => order.customerPhone)).size),
      icon: Users,
    },
  ];
  const activeOrders = orders.filter((order) => order.status !== "CANCELLED");
  const cancelledOrders = orders.filter((order) => order.status === "CANCELLED");

  function OrderCard({ order }: { order: StoreOrder }) {
    return (
      <div
        className={`rounded p-4 ${
          order.status === "CANCELLED" ? "bg-zinc-950 opacity-75" : "bg-zinc-900"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-amber-200">{order.orderNumber}</p>
              {order.discountAmount > 0 && order.couponCode ? (
                <span className="rounded bg-amber-300 px-2 py-1 text-xs font-extrabold text-emerald-950">
                  Coupon {order.couponCode} - {formatCurrency(order.discountAmount)}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-stone-300">
              {order.customerName} | {order.customerPhone} | {order.district}
            </p>
            <p className="mt-1 text-sm text-stone-300">{order.customerAddress}</p>
          </div>
          <select
            value={order.status}
            onChange={(event) =>
              updateOrderStatus(order.orderNumber, event.target.value as StoreOrder["status"])
            }
            className="h-10 rounded border border-white/10 bg-zinc-950 px-3 text-sm font-bold"
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 grid gap-1 text-sm text-stone-300">
          {order.items.map((item) => (
            <p key={`${order.orderNumber}-${item.productId}`}>
              {item.productName} x {item.quantity} ={" "}
              {formatCurrency(item.unitPrice * item.quantity)}
            </p>
          ))}
        </div>
        <div className="mt-3 grid gap-1 rounded border border-white/10 bg-zinc-950 p-3 text-sm">
          <p className="flex justify-between gap-4">
            <span className="text-stone-300">Subtotal</span>
            <b>{formatCurrency(order.subtotal)}</b>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-stone-300">Delivery</span>
            <b>{formatCurrency(order.deliveryCharge)}</b>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-stone-300">
              Coupon {order.couponCode ? `(${order.couponCode})` : ""}
            </span>
            <b className={order.discountAmount > 0 ? "text-amber-200" : ""}>
              -{formatCurrency(order.discountAmount)}
            </b>
          </p>
          <p className="flex justify-between gap-4 border-t border-white/10 pt-2 text-base">
            <span className="font-bold">Final Total</span>
            <b className="text-amber-200">{formatCurrency(order.totalAmount)}</b>
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 text-stone-50">
        <p className="text-sm font-semibold text-stone-300">Checking admin access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
              Admin Panel
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">Halal Subas Dashboard</h1>
          </div>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded bg-amber-300 px-4 font-bold text-emerald-950"
          >
            View Storefront
          </Link>
          <button
            onClick={logout}
            className="inline-flex h-11 items-center justify-center rounded border border-white/15 px-4 font-bold text-stone-100"
          >
            Logout
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded border border-white/10 bg-white/5 p-5">
              <card.icon className="text-amber-300" />
              <p className="mt-4 text-sm text-stone-300">{card.title}</p>
              <p className="mt-1 text-2xl font-extrabold">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2">
            <ReceiptText className="text-amber-300" />
            <h2 className="text-xl font-bold">Delivery Charge</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            Delivery charge change korle checkout e automatically update hobe. Free delivery on
            korle charge 0 taka hobe.
          </p>
          <form onSubmit={saveDelivery} className="mt-5 grid gap-3 sm:grid-cols-[220px_1fr_auto] sm:items-center">
            <input
              name="deliveryCharge"
              type="number"
              min="0"
              defaultValue={deliverySettings.isFreeDelivery ? 0 : deliverySettings.deliveryCharge}
              className="h-11 rounded border border-white/10 bg-zinc-900 px-3"
              placeholder="Delivery charge"
            />
            <label className="inline-flex items-center gap-3 text-sm font-semibold text-stone-200">
              <input
                name="isFreeDelivery"
                type="checkbox"
                defaultChecked={deliverySettings.isFreeDelivery}
                className="h-5 w-5 accent-amber-300"
              />
              Free delivery
            </label>
            <button className="h-11 rounded bg-amber-300 px-5 font-bold text-emerald-950">
              Save Delivery
            </button>
          </form>
          <p className="mt-3 text-sm text-stone-300">
            Current:{" "}
            <b className="text-amber-200">
              {deliverySettings.isFreeDelivery
                ? "Free delivery"
                : formatCurrency(deliverySettings.deliveryCharge)}
            </b>
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={addProduct} className="rounded border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2">
              <Package className="text-amber-300" />
              <h2 className="text-xl font-bold">Add Product</h2>
            </div>
            <div className="mt-5 grid gap-3">
              <input name="nameBn" required placeholder="Bangla name" className="h-11 rounded border border-white/10 bg-zinc-900 px-3" />
              <input name="nameEn" required placeholder="English name" className="h-11 rounded border border-white/10 bg-zinc-900 px-3" />
              <input name="price" required type="number" placeholder="Price" className="h-11 rounded border border-white/10 bg-zinc-900 px-3" />
              <input name="compareAtPrice" type="number" placeholder="Old price optional" className="h-11 rounded border border-white/10 bg-zinc-900 px-3" />
              <input name="sizeLabel" placeholder="Size, example 6ml" className="h-11 rounded border border-white/10 bg-zinc-900 px-3" />
              <input name="imageUrl" required placeholder="Image URL" className="h-11 rounded border border-white/10 bg-zinc-900 px-3" />
              <textarea name="shortDescription" required placeholder="Short description" className="min-h-24 rounded border border-white/10 bg-zinc-900 p-3" />
              <button className="h-11 rounded bg-amber-300 font-bold text-emerald-950">
                Save Product
              </button>
              {message ? <p className="text-sm font-semibold text-amber-100">{message}</p> : null}
            </div>
          </form>

          <div className="rounded border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2">
              <Tags className="text-amber-300" />
              <h2 className="text-xl font-bold">Products</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 rounded bg-zinc-900 p-3">
                  <div>
                    <p className="font-bold">{product.nameBn || product.nameEn}</p>
                    <p className="text-sm text-stone-300">
                      {product.nameEn} | {formatCurrency(product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded border border-red-300/30 text-red-200"
                    aria-label="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={addCoupon} className="rounded border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2">
              <Tags className="text-amber-300" />
              <h2 className="text-xl font-bold">Add Coupon</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Fixed taka discount. Customer checkout e ei code dile total amount theke taka kombe.
            </p>
            <div className="mt-5 grid gap-3">
              <input
                name="code"
                required
                placeholder="Coupon code, example EID100"
                className="h-11 rounded border border-white/10 bg-zinc-900 px-3 uppercase"
              />
              <input
                name="discountValue"
                required
                type="number"
                min="1"
                placeholder="Discount taka, example 100"
                className="h-11 rounded border border-white/10 bg-zinc-900 px-3"
              />
              <input
                name="minimumOrderAmount"
                type="number"
                min="0"
                placeholder="Minimum order taka optional"
                className="h-11 rounded border border-white/10 bg-zinc-900 px-3"
              />
              <button className="h-11 rounded bg-amber-300 font-bold text-emerald-950">
                Save Coupon
              </button>
            </div>
          </form>

          <div className="rounded border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2">
              <Tags className="text-amber-300" />
              <h2 className="text-xl font-bold">Coupons</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {coupons.length ? (
                coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between gap-3 rounded bg-zinc-900 p-3"
                  >
                    <div>
                      <p className="font-bold text-amber-200">{coupon.code}</p>
                      <p className="text-sm text-stone-300">
                        {formatCurrency(coupon.discountValue)} off
                        {coupon.minimumOrderAmount
                          ? ` | minimum ${formatCurrency(coupon.minimumOrderAmount)}`
                          : ""}{" "}
                        | used {coupon.usedCount}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-red-300/30 text-red-200"
                      aria-label="Delete coupon"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="rounded bg-zinc-900 p-4 text-sm text-stone-300">
                  No coupon yet. Add a coupon code from the form.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2">
            <ReceiptText className="text-amber-300" />
            <h2 className="text-xl font-bold">Orders</h2>
          </div>
          <div className="mt-5 grid gap-4">
            {activeOrders.length ? (
              activeOrders.map((order) => <OrderCard key={order.orderNumber} order={order} />)
            ) : (
              <p className="rounded bg-zinc-900 p-4 text-sm text-stone-300">
                No orders yet. Place an order from checkout, then it will appear here.
              </p>
            )}
          </div>
        </section>

        {cancelledOrders.length ? (
          <section className="mt-8 rounded border border-red-300/20 bg-red-950/10 p-5">
            <div className="flex items-center gap-2">
              <ReceiptText className="text-red-200" />
              <h2 className="text-xl font-bold">Cancelled Orders</h2>
            </div>
            <p className="mt-2 text-sm text-stone-400">
              Cancelled orders record hisebe rakha valo. Sales report e egulo count hobe na.
            </p>
            <div className="mt-5 grid gap-4">
              {cancelledOrders.map((order) => (
                <OrderCard key={order.orderNumber} order={order} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
