import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { RECEIPTS_DIR } from "./config";

export const MAX_RECEIPT_BYTES = 5 * 1024 * 1024; // 5 MB

export type ReceiptKind = { ext: "jpg" | "png" | "pdf"; mime: string };

/**
 * Decide the real file type from its first bytes. The client-supplied name and
 * MIME type are ignored because both can be faked.
 */
export function sniffReceipt(buf: Buffer): ReceiptKind | null {
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  if (
    buf.length > 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { ext: "png", mime: "image/png" };
  }
  if (buf.length > 5 && buf.subarray(0, 5).toString("latin1") === "%PDF-") {
    return { ext: "pdf", mime: "application/pdf" };
  }
  return null;
}

function dir(): string {
  return path.resolve(process.cwd(), RECEIPTS_DIR);
}

export async function saveReceipt(buf: Buffer, kind: ReceiptKind): Promise<string> {
  await mkdir(dir(), { recursive: true });
  const fileName = `${randomUUID()}.${kind.ext}`;
  await writeFile(path.join(dir(), fileName), buf, { mode: 0o600 });
  return fileName;
}

const SAFE_NAME = /^[0-9a-f-]{36}\.(jpg|png|pdf)$/;

export async function readReceipt(fileName: string): Promise<Buffer | null> {
  // Only ever open names this module generated: blocks path traversal.
  if (!SAFE_NAME.test(fileName)) return null;
  try {
    return await readFile(path.join(dir(), fileName));
  } catch {
    return null;
  }
}
