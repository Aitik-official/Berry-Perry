import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { firstCryClothingProducts } from "@/lib/firstcry-clothing-data";
import { products as kidsProductsList } from "@/lib/products-fallback-list";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic'
export const revalidate = 0

const fallbackProducts = kidsProductsList.length > 0 ? kidsProductsList : firstCryClothingProducts;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, products: products || [] });
  } catch (error: any) {
    console.warn("GET /api/products database error, using fallback products:", error.message);
    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      isFallback: true,
    });
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
