import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pageSchema, type Page } from "./schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(ROOT, "data");
export const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(ROOT, "uploads");

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

function pagePath(slug: string) {
  // Guard against path traversal — slug is validated, but be defensive.
  const safe = slug.replace(/[^a-z0-9-]/g, "");
  return path.join(DATA_DIR, `${safe}.json`);
}

export async function listPages(): Promise<Page[]> {
  await ensureDirs();
  const files = await fs.readdir(DATA_DIR);
  const pages: Page[] = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    const parsed = pageSchema.safeParse(JSON.parse(raw));
    if (parsed.success) pages.push(parsed.data);
  }
  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getPage(slug: string): Promise<Page | null> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(pagePath(slug), "utf8");
    return pageSchema.parse(JSON.parse(raw));
  } catch (err: any) {
    if (err?.code === "ENOENT") return null;
    throw err;
  }
}

export async function savePage(page: Page): Promise<Page> {
  await ensureDirs();
  const validated = pageSchema.parse(page);
  await fs.writeFile(
    pagePath(validated.slug),
    JSON.stringify(validated, null, 2) + "\n",
    "utf8",
  );
  return validated;
}
