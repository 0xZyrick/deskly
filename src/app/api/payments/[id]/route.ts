import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

function fail(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const data = store.getPayment(id);
  if (!data) return fail("NOT_FOUND", "Payment not found", 404);
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return fail("INVALID_JSON", "Invalid request body", 400);
  }
  if (body.action !== "refund") return fail("VALIDATION_ERROR", "Unsupported action", 400);
  const result = store.refundPayment(id);
  if ("error" in result) {
    return fail(result.error.includes("not found") ? "NOT_FOUND" : "VALIDATION_ERROR", result.error, result.error.includes("not found") ? 404 : 400);
  }
  return NextResponse.json({ data: result });
}
