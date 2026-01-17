"use client";

import { useState, FormEvent, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";

type FulfillmentMethod = "pickup" | "delivery" | "shipping";
type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
  fulfillmentMethod: FulfillmentMethod;
  shippingAddress: string;
  notes: string;
}

function SuccessCat() {
  return (
    <div className="relative mx-auto mb-4 w-24 h-24">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-bounce"
        style={{ animationDuration: "0.6s" }}
        aria-hidden="true"
      >
        <ellipse cx="50" cy="65" rx="25" ry="22" fill="#1f2937" />
        <ellipse cx="50" cy="40" rx="28" ry="24" fill="#1f2937" />
        <path d="M25 30 L30 10 L42 28 Z" fill="#1f2937" />
        <path d="M58 28 L70 10 L75 30 Z" fill="#1f2937" />
        <path d="M28 28 L32 15 L40 27 Z" fill="#ff6b9d" />
        <path d="M60 27 L68 15 L72 28 Z" fill="#ff6b9d" />
        <path d="M35 38 Q40 33, 45 38" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M55 38 Q60 33, 65 38" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="32" cy="45" rx="5" ry="3" fill="#ff6b9d" opacity="0.5" />
        <ellipse cx="68" cy="45" rx="5" ry="3" fill="#ff6b9d" opacity="0.5" />
        <path d="M42 52 Q50 60, 58 52" stroke="#ff6b9d" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50 48 L47 52 L53 52 Z" fill="#ff6b9d" />
      </svg>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, getCartCount, clearCart, isHydrated } = useCart();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    fulfillmentMethod: "pickup",
    shippingAddress: "",
    notes: "",
  });

  // Redirect if cart is empty (after hydration)
  useEffect(() => {
    if (isHydrated && items.length === 0 && status !== "success") {
      router.push("/shop");
    }
  }, [isHydrated, items.length, router, status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    const form = e.target as HTMLFormElement;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: items.map((item) => ({
            productSlug: item.productSlug,
            productName: item.productName,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
          honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit order");
      }

      setStatus("success");
      clearCart();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 border border-green-200 p-8 rounded-lg">
          <SuccessCat />
          <h1 className="text-2xl font-display font-semibold text-green-800 mb-2">
            Order Request Received!
          </h1>
          <p className="text-green-700 mb-6">
            We&apos;ll be in touch within 24-48 hours to confirm details and arrange payment.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-semibold">Checkout</h1>
          <p className="text-gray-600 mt-1">
            Review your order and provide your details
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Contact Information */}
              <div className="bg-white border p-6">
                <h2 className="font-display text-lg font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="Your name"
                      disabled={status === "submitting"}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="your@email.com"
                      disabled={status === "submitting"}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="(504) 555-0123"
                      disabled={status === "submitting"}
                    />
                  </div>
                </div>
              </div>

              {/* Fulfillment Method */}
              <div className="bg-white border p-6">
                <h2 className="font-display text-lg font-semibold mb-4">
                  Fulfillment Method
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      value: "pickup",
                      label: "Local Pickup",
                      description: "Pick up in New Orleans (free)",
                    },
                    {
                      value: "delivery",
                      label: "Local Delivery",
                      description: "New Orleans area delivery",
                    },
                    {
                      value: "shipping",
                      label: "Shipping",
                      description: "Ship anywhere in the US",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                        formData.fulfillmentMethod === option.value
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillmentMethod"
                        value={option.value}
                        checked={formData.fulfillmentMethod === option.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fulfillmentMethod: e.target
                              .value as FulfillmentMethod,
                          })
                        }
                        className="mt-1 w-4 h-4 text-black focus:ring-black"
                        disabled={status === "submitting"}
                      />
                      <div>
                        <span className="font-medium">{option.label}</span>
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Shipping Address */}
                {formData.fulfillmentMethod === "shipping" && (
                  <div className="mt-4">
                    <label
                      htmlFor="shippingAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="shippingAddress"
                      required
                      rows={3}
                      value={formData.shippingAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingAddress: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black resize-none"
                      placeholder="Street address, city, state, ZIP"
                      disabled={status === "submitting"}
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white border p-6">
                <h2 className="font-display text-lg font-semibold mb-4">
                  Additional Notes
                </h2>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black resize-none"
                  placeholder="Any special requests or questions?"
                  disabled={status === "submitting"}
                />
              </div>

              {/* Error Message */}
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 p-4">
                  <p className="text-red-700 text-sm font-medium mb-1">
                    Oops, something went wrong
                  </p>
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit - visible on mobile */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={status === "submitting" || items.length === 0}
                >
                  {status === "submitting" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Order Request"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border p-6 sticky top-24">
              <h2 className="font-display text-lg font-semibold mb-4">
                Order Summary ({getCartCount()} items)
              </h2>

              {/* Items */}
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li
                    key={`${item.productSlug}-${item.size}`}
                    className="py-4 flex gap-4"
                  >
                    <div className="w-16 h-20 bg-gray-200 flex-shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.productName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Size: {item.size}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500">Calculated later</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Submit - visible on desktop */}
              <div className="hidden lg:block mt-6">
                <Button
                  type="submit"
                  form="checkout-form"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={status === "submitting" || items.length === 0}
                  onClick={(e) => {
                    // Trigger form submission
                    const form = document.querySelector("form");
                    if (form) {
                      form.requestSubmit();
                    }
                    e.preventDefault();
                  }}
                >
                  {status === "submitting" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Order Request"
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                We&apos;ll reply within 24-48 hours to confirm availability and
                coordinate payment.
              </p>

              {/* Edit Cart Link */}
              <div className="text-center mt-4">
                <Link
                  href="/shop"
                  className="text-sm text-accent hover:underline"
                >
                  Edit Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
