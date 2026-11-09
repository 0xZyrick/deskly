import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { PaymentStatus } from "@/types";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const status = (sp.get("status") as PaymentStatus) || undefined;
  const dateFrom = sp.get("dateFrom") ?? undefined;
  const dateTo = sp.get("dateTo") ?? undefined;

  const data = store.listPayments({ status, dateFrom, dateTo });
  return NextResponse.json({ data, meta: { total: data.length } });
}
