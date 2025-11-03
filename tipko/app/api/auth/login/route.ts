import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fingerprint } = await request.json();

    // TODO: Find user and generate JWT
    // const user = await db.user.findUnique({ where: { fingerprint } });
    // if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // const jwt = generateJWT(user);

    // Placeholder response
    const user = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      fingerprint,
      jwt: "jwt_token_placeholder",
    };

    // Set HTTP-only cookie
    const response = NextResponse.json(user);
    response.cookies.set("jwt", user.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
