export const initalValuesForCreate = {
  product_id: "",
  productName: "",
  quantity: 0,
  price: 0,
  total_amount: 0,
  discount_in_percentage: 0,
  discount_in_rupees: 0,
};

import { z } from "zod";

export const productSchema = z.object({
  product_id: z.string().uuid().optional(), // allow optional for new products
  productName: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be >= 0"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  discount_in_percentage: z.number().min(0).max(100).optional(),
  discount_in_rupees: z.number().min(0).optional(), // removed .max(100)
  total_amount: z.number().min(0).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
