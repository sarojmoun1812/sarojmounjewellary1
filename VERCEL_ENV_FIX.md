# 🚀 URGENT FIX: DATABASE_URL Missing on Vercel

**ERROR:** `Environment variable not found: DATABASE_URL`

This is why admin setup is failing. Here's the 2-minute fix:

---

## ✅ STEP 1: Get DATABASE_URL from Supabase

1. Open: https://supabase.com
2. Login → Select Your Project
3. Click **Settings** (bottom left)
4. Click **Database** tab
5. Look for "Connection string" section
6. Click the **PostgreSQL** tab
7. **Copy** the connection string (looks like):
   ```
   postgresql://postgres:[PASSWORD]@db.zxsexfufedeawsxyjprh.supabase.co:5432/postgres?schema=public
   ```
8. **Replace `[PASSWORD]`** with your actual database password that you set during Supabase setup

---

## ✅ STEP 2: Set Environment Variables on Vercel

1. Open: https://vercel.com
2. Click Your Project (**sarojmounjewellary1**)
3. Go to **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Add these 2 critical variables:

### Variable 1:
- **Name:** `DATABASE_URL`
- **Value:** (Paste the connection string from Step 1)
- Click **Add**

### Variable 2:
- **Name:** `AUTH_SECRET`
- **Value:** `supersecretkey123456!@#$%` (or any strong random string)
- Click **Add**

6. **IMPORTANT:** Check the "Preview" and "Production" checkboxes are selected
7. Click **Save**

---

## ✅ STEP 3: Redeploy on Vercel

1. Still in Vercel → Go to **Deployments** tab
2. Click on latest deployment (top one)
3. Click **Redeploy**
4. Wait for green checkmark (1-2 minutes)

---

## ✅ STEP 4: Test Admin Setup

1. Go to: https://sarojmounjewellary1.vercel.app/admin/login
2. Create admin account with your details
3. Should work now! ✨

---

## ⚠️ If Still Getting Error:

Check that:
- [ ] DATABASE_URL has correct password (not placeholder `[PASSWORD]`)
- [ ] DATABASE_URL includes `?schema=public` at the end
- [ ] AUTH_SECRET is set (any random string)
- [ ] Vercel redeploy completed (green checkmark)
- [ ] Variables saved in BOTH Preview + Production

---

**That's it! Site will be live after this.** 🎉
