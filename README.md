# foodsharing-cms

A tiny headless CMS for the [foodsharing-plugin](../foodsharing-plugin). It does
exactly two things:

- **Serves page content + images** over a small JSON API (public, read-only).
- **Accepts edits** to that content behind a single password (writes + image
  uploads).

The plugin renders pages from this API and ships a password-protected editor at
`/#/fss-admin`. No database — content lives as one JSON file per page under
`data/`, images under `uploads/`.

## How it fits together

```
Browser (Karrot + foodsharing-plugin)
  ├─ public pages  ── GET  /fss-cms/api/pages/:slug   ──┐
  └─ /#/fss-admin  ── PUT  /fss-cms/api/pages/:slug     │  reverse-proxied,
                      POST /fss-cms/api/uploads         │  same origin
                                                        ▼
                                          foodsharing-cms (Hono, :8787)
                                            data/*.json   uploads/*
```

## API

| Method | Path                | Auth   | Purpose                          |
| ------ | ------------------- | ------ | -------------------------------- |
| GET    | `/api/health`       | –      | Liveness check                   |
| GET    | `/api/pages`        | –      | List all pages                   |
| GET    | `/api/pages/:slug`  | –      | Get one page                     |
| GET    | `/api/auth/check`   | bearer | Validate the editor password     |
| PUT    | `/api/pages/:slug`  | bearer | Create/replace a page (validated)|
| POST   | `/api/uploads`      | bearer | Upload an image (`file` field)   |
| GET    | `/uploads/:name`    | –      | Serve an uploaded image          |

Auth is a bearer token equal to `CMS_TOKEN` — the same string the editor asks
for as a "password". Always run behind HTTPS so it isn't sent in the clear.

## Run locally

```bash
cp .env.example .env        # set CMS_TOKEN
npm install
npm run seed                # one-off: writes current page content into data/
npm run dev                 # http://localhost:8787
```

`npm run seed` overwrites `data/*.json`, so only run it once — re-running it
discards edits made through the editor.

## Configuration

All via environment variables (see `.env.example`):

- `CMS_TOKEN` (required) — the editor password / bearer token.
- `PORT` — listen port (default 8787).
- `CORS_ORIGINS` — comma-separated allowed origins, or `*`. Irrelevant if you
  reverse-proxy under the same domain (recommended).
- `DATA_DIR`, `UPLOADS_DIR` — override storage locations (e.g. point at a
  backed-up volume like `/var/lib/foodsharing-cms`).

## Deploy with Co-op Cloud (abra)

This repo doubles as a Co-op Cloud **recipe** (it contains `compose.yml`,
`abra.sh`, `.env.sample`). The CMS runs as its own app and **Traefik** routes
`https://<karrot-domain>/fss-cms/*` to it — same origin as Karrot, so no changes
to the Karrot recipe (or its nginx) are needed.

### 1. Publish the image

Swarm can't build images, so the recipe references a published image. Pushing a
tag runs `.github/workflows/publish.yml`, which builds and pushes to
`ghcr.io/wilhelmberggren/foodsharing-cms`.

Use an **annotated** tag (`-a`) — abra requires recipe version tags to be
annotated (lint rule R014), and this repo is also the recipe:

```bash
git tag -a v1.0.0 -m "v1.0.0" && git push origin v1.0.0
```

Make the GHCR package **public** (repo → Packages → Package settings) so the
Swarm nodes can pull it without credentials. To build manually instead:

```bash
docker build -t ghcr.io/wilhelmberggren/foodsharing-cms:1.0.0 .
docker push ghcr.io/wilhelmberggren/foodsharing-cms:1.0.0
```

The tag in `compose.yml` (`image:`) must match what you pushed.

### 2. Create and configure the app

```bash
# Make abra aware of the recipe (clone this repo into the recipes dir):
git clone https://github.com/WilhelmBerggren/foodsharing-cms \
  ~/.abra/recipes/foodsharing-cms

# Create the app on your server
abra app new foodsharing-cms --server <your-server>

# Edit DOMAIN to match your Karrot domain (e.g. foodsharing.se)
abra app config <app-name>
```

### 3. Set the editor password (secret)

The editor password is the `cms_token` secret. Choose your own:

```bash
abra app secret insert <app-name> cms_token v1 "your-chosen-password"
```

(or `abra app secret generate <app-name> cms_token v1` for a random one — note
it down, it's the login for `/#/fss-admin`).

### 4. Deploy

```bash
abra app deploy <app-name>
```

On first deploy the data volume is empty, so the container seeds the initial
page content automatically (`SEED_ON_EMPTY=true`). Visit
`https://<karrot-domain>/fss-cms/api/health` to confirm it's up, then edit
content at `https://<karrot-domain>/#/fss-admin`.

**Troubleshooting `R014: only annotated tags used for recipe version`** — a
lightweight git tag exists on the recipe. Recreate it annotated, or deploy the
current checkout directly:

```bash
cd ~/.abra/recipes/foodsharing-cms
git tag -d v1.0.0 && git tag -a v1.0.0 -m "v1.0.0"   # make it annotated
abra app deploy <app-name>
# ...or skip recipe versioning entirely while iterating:
abra app deploy <app-name> --chaos
```

> Why no Karrot/nginx change? Traefik already fronts every Co-op Cloud app. The
> CMS router uses `Host(<domain>) && PathPrefix(/fss-cms)` with a higher
> priority than Karrot's host-only router, and a `stripprefix` middleware
> removes `/fss-cms` before forwarding. If you ever *did* want Karrot's nginx to
> proxy instead, both stacks would need to share a Docker network — the Traefik
> route avoids that entirely.

## Deploy on a plain VPS (systemd)

The cleanest setup proxies the CMS under the **same domain** as Karrot, so the
plugin talks to `/fss-cms/...` with no CORS.

### 1. Run it as a service (systemd)

```ini
# /etc/systemd/system/foodsharing-cms.service
[Unit]
Description=foodsharing-cms
After=network.target

[Service]
WorkingDirectory=/opt/foodsharing-cms
ExecStart=/usr/bin/npm run start
Environment=PORT=8787
Environment=CMS_TOKEN=replace-with-a-long-random-secret
Environment=DATA_DIR=/var/lib/foodsharing-cms/data
Environment=UPLOADS_DIR=/var/lib/foodsharing-cms/uploads
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
cd /opt/foodsharing-cms && npm install
sudo mkdir -p /var/lib/foodsharing-cms/{data,uploads}
sudo chown -R www-data:www-data /var/lib/foodsharing-cms
# seed once:
sudo -u www-data DATA_DIR=/var/lib/foodsharing-cms/data \
     UPLOADS_DIR=/var/lib/foodsharing-cms/uploads CMS_TOKEN=x npm run seed
sudo systemctl enable --now foodsharing-cms
```

(`npm run start` uses `tsx`; alternatively run with `pm2` if you prefer.)

### 2. Reverse-proxy `/fss-cms` to it

**Caddy:**

```
foodsharing.se {
    handle_path /fss-cms/* {
        reverse_proxy localhost:8787
    }
    # ... existing Karrot block ...
}
```

**nginx:**

```nginx
location /fss-cms/ {
    proxy_pass http://localhost:8787/;
}
```

With this, the plugin's default `CMS_BASE` of `/fss-cms` works as-is. If you host
the CMS on a different domain instead, set `VITE_CMS_BASE` when building the
plugin and `CORS_ORIGINS` to your site origin here.

## Backups

Content and images are just files. Either:

- point `DATA_DIR`/`UPLOADS_DIR` at a directory included in your VPS backups, or
- remove `data/` and `uploads/` from `.gitignore` and commit them.

## Editing content

Open `https://foodsharing.se/#/fss-admin`, enter the `CMS_TOKEN`, pick a page,
edit text/images, Save. Changes are live on next page load (the plugin caches
for 60s).
