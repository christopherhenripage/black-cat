import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl md:text-8xl font-bold mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-medium mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/" variant="primary">
            Go Home
          </Button>
          <Button href="/shop" variant="outline">
            Browse Shop
          </Button>
        </div>
      </div>
    </div>
  );
}
