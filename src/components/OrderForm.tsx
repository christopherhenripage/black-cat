"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "./Button";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/products";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface OrderFormProps {
  product?: Product;
  products?: Product[];
  showProductSelect?: boolean;
}

type FulfillmentMethod = "pickup" | "delivery" | "shipping";

interface FormData {
  name: string;
  email: string;
  phone: string;
  productSlug: string;
  productName: string;
  size: string;
  quantity: number;
  fulfillmentMethod: FulfillmentMethod;
  shippingAddress: string;
  notes: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

function SuccessCheckmark() {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      className="w-16 h-16 mx-auto mb-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        className="text-green-500"
      />
      <path
        d="M7 12l3 3 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-500"
        style={{
          strokeDasharray: 24,
          strokeDashoffset: reducedMotion ? 0 : 24,
          animation: reducedMotion ? "none" : "checkmark 0.4s ease-out 0.2s forwards",
        }}
      />
    </svg>
  );
}

export function OrderForm({
  product,
  products,
  showProductSelect = false,
}: OrderFormProps) {
  const allProducts = products || getAllProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    product
  );
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    productSlug: product?.slug || "",
    productName: product?.name || "",
    size: "",
    quantity: 1,
    fulfillmentMethod: "pickup",
    shippingAddress: "",
    notes: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Preserve form data on error
  const [preservedData, setPreservedData] = useState<FormData | null>(null);

  useEffect(() => {
    if (status === "error" && preservedData) {
      setFormData(preservedData);
    }
  }, [status, preservedData]);

  const handleProductChange = (slug: string) => {
    const newProduct = allProducts.find((p) => p.slug === slug);
    setSelectedProduct(newProduct);
    setFormData((prev) => ({
      ...prev,
      productSlug: slug,
      productName: newProduct?.name || "",
      size: "",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (status === "submitting" || submittedOnce) return;

    setStatus("submitting");
    setErrorMessage("");
    setPreservedData(formData);

    // Get honeypot field
    const form = e.target as HTMLFormElement;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)
      ?.value;

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit order request");
      }

      setStatus("success");
      setSubmittedOnce(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        productSlug: product?.slug || "",
        productName: product?.name || "",
        size: "",
        quantity: 1,
        fulfillmentMethod: "pickup",
        shippingAddress: "",
        notes: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  };

  const availableSizes = selectedProduct?.variants.filter((v) => v.available) || [];

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 p-8 text-center animate-fade-in">
        <SuccessCheckmark />
        <h3 className="text-xl font-medium text-green-800 mb-2">
          We&apos;ve got it. Talk soon.
        </h3>
        <p className="text-green-700 text-sm mb-6">
          Your request for {formData.productName || "a shirt"} is on its way to us.
          We&apos;ll be in touch within 24-48 hours to confirm details.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStatus("idle");
            setSubmittedOnce(false);
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot - hidden from users */}
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

      {/* Product Select (for general order form) */}
      {showProductSelect && (
        <div>
          <label
            htmlFor="product"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Product <span className="text-red-500">*</span>
          </label>
          <select
            id="product"
            required
            value={formData.productSlug}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-base"
            disabled={status === "submitting"}
          >
            <option value="">Select a product</option>
            {allProducts.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name} {p.price ? `- $${p.price}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-base"
          placeholder="Your name"
          disabled={status === "submitting"}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-base"
          placeholder="your@email.com"
          disabled={status === "submitting"}
        />
      </div>

      {/* Phone (Optional) */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-base"
          placeholder="(504) 555-0123"
          disabled={status === "submitting"}
        />
      </div>

      {/* Size */}
      {selectedProduct && (
        <div>
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Size <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedProduct.variants.map((variant) => (
              <button
                key={variant.size}
                type="button"
                disabled={!variant.available || status === "submitting"}
                onClick={() => setFormData({ ...formData, size: variant.size })}
                className={`px-4 py-2 border text-sm font-medium transition-colors ${
                  formData.size === variant.size
                    ? "border-black bg-black text-white"
                    : variant.available
                    ? "border-gray-300 hover:border-black"
                    : "border-gray-200 text-gray-400 cursor-not-allowed line-through"
                }`}
                aria-label={`Size ${variant.size}${!variant.available ? " - Sold out" : ""}`}
              >
                {variant.size}
              </button>
            ))}
          </div>
          {availableSizes.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              All sizes currently sold out. Submit a request and we&apos;ll notify
              you when available.
            </p>
          )}
        </div>
      )}

      {/* Quantity */}
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Quantity <span className="text-red-500">*</span>
        </label>
        <select
          id="quantity"
          required
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value) })
          }
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-base"
          disabled={status === "submitting"}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Fulfillment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fulfillment Method <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: "pickup", label: "Local Pickup (New Orleans)" },
            { value: "delivery", label: "Local Delivery (New Orleans area)" },
            { value: "shipping", label: "Shipping" },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="fulfillmentMethod"
                value={option.value}
                checked={formData.fulfillmentMethod === option.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fulfillmentMethod: e.target.value as FulfillmentMethod,
                  })
                }
                className="w-4 h-4 text-black focus:ring-black"
                disabled={status === "submitting"}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Shipping Address (Conditional) */}
      {formData.fulfillmentMethod === "shipping" && (
        <div>
          <label
            htmlFor="shippingAddress"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Shipping Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="shippingAddress"
            required
            rows={3}
            value={formData.shippingAddress}
            onChange={(e) =>
              setFormData({ ...formData, shippingAddress: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-base resize-none"
            placeholder="Street address, city, state, ZIP"
            disabled={status === "submitting"}
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-base resize-none"
          placeholder="Any special requests or questions?"
          disabled={status === "submitting"}
        />
      </div>

      {/* Error Message */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 p-4 animate-fade-in">
          <p className="text-red-700 text-sm font-medium mb-1">
            Oops, something went wrong
          </p>
          <p className="text-red-600 text-sm">{errorMessage}</p>
          <p className="text-red-500 text-xs mt-2">
            Your information is still here—just try submitting again.
          </p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={status === "submitting" || submittedOnce}
      >
        {status === "submitting" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
            Sending...
          </span>
        ) : (
          "Submit Order Request"
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        This is a request, not a purchase. We&apos;ll contact you to confirm
        availability and arrange payment.
      </p>
    </form>
  );
}
