import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Confirm participation
  return NextResponse.json({ message: "Confirmed" });
}
