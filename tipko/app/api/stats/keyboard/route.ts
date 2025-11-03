import { NextResponse } from "next/server";

interface Payload {
  userId: string;
  wpm: number;
  accuracy: number;
  time: number;
  points: number;
  errors: number;
  quoteLength: string;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const { payload }: { payload: Payload } = await request.json();

    // TODO: Find user and generate JWT
    // const user = await db.user.findUnique({ where: { fingerprint } });
    // if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // const jwt = generateJWT(user);

    // Placeholder response

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: "Stats recorded successfully",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
