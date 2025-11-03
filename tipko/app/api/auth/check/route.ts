import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fingerprint } = await request.json();

    // TODO: Check if fingerprint exists in your database
    // const user = await db.user.findUnique({ where: { fingerprint } });

    // Placeholder response
    const exists = false; // Replace with actual DB check

    return NextResponse.json({ exists });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check fingerprint" },
      { status: 500 }
    );
  }
}
