import { promises as fs } from "fs";
import path from "path";
import type { Draft } from "./types";

// MVP向けのファイルベース保存。
// 注意: Vercel等のサーバーレスでは実行間で消えるため、
//   本番運用時はDB（Postgres/KV等）へ差し替えてください（インターフェースは同じ）。
const DATA_DIR = path.join(process.cwd(), ".data");
const DRAFTS_FILE = path.join(DATA_DIR, "drafts.json");

async function ensure(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DRAFTS_FILE);
  } catch {
    await fs.writeFile(DRAFTS_FILE, "[]", "utf-8");
  }
}

export async function listDrafts(): Promise<Draft[]> {
  await ensure();
  const raw = await fs.readFile(DRAFTS_FILE, "utf-8");
  try {
    const drafts = JSON.parse(raw) as Draft[];
    return drafts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

async function writeAll(drafts: Draft[]): Promise<void> {
  await ensure();
  await fs.writeFile(DRAFTS_FILE, JSON.stringify(drafts, null, 2), "utf-8");
}

export async function addDraft(draft: Draft): Promise<Draft> {
  const drafts = await listDrafts();
  drafts.unshift(draft);
  await writeAll(drafts);
  return draft;
}

export async function getDraft(id: string): Promise<Draft | undefined> {
  const drafts = await listDrafts();
  return drafts.find((d) => d.id === id);
}

export async function updateDraft(
  id: string,
  patch: Partial<Draft>
): Promise<Draft | undefined> {
  const drafts = await listDrafts();
  const idx = drafts.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  drafts[idx] = { ...drafts[idx], ...patch, updatedAt: new Date().toISOString() };
  await writeAll(drafts);
  return drafts[idx];
}

export async function deleteDraft(id: string): Promise<void> {
  const drafts = await listDrafts();
  await writeAll(drafts.filter((d) => d.id !== id));
}
