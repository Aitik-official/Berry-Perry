import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPOItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQty?: number;
}

export interface IPurchaseOrder extends Document {
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierGstin?: string;
  items: IPOItem[];
  totalAmount: number;
  status: "DRAFT" | "ORDERED" | "RECEIVED" | "CANCELLED";
  expectedDate?: string;
  receivedDate?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const POItemSchema = new Schema<IPOItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    receivedQty: { type: Number, default: 0 },
  },
  { _id: false }
);

const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    poNumber: { type: String, required: true, unique: true, index: true },
    supplierId: { type: String, required: true, index: true },
    supplierName: { type: String, required: true },
    supplierGstin: { type: String, default: "" },
    items: { type: [POItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "ORDERED", "RECEIVED", "CANCELLED"],
      default: "ORDERED",
      index: true,
    },
    expectedDate: { type: String },
    receivedDate: { type: String },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

PurchaseOrderSchema.index({ createdAt: -1 });

export const PurchaseOrder: Model<IPurchaseOrder> =
  mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);

export default PurchaseOrder;

