import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import type { ReminderChannel, ReminderLeadTime } from "@/types";

export async function GET() {
  return NextResponse.json({ data: store.getReminderSettings() });
}

export async function PATCH(request: NextRequest) {
  let body: {
    enabled?: boolean;
    channels?: ReminderChannel[];
    leadTimes?: ReminderLeadTime[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Invalid request body" } },
      { status: 400 }
    );
  }

  if (body.channels && body.channels.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Select at least one channel",
        },
      },
      { status: 400 }
    );
  }

  const data = store.updateReminderSettings(body);
  return NextResponse.json({ data });
}
