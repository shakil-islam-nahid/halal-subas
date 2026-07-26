import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getDeliverySettings, saveDeliverySettings } from "@/lib/settings";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getDeliverySettings());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const deliveryCharge = Math.max(0, Number(body.deliveryCharge ?? 0));
  const isFreeDelivery = Boolean(body.isFreeDelivery);

  await saveDeliverySettings({ deliveryCharge, isFreeDelivery });
  return NextResponse.json(await getDeliverySettings());
}
