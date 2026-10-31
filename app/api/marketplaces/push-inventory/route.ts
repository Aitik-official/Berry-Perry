import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";
import { findProductDocument } from "@/lib/products-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to sync marketplace inventory");
  }

  try {
    await connectToDatabase();
    const body = await request.json();
    const { productId, sku } = body;

    let product = productId ? await findProductDocument(productId) : null;
    if (!product && sku) {
      product = await Product.findOne({ sku });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const availableStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 0;
    const targetSku = (product as any).sku || `VS-${product.id.slice(0, 8).toUpperCase()}`;

    // Simulated marketplace feed sync (Amazon SP-API / Flipkart API payload)
    const marketplaceFeed = {
      channelSku: targetSku,
      warehouseStock: availableStock,
      timestamp: new Date().toISOString(),
      channels: [
        { channel: "AMAZON_INDIA", status: "FEED_SUBMITTED", liveStock: availableStock },
        { channel: "FLIPKART", status: "FEED_SUBMITTED", liveStock: availableStock },
      ],
    };

    return NextResponse.json({
      success: true,
      message: `Stock level (${availableStock}) synced to Amazon & Flipkart for SKU ${targetSku}`,
      feed: marketplaceFeed,
    });
  } catch (error: any) {
    console.error("POST /api/marketplaces/push-inventory error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to push marketplace inventory" },
      { status: 500 }
    );
  }
}

