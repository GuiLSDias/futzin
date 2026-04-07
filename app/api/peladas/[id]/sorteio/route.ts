import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Perform draw
  return NextResponse.json({ result: "Draw performed" });
}
