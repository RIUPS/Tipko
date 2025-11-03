import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fingerprint } = await request.json();

    const res = await fetch(`http://localhost:5000/api/auth/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fingerprint }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Registracija neuspešna" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json({ exists: data.exists });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check fingerprint" },
      { status: 500 }
    );
  }
}
