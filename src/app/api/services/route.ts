import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const data = store.listServices();
  return NextResponse.json({ data, meta: { total: data.length } });
}
