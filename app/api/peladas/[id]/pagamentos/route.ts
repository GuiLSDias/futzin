import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Get payments
  return NextResponse.json({ payments: [] });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Process payment
  return NextResponse.json({ message: "Payment processed" });
}
