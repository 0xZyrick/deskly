import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { UpdateAppointmentInput } from "@/types";

type Ctx = { params: Promise<{ id: string }> };

function fail(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function statusFor(message: string) {
  if (message.includes("no longer available")) return 409;
  if (message.includes("not found")) return 404;
  return 400;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const data = store.getAppointment(id);
  if (!data) return fail("NOT_FOUND", "Appointment not found", 404);
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  let body: UpdateAppointmentInput;
  try {
    body = await req.json();
  } catch {
    return fail("INVALID_JSON", "Invalid request body", 400);
  }
  const result = store.updateAppointment(id, body);
  if ("error" in result) {
    const status = statusFor(result.error);
    return fail(status === 409 ? "SLOT_UNAVAILABLE" : status === 404 ? "NOT_FOUND" : "VALIDATION_ERROR", result.error, status);
  }
  return NextResponse.json({ data: result });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const result = store.cancelAppointment(id);
  if ("error" in result) {
    const status = statusFor(result.error);
    return fail(status === 404 ? "NOT_FOUND" : "VALIDATION_ERROR", result.error, status);
  }
  return NextResponse.json({ data: result });
}
