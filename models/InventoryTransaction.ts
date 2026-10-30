import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryTransaction extends Document {
  transactionId: string;
  productId: string;
  productVariantId?: string;
  unitBarcodeId?: string;
  productName: string;
  sku: string;
  type: "RECEIVE" | "SALE" | "RETURN" | "ADJUST" | "DAMAGE" | "TRANSFER";
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reference?: string;
  reason: string;
  performedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    productVariantId: { type: String, index: true },
    unitBarcodeId: { type: String, index: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["RECEIVE", "SALE", "RETURN", "ADJUST", "DAMAGE", "TRANSFER"],
      required: true,
      index: true,
    },
    quantityChange: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reference: { type: String, default: "" },
    reason: { type: String, default: "Stock adjustment" },
    performedBy: { type: String, default: "Admin Console" },
  },
  { timestamps: true }
);

InventoryTransactionSchema.index({ createdAt: -1 });

export const InventoryTransaction: Model<IInventoryTransaction> =
  mongoose.models.InventoryTransaction ||
  mongoose.model<IInventoryTransaction>("InventoryTransaction", InventoryTransactionSchema);

export default InventoryTransaction;

