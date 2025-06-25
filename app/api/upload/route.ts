import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = await (file as Blob).arrayBuffer();
    const mime = (file as File).type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString(encoding);
    const fileUri = `data:${mime};${encoding},${base64Data}`;

    const uploadRes = await cloudinary.uploader.upload(fileUri, {
      folder: "hire-hub",
    });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
