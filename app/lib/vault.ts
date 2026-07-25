// Vault — almacenamiento de documentos (FS-016).
//
// v1 MVP: guarda el binario en disco local del servidor, fuera de /public
// (nunca servido directamente por Next — solo a través de
// app/api/vault/[documentId]/route.ts, que valida acceso primero).
//
// Esto es un placeholder deliberado para poder probar el sistema de punta a
// punta hoy. MD-500 deja pendiente, vía ADR, la decisión de un object
// storage real (S3, Cloudflare R2, etc.) para producción. Cuando se decida,
// solo cambian saveFile/readFile — el resto del modelo (Document, hash,
// clasificación, vínculos, auditoría) no se toca.

import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";

const STORAGE_ROOT = path.join(process.cwd(), ".vault-storage");

async function ensureStorageDir() {
  await fs.mkdir(STORAGE_ROOT, { recursive: true });
}

export async function saveFile(buffer: Buffer, storagePath: string) {
  await ensureStorageDir();
  const fullPath = path.join(STORAGE_ROOT, storagePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);
}

export async function readFile(storagePath: string): Promise<Buffer> {
  const fullPath = path.join(STORAGE_ROOT, storagePath);
  return fs.readFile(fullPath);
}

export function hashBuffer(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function safeFilename(original: string): string {
  return original.replace(/[^a-zA-Z0-9._-]/g, "_");
}
