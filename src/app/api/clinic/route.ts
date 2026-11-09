import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const clinic = store.getClinic();
  return NextResponse.json({ data: clinic });
}
