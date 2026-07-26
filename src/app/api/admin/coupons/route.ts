import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(coupons);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const code = String(body.code ?? "").trim().toUpperCase();
  const discountValue = Number(body.discountValue ?? 0);
  const minimumOrderAmount = Number(body.minimumOrderAmount ?? 0);

  if (!code || discountValue <= 0) {
    return NextResponse.json(
      { error: "Coupon code and taka amount are required." },
      { status: 400 },
    );
  }

  const coupon = await prisma.coupon.upsert({
    where: { code },
    update: {
      discountType: "FIXED",
      discountValue,
      minimumOrderAmount,
      isActive: true,
    },
    create: {
      code,
      discountType: "FIXED",
      discountValue,
      minimumOrderAmount,
      isActive: true,
    },
  });

  return NextResponse.json(coupon);
}
