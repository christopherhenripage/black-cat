import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

interface ProductJson {
  id: string;
  name: string;
  slug: string;
  price?: number;
  type: string;
  description: string;
  variants: Array<{
    size: string;
    available: boolean;
  }>;
}

async function main() {
  console.log("Starting seed...");

  // Read products.json
  const productsPath = join(process.cwd(), "src/data/products.json");
  let products: ProductJson[] = [];

  try {
    const productsData = readFileSync(productsPath, "utf-8");
    products = JSON.parse(productsData);
    console.log(`Found ${products.length} products in products.json`);
  } catch {
    console.log("Could not read products.json, creating sample data...");
    products = [
      {
        id: "sample-1",
        name: "Sample Shirt",
        slug: "sample-shirt",
        price: 20,
        type: "button-down",
        description: "A sample shirt for testing",
        variants: [
          { size: "S", available: true },
          { size: "M", available: true },
          { size: "L", available: true },
          { size: "XL", available: true },
        ],
      },
    ];
  }

  // Create products and variants
  for (const product of products) {
    console.log(`Creating product: ${product.name}`);

    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        type: product.type,
        description: product.description,
      },
      create: {
        name: product.name,
        slug: product.slug,
        type: product.type,
        description: product.description,
      },
    });

    // Create variants
    for (const variant of product.variants) {
      const existingVariant = await prisma.variant.findFirst({
        where: {
          productId: createdProduct.id,
          size: variant.size,
        },
      });

      if (!existingVariant) {
        await prisma.variant.create({
          data: {
            productId: createdProduct.id,
            size: variant.size,
            price: product.price ? product.price * 100 : null,
            quantityOnHand: variant.available ? 2 : 0, // Default stock of 2 if available
            lastRestockedAt: variant.available ? new Date() : null,
          },
        });
        console.log(`  - Created variant: ${variant.size}`);
      } else {
        console.log(`  - Variant ${variant.size} already exists, skipping`);
      }
    }
  }

  console.log("\nSeed completed successfully!");
  console.log(`\nAdmin login: /admin/login`);
  console.log(`Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
