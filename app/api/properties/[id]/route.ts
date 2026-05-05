import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as propertyController from "@/controllers/property.controller";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data, error } = await propertyController.getPropertyDetail(
    supabase,
    id
  );
  if (error || !data) {
    return NextResponse.json(
      { error: error ?? "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ data });
}
