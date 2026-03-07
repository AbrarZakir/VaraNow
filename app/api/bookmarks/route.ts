import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as bookmarkController from "@/controllers/bookmark.controller";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { data, error } = await bookmarkController.getSavedList(supabase, user.id);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const propertyId = body.propertyId ?? body.property_id;
  if (!propertyId) return NextResponse.json({ error: "propertyId required" }, { status: 400 });
  const { error } = await bookmarkController.addBookmark(supabase, user.id, propertyId);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId") ?? searchParams.get("property_id");
  if (!propertyId) return NextResponse.json({ error: "propertyId required" }, { status: 400 });
  const { error } = await bookmarkController.removeBookmark(supabase, user.id, propertyId);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ success: true });
}
