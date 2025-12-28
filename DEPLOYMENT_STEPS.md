# 🚀 DEPLOYMENT - Step by Step

## ✅ ALREADY DONE:
- Metal Price API Key: ✅ Added
- Supabase Project: ✅ Created
- Supabase URL: ✅ Added
- Supabase API Key: ✅ Added

---

## 🔴 URGENT: Get Database Password

### Step 1: Get Database Password from Supabase

1. Go to your Supabase project: https://zxsexfufedeawsxyjprh.supabase.co
2. Click **Settings** (gear icon) in left sidebar
3. Click **Database**
4. Scroll to **Connection String**
5. Click **"URI"** tab
6. Copy the full connection string (it has your password)

It looks like:
```
postgresql://postgres:YOUR_PASSWORD_HERE@db.zxsexfufedeawsxyjprh.supabase.co:5432/postgres
```

### Step 2: Update .env File

Replace `[YOUR-PASSWORD]` in `.env` with your actual password:

```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.zxsexfufedeawsxyjprh.supabase.co:5432/postgres"
```

---

## 📋 NEXT STEPS (After Password):

### 1️⃣ Push Database Schema (2 minutes)

```bash
npx prisma generate
npx prisma db push
```

This will create all tables in Supabase!

### 2️⃣ Test Silver Rate API (1 minute)

Start server:
```bash
npm run dev
```

Test API:
```bash
curl http://localhost:3000/api/silver-rate
```

Should return current silver rate! ✅

### 3️⃣ Deploy to Vercel (5 minutes)

1. Go to **https://vercel.com**
2. Sign in with GitHub
3. Click **"New Project"**
4. Import: `sarojmoun1812/sarojmounjewellary`
5. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.zxsexfufedeawsxyjprh.supabase.co:5432/postgres
   NEXT_PUBLIC_SUPABASE_URL=https://zxsexfufedeawsxyjprh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_anlH89ir8c3dDUTSskkn2A_nswm-1pi
   METAL_PRICE_API_KEY=12b750578db1c1e8ba1d278dab276631
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   NEXT_PUBLIC_BASE_URL=https://your-site.vercel.app
   ```
6. Click **Deploy**
7. Wait 2 minutes

✅ **LIVE!**

---

## 🎯 CHECKLIST:

- [ ] Get database password from Supabase
- [ ] Update DATABASE_URL in .env
- [ ] Run `npx prisma db push`
- [ ] Test silver rate API locally
- [ ] Get Razorpay keys (live mode)
- [ ] Deploy to Vercel
- [ ] Test live site
- [ ] Add custom domain (optional)

---

## 🔥 CURRENT STATUS:

✅ Supabase database created
✅ Metal Price API key added
✅ Dynamic pricing system ready
✅ Code pushed to GitHub
❌ Database password needed
❌ Prisma migration needed
❌ Vercel deployment pending

**Next Action: Get database password!**
