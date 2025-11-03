import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fingerprint } = await request.json();

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Missing fingerprint" },
        { status: 400 }
      );
    }

    const checkRes = await fetch(`http://localhost:5000/api/auth/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
    });

    const checkData = await checkRes.json();

    if (!checkRes.ok) {
      return NextResponse.json(
        { error: checkData.message || "Check failed" },
        { status: checkRes.status }
      );
    }

    if (checkData.exists) {
      const loginRes = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        return NextResponse.json(
          { error: loginData.message || "Login failed" },
          { status: loginRes.status }
        );
      }

      return NextResponse.json({
        ...loginData,
        alreadyRegistered: true,
        message: "User already exists, logged in successfully",
      });
    }

    const registerRes = await fetch(`http://localhost:5000/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
    });

    const registerData = await registerRes.json();

    if (!registerRes.ok) {
      return NextResponse.json(
        { error: registerData.message || "Registration failed" },
        { status: registerRes.status }
      );
    }

    return NextResponse.json({
      ...registerData,
      alreadyRegistered: false,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Auth proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
