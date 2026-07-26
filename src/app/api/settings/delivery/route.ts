import { NextResponse } from "next/server";
import { getDeliverySettings } from "@/lib/settings";

export async function GET() {
  return NextResponse.json(await getDeliverySettings());
}
