# Anonymous comments

The existing static export is retained. `worker/comments.ts` runs first only for `/api/*`; other requests are served by Cloudflare Assets. D1 persists comments. Allowed threads: three technical articles, journal, downloads. Entries default to pending. Only approved entries are returned publicly.

## Moderation

Open `/moderation.html` and enter the separate admin token. The token is held in browser memory only. Approve publishes a comment; remove/hide makes it private, with restoration available in the hidden list. This interface does not permanently erase records. The admin credential is stored locally at `~/.config/microduck/comments-admin-token.txt` with mode 0600, and in the Worker's encrypted secret. Never publish it or paste it into a GitHub issue.

## Cloudflare configuration

- D1 binding: COMMENTS_DB; database name: microduck-comments.
- TURNSTILE_SITE_KEY is public; widget is restricted to microduck.intemotech.com, managed mode, pre-clearance disabled.
- Encrypted Worker secrets: TURNSTILE_SECRET, COMMENTS_ADMIN_TOKEN, COMMENTS_HASH_SECRET.
- The application validates the Turnstile token server-side, including hostname and action `comment`. It has no production test-token bypass.
- Production `0001_comments.sql` was applied via Cloudflare D1 Console on 2026-09-11 because the existing CLI OAuth scope lacks D1 write. No permission expansion was needed. It is applied already: do not reapply that schema directly. Future schema changes must be additive numbered migrations, applied before code relying on them. CI deploys code/assets; it does not apply D1 migrations.

## Abuse limits and privacy

One accepted comment per minute and ten per UTC day per daily HMAC IP identifier. Limits are enforced with an atomic conditional INSERT, including hidden/pending records. The daily hash changes at UTC midnight; the minute limit can reset at that boundary. Raw IP is not stored in D1. Older hashes are cleared on subsequent submissions after 24 hours; during inactivity they can remain until the next submission. Cloudflare independently processes IP and challenge signals; Worker logs remain disabled. Nickname/body are treated as plain text, never rendered as HTML. Request bodies are capped at 12 KB, body at 2,000 characters, nickname at 40. Public and private lists are paginated and no-store.

## Validation / local use

`npm run test:comments` uses local Miniflare D1 and an injected Siteverify response in the test harness only. It checks moderation privacy/auth, publishing/hiding, idempotent retries, concurrent rate limiting, invalid tokens/hostname/action, cross-origin rejection, request size and IP storage. The real Worker always calls Cloudflare Siteverify.

`npx wrangler d1 migrations apply microduck-comments-local --local --config cloudflare-comments.local.jsonc`

`npx wrangler dev --config cloudflare-comments.local.jsonc --port 8774`

Local config has no real Turnstile credentials; submissions stay unavailable. Test-only admin/hash values are confined to this separate local config. Do not deploy that config. `npm run deploy` uses cloudflare-static.jsonc, which now includes the API Worker and production D1 binding. Secrets are managed separately and never committed.
