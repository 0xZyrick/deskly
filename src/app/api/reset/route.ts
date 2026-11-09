import { NextResponse } from "next/server";
import { store } from "@/lib/store";

/** POST /api/reset — restore seed data (demo helper) */
export async function POST() {
  store.reset();
  return NextResponse.json({ data: { ok: true } });
}
