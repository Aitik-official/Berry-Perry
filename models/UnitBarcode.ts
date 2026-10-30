import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUnitBarcode extends Document {
  barcode: string;
  serialNumber: number;
  productId: string;
  productVariantId?: string;
  productName: string;
  sku: string;
  batchNumber?: string;
  status: "AVAILABLE" | "SOLD" | "RESERVED" | "DAMAGED" | "RETIRED";
  reason?: string;
  printedAt?: Date;
  soldAt?: Date;
  orderNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UnitBarcodeSchema = new Schema<IUnitBarcode>(
  {
    barcode: { type: String, required: true, unique: true, index: true },
    serialNumber: { type: Number, required: true },
    productId: { type: String, required: true, index: true },
    productVariantId: { type: String, index: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true, index: true },
    batchNumber: { type: String, default: "BATCH-01" },
    status: {
      type: String,
      enum: ["AVAILABLE", "SOLD", "RESERVED", "DAMAGED", "RETIRED"],
      default: "AVAILABLE",
      index: true,
    },
    reason: { type: String, default: "" },
    printedAt: { type: Date },
    soldAt: { type: Date },
    orderNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

UnitBarcodeSchema.index({ productId: 1, status: 1 });
UnitBarcodeSchema.index({ createdAt: -1 });

const UnitBarcode: Model<IUnitBarcode> =
  mongoose.models.UnitBarcode || mongoose.model<IUnitBarcode>("UnitBarcode", UnitBarcodeSchema);

export default UnitBarcode;

