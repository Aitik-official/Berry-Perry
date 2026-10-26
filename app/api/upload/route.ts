import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAdminAuth, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!(await verifyAdminAuth())) {
    return unauthorizedResponse("Admin authentication required to upload files");
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate clean unique filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const uniqueName = `${baseName}_${Date.now()}${ext.toLowerCase()}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save uploaded file" },
      { status: 500 }
    );
  }
}
