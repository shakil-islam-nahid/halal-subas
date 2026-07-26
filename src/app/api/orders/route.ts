import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/schemas";
import { getDeliverySettings } from "@/lib/settings";

function makeOrderNumber() {
  return `HS-${Date.now().toString().slice(-8)}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order information." }, { status: 400 });
  }

  const orderNumber = makeOrderNumber();
  const subtotal = parsed.data.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const deliverySettings = await getDeliverySettings();
  const deliveryCharge = deliverySettings.deliveryCharge;
  let discountAmount = 0;
  const totalAmount = subtotal + deliveryCharge - discountAmount;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      orderNumber,
      status: "PENDING",
      subtotal,
      discountAmount,
      totalAmount,
      note: "Demo mode: DATABASE_URL is not configured yet.",
    });
  }

  const { prisma } = await import("@/lib/prisma");
  const couponCode = parsed.data.couponCode?.toUpperCase() || null;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    const validCoupon =
      coupon &&
      coupon.isActive &&
      (!coupon.expiryDate || coupon.expiryDate >= new Date()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
      subtotal >= coupon.minimumOrderAmount;

    if (validCoupon) {
      discountAmount =
        coupon.discountType === "FIXED"
          ? Math.min(coupon.discountValue, subtotal)
          : Math.round(subtotal * (coupon.discountValue / 100));
    }
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerAddress: parsed.data.customerAddress,
      district: parsed.data.district,
      note: parsed.data.note,
      subtotal,
      deliveryCharge,
      discountAmount,
      totalAmount: subtotal + deliveryCharge - discountAmount,
      couponCode,
      items: {
        create: parsed.data.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          totalPrice: item.unitPrice * item.quantity,
        })),
      },
    },
  });

  if (couponCode && discountAmount > 0) {
    await prisma.coupon.update({
      where: { code: couponCode },
      data: { usedCount: { increment: 1 } },
    });
  }

  return NextResponse.json({ orderNumber: order.orderNumber, status: order.status });
}
