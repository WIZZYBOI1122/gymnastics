import { NextResponse } from "next/server";
import { TRAINERS } from "@/lib/content";

export function GET() {
  return NextResponse.json({ trainers: TRAINERS });
}
