import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  let body: { name?: string; subject?: string; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: "INVALID_JSON", message: "Invalid request body" } }, { status: 400 });
  }
  const patch: { name?: string; subject?: string; body?: string } = {};
  if (typeof body.name === "string") patch.name = body.name;
  if (typeof body.subject === "string") patch.subject = body.subject;
  if (typeof body.body === "string") patch.body = body.body;
  const result = store.updateReminderTemplate(id, patch);
  if ("error" in result) {
    if (result.blockedWords?.length) {
      return NextResponse.json(
        { error: { code: "BLOCKED_CONTENT", message: result.error, details: { blockedWords: result.blockedWords } } },
        { status: 422 }
      );
    }
    return NextResponse.json({ error: { code: "NOT_FOUND", message: result.error } }, { status: 404 });
  }
  return NextResponse.json({ data: result });
}
