import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWaste extends Document {
  wasteId: string;
  productId: string;
  productVariantId?: string;
  unitBarcode?: string;
  productName: string;
  sku: string;
  quantity: number;
  category: "DAMAGED" | "DEFECTIVE" | "EXPIRED" | "LOST" | "OTHER";
  estimatedLoss: number;
  reason: string;
  disposition: "SCRAPPED" | "RETURNED_TO_VENDOR" | "RECYCLED";
  reportedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const WasteSchema = new Schema<IWaste>(
  {
    wasteId: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    productVariantId: { type: String, index: true },
    unitBarcode: { type: String, index: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, default: 1 },
    category: {
      type: String,
      enum: ["DAMAGED", "DEFECTIVE", "EXPIRED", "LOST", "OTHER"],
      default: "DAMAGED",
      index: true,
    },
    estimatedLoss: { type: Number, default: 0 },
    reason: { type: String, default: "Defective piece write-off" },
    disposition: {
      type: String,
      enum: ["SCRAPPED", "RETURNED_TO_VENDOR", "RECYCLED"],
      default: "SCRAPPED",
    },
    reportedBy: { type: String, default: "Warehouse Staff" },
  },
  { timestamps: true }
);

WasteSchema.index({ createdAt: -1 });

export const Waste: Model<IWaste> =
  mongoose.models.Waste || mongoose.model<IWaste>("Waste", WasteSchema);

export default Waste;

