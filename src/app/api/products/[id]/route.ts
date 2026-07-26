import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type ProductRouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: ProductRouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ ok: true });
}
