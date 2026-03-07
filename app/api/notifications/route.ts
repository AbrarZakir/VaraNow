import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as notificationController from "@/controllers/notification.controller";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;
  const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : 0;
  const { data, error } = await notificationController.getForUser(supabase, user.id, {
    unreadOnly,
    limit,
    offset,
  });
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const notificationId = body.notificationId ?? body.id;
  const markAll = body.markAll === true;
  if (markAll) {
    const { error } = await notificationController.markAllRead(supabase, user.id);
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true });
  }
  if (!notificationId) return NextResponse.json({ error: "notificationId required" }, { status: 400 });
  const { error } = await notificationController.markRead(
    supabase,
    notificationId,
    user.id
  );
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ success: true });
}
