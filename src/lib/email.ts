import { Resend } from "resend";
import nodemailer from "nodemailer";
import { OrderRequest } from "./validation";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ORDER_TO_EMAIL = process.env.ORDER_TO_EMAIL || "orders@blackcatbuttondown.com";
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blackcatbuttondown.com";

interface EmailResult {
  success: boolean;
  method: "resend" | "nodemailer" | "dev-log";
  error?: string;
}

function formatOrderDetails(order: OrderRequest): string {
  return `
Name: ${order.name}
Email: ${order.email}
Phone: ${order.phone || "Not provided"}

Product: ${order.productName}
Product Slug: ${order.productSlug}
Size: ${order.size || "Not specified"}
Quantity: ${order.quantity}

Fulfillment: ${order.fulfillmentMethod}
${order.fulfillmentMethod === "shipping" ? `Shipping Address: ${order.shippingAddress}` : ""}

Notes: ${order.notes || "None"}
  `.trim();
}

function getOwnerEmailHtml(order: OrderRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order Request</title>
</head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #000; border-bottom: 2px solid #c9a227; padding-bottom: 10px;">New Order Request</h1>

  <h2 style="color: #333;">Customer Details</h2>
  <p><strong>Name:</strong> ${order.name}</p>
  <p><strong>Email:</strong> <a href="mailto:${order.email}">${order.email}</a></p>
  <p><strong>Phone:</strong> ${order.phone || "Not provided"}</p>

  <h2 style="color: #333;">Order Details</h2>
  <p><strong>Product:</strong> ${order.productName}</p>
  <p><strong>Size:</strong> ${order.size || "Not specified"}</p>
  <p><strong>Quantity:</strong> ${order.quantity}</p>
  <p><strong>Fulfillment:</strong> ${order.fulfillmentMethod}</p>
  ${order.fulfillmentMethod === "shipping" ? `<p><strong>Shipping Address:</strong><br>${order.shippingAddress?.replace(/\n/g, "<br>")}</p>` : ""}

  ${order.notes ? `<h2 style="color: #333;">Notes</h2><p>${order.notes}</p>` : ""}

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
  <p style="color: #666; font-size: 12px;">
    This order request was submitted via <a href="${SITE_URL}">${SITE_URL}</a>
  </p>
</body>
</html>
  `.trim();
}

function getCustomerEmailHtml(order: OrderRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Request Received - Black Cat Button Down</title>
</head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #000; border-bottom: 2px solid #c9a227; padding-bottom: 10px;">Thank You for Your Order Request</h1>

  <p>Hi ${order.name},</p>

  <p>We've received your order request and we're excited to help you get your hands on a Black Cat shirt!</p>

  <h2 style="color: #333;">What's Next?</h2>
  <ol>
    <li>We'll review your request and check availability</li>
    <li>Within 24-48 hours, we'll send you an email to confirm details</li>
    <li>Once confirmed, we'll provide a secure payment link</li>
    <li>After payment, we'll arrange your ${order.fulfillmentMethod === "pickup" ? "pickup" : order.fulfillmentMethod === "delivery" ? "delivery" : "shipping"}</li>
  </ol>

  <h2 style="color: #333;">Your Request Summary</h2>
  <p><strong>Product:</strong> ${order.productName}</p>
  <p><strong>Size:</strong> ${order.size || "To be confirmed"}</p>
  <p><strong>Quantity:</strong> ${order.quantity}</p>
  <p><strong>Fulfillment:</strong> ${order.fulfillmentMethod}</p>

  <p>If you have any questions in the meantime, just reply to this email or reach out at <a href="mailto:hello@blackcatbuttondown.com">hello@blackcatbuttondown.com</a>.</p>

  <p>Cheers,<br>The Black Cat Button Down Team</p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
  <p style="color: #666; font-size: 12px;">
    Black Cat Button Down<br>
    Created in Bangkok / Sold in New Orleans<br>
    <a href="${SITE_URL}">${SITE_URL}</a>
  </p>
</body>
</html>
  `.trim();
}

async function sendWithResend(order: OrderRequest): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    return { success: false, method: "resend", error: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    // Send to owner
    await resend.emails.send({
      from: "Black Cat Button Down <onboarding@resend.dev>",
      to: ORDER_TO_EMAIL,
      subject: `New Order Request: ${order.productName}`,
      html: getOwnerEmailHtml(order),
      text: formatOrderDetails(order),
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: "Black Cat Button Down <onboarding@resend.dev>",
      to: order.email,
      subject: "Order Request Received - Black Cat Button Down",
      html: getCustomerEmailHtml(order),
    });

    return { success: true, method: "resend" };
  } catch (error) {
    return {
      success: false,
      method: "resend",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function sendWithNodemailer(order: OrderRequest): Promise<EmailResult> {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return { success: false, method: "nodemailer", error: "SMTP not configured" };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: SMTP_PORT === "465",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    // Send to owner
    await transporter.sendMail({
      from: `"Black Cat Button Down" <${SMTP_USER}>`,
      to: ORDER_TO_EMAIL,
      subject: `New Order Request: ${order.productName}`,
      html: getOwnerEmailHtml(order),
      text: formatOrderDetails(order),
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"Black Cat Button Down" <${SMTP_USER}>`,
      to: order.email,
      subject: "Order Request Received - Black Cat Button Down",
      html: getCustomerEmailHtml(order),
    });

    return { success: true, method: "nodemailer" };
  } catch (error) {
    return {
      success: false,
      method: "nodemailer",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function logOrderToConsole(order: OrderRequest): EmailResult {
  console.log("\n========================================");
  console.log("NEW ORDER REQUEST (Dev Mode - No Email Sent)");
  console.log("========================================");
  console.log(formatOrderDetails(order));
  console.log("========================================\n");

  return { success: true, method: "dev-log" };
}

export async function sendOrderEmails(order: OrderRequest): Promise<EmailResult> {
  // Try Resend first
  if (RESEND_API_KEY) {
    const result = await sendWithResend(order);
    if (result.success) return result;
    console.warn("Resend failed:", result.error);
  }

  // Try Nodemailer as fallback
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const result = await sendWithNodemailer(order);
    if (result.success) return result;
    console.warn("Nodemailer failed:", result.error);
  }

  // Dev mode - log to console
  console.warn("No email provider configured - logging order to console");
  return logOrderToConsole(order);
}
