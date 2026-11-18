import { NextResponse } from "next/server";
import { CLASSES } from "@/lib/content";

export function GET() {
  return NextResponse.json({ classes: CLASSES });
}
