import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

type OrderRouteProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function PATCH(request: Request, { params }: OrderRouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const status = String(body.status ?? "");
  if (!statuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { orderNumber } = await params;
  const order = await prisma.order.update({
    where: { orderNumber },
    data: { status: status as never },
    include: { items: true },
  });

  return NextResponse.json(order);
}
