import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Get group by id
  return NextResponse.json({ group: { id: params.id } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Update group
  return NextResponse.json({ message: "Group updated" });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Delete group
  return NextResponse.json({ message: "Group deleted" });
}
