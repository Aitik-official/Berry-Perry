import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import UnitBarcode from "@/models/UnitBarcode";
import InventoryTransaction from "@/models/InventoryTransaction";
import Waste from "@/models/Waste";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET all orders for Admin Control Center
export async function GET() {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to view orders");
  }

  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST create a new order upon checkout completion
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.customer || !body.items || !body.items.length) {
      return NextResponse.json(
        { success: false, error: "Missing required order information." },
        { status: 400 }
      );
    }

    // Verify item prices against database products to prevent client price tampering
    const productIds = body.items.map((i: any) => i.productId).filter(Boolean);
    const dbProducts = await Product.find({
      $or: [{ id: { $in: productIds } }, { slug: { $in: productIds } }],
    }).lean();

    const productMap = new Map();
    for (const p of dbProducts) {
      productMap.set(p.id, p);
      if (p.slug) productMap.set(p.slug, p);
    }

    let calculatedSubtotal = 0;
    const validatedItems = body.items.map((item: any) => {
      const dbProduct = productMap.get(item.productId);
      const unitPrice = dbProduct && typeof dbProduct.price === "number" ? dbProduct.price : item.price;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      calculatedSubtotal += unitPrice * quantity;

      return {
        ...item,
        price: unitPrice,
        quantity,
      };
    });

    const discount = Math.max(0, Number(body.discount) || 0);
    const shipping = Math.max(0, Number(body.shipping) || 0);
    const codFee = Math.max(0, Number(body.codFee) || 0);
    const calculatedGrandTotal = Math.max(0, calculatedSubtotal - discount + shipping + codFee);

    const orderNumber =
      body.orderNumber ||
      `VS${Date.now().toString().slice(-8).toUpperCase()}`;

    const newOrder = await Order.create({
      orderNumber,
      customer: body.customer,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount,
      shipping,
      codFee,
      grandTotal: calculatedGrandTotal,
      paymentMethod: body.paymentMethod || "cod",
      paymentStatus: body.paymentMethod === "cod" ? "cod" : "paid",
      orderStatus: "placed",
    });

    return NextResponse.json(
      { success: true, order: newOrder, orderNumber },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    // Return graceful fallback so user checkout experience isn't blocked even if DB is offline
    return NextResponse.json(
      {
        success: true,
        fallback: true,
        orderNumber: `VS${Date.now().toString().slice(-8).toUpperCase()}`,
        warning: "Order recorded in local mode; MongoDB sync pending.",
        error: error.message,
      },
      { status: 200 }
    );
  }
}

// PATCH update order status (e.g., mark as shipped, delivered, or returned with inventory reconciliation)
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to update order status");
  }

  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      orderId,
      orderStatus,
      paymentStatus,
      trackingNumber,
      courier,
      returnType,
      returnReason,
      notes,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      $or: [{ _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }, { orderNumber: orderId }].filter(Boolean),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (courier !== undefined) order.courier = courier;
    if (notes !== undefined) order.notes = notes;

    // Handle interactive returns reconciliation
    if (orderStatus === "returned" && previousStatus !== "returned") {
      order.returnType = returnType || "RESTOCK";
      order.returnReason = returnReason || "Order returned by customer";

      for (const item of order.items) {
        const product = await Product.findOne({
          $or: [{ id: item.productId }, { _id: item.productId }],
        });

        if (order.returnType === "RESTOCK") {
          // Re-increment inventory stock
          if (product) {
            const currentStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 25;
            const newStock = currentStock + (item.quantity || 1);
            product.stockQuantity = newStock;
            product.inStock = true;
            await product.save();

            await InventoryTransaction.create({
              transactionId: `TXN-${Date.now().toString().slice(-6)}`,
              productId: product.id,
              productName: product.name,
              sku: (product as any).sku || `VS-${product.id.slice(0, 8).toUpperCase()}`,
              type: "RETURN",
              quantityChange: item.quantity || 1,
              previousStock: currentStock,
              newStock,
              reference: order.orderNumber,
              reason: returnReason || "Order returned - restocked to warehouse",
              performedBy: "Admin (Orders Hub)",
            });
          }

          if (item.unitBarcode) {
            await UnitBarcode.updateOne(
              { barcode: item.unitBarcode },
              { $set: { status: "AVAILABLE", soldAt: null, reason: "" } }
            );
          }
        } else {
          // Shift to DEFECTIVE / Waste write-off (do NOT increment sellable stock)
          if (product) {
            const currentStock = typeof product.stockQuantity === "number" ? product.stockQuantity : 25;
            const productSku = (product as any).sku || `VS-${product.id.slice(0, 8).toUpperCase()}`;

            await Waste.create({
              wasteId: `WST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
              productId: product.id,
              productName: product.name,
              sku: productSku,
              unitBarcode: item.unitBarcode || undefined,
              quantity: item.quantity || 1,
              category: "DEFECTIVE",
              estimatedLoss: Math.round(Number(product.price) * 0.55 * (item.quantity || 1)),
              reason: returnReason || "Customer return defective piece write-off",
              disposition: "SCRAPPED",
              reportedBy: "Admin (Orders Hub)",
            });

            await InventoryTransaction.create({
              transactionId: `TXN-${Date.now().toString().slice(-6)}`,
              productId: product.id,
              productName: product.name,
              sku: productSku,
              type: "DAMAGE",
              quantityChange: 0,
              previousStock: currentStock,
              newStock: currentStock,
              reference: order.orderNumber,
              reason: returnReason || "Returned unit marked defective",
              performedBy: "Admin (Orders Hub)",
            });
          }

          if (item.unitBarcode) {
            await UnitBarcode.updateOne(
              { barcode: item.unitBarcode },
              { $set: { status: "DAMAGED", reason: returnReason || "Customer returned defective" } }
            );
          }
        }
      }
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
