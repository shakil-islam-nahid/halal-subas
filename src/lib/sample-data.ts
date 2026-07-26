export const categories = [
  { id: "classic", nameBn: "ক্লাসিক আতর", nameEn: "Classic Ator", slug: "classic" },
  { id: "premium", nameBn: "প্রিমিয়াম", nameEn: "Premium", slug: "premium" },
  { id: "gift", nameBn: "গিফট সেট", nameEn: "Gift Set", slug: "gift" },
];

export const products = [
  {
    id: "oud-royal",
    categoryId: "premium",
    nameBn: "উদ রয়েল",
    nameEn: "Oud Royal",
    slug: "oud-royal",
    shortDescription: "গভীর, রাজকীয় ও দীর্ঘস্থায়ী উদ ঘ্রাণ।",
    description:
      "Oud Royal is crafted for a refined Islamic lifestyle fragrance experience with a warm woody profile.",
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
    nameBn: "মাস্ক সাফা",
    nameEn: "Musk Safa",
    slug: "musk-safa",
    shortDescription: "পরিষ্কার, নরম ও দৈনন্দিন ব্যবহারের জন্য সুন্দর।",
    description:
      "A clean musk profile suitable for daily wear, prayer, office, and gifting.",
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
    nameBn: "আম্বর নূর",
    nameEn: "Amber Noor",
    slug: "amber-noor",
    shortDescription: "উষ্ণ আম্বর, মিষ্টি স্পাইস আর প্রিমিয়াম টোন।",
    description:
      "Amber Noor blends warm amber notes with a smooth luxury finish for evening wear.",
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
    nameBn: "হালাল গিফট বক্স",
    nameEn: "Halal Gift Box",
    slug: "halal-gift-box",
    shortDescription: "বিশেষ দিনের জন্য প্রিমিয়াম আতর সেট।",
    description:
      "A curated gift box for Eid, Jummah, weddings, and meaningful personal gifting.",
    price: 1490,
    compareAtPrice: 1690,
    sizeLabel: "3 x 6ml",
    imageUrl:
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
];
