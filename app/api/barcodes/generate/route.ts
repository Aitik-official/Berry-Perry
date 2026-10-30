import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UnitBarcode from "@/models/UnitBarcode";
import Product from "@/models/Product";
import InventoryTransaction from "@/models/InventoryTransaction";
import { generateUnitBarcodeString } from "@/lib/barcode";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to generate barcodes");
  }

  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      productId,
      productVariantId,
      count = 10,
      prefix = "BP",
      batchNumber = `BATCH-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}`,
    } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const genCount = Math.max(1, Math.min(500, parseInt(count, 10) || 1));

    const product = await Product.findOne({
      $or: [{ id: productId }, { _id: productId }],
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const baseSku = (product as any).sku || `VS-${product.id.slice(0, 6).toUpperCase()}`;

    // Find highest serial number for this product to guarantee contiguous monotonic increment
    const highestUnit = await UnitBarcode.findOne({ productId: product.id })
      .sort({ serialNumber: -1 })
      .lean();

    let nextSerial = (highestUnit?.serialNumber || 0) + 1;

    const newUnits = [];
    const now = new Date();

    for (let i = 0; i < genCount; i++) {
      const serial = nextSerial++;
      const barcodeStr = generateUnitBarcodeString(baseSku, serial, prefix);

      newUnits.push({
        barcode: barcodeStr,
        serialNumber: serial,
        productId: product.id,
        productVariantId: productVariantId || undefined,
        productName: product.name,
        sku: baseSku,
        batchNumber,
        status: "AVAILABLE",
        printedAt: now,
      });
    }

    const inserted = await UnitBarcode.insertMany(newUnits);

    // Update product available inventory count
    const currentStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 25;
    const newStock = currentStock + genCount;
    product.stockQuantity = newStock;
    product.inStock = true;
    await product.save();

    // Log double-entry inventory ledger transaction
    await InventoryTransaction.create({
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      productId: product.id,
      productVariantId: productVariantId || undefined,
      productName: product.name,
      sku: baseSku,
      type: "RECEIVE",
      quantityChange: genCount,
      previousStock: currentStock,
      newStock,
      reference: batchNumber,
      reason: `Generated ${genCount} serialized barcodes (${batchNumber})`,
      performedBy: "Admin",
    });

    return NextResponse.json({
      success: true,
      message: `Generated ${genCount} unit barcodes successfully.`,
      count: genCount,
      barcodes: inserted,
      newStock,
    });
  } catch (error: any) {
    console.error("POST /api/barcodes/generate error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate barcodes" },
      { status: 500 }
    );
  }
}

