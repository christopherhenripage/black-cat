import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Black Cat Button Down shirts, sizing, shipping, and care.",
};

const faqs = [
  {
    id: "ordering",
    category: "Ordering",
    questions: [
      {
        q: "How do I place an order?",
        a: "We use a request-based ordering system. Browse our collection, find what you like, and submit an order request through our website. We'll confirm availability within 24-48 hours, then coordinate pickup/shipping and payment offline.",
      },
      {
        q: "Why don't you have a traditional shopping cart?",
        a: "We're a small operation that values personal service. Our request system lets us confirm availability, answer questions, and ensure you're getting exactly what you want before you pay.",
      },
      {
        q: "How does payment work?",
        a: "Payment is coordinated after confirmation (offline). We'll discuss options when we confirm your order—typically cash, Venmo, or Zelle for local orders.",
      },
      {
        q: "Can I cancel my order?",
        a: "Yes, you can cancel anytime before we finalize the order. Once an order is confirmed and payment is arranged, cancellations may be subject to a restocking fee.",
      },
    ],
  },
  {
    id: "shipping",
    category: "Shipping & Pickup",
    questions: [
      {
        q: "What are my fulfillment options?",
        a: "We offer three options: free local pickup in New Orleans, local delivery ($10) within the Greater New Orleans area, or shipping ($15 flat rate within the US).",
      },
      {
        q: "How long does shipping take?",
        a: "Most orders ship within 2-3 business days. Standard shipping typically arrives within 5-7 business days. Local pickup and delivery can often be arranged within 1-2 days.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes! International shipping is available upon request. Contact us with your location and we'll provide a quote.",
      },
      {
        q: "Where is local pickup located?",
        a: "We arrange pickup at convenient locations in New Orleans, typically in the French Quarter, Marigny, or Bywater areas. We'll coordinate a specific time and place when confirming your order.",
      },
    ],
  },
  {
    id: "sizing",
    category: "Sizing & Fit",
    questions: [
      {
        q: "How do your shirts fit?",
        a: "Our shirts feature a modern, slightly relaxed fit. Not too slim, not too boxy. They're designed to look great tucked or untucked.",
      },
      {
        q: "What if I'm between sizes?",
        a: "If you prefer a more fitted look, size down. For a more relaxed fit, size up. When in doubt, reach out with your measurements and we'll help you decide.",
      },
      {
        q: "Do you have a size chart?",
        a: "Chest (S: 38-40\", M: 40-42\", L: 42-44\", XL: 44-46\", XXL: 46-48\"). Length (S: 28\", M: 29\", L: 30\", XL: 31\", XXL: 32\"). Sleeve (S: 33\", M: 34\", L: 35\", XL: 36\", XXL: 37\").",
      },
      {
        q: "What if my shirt doesn't fit?",
        a: "We want you to love your shirt. If the fit isn't right, contact us within 14 days and we'll arrange an exchange for a different size (subject to availability).",
      },
    ],
  },
  {
    id: "care",
    category: "Care & Maintenance",
    questions: [
      {
        q: "How should I wash my shirt?",
        a: "Most of our shirts can be machine washed cold on a gentle cycle. Check the care instructions on your specific shirt, as some fabrics (like linen) may have different requirements.",
      },
      {
        q: "Can I put my shirt in the dryer?",
        a: "We recommend hang drying or tumble drying on low heat. High heat can cause shrinkage and damage to certain fabrics.",
      },
      {
        q: "Do I need to iron my shirt?",
        a: "It depends on the look you're going for and the fabric. Cotton shirts look best pressed, while linen shirts can embrace a more relaxed, natural wrinkle. Iron on appropriate heat for the fabric.",
      },
      {
        q: "How do I remove stains?",
        a: "Treat stains as quickly as possible with cold water. For stubborn stains, use a gentle stain remover before washing. Avoid bleach on colored fabrics.",
      },
    ],
  },
  {
    id: "returns",
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept exchanges within 14 days for unworn items with tags attached. Due to the personal nature of our business, we handle returns on a case-by-case basis.",
      },
      {
        q: "How do I initiate a return or exchange?",
        a: "Email us at hello@blackcatbuttondown.com with your order details and reason for return. We'll provide instructions and work with you to make it right.",
      },
      {
        q: "Are there any items that can't be returned?",
        a: "Items marked as final sale cannot be returned. Custom or made-to-order items are also non-returnable.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-page-title mb-4">
            Questions & Answers
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Everything you need to know about ordering, sizing, and care.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-b border-gray-200 sticky top-16 md:top-20 bg-white z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex flex-wrap gap-4 justify-center">
            {faqs.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                {section.category}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((section) => (
            <div key={section.id} id={section.id} className="mb-16 last:mb-0 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold mb-8 pb-4 border-b border-gray-200">
                {section.category}
              </h2>
              <div className="space-y-8">
                {section.questions.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-lg mb-2">{item.q}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-8">
            We&apos;re here to help. Reach out and we&apos;ll get back to you as soon as
            possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 font-medium bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:hello@blackcatbuttondown.com"
              className="inline-flex items-center justify-center px-6 py-3 font-medium border border-black hover:bg-black hover:text-white transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
