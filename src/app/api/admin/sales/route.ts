import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";
import { z } from "zod";

const saleSchema = z.object({
  channel: z.enum(["WEBSITE", "INSTAGRAM", "POPUP", "OTHER"]),
  customerName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
  lineItems: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number().min(1),
      unitPrice: z.number().nullable().optional(),
    })
  ).min(1, "At least one item is required"),
});

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = saleSchema.parse(body);

    // Calculate total
    const total = validatedData.lineItems.reduce((sum, item) => {
      if (item.unitPrice) {
        return sum + item.unitPrice * item.quantity;
      }
      return sum;
    }, 0);

    // Create sale and update inventory in a transaction
    await prisma.$transaction(async (tx) => {
      // Create the sale
      const sale = await tx.sale.create({
        data: {
          channel: validatedData.channel,
          customerName: validatedData.customerName || null,
          email: validatedData.email || null,
          notes: validatedData.notes || null,
          total: total || null,
          lineItems: {
            create: validatedData.lineItems.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      // Update inventory for each line item
      for (const item of validatedData.lineItems) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: {
            quantityOnHand: { decrement: item.quantity },
            quantitySold: { increment: item.quantity },
          },
        });
      }

      return sale;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Create sale error:", error);
    return NextResponse.json(
      { error: "Failed to record sale" },
      { status: 500 }
    );
  }
}
