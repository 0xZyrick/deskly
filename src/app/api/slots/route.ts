import { NextRequest, NextResponse } from "next/server";
import { getOpenSlots } from "@/lib/scheduling";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const date = sp.get("date");
  const serviceId = sp.get("serviceId");
  const clinicianId = sp.get("clinicianId") ?? undefined;

  if (!date || !serviceId) {
    return NextResponse.json(
      {
        error: {
          code: "MISSING_PARAMS",
          message: "date and serviceId are required",
        },
      },
      { status: 400 }
    );
  }

  const data = getOpenSlots({ date, serviceId, clinicianId });
  return NextResponse.json({ data, meta: { total: data.length } });
}
