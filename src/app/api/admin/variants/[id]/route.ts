import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";
import { z } from "zod";

const adjustSchema = z.object({
  field: z.enum(["quantityOnHand", "quantityReserved", "quantitySold"]),
  delta: z.number(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { field, delta } = adjustSchema.parse(body);

    const variant = await prisma.variant.findUnique({ where: { id } });
    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    const currentValue = variant[field];
    const newValue = Math.max(0, currentValue + delta);

    const updateData: Record<string, unknown> = {
      [field]: newValue,
    };

    // Update lastRestockedAt if adding to onHand
    if (field === "quantityOnHand" && delta > 0) {
      updateData.lastRestockedAt = new Date();
    }

    await prisma.variant.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Adjust variant error:", error);
    return NextResponse.json(
      { error: "Failed to adjust variant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.variant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete variant error:", error);
    return NextResponse.json(
      { error: "Failed to delete variant" },
      { status: 500 }
    );
  }
}
