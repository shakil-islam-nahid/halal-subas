const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)="?(.+?)"?$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}

const prisma = new PrismaClient();

const categories = [
  { id: "classic", nameBn: "Classic Ator", nameEn: "Classic Ator", slug: "classic" },
  { id: "premium", nameBn: "Premium", nameEn: "Premium", slug: "premium" },
  { id: "gift", nameBn: "Gift Set", nameEn: "Gift Set", slug: "gift" },
];

const products = [
  {
    id: "oud-royal",
    categoryId: "premium",
    nameBn: "Oud Royal",
    nameEn: "Oud Royal",
    slug: "oud-royal",
    shortDescription: "Deep, royal and long-lasting oud fragrance.",
    description: "A warm woody profile for a refined Islamic lifestyle fragrance experience.",
    price: 850,
    compareAtPrice: 1050,
    sizeLabel: "6ml",
    imageUrl:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
  {
    id: "musk-safa",
    categoryId: "classic",
    nameBn: "Musk Safa",
    nameEn: "Musk Safa",
    slug: "musk-safa",
    shortDescription: "Clean, soft and suitable for daily use.",
    description: "A clean musk profile for prayer, office, daily wear and gifting.",
    price: 450,
    compareAtPrice: 550,
    sizeLabel: "6ml",
    imageUrl:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
  {
    id: "amber-noor",
    categoryId: "premium",
    nameBn: "Amber Noor",
    nameEn: "Amber Noor",
    slug: "amber-noor",
    shortDescription: "Warm amber, sweet spice and premium tone.",
    description: "Amber Noor blends warm amber notes with a smooth luxury finish.",
    price: 690,
    compareAtPrice: 790,
    sizeLabel: "6ml",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
  {
    id: "halal-gift-box",
    categoryId: "gift",
    nameBn: "Halal Gift Box",
    nameEn: "Halal Gift Box",
    slug: "halal-gift-box",
    shortDescription: "Premium ator set for special days.",
    description: "A curated gift box for Eid, Jummah, weddings and personal gifting.",
    price: 1490,
    compareAtPrice: 1690,
    sizeLabel: "3 x 6ml",
    imageUrl:
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: { ...product, isActive: true },
      create: product,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
