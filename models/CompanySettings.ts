import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompanySettings extends Document {
  companyName: string;
  tradeName?: string;
  gstin?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  invoicePrefix: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
    branch?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    companyName: { type: String, default: "Berry Perry India Pvt. Ltd." },
    tradeName: { type: String, default: "Berry Perry Cricket & Activewear" },
    gstin: { type: String, default: "07AAAAA1234A1Z5" },
    email: { type: String, default: "support@berryperry.com" },
    phone: { type: String, default: "+91 98000 12345" },
    addressLine1: { type: String, default: "Plot 42, Sportswear Tech Park, Phase II" },
    city: { type: String, default: "New Delhi" },
    state: { type: String, default: "Delhi" },
    pincode: { type: String, default: "110020" },
    invoicePrefix: { type: String, default: "BP-INV" },
    bankDetails: {
      bankName: { type: String, default: "HDFC Bank" },
      accountNumber: { type: String, default: "50200012345678" },
      ifsc: { type: String, default: "HDFC0001234" },
      branch: { type: String, default: "Connaught Place, New Delhi" },
    },
  },
  { timestamps: true }
);

export const CompanySettings: Model<ICompanySettings> =
  mongoose.models.CompanySettings ||
  mongoose.model<ICompanySettings>("CompanySettings", CompanySettingsSchema);

export default CompanySettings;

