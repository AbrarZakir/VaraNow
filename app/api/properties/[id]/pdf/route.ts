import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as pdfController from "@/controllers/pdf.controller";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data, error } = await pdfController.generatePropertyPdf(
    supabase,
    params.id
  );
  if (error || !data) {
    return NextResponse.json(
      { error: error ?? "Not found" },
      { status: 404 }
    );
  }
  return new NextResponse(Buffer.from(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="property-${params.id}.pdf"`,
    },
  });
}
