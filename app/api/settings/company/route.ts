import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CompanySettings from "@/models/CompanySettings";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await CompanySettings.findOne().lean();
    if (!settings) {
      settings = await CompanySettings.create({
        companyName: "Berry Perry India Pvt. Ltd.",
        tradeName: "Berry Perry Cricket & Activewear",
        gstin: "07AAAAA1234A1Z5",
        email: "support@berryperry.com",
        phone: "+91 98000 12345",
        addressLine1: "Plot 42, Sportswear Tech Park, Phase II",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110020",
        invoicePrefix: "BP-INV",
      });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("GET /api/settings/company error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load company settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to update company settings");
  }

  try {
    await connectToDatabase();
    const body = await request.json();

    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings(body);
    } else {
      Object.assign(settings, body);
    }

    await settings.save();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("POST /api/settings/company error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update company settings" },
      { status: 500 }
    );
  }
}

