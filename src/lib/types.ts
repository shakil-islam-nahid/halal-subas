export type StoreProduct = {
  id: string;
  categoryId: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sizeLabel?: string;
  imageUrl: string;
  isFeatured?: boolean;
};

export type StoreOrderItem = {
  productId: string;
  productName: string;
  nameBn?: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
};

export type StoreOrder = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  district: string;
  note?: string;
  couponCode?: string;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: StoreOrderItem[];
  createdAt: string;
};
