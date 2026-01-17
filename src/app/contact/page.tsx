import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Black Cat Button Down. Questions about sizing, orders, or just want to say hi?",
};

export default function ContactPage() {
  return (
    <div className="">
      {/* Header */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-page-title mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Questions, comments, or just want to say hello.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Email */}
            <div className="text-center p-8 bg-gray-50">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Email Us</h2>
              <p className="text-gray-600 mb-4">
                For orders, questions, or just to say hey.
              </p>
              <a
                href="mailto:hello@blackcatbuttondown.com"
                className="text-accent hover:underline font-medium"
              >
                hello@blackcatbuttondown.com
              </a>
            </div>

            {/* Instagram */}
            <div className="text-center p-8 bg-gray-50">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold mb-2">
                Follow Us
              </h2>
              <p className="text-gray-600 mb-4">
                See new arrivals, behind-the-scenes, and more.
              </p>
              <a
                href="https://instagram.com/blackcatbuttondown"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
              >
                @blackcatbuttondown
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="mt-12 text-center">
            <h2 className="font-display text-xl font-bold mb-4">Location</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We&apos;re based in <strong className="text-black">New Orleans, Louisiana</strong>.
              While we don&apos;t have a physical storefront, we offer local pickup
              and delivery throughout the Greater New Orleans area.
            </p>
          </div>

          {/* Response Time */}
          <div className="mt-12 p-6 bg-accent/10 text-center">
            <p className="text-gray-700">
              <strong>Response Time:</strong> We typically respond within 24
              hours. For urgent inquiries, send us a DM on Instagram.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Common Questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Check out our FAQ for answers about sizing, shipping, care, and more.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 font-medium bg-black text-white hover:bg-gray-800 transition-colors"
          >
            View FAQ
          </Link>
        </div>
      </section>
    </div>
  );
}
