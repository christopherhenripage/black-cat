import { NextRequest, NextResponse } from "next/server";
import { validateCartOrder, validateOrderRequest } from "@/lib/validation";
import { checkRateLimit, getRateLimitIdentifier } from "@/lib/rate-limit";
import { sendOrderEmails, sendCartOrderEmails } from "@/lib/email";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request.headers);
    const rateLimitResult = checkRateLimit(identifier, {
      maxRequests: 5,
      windowMs: 60000, // 5 requests per minute
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();

    // Check if this is a cart order (has items array) or single product order
    const isCartOrder = Array.isArray(body.items);

    if (isCartOrder) {
      return handleCartOrder(body);
    } else {
      return handleSingleProductOrder(body);
    }
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Handle cart orders (multiple items)
async function handleCartOrder(body: unknown) {
  const validation = validateCartOrder(body);

  if (!validation.success) {
    if (validation.error === "spam_detected") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const fulfillmentMap: Record<string, "PICKUP" | "DELIVERY" | "SHIPPING"> = {
    pickup: "PICKUP",
    delivery: "DELIVERY",
    shipping: "SHIPPING",
  };

  try {
    await prisma.orderRequest.create({
      data: {
        customerName: validation.data!.name,
        email: validation.data!.email,
        phone: validation.data!.phone || null,
        fulfillmentMethod:
          fulfillmentMap[validation.data!.fulfillmentMethod] || "PICKUP",
        shippingAddress: validation.data!.shippingAddress || null,
        notes: validation.data!.notes || null,
        items: {
          create: validation.data!.items.map((item) => ({
            productSlug: item.productSlug,
            productName: item.productName,
            variantSize: item.size,
            quantity: item.quantity,
            price: Math.round(item.price * 100), // Convert to cents
          })),
        },
      },
    });
  } catch (dbError) {
    console.error("Failed to save cart order to database:", dbError);
  }

  // Send emails
  const emailResult = await sendCartOrderEmails(validation.data!);

  if (!emailResult.success) {
    console.error("Email sending failed:", emailResult.error);
  }

  const itemCount = validation.data!.items.reduce((sum, item) => sum + item.quantity, 0);
  console.log(
    `Cart order processed: ${itemCount} items - ${validation.data!.email} (via ${emailResult.method})`
  );

  return NextResponse.json({
    success: true,
    message: "Order request submitted successfully",
  });
}

// Handle single product orders (legacy)
async function handleSingleProductOrder(body: unknown) {
  const validation = validateOrderRequest(body);

  if (!validation.success) {
    if (validation.error === "spam_detected") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const fulfillmentMap: Record<string, "PICKUP" | "DELIVERY" | "SHIPPING"> = {
    pickup: "PICKUP",
    delivery: "DELIVERY",
    shipping: "SHIPPING",
  };

  try {
    await prisma.orderRequest.create({
      data: {
        customerName: validation.data!.name,
        email: validation.data!.email,
        phone: validation.data!.phone || null,
        fulfillmentMethod:
          fulfillmentMap[validation.data!.fulfillmentMethod] || "PICKUP",
        shippingAddress: validation.data!.shippingAddress || null,
        notes: validation.data!.notes || null,
        items: {
          create: {
            productSlug: validation.data!.productSlug,
            productName: validation.data!.productName,
            variantSize: validation.data!.size || "Unknown",
            quantity: validation.data!.quantity,
            price: null,
          },
        },
      },
    });
  } catch (dbError) {
    console.error("Failed to save order request to database:", dbError);
  }

  const emailResult = await sendOrderEmails(validation.data!);

  if (!emailResult.success) {
    console.error("Email sending failed:", emailResult.error);
  }

  console.log(
    `Order request processed: ${validation.data!.productName} - ${
      validation.data!.email
    } (via ${emailResult.method})`
  );

  return NextResponse.json({
    success: true,
    message: "Order request submitted successfully",
  });
}

// Optionally handle other methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
