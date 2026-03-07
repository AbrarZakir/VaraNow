import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Rent estimate — delegate to rent-estimate.controller" });
}
