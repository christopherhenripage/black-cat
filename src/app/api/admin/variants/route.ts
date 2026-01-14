import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";
import { z } from "zod";

const variantSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  cost: z.number().nullable().optional(),
  quantityOnHand: z.number().default(0),
});

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = variantSchema.parse(body);

    await prisma.variant.create({
      data: {
        productId: validatedData.productId,
        size: validatedData.size,
        color: validatedData.color,
        sku: validatedData.sku,
        price: validatedData.price,
        cost: validatedData.cost,
        quantityOnHand: validatedData.quantityOnHand,
        lastRestockedAt: validatedData.quantityOnHand > 0 ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Create variant error:", error);
    return NextResponse.json(
      { error: "Failed to create variant" },
      { status: 500 }
    );
  }
}
