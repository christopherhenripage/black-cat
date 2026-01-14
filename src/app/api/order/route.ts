import { NextRequest, NextResponse } from "next/server";
import { validateOrderRequest } from "@/lib/validation";
import { checkRateLimit, getRateLimitIdentifier } from "@/lib/rate-limit";
import { sendOrderEmails } from "@/lib/email";

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

    // Validate input
    const validation = validateOrderRequest(body);

    if (!validation.success) {
      // Don't reveal honeypot detection
      if (validation.error === "spam_detected") {
        return NextResponse.json({ success: true });
      }

      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Send emails
    const emailResult = await sendOrderEmails(validation.data!);

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      // Still return success to user - we've logged the order
      // In production, you might want to handle this differently
    }

    // Log for debugging
    console.log(
      `Order request processed: ${validation.data!.productName} - ${
        validation.data!.email
      } (via ${emailResult.method})`
    );

    return NextResponse.json({
      success: true,
      message: "Order request submitted successfully",
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Optionally handle other methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
