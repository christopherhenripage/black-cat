import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";
import { z } from "zod";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  type: z.string().default("button-down"),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Handle form data from HTML form submission
    const contentType = request.headers.get("content-type");
    let data: Record<string, unknown>;

    if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      data = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        type: formData.get("type") || "button-down",
        description: formData.get("description") || undefined,
      };
    } else {
      data = await request.json();
    }

    const validatedData = productSchema.parse(data);

    await prisma.product.create({
      data: validatedData,
    });

    // Redirect back to products page for form submissions
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      redirect("/admin/products");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
