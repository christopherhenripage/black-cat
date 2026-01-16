import { Resend } from "resend";
import nodemailer from "nodemailer";
import { OrderRequest, CartOrder } from "./validation";

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
  const fulfillmentLabel = order.fulfillmentMethod === "pickup"
    ? "🏪 Pickup"
    : order.fulfillmentMethod === "delivery"
    ? "🚗 Delivery"
    : "📦 Shipping";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Request</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #c9a227; padding: 20px; text-align: center;">
      <h1 style="color: #000; font-size: 18px; font-weight: bold; margin: 0; letter-spacing: 1px;">
        🐱 NEW ORDER REQUEST
      </h1>
    </div>

    <!-- Quick glance -->
    <div style="padding: 25px; border-bottom: 1px solid #eee;">
      <table style="width: 100%;">
        <tr>
          <td style="font-size: 28px; font-weight: bold; color: #000;">${order.productName}</td>
        </tr>
        <tr>
          <td style="color: #666; padding-top: 5px;">
            Size: <strong>${order.size || "TBD"}</strong> &nbsp;|&nbsp;
            Qty: <strong>${order.quantity}</strong> &nbsp;|&nbsp;
            ${fulfillmentLabel}
          </td>
        </tr>
      </table>
    </div>

    <!-- Customer info -->
    <div style="padding: 25px; background-color: #fafafa;">
      <h2 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        Customer
      </h2>
      <p style="margin: 0 0 8px 0;">
        <strong>${order.name}</strong>
      </p>
      <p style="margin: 0 0 8px 0;">
        <a href="mailto:${order.email}" style="color: #0066cc;">${order.email}</a>
      </p>
      <p style="margin: 0; color: #666;">
        ${order.phone || "No phone provided"}
      </p>
    </div>

    ${order.fulfillmentMethod === "shipping" && order.shippingAddress ? `
    <!-- Shipping address -->
    <div style="padding: 25px; border-top: 1px solid #eee;">
      <h2 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        Ship To
      </h2>
      <p style="margin: 0; color: #333; line-height: 1.6;">
        ${order.shippingAddress.replace(/\n/g, "<br>")}
      </p>
    </div>
    ` : ""}

    ${order.notes ? `
    <!-- Notes -->
    <div style="padding: 25px; border-top: 1px solid #eee;">
      <h2 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        Notes
      </h2>
      <p style="margin: 0; color: #333; line-height: 1.6; font-style: italic;">
        "${order.notes}"
      </p>
    </div>
    ` : ""}

    <!-- Actions -->
    <div style="padding: 25px; text-align: center; border-top: 1px solid #eee;">
      <a href="mailto:${order.email}?subject=Re: Your Black Cat Order Request - ${order.productName}"
         style="display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; font-size: 14px; font-weight: bold;">
        Reply to Customer
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 15px; background-color: #f5f5f5; text-align: center;">
      <p style="margin: 0; color: #999; font-size: 11px;">
        Submitted via <a href="${SITE_URL}" style="color: #999;">${SITE_URL}</a>
      </p>
    </div>
  </div>
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Request Received - Black Cat Button Down</title>
</head>
<body style="font-family: 'Georgia', serif; margin: 0; padding: 0; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with cat silhouette -->
    <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
      <!-- Simple cat silhouette using CSS -->
      <div style="margin-bottom: 16px;">
        <svg width="60" height="60" viewBox="0 0 100 100" style="display: inline-block;">
          <path d="M25 35 L35 15 L45 35 Z" fill="#c9a227"/>
          <path d="M55 35 L65 15 L75 35 Z" fill="#c9a227"/>
          <ellipse cx="50" cy="45" rx="28" ry="24" fill="#c9a227"/>
          <ellipse cx="50" cy="75" rx="22" ry="20" fill="#c9a227"/>
          <path d="M72 75 Q 90 70, 92 50 Q 94 35, 85 30" stroke="#c9a227" stroke-width="8" fill="none" stroke-linecap="round"/>
          <ellipse cx="41" cy="42" rx="4" ry="5" fill="#22c55e"/>
          <ellipse cx="59" cy="42" rx="4" ry="5" fill="#22c55e"/>
        </svg>
      </div>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: normal; margin: 0; letter-spacing: 2px;">
        BLACK CAT BUTTON DOWN
      </h1>
      <p style="color: #c9a227; font-size: 12px; margin: 8px 0 0 0; letter-spacing: 1px;">
        BANGKOK → NEW ORLEANS
      </p>
    </div>

    <!-- Main content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #000; font-size: 22px; font-weight: normal; margin: 0 0 20px 0;">
        We've got your request, ${order.name.split(' ')[0]}.
      </h2>

      <p style="color: #555; line-height: 1.7; margin: 0 0 25px 0;">
        Thanks for reaching out. We'll review your order and get back to you within 24-48 hours to confirm availability and next steps.
      </p>

      <!-- Order summary box -->
      <div style="background-color: #f9f9f9; padding: 25px; margin: 25px 0;">
        <h3 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
          Your Request
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #888; padding: 8px 0; font-size: 14px;">Product</td>
            <td style="color: #000; padding: 8px 0; font-size: 14px; text-align: right;">${order.productName}</td>
          </tr>
          <tr>
            <td style="color: #888; padding: 8px 0; font-size: 14px;">Size</td>
            <td style="color: #000; padding: 8px 0; font-size: 14px; text-align: right;">${order.size || "To be confirmed"}</td>
          </tr>
          <tr>
            <td style="color: #888; padding: 8px 0; font-size: 14px;">Quantity</td>
            <td style="color: #000; padding: 8px 0; font-size: 14px; text-align: right;">${order.quantity}</td>
          </tr>
          <tr>
            <td style="color: #888; padding: 8px 0; font-size: 14px;">Fulfillment</td>
            <td style="color: #000; padding: 8px 0; font-size: 14px; text-align: right; text-transform: capitalize;">${order.fulfillmentMethod}</td>
          </tr>
        </table>
      </div>

      <!-- What's next -->
      <h3 style="color: #000; font-size: 14px; font-weight: bold; margin: 30px 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        What Happens Next
      </h3>
      <div style="color: #555; line-height: 1.8; font-size: 14px;">
        <p style="margin: 0 0 10px 0;">1. We check availability and confirm your order</p>
        <p style="margin: 0 0 10px 0;">2. We'll reach out to coordinate payment</p>
        <p style="margin: 0 0 10px 0;">3. Your shirt heads your way</p>
      </div>

      <p style="color: #555; line-height: 1.7; margin: 30px 0 0 0;">
        Questions? Just reply to this email.
      </p>

      <p style="color: #000; margin: 30px 0 0 0;">
        — The Black Cat Team
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #000; padding: 25px 30px; text-align: center;">
      <p style="color: #888; font-size: 12px; margin: 0 0 5px 0;">
        Found in Bangkok. Sold in New Orleans.
      </p>
      <p style="margin: 0;">
        <a href="${SITE_URL}" style="color: #c9a227; font-size: 12px; text-decoration: none;">${SITE_URL}</a>
      </p>
    </div>
  </div>
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

// ==========================================
// Cart Order Emails (Multiple Items)
// ==========================================

function getCartTotal(order: CartOrder): number {
  return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartItemCount(order: CartOrder): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function formatCartOrderDetails(order: CartOrder): string {
  const itemsList = order.items
    .map((item) => `- ${item.productName} (Size: ${item.size}, Qty: ${item.quantity}) - $${item.price}`)
    .join("\n");

  return `
Name: ${order.name}
Email: ${order.email}
Phone: ${order.phone || "Not provided"}

Items:
${itemsList}

Total: $${getCartTotal(order).toFixed(2)}

Fulfillment: ${order.fulfillmentMethod}
${order.fulfillmentMethod === "shipping" ? `Shipping Address: ${order.shippingAddress}` : ""}

Notes: ${order.notes || "None"}
  `.trim();
}

function getCartOwnerEmailHtml(order: CartOrder): string {
  const fulfillmentLabel = order.fulfillmentMethod === "pickup"
    ? "🏪 Pickup"
    : order.fulfillmentMethod === "delivery"
    ? "🚗 Delivery"
    : "📦 Shipping";

  const itemCount = getCartItemCount(order);
  const total = getCartTotal(order);

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
          <strong>${item.productName}</strong><br>
          <span style="color: #666; font-size: 13px;">Size: ${item.size}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Cart Order</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #c9a227; padding: 20px; text-align: center;">
      <h1 style="color: #000; font-size: 18px; font-weight: bold; margin: 0; letter-spacing: 1px;">
        🐱 NEW ORDER (${itemCount} ITEMS)
      </h1>
    </div>

    <!-- Quick glance -->
    <div style="padding: 25px; border-bottom: 1px solid #eee;">
      <table style="width: 100%;">
        <tr>
          <td style="font-size: 28px; font-weight: bold; color: #000;">$${total.toFixed(2)}</td>
          <td style="text-align: right; color: #666;">${fulfillmentLabel}</td>
        </tr>
      </table>
    </div>

    <!-- Items list -->
    <div style="padding: 25px;">
      <h2 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        Order Items
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #000;">
            <th style="text-align: left; padding: 8px 0; font-size: 12px; color: #666;">Item</th>
            <th style="text-align: center; padding: 8px 0; font-size: 12px; color: #666;">Qty</th>
            <th style="text-align: right; padding: 8px 0; font-size: 12px; color: #666;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 12px 0; font-weight: bold;">Total</td>
            <td style="padding: 12px 0; font-weight: bold; text-align: right;">$${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Customer info -->
    <div style="padding: 25px; background-color: #fafafa;">
      <h2 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        Customer
      </h2>
      <p style="margin: 0 0 8px 0;">
        <strong>${order.name}</strong>
      </p>
      <p style="margin: 0 0 8px 0;">
        <a href="mailto:${order.email}" style="color: #0066cc;">${order.email}</a>
      </p>
      <p style="margin: 0; color: #666;">
        ${order.phone || "No phone provided"}
      </p>
    </div>

    ${order.fulfillmentMethod === "shipping" && order.shippingAddress ? `
    <!-- Shipping address -->
    <div style="padding: 25px; border-top: 1px solid #eee;">
      <h2 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        Ship To
      </h2>
      <p style="margin: 0; color: #333; line-height: 1.6;">
        ${order.shippingAddress.replace(/\n/g, "<br>")}
      </p>
    </div>
    ` : ""}

    ${order.notes ? `
    <!-- Notes -->
    <div style="padding: 25px; border-top: 1px solid #eee;">
      <h2 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        Notes
      </h2>
      <p style="margin: 0; color: #333; line-height: 1.6; font-style: italic;">
        "${order.notes}"
      </p>
    </div>
    ` : ""}

    <!-- Actions -->
    <div style="padding: 25px; text-align: center; border-top: 1px solid #eee;">
      <a href="mailto:${order.email}?subject=Re: Your Black Cat Order"
         style="display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; font-size: 14px; font-weight: bold;">
        Reply to Customer
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 15px; background-color: #f5f5f5; text-align: center;">
      <p style="margin: 0; color: #999; font-size: 11px;">
        Submitted via <a href="${SITE_URL}" style="color: #999;">${SITE_URL}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getCartCustomerEmailHtml(order: CartOrder): string {
  const total = getCartTotal(order);

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
          ${item.productName}<br>
          <span style="color: #888; font-size: 13px;">Size: ${item.size}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Request Received - Black Cat Button Down</title>
</head>
<body style="font-family: 'Georgia', serif; margin: 0; padding: 0; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with cat silhouette -->
    <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
      <div style="margin-bottom: 16px;">
        <svg width="60" height="60" viewBox="0 0 100 100" style="display: inline-block;">
          <path d="M25 35 L35 15 L45 35 Z" fill="#c9a227"/>
          <path d="M55 35 L65 15 L75 35 Z" fill="#c9a227"/>
          <ellipse cx="50" cy="45" rx="28" ry="24" fill="#c9a227"/>
          <ellipse cx="50" cy="75" rx="22" ry="20" fill="#c9a227"/>
          <path d="M72 75 Q 90 70, 92 50 Q 94 35, 85 30" stroke="#c9a227" stroke-width="8" fill="none" stroke-linecap="round"/>
          <ellipse cx="41" cy="42" rx="4" ry="5" fill="#22c55e"/>
          <ellipse cx="59" cy="42" rx="4" ry="5" fill="#22c55e"/>
        </svg>
      </div>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: normal; margin: 0; letter-spacing: 2px;">
        BLACK CAT BUTTON DOWN
      </h1>
      <p style="color: #c9a227; font-size: 12px; margin: 8px 0 0 0; letter-spacing: 1px;">
        BANGKOK → NEW ORLEANS
      </p>
    </div>

    <!-- Main content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #000; font-size: 22px; font-weight: normal; margin: 0 0 20px 0;">
        We've got your order, ${order.name.split(' ')[0]}.
      </h2>

      <p style="color: #555; line-height: 1.7; margin: 0 0 25px 0;">
        Thanks for your order. We'll review it and get back to you within 24-48 hours to confirm availability and coordinate payment.
      </p>

      <!-- Order summary box -->
      <div style="background-color: #f9f9f9; padding: 25px; margin: 25px 0;">
        <h3 style="color: #000; font-size: 14px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
          Your Order
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #ddd;">
              <th style="text-align: left; padding: 8px 0; font-size: 12px; color: #666; font-weight: normal;">Item</th>
              <th style="text-align: center; padding: 8px 0; font-size: 12px; color: #666; font-weight: normal;">Qty</th>
              <th style="text-align: right; padding: 8px 0; font-size: 12px; color: #666; font-weight: normal;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding: 15px 0 0 0; font-weight: bold;">Subtotal</td>
              <td style="padding: 15px 0 0 0; font-weight: bold; text-align: right;">$${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <p style="margin: 15px 0 0 0; font-size: 13px; color: #666;">
          Fulfillment: <span style="text-transform: capitalize;">${order.fulfillmentMethod}</span>
        </p>
      </div>

      <!-- What's next -->
      <h3 style="color: #000; font-size: 14px; font-weight: bold; margin: 30px 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
        What Happens Next
      </h3>
      <div style="color: #555; line-height: 1.8; font-size: 14px;">
        <p style="margin: 0 0 10px 0;">1. We check availability and confirm your order</p>
        <p style="margin: 0 0 10px 0;">2. We'll reach out to coordinate payment</p>
        <p style="margin: 0 0 10px 0;">3. Your shirts head your way</p>
      </div>

      <p style="color: #555; line-height: 1.7; margin: 30px 0 0 0;">
        Questions? Just reply to this email.
      </p>

      <p style="color: #000; margin: 30px 0 0 0;">
        — The Black Cat Team
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #000; padding: 25px 30px; text-align: center;">
      <p style="color: #888; font-size: 12px; margin: 0 0 5px 0;">
        Made in Bangkok. Sold in New Orleans.
      </p>
      <p style="margin: 0;">
        <a href="${SITE_URL}" style="color: #c9a227; font-size: 12px; text-decoration: none;">${SITE_URL}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

async function sendCartWithResend(order: CartOrder): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    return { success: false, method: "resend", error: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(RESEND_API_KEY);
  const itemCount = getCartItemCount(order);

  try {
    // Send to owner
    await resend.emails.send({
      from: "Black Cat Button Down <onboarding@resend.dev>",
      to: ORDER_TO_EMAIL,
      subject: `New Order: ${itemCount} item${itemCount > 1 ? "s" : ""} - $${getCartTotal(order).toFixed(2)}`,
      html: getCartOwnerEmailHtml(order),
      text: formatCartOrderDetails(order),
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: "Black Cat Button Down <onboarding@resend.dev>",
      to: order.email,
      subject: "Order Request Received - Black Cat Button Down",
      html: getCartCustomerEmailHtml(order),
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

async function sendCartWithNodemailer(order: CartOrder): Promise<EmailResult> {
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

  const itemCount = getCartItemCount(order);

  try {
    // Send to owner
    await transporter.sendMail({
      from: `"Black Cat Button Down" <${SMTP_USER}>`,
      to: ORDER_TO_EMAIL,
      subject: `New Order: ${itemCount} item${itemCount > 1 ? "s" : ""} - $${getCartTotal(order).toFixed(2)}`,
      html: getCartOwnerEmailHtml(order),
      text: formatCartOrderDetails(order),
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"Black Cat Button Down" <${SMTP_USER}>`,
      to: order.email,
      subject: "Order Request Received - Black Cat Button Down",
      html: getCartCustomerEmailHtml(order),
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

function logCartOrderToConsole(order: CartOrder): EmailResult {
  console.log("\n========================================");
  console.log("NEW CART ORDER (Dev Mode - No Email Sent)");
  console.log("========================================");
  console.log(formatCartOrderDetails(order));
  console.log("========================================\n");

  return { success: true, method: "dev-log" };
}

export async function sendCartOrderEmails(order: CartOrder): Promise<EmailResult> {
  // Try Resend first
  if (RESEND_API_KEY) {
    const result = await sendCartWithResend(order);
    if (result.success) return result;
    console.warn("Resend failed:", result.error);
  }

  // Try Nodemailer as fallback
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const result = await sendCartWithNodemailer(order);
    if (result.success) return result;
    console.warn("Nodemailer failed:", result.error);
  }

  // Dev mode - log to console
  console.warn("No email provider configured - logging cart order to console");
  return logCartOrderToConsole(order);
}
