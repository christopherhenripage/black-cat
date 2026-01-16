import { z } from "zod";

// Schema for individual cart items
const cartItemSchema = z.object({
  productSlug: z.string().min(1, "Product slug is required"),
  productName: z.string().min(1, "Product name is required"),
  size: z.string().min(1, "Size is required"),
  quantity: z.number().int().min(1).max(10),
  price: z.number().min(0),
});

// Schema for cart-based orders (multiple items)
export const cartOrderSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  items: z.array(cartItemSchema).min(1, "Cart cannot be empty"),
  fulfillmentMethod: z.enum(["pickup", "delivery", "shipping"]),
  shippingAddress: z.string().optional().or(z.literal("")),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional().or(z.literal("")),
  honeypot: z.string().optional(),
});

// Legacy schema for single product orders (backwards compatibility)
export const orderRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  productSlug: z.string().min(1, "Please select a product"),
  productName: z.string().min(1, "Product name is required"),
  size: z.string().optional().or(z.literal("")),
  quantity: z.number().int().min(1).max(10),
  fulfillmentMethod: z.enum(["pickup", "delivery", "shipping"]),
  shippingAddress: z.string().optional().or(z.literal("")),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional().or(z.literal("")),
  honeypot: z.string().optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartOrder = z.infer<typeof cartOrderSchema>;
export type OrderRequest = z.infer<typeof orderRequestSchema>;

// Validate cart-based order (multiple items)
export function validateCartOrder(data: unknown) {
  const result = cartOrderSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join(", ");
    return { success: false, error: errors, data: null };
  }

  // Check honeypot
  if (result.data.honeypot && result.data.honeypot.length > 0) {
    return { success: false, error: "spam_detected", data: null };
  }

  // Validate shipping address
  if (
    result.data.fulfillmentMethod === "shipping" &&
    (!result.data.shippingAddress || result.data.shippingAddress.trim().length === 0)
  ) {
    return {
      success: false,
      error: "Shipping address is required for shipping orders",
      data: null,
    };
  }

  return { success: true, error: null, data: result.data };
}

// Legacy validation for single product orders
export function validateOrderRequest(data: unknown) {
  const result = orderRequestSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join(", ");
    return { success: false, error: errors, data: null };
  }

  // Check honeypot - if filled, it's likely a bot
  if (result.data.honeypot && result.data.honeypot.length > 0) {
    // Return success to not reveal the honeypot, but don't process
    return { success: false, error: "spam_detected", data: null };
  }

  // Validate shipping address is provided when shipping is selected
  if (
    result.data.fulfillmentMethod === "shipping" &&
    (!result.data.shippingAddress || result.data.shippingAddress.trim().length === 0)
  ) {
    return {
      success: false,
      error: "Shipping address is required for shipping orders",
      data: null,
    };
  }

  return { success: true, error: null, data: result.data };
}
