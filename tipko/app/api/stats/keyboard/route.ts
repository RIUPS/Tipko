import { useAuth } from "@/context/AuthContext";
import { NextResponse } from "next/server";

interface Payload {
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
    const { user } = useAuth();

    console.log("keyboard route:", payload, user);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`http://localhost:5000/api/stats/keyboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload, userId: user.id }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Login failed" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
