import { prisma } from "@/lib/prisma";

export type DeliverySettings = {
  deliveryCharge: number;
  isFreeDelivery: boolean;
};

export async function getDeliverySettings(): Promise<DeliverySettings> {
  const settings = await prisma.shopSetting.findMany({
    where: {
      key: { in: ["deliveryCharge", "isFreeDelivery"] },
    },
  });

  const deliveryCharge =
    Number(settings.find((setting) => setting.key === "deliveryCharge")?.value ?? 120) || 0;
  const isFreeDelivery =
    settings.find((setting) => setting.key === "isFreeDelivery")?.value === "true";

  return {
    deliveryCharge: isFreeDelivery ? 0 : deliveryCharge,
    isFreeDelivery,
  };
}

export async function saveDeliverySettings(settings: DeliverySettings) {
  await prisma.$transaction([
    prisma.shopSetting.upsert({
      where: { key: "deliveryCharge" },
      update: { value: String(settings.deliveryCharge) },
      create: { key: "deliveryCharge", value: String(settings.deliveryCharge) },
    }),
    prisma.shopSetting.upsert({
      where: { key: "isFreeDelivery" },
      update: { value: String(settings.isFreeDelivery) },
      create: { key: "isFreeDelivery", value: String(settings.isFreeDelivery) },
    }),
  ]);
}
