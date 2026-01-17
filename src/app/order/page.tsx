import { Metadata } from "next";
import { OrderForm } from "@/components/OrderForm";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Request to order a Black Cat Button Down shirt. Learn about our ordering process, shipping, and returns.",
};

const orderSteps = [
  {
    number: "01",
    title: "Browse & Select",
    description:
      "Explore our collection and find the shirt that speaks to you. Check available sizes and details.",
  },
  {
    number: "02",
    title: "Submit Request",
    description:
      "Fill out the order request form with your details, size, and preferred fulfillment method.",
  },
  {
    number: "03",
    title: "Confirmation",
    description:
      "We'll review your request and confirm availability within 24-48 hours via email.",
  },
  {
    number: "04",
    title: "Coordination",
    description:
      "We'll confirm availability and total within 24-48 hours, then coordinate pickup/shipping and payment offline.",
  },
  {
    number: "05",
    title: "Fulfillment",
    description:
      "Pick up locally in New Orleans, receive local delivery, or have it shipped to your door.",
  },
  {
    number: "06",
    title: "Enjoy",
    description:
      "Rock your new Bangkok-crafted shirt with confidence. Questions? We're always here to help.",
  },
];

export default function OrderPage() {
  const products = getAllProducts();

  return (
    <div className="">
      {/* Header */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-page-title mb-4">
            How to Order
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Personal service, not e-commerce. Every shirt finds the right home.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
            The Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orderSteps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-6xl font-display font-bold text-gray-100 absolute -top-4 -left-2">
                  {step.number}
                </span>
                <div className="relative pt-8 pl-4">
                  <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Submit Your Request
            </h2>
            <p className="text-gray-600">
              Select a shirt and fill out the form below. We&apos;ll be in touch
              shortly to confirm your order.
            </p>
          </div>
          <div className="bg-white p-6 md:p-8 shadow-sm">
            <OrderForm products={products} showProductSelect />
          </div>
        </div>
      </section>

      {/* Shipping & Returns */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
            Shipping & Returns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Fulfillment Options</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">•</span>
                  <div>
                    <strong className="text-black">Local Pickup:</strong> Free.
                    Pick up in New Orleans at a mutually convenient location.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">•</span>
                  <div>
                    <strong className="text-black">Local Delivery:</strong> $10
                    within Greater New Orleans area.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">•</span>
                  <div>
                    <strong className="text-black">Shipping:</strong> $15 flat
                    rate within the US. International available upon request.
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Returns & Exchanges</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold">•</span>
                  <span>
                    Exchanges accepted within 14 days for unworn items with tags
                    attached.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold">•</span>
                  <span>
                    We&apos;ll work with you on sizing issues—just reach out.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold">•</span>
                  <span>
                    Final sale on items marked as such. No returns on custom orders.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
