import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("WEBHOOK-GITHUB", body);
    const event = req.headers.get("X-gitHub-Event");

    if (event === "ping") {
      return NextResponse.json({ message: "pong" }, { status: 200 });
    }

    return NextResponse.json({ message: "Event Processed" }, { status: 200 });
  } catch (e) {
    console.log("error==========>", e);
    return NextResponse.json({ message: "Server Error, Sorry!" }, { status: 500 });
  }
}
