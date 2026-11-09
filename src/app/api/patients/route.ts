import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  const data = q ? store.searchPatients(q) : store.listPatients();
  return NextResponse.json({ data, meta: { total: data.length } });
}

export async function POST(request: NextRequest) {
  let body: { firstName?: string; lastName?: string; phone?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Invalid request body" } },
      { status: 400 }
    );
  }
  for (const key of ["firstName", "lastName", "phone"] as const) {
    if (!body[key]?.toString().trim()) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: `${key} is required` } },
        { status: 400 }
      );
    }
  }
  const existing = store.findPatientByPhone(body.phone!);
  if (existing) return NextResponse.json({ data: existing }, { status: 200 });
  const data = store.createPatient({
    firstName: body.firstName!,
    lastName: body.lastName!,
    phone: body.phone!,
    email: body.email,
  });
  return NextResponse.json({ data }, { status: 201 });
}
