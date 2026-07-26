import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const code = String(body.code ?? "").trim().toUpperCase();
  const subtotal = Number(body.subtotal ?? 0);

  if (!code) {
    return NextResponse.json({ discountAmount: 0, message: "Coupon code required." });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({
      discountAmount: 0,
      message: "Invalid coupon.",
    });
  }

  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    return NextResponse.json({ discountAmount: 0, message: "Coupon expired." });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ discountAmount: 0, message: "Coupon usage limit reached." });
  }

  if (subtotal < coupon.minimumOrderAmount) {
    return NextResponse.json({
      discountAmount: 0,
      message: `Minimum order amount is ${coupon.minimumOrderAmount} taka.`,
    });
  }

  const discountAmount =
    coupon.discountType === "FIXED"
      ? Math.min(coupon.discountValue, subtotal)
      : Math.round(subtotal * (coupon.discountValue / 100));

  return NextResponse.json({
    discountAmount,
    message: `${coupon.code} applied. ${discountAmount} taka discount added.`,
  });
}
