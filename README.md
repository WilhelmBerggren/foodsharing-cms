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

## Deploy on the VPS

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
