import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Supabase OAuth callback logic
  return NextResponse.json({ message: "Callback handled" });
}
