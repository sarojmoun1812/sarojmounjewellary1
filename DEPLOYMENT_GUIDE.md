# Deployment Guide — Saroj Moun Jewellery

## The stack, as it actually is

| Piece | Where it runs |
| --- | --- |
| Website and API routes | Vercel |
| Postgres database | Render |
| Product photographs | Cloudinary |
| Orders | WhatsApp to +91 81687 90171 |
| Domain | sarojmounjewellary.com |

There is no separate backend to deploy. The API routes live inside the Next.js
app, so they go up with the site on Vercel. Render hosts only the database.

There is no payment gateway. A customer builds a cart, the server prices it, and
the order arrives as a WhatsApp message. Razorpay was removed — do not add
payment keys, and do not follow any older guide in this repo that mentions
Razorpay or Supabase. Those describe a version of the site that no longer exists.

---

## Environment variables on Vercel

Set every one of these in **Vercel → Project → Settings → Environment
Variables**, for Production (and Preview if you use it). The site will not work
correctly without the first four.

```env
# Render Postgres, the External Connection String, ending in ?sslmode=require
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require

# Admin password hashes derive from this. Changing it invalidates every
# existing password. Generate with:
#   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
AUTH_SECRET=

# The real domain, no trailing slash. Canonical URLs, the sitemap, robots.txt
# and every share preview are built from this.
NEXT_PUBLIC_BASE_URL=https://sarojmounjewellary.com

# Cloudinary, from Dashboard → Settings → API Keys. Without these, uploading a
# product photo fails with a clear error instead of saving anything.
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# metalpriceapi.com. Without it the silver rate is whatever was last saved in
# the admin panel. Every product price depends on it.
METAL_PRICE_API_KEY=

# Digits only, with country code. Customer orders are sent here.
NEXT_PUBLIC_WHATSAPP_NUMBER=918168790171

NEXT_PUBLIC_SITE_NAME=Saroj Moun Jewellery

# Optional. While set (16+ characters) the login page can create the first
# admin. Remove it once her account exists.
ADMIN_SETUP_TOKEN=
```

Anything starting with `NEXT_PUBLIC_` is visible in the browser by design. Never
put a password or secret behind that prefix.

---

## First deploy

1. Push to GitHub. Vercel deploys `main` automatically once connected.
2. In Vercel, import the repository. Framework preset: Next.js. Leave the build
   and output settings alone — `npm run build` already runs `prisma generate`.
3. Add the environment variables above, then redeploy so they take effect.
   Variables added after a build do not apply to that build.
4. Visit the deployment URL and check the shop page loads with products.

## Connecting the domain

1. Vercel → Settings → Domains → add `sarojmounjewellary.com` and `www`.
2. At the registrar, create the exact DNS records Vercel shows you on that
   screen. Do not copy IP addresses out of any guide, including this one —
   Vercel changes them, and the dashboard is the only current source.
3. DNS usually propagates within an hour, occasionally up to 48.
4. Confirm `NEXT_PUBLIC_BASE_URL` matches the final domain, then redeploy.

## Creating her admin account

There is no default password, by design. From a machine with the production
`DATABASE_URL` and `AUTH_SECRET` in `.env`:

```bash
ADMIN_EMAIL=her@email.com ADMIN_PASSWORD=a-long-password node scripts/create-admin.js
```

Minimum twelve characters. To reset it later, run the same command again with a
new password.

---

## Before telling anyone the site is live

- [ ] At least five products, each with her own photographs uploaded
- [ ] Place a real test order end to end and confirm the WhatsApp message
      arrives with the right items and total
- [ ] Check a product page on a phone, including add-to-cart
- [ ] Confirm the silver rate in the admin panel matches the market
- [ ] Confirm `/admin` asks for a login when signed out
- [ ] Search Google Search Console for the sitemap at
      `https://sarojmounjewellary.com/sitemap.xml`

## Verifying it after deploy

```bash
npm run db:status   # products, orders, admins, silver rate, shipping settings
npm run smoke       # 105 checks; needs the site running and ADMIN_EMAIL/ADMIN_PASSWORD
```

---

## Things that will bite

**GST is off, and must stay off.** She is not GST registered, and collecting tax
without a GSTIN is an offence. The rate is 0 in the database and in the admin
panel. Only raise it after she registers.

**The Render free tier deletes the database after 30 days.** Move to a paid tier
or take regular backups before then. Everything — products, orders, customers —
lives there.

**Rotate anything that has ever been committed.** The metalpriceapi key was
previously in this file in plain text, so treat it as public and generate a new
one.

**Prices come from the live silver rate.** If the rate feed is wrong or stale,
every price on the site is wrong. Check it after deploy and occasionally after.

**No coupon system exists.** Do not advertise a discount code; nothing will
accept it. Offer a discount by adjusting the price she quotes on WhatsApp.

---

## Ongoing

**Daily** — check for new orders on WhatsApp and in `/admin/orders`, reply to
inquiries.

**Weekly** — update stock, confirm the silver rate looks right.

**Monthly** — add products and fresh photographs, review what sold.

## Support channels

- WhatsApp: +91 81687 90171 (primary, this is where orders arrive)
- Email: sarojmounjewellary@gmail.com
- Instagram: @sarojmounfashion
- YouTube: @sarojmoun1207

## When something breaks

1. Vercel dashboard → the failing deployment → Runtime Logs
2. Check the Render database is awake and reachable
3. Confirm the environment variables are present in the right environment
4. Vercel status: https://www.vercel-status.com — Render status:
   https://status.render.com
