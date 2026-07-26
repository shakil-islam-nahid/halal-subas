import { products as sampleProducts } from "@/lib/sample-data";
import type { StoreOrder, StoreProduct } from "@/lib/types";

const productKey = "halal-subas-products";
const orderKey = "halal-subas-orders";

export function getProducts(): StoreProduct[] {
  const saved = localStorage.getItem(productKey);
  if (!saved) {
    localStorage.setItem(productKey, JSON.stringify(sampleProducts));
    return sampleProducts;
  }
  return JSON.parse(saved);
}

export function saveProducts(products: StoreProduct[]) {
  localStorage.setItem(productKey, JSON.stringify(products));
  window.dispatchEvent(new Event("halal-subas-products"));
}

export function getOrders(): StoreOrder[] {
  return JSON.parse(localStorage.getItem(orderKey) ?? "[]");
}

export function saveOrders(orders: StoreOrder[]) {
  localStorage.setItem(orderKey, JSON.stringify(orders));
  window.dispatchEvent(new Event("halal-subas-orders"));
}

export function addOrder(order: StoreOrder) {
  saveOrders([order, ...getOrders()]);
}
