import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const today =
    request.nextUrl.searchParams.get("date") ?? "2026-11-05";
  const data = store.getSummary(today);
  return NextResponse.json({ data });
}
