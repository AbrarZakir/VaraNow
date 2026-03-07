import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as propertyController from "@/controllers/property.controller";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data, error } = await propertyController.getPropertyDetail(
    supabase,
    params.id
  );
  if (error || !data) {
    return NextResponse.json(
      { error: error ?? "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ data });
}
