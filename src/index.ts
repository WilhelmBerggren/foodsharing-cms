import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import { promises as fs, readFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pageSchema } from "./schema.js";
import { getPage, listPages, savePage, UPLOADS_DIR } from "./store.js";

const PORT = Number(process.env.PORT ?? 8787);
// The editor password may be provided directly (CMS_TOKEN) or via a file
// (CMS_TOKEN_FILE) — the latter for Docker / Co-op Cloud secrets mounted at
// /run/secrets/...
let TOKEN = process.env.CMS_TOKEN;
if (!TOKEN && process.env.CMS_TOKEN_FILE) {
  TOKEN = readFileSync(process.env.CMS_TOKEN_FILE, "utf8").trim();
}
if (!TOKEN) {
  console.error(
    "Refusing to start: set CMS_TOKEN or CMS_TOKEN_FILE (the editor password).",
  );
  process.exit(1);
}

// Comma-separated list of allowed origins for cross-origin reads/writes.
// If you reverse-proxy under the same domain you can leave this unset.
const ORIGINS = (process.env.CORS_ORIGINS ?? "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: ORIGINS.length === 1 && ORIGINS[0] === "*" ? "*" : ORIGINS,
    allowMethods: ["GET", "PUT", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// ---- Public reads ---------------------------------------------------------

app.get("/api/health", (c) => c.json({ ok: true }));

app.get("/api/pages", async (c) => c.json(await listPages()));

app.get("/api/pages/:slug", async (c) => {
  const page = await getPage(c.req.param("slug"));
  if (!page) return c.json({ error: "not found" }, 404);
  return c.json(page);
});

// ---- Protected writes -----------------------------------------------------

const auth = bearerAuth({ token: TOKEN });

// Cheap endpoint the editor calls to validate the entered password.
app.get("/api/auth/check", auth, (c) => c.json({ ok: true }));

app.put("/api/pages/:slug", auth, async (c) => {
  const slug = c.req.param("slug");
  const body = await c.req.json().catch(() => null);
  const parsed = pageSchema.safeParse({ ...body, slug });
  if (!parsed.success) {
    return c.json({ error: "invalid page", issues: parsed.error.issues }, 400);
  }
  return c.json(await savePage(parsed.data));
});

app.post("/api/uploads", auth, async (c) => {
  const form = await c.req.parseBody();
  const file = form["file"];
  if (!(file instanceof File)) {
    return c.json({ error: "expected a 'file' field" }, 400);
  }
  const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "");
  const name = `${randomUUID()}${ext || ".bin"}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(
    path.join(UPLOADS_DIR, name),
    Buffer.from(await file.arrayBuffer()),
  );
  return c.json({ url: `/uploads/${name}` });
});

// ---- Static assets --------------------------------------------------------
// Long cache: filenames are content-unique (uuid), so they never change.
app.use(
  "/uploads/*",
  serveStatic({
    root: path.relative(process.cwd(), path.dirname(UPLOADS_DIR)) || ".",
    onFound: (_p, c) =>
      c.header("Cache-Control", "public, max-age=31536000, immutable"),
  }),
);

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`foodsharing-cms listening on http://localhost:${info.port}`);
});
