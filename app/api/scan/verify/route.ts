import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UnitBarcode from "@/models/UnitBarcode";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required for barcode verification");
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get("barcode")?.trim();

    if (!barcode) {
      return NextResponse.json({ error: "Barcode query parameter is required" }, { status: 400 });
    }

    // 1. Check if it's a serialized UnitBarcode
    const unit = await UnitBarcode.findOne({ barcode }).lean();
    if (unit) {
      return NextResponse.json({
        success: true,
        type: "UNIT_BARCODE",
        data: unit,
        message: `Found Unit #${unit.serialNumber} (${unit.status})`,
      });
    }

    // 2. Check if it's an Order Number
    const order = await Order.findOne({ orderNumber: barcode }).lean();
    if (order) {
      return NextResponse.json({
        success: true,
        type: "ORDER",
        data: order,
        message: `Found Order ${order.orderNumber} (${order.orderStatus})`,
      });
    }

    // 3. Check if it's a Product SKU or ID
    const product = await Product.findOne({
      $or: [
        { id: barcode },
        { sku: barcode },
        { supplierBarcode: barcode },
        { warehouseBarcode: barcode },
      ],
    }).lean();

    if (product) {
      return NextResponse.json({
        success: true,
        type: "PRODUCT",
        data: product,
        message: `Found Product ${product.name}`,
      });
    }

    return NextResponse.json({
      success: false,
      error: `No registered unit barcode, order, or product found for "${barcode}"`,
    }, { status: 404 });
  } catch (error: any) {
    console.error("GET /api/scan/verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify barcode" },
      { status: 500 }
    );
  }
}

