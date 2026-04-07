import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Get pelada by id
  return NextResponse.json({ pelada: { id: params.id } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Update pelada
  return NextResponse.json({ message: "Pelada updated" });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Delete pelada
  return NextResponse.json({ message: "Pelada deleted" });
}
