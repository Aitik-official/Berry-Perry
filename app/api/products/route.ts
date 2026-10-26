import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { firstCryClothingProducts } from "@/lib/firstcry-clothing-data";
import { products as kidsProductsList } from "@/lib/products-fallback-list";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const rawProducts = await Product.find().sort({ createdAt: -1 }).lean();

    // Sort to prioritize baby clothing, toys, footwear, and general kids essentials first (non-diapers first)
    const isDiaperProduct = (p: any) => {
      const cat = (p.category || '').toLowerCase();
      const subCat = (p.subCategory || '').toLowerCase();
      const mainCat = (p.mainCategory || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return (
        cat.includes('diaper') ||
        subCat.includes('diaper') ||
        mainCat.includes('diaper') ||
        name.includes('diaper') ||
        name.includes('pants extra absorb') ||
        name.includes('wonder pants')
      );
    };

    const prioritizedProducts = [...(rawProducts || [])].sort((a: any, b: any) => {
      const aIsDiaper = isDiaperProduct(a);
      const bIsDiaper = isDiaperProduct(b);
      if (aIsDiaper && !bIsDiaper) return 1;
      if (!aIsDiaper && bIsDiaper) return -1;
      return 0;
    });

    return NextResponse.json({ success: true, products: prioritizedProducts });
  } catch (error: any) {
    console.error("GET /api/products database error:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load products from database",
        products: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to create products");
  }

  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: "Name, price, and category are required." },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const id = body.id || `product-${Date.now()}`;

    const newProduct = await Product.create({
      ...body,
      id,
      slug,
      images: body.images?.length ? body.images : [body.image],
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
