import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  unitPrice: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerAddress: z.string().min(8),
  district: z.string().min(2),
  note: z.string().optional(),
  couponCode: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});
