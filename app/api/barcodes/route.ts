import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import UnitBarcode from "@/models/UnitBarcode";
import Product from "@/models/Product";
import Waste from "@/models/Waste";
import InventoryTransaction from "@/models/InventoryTransaction";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";
import { findProductDocument } from "@/lib/products-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/barcodes - Paginated list of unit barcodes with filters
export async function GET(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to access barcodes");
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "25", 10)));
    const status = searchParams.get("status");
    const productId = searchParams.get("productId");
    const search = searchParams.get("search");

    const query: any = {};
    if (status && status !== "ALL") {
      query.status = status;
    }
    if (productId) {
      query.productId = productId;
    }
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { barcode: { $regex: q, $options: "i" } },
        { sku: { $regex: q, $options: "i" } },
        { productName: { $regex: q, $options: "i" } },
        { orderNumber: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [barcodes, totalCount, countsByStatus] = await Promise.all([
      UnitBarcode.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      UnitBarcode.countDocuments(query),
      UnitBarcode.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const stats = {
      TOTAL: 0,
      AVAILABLE: 0,
      SOLD: 0,
      RESERVED: 0,
      DAMAGED: 0,
      RETIRED: 0,
    };

    countsByStatus.forEach((item: { _id: string; count: number }) => {
      if (item._id in stats) {
        stats[item._id as keyof typeof stats] = item.count;
      }
      stats.TOTAL += item.count;
    });

    return NextResponse.json({
      success: true,
      barcodes,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: skip + barcodes.length < totalCount,
      stats,
    });
  } catch (error: any) {
    console.error("GET /api/barcodes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch barcodes" },
      { status: 500 }
    );
  }
}

// PATCH /api/barcodes - Update barcode status (Defective Shifting / Restore)
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to update barcode");
  }

  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, barcode, status, reason, performedBy = "Admin" } = body;

    const query = id
      ? (mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { barcode: id })
      : barcode
      ? { barcode }
      : null;
    if (!query) {
      return NextResponse.json({ error: "Barcode id or barcode text is required" }, { status: 400 });
    }

    const unit = await UnitBarcode.findOne(query);
    if (!unit) {
      return NextResponse.json({ error: "Unit barcode not found" }, { status: 404 });
    }

    const previousStatus = unit.status;
    const newStatus = status || unit.status;

    // 1. Shifting to DAMAGED (Defective Piece)
    if (newStatus === "DAMAGED" && previousStatus !== "DAMAGED") {
      unit.status = "DAMAGED";
      unit.reason = reason || "Flagged as defective in warehouse inspection";

      // If it was sellable/available, decrement inventory count and record write-off
      if (previousStatus === "AVAILABLE") {
        const product = await findProductDocument(unit.productId);

        if (product) {
          const currentStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 25;
          const nextStock = Math.max(0, currentStock - 1);
          product.stockQuantity = nextStock;
          product.inStock = nextStock > 0;
          await product.save();

          // Create Double-Entry Ledger Record
          await InventoryTransaction.create({
            transactionId: `TXN-${Date.now().toString().slice(-6)}`,
            productId: product.id,
            productVariantId: unit.productVariantId,
            unitBarcodeId: unit._id.toString(),
            productName: unit.productName,
            sku: unit.sku,
            type: "DAMAGE",
            quantityChange: -1,
            previousStock: currentStock,
            newStock: nextStock,
            reference: unit.barcode,
            reason: reason || "Defective piece write-off",
            performedBy,
          });
        }

        // Record in Damaged & Waste write-off ledger
        await Waste.create({
          wasteId: `WST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
          productId: unit.productId,
          productVariantId: unit.productVariantId,
          unitBarcode: unit.barcode,
          productName: unit.productName,
          sku: unit.sku,
          quantity: 1,
          category: "DEFECTIVE",
          estimatedLoss: 0,
          reason: reason || "Defective piece write-off",
          disposition: "SCRAPPED",
          reportedBy: performedBy,
        });
      }
    }
    // 2. Restoring to AVAILABLE
    else if (newStatus === "AVAILABLE" && previousStatus === "DAMAGED") {
      unit.status = "AVAILABLE";
      unit.reason = "";

      const product = await findProductDocument(unit.productId);

      if (product) {
        const currentStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 25;
        const nextStock = currentStock + 1;
        product.stockQuantity = nextStock;
        product.inStock = true;
        await product.save();

        await InventoryTransaction.create({
          transactionId: `TXN-${Date.now().toString().slice(-6)}`,
          productId: product.id,
          productVariantId: unit.productVariantId,
          unitBarcodeId: unit._id.toString(),
          productName: unit.productName,
          sku: unit.sku,
          type: "ADJUST",
          quantityChange: 1,
          previousStock: currentStock,
          newStock: nextStock,
          reference: unit.barcode,
          reason: "Restored from defective to available stock",
          performedBy,
        });
      }
    } else {
      unit.status = newStatus;
      if (reason !== undefined) unit.reason = reason;
    }

    await unit.save();

    return NextResponse.json({
      success: true,
      unit,
      message: `Barcode ${unit.barcode} updated to ${unit.status}`,
    });
  } catch (error: any) {
    console.error("PATCH /api/barcodes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update barcode" },
      { status: 500 }
    );
  }
}

// DELETE /api/barcodes - Permanent unit deletion with inventory alignment
export async function DELETE(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to delete barcode");
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const barcode = searchParams.get("barcode");

    const query = id
      ? (mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { barcode: id })
      : barcode
      ? { barcode }
      : null;
    if (!query) {
      return NextResponse.json({ error: "Barcode id or barcode text is required" }, { status: 400 });
    }

    const unit = await UnitBarcode.findOne(query);
    if (!unit) {
      return NextResponse.json({ error: "Unit barcode not found" }, { status: 404 });
    }

    // If unit was sellable/AVAILABLE, decrement inventory by 1 to maintain physical alignment
    if (unit.status === "AVAILABLE") {
      const product = await findProductDocument(unit.productId);
      if (product) {
        const currentStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 25;
        const nextStock = Math.max(0, currentStock - 1);
        product.stockQuantity = nextStock;
        product.inStock = nextStock > 0;
        await product.save();

        await InventoryTransaction.create({
          transactionId: `TXN-${Date.now().toString().slice(-6)}`,
          productId: product.id,
          unitBarcodeId: unit._id.toString(),
          productName: unit.productName,
          sku: unit.sku,
          type: "ADJUST",
          quantityChange: -1,
          previousStock: currentStock,
          newStock: nextStock,
          reference: unit.barcode,
          reason: "Deleted unit barcode removed from warehouse",
          performedBy: "Admin",
        });
      }
    }

    await UnitBarcode.deleteOne({ _id: unit._id });

    return NextResponse.json({
      success: true,
      message: `Unit barcode ${unit.barcode} deleted successfully`,
    });
  } catch (error: any) {
    console.error("DELETE /api/barcodes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete barcode" },
      { status: 500 }
    );
  }
}

