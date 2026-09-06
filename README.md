# Saroj Moun Jewellery

Handcrafted 925 silver jewellery storefront + admin panel for **Saroj Moun Jewellery** (Jind, Haryana).

Orders are confirmed on **WhatsApp** (no card gateway). Prices follow the live silver rate + labour per gram.

## Stack

- **App:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database:** PostgreSQL + Prisma (production typically on Render)
- **Hosting:** Vercel (includes daily silver-rate cron)
- **Uploads:** Vercel Blob (preferred) or Cloudinary
- **Rates:** MetalPriceAPI → stored local rate + admin premium %

## Local setup

```bash
npm install
cp .env.example .env   # fill real values — never invent secrets
npm run db:status      # check Postgres
npm run dev            # http://localhost:3000
```

Useful scripts:

| Script | Purpose |
|--------|---------|
| `npm run admin:create` | Create/reset admin (`ADMIN_EMAIL` + `ADMIN_PASSWORD`) |
| `npm run smoke` | Smoke-test public + admin pages |
| `npm run db:push` | Push Prisma schema |
| `npm run db:seed` | Optional seed data |

See `.env.example` for every variable. Prefer copying values from the Vercel project rather than guessing.

## Production shape

- Public site + `/api/*` on Vercel
- Admin at `/admin/login`
- Cron: `/api/cron/silver-rate` (needs `CRON_SECRET`)
- Domain via `NEXT_PUBLIC_BASE_URL` (e.g. `https://sarojmounjewellary.com`)

## What customers can do

- Browse / search the shop, filter by category, sort by price
- Add in-stock pieces to cart (server-priced on today’s silver rate)
- Checkout → WhatsApp order message

## What the admin can do

- Products (photos/video, weight or fixed price, stock)
- Orders, customers, leads, messages, newsletter
- Site settings (labour/gram, GST, shipping, socials)
- Manual or cron silver-rate refresh

## Docs note

Older markdown files in this repo (`STATUS.md`, `FINAL_AUDIT_REPORT.md`, etc.) may still mention Razorpay/Supabase. Trust **`.env.example`**, **`DEPLOYMENT_GUIDE.md`**, and this README for the current system.
