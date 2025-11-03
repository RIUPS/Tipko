import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fingerprint } = await request.json();

    // TODO: Create user in your database
    // const user = await db.user.create({ data: { fingerprint } });
    // const jwt = generateJWT(user);

    // Placeholder response
    const user = {
      id: "user_" + fingerprint.slice(0, 8),
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
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
