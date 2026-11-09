import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { AppointmentStatus, CreateAppointmentInput } from "@/types";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const date = sp.get("date") ?? undefined;
  const status = (sp.get("status") as AppointmentStatus) ?? undefined;
  const clinicianId = sp.get("clinicianId") ?? undefined;
  const patientId = sp.get("patientId") ?? undefined;

  const data = store.listAppointments({ date, status, clinicianId, patientId });
  return NextResponse.json({ data, meta: { total: data.length } });
}

export async function POST(request: NextRequest) {
  let body: CreateAppointmentInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Invalid request body" } },
      { status: 400 }
    );
  }

  const required = ["patientId", "serviceId", "clinicianId", "startsAt"] as const;
  for (const key of required) {
    if (!body[key]) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: `${key} is required`,
          },
        },
        { status: 400 }
      );
    }
  }

  const result = store.createAppointment(body);

  if ("error" in result) {
    return NextResponse.json(
      { error: { code: "SLOT_UNAVAILABLE", message: result.error } },
      { status: 409 }
    );
  }

  if (body.depositPaidMinor && body.depositPaidMinor > 0) {
    store.createPayment({
      appointmentId: result.id,
      patientId: result.patientId,
      amountMinor: body.depositPaidMinor,
      kind: "deposit",
      method: "card",
    });
  }

  return NextResponse.json({ data: result }, { status: 201 });
}
