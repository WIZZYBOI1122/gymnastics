import { NextResponse } from "next/server";
import { PLANS } from "@/lib/content";

export function GET() {
  return NextResponse.json({ plans: PLANS });
}
