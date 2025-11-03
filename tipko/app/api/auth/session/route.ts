import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const jwt = (await cookieStore).get("jwt");

    if (!jwt) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // TODO: Verify JWT and get user data
    // const decoded = verifyJWT(jwt.value);
    // const user = await db.user.findUnique({ where: { id: decoded.userId } });

    // Placeholder response
    const user = {
      id: "user_placeholder",
      fingerprint: "fp_placeholder",
      jwt: jwt.value,
    };

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
