import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupplier extends Document {
  supplierId: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  paymentTerms: string;
  status: "ACTIVE" | "INACTIVE";
  productsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>(
  {
    supplierId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    contactPerson: { type: String, default: "Primary Contact" },
    email: { type: String, default: "contact@supplier.com" },
    phone: { type: String, default: "+91 98000 00000" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    gstin: { type: String, default: "" },
    paymentTerms: { type: String, default: "Net 30" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    productsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Supplier: Model<ISupplier> =
  mongoose.models.Supplier || mongoose.model<ISupplier>("Supplier", SupplierSchema);

export default Supplier;

