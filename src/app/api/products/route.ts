import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function defaultCategoryId() {
  const category = await prisma.category.upsert({
    where: { slug: "premium" },
    update: {},
    create: {
      id: "premium",
      nameBn: "Premium",
      nameEn: "Premium",
      slug: "premium",
      description: "Premium ator collection",
    },
  });
  return category.id;
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const nameEn = String(body.nameEn ?? "").trim();
  const nameBn = String(body.nameBn ?? nameEn).trim();
  const price = Number(body.price ?? 0);
  const imageUrl = String(body.imageUrl ?? "").trim();
  const shortDescription = String(body.shortDescription ?? "").trim();

  if (!nameEn || !nameBn || !price || !imageUrl || !shortDescription) {
    return NextResponse.json({ error: "Missing product information." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      categoryId: await defaultCategoryId(),
      nameBn,
      nameEn,
      slug: `${slugify(nameEn)}-${Date.now()}`,
      shortDescription,
      description: shortDescription,
      price,
      compareAtPrice: Number(body.compareAtPrice || 0) || null,
      sizeLabel: String(body.sizeLabel || "6ml"),
      imageUrl,
      isFeatured: true,
      isActive: true,
    },
  });

  return NextResponse.json(product);
}
