import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // Get peladas
  return NextResponse.json({ peladas: [] });
}

export async function POST(request: NextRequest) {
  // Create pelada
  return NextResponse.json({ message: "Pelada created" });
}
