# 🔑 ADMIN PORTAL - SETUP & ACCESS GUIDE

## ⚡ QUICK START (5 minutes)

### Step 1: Start Development Server
Open terminal and run:
```bash
npm run dev
```

This starts the server at: **http://localhost:3000**

### Step 2: Sync Database Schema (Important!)
In a NEW terminal window:
```bash
npx prisma db push
```

This creates all tables in your Supabase database. You'll see:
```
✔ 18 tables created/updated
✔ Database migrated
```

### Step 3: Access Admin Login Portal
Open your browser and go to:
```
http://localhost:3000/admin/login
```

You should see a beautiful login page.

---

## 📝 CREATE YOUR ADMIN ACCOUNT

### First-Time Setup (Auto-creates Admin)

1. **Click "Create Account"** tab on login page
2. **Fill in details:**
   ```
   Name: Your Name
   Email: your.email@example.com
   Password: Strong password (min 8 chars)
   ```
3. **Click "Create & Login"**
4. ✅ Account created automatically
5. ✅ Redirects to Admin Dashboard

**That's it!** No need for manual database entry.

---

## 📊 ADMIN DASHBOARD

After login, you'll see:

```
┌─────────────────────────────────────────┐
│  ADMIN DASHBOARD                        │
├─────────────────────────────────────────┤
│                                         │
│  📦 Products      [0]                  │
│  🛒 Orders        [0]                  │
│  👥 Customers     [0]                  │
│  📈 Revenue       ₹0                   │
│  📨 Messages      [0]                  │
│                                         │
├─────────────────────────────────────────┤
│ SIDEBAR MENU:                          │
│  • Dashboard                           │
│  • Products        → Add/Edit/Delete   │
│  • Orders          → Manage Orders    │
│  • Customers       → View Customers   │
│  • Leads           → Track Inquiries  │
│  • Messages        → Contact Forms    │
│  • Newsletter      → Subscribers      │
│  • Settings        → Site Config      │
│  • [Logout]                           │
└─────────────────────────────────────────┘
```

---

## 📦 ADD YOUR FIRST PRODUCT

### Navigate to: `Products` → `Add Product Button`

**Step-by-Step Form:**

#### 1. **Basic Info**
   - **Product Name:** "Silver Necklace - Classic"
   - **Category:** Select from dropdown (Necklaces, Rings, etc.)
   - **Stock:** 10

#### 2. **Jewelry Details**
   - **Silver Weight (grams):** 25.5
   - **Making Charges (₹):** 500
   - **Profit Per Gram (₹):** 100
   - **Fixed Price Override:** Leave blank (auto-calculates)

#### 3. **Description**
   - **Description:** "Handcrafted 925 sterling silver necklace with traditional designs..."
   - **Material:** "925 Silver" (default)
   - **Tags:** "necklace, silver, handmade, traditional"

#### 4. **Images** (IMPORTANT!)
   - **Click "Upload Images"**
   - **Select 2-3 product photos** from your computer
   - **Wait for upload** (shows progress)
   - ✅ Images appear as thumbnails

**⚠️ Note:** Image upload currently uses **placeholder service**. See "Enable Image Upload" section below to use real Cloudinary.

#### 5. **SEO Info** (Optional)
   - **Meta Title:** "Silver Necklace | Saroj Moun Jewellery"
   - **Meta Description:** "Buy authentic 925 sterling silver necklace..."

#### 6. **Pricing Preview**
You'll see **live price calculation:**
```
Silver Rate: ₹85/gram (updates hourly)
Silver Cost: 25.5g × ₹85 = ₹2,167.50
Making Charges: ₹500
Profit: 25.5g × ₹100 = ₹2,550
────────────────────────────
FINAL PRICE: ₹5,217.50
```

#### 7. **Save**
   - **Click "Save Product"**
   - ✅ Redirects to Products List
   - ✅ Product shows with "Edit" & "Delete" buttons

---

## 🖼️ ENABLE REAL IMAGE UPLOADS

Currently images are placeholders. To enable real Cloudinary uploads:

### Step 1: Create Cloudinary Account
1. Go to: https://cloudinary.com
2. Click **"Sign Up Free"**
3. Email verification (2 minutes)

### Step 2: Get API Credentials
1. Dashboard → **Settings** (gear icon)
2. Left sidebar → **API Keys**
3. Copy these:
   - **Cloud Name:** `dxxxxxxx` (top of page)
   - **API Key:** `123456789...`
   - **API Secret:** `abcdef123456...`

### Step 3: Update .env File
Edit `.env` in your project root:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dxxxxxxx"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="abcdef123456"
```

### Step 4: Restart Server
```bash
# Press Ctrl+C to stop
npm run dev
```

### Step 5: Test Upload
1. Go to: http://localhost:3000/admin/products/new
2. Upload image
3. ✅ Should now upload to Cloudinary (not placeholder)

---

## 💳 ENABLE PAYMENTS (For Customers)

Customers can't buy until Razorpay is configured.

### Step 1: Create Razorpay Account
1. Go to: https://razorpay.com
2. Sign up
3. **For Testing:** Use Razorpay Test Keys (immediate)
4. **For Live:** Need business verification (24-48 hours)

### Step 2: Get API Keys
1. Dashboard → **Settings** → **API Keys**
2. Copy:
   - **Key ID:** `rzp_test_xxx`
   - **Key Secret:** `xxx`

### Step 3: Update .env
```env
RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="xxx"
```

### Step 4: Restart Server
```bash
npm run dev
```

### Step 5: Test Checkout
1. Go to: http://localhost:3000 (homepage)
2. Add product to cart
3. Checkout
4. Payment modal appears (Razorpay)
5. Use test card:
   ```
   Card: 4111 1111 1111 1111
   Expiry: 12/25
   CVV: 123
   ```

---

## 🔍 VIEW ADMIN FUNCTIONS

### Products Tab
```
✅ View all products
✅ Search by name
✅ Filter by category
✅ Add new product
✅ Edit product details
✅ Delete products
✅ Mark as featured/bestseller
✅ Toggle active status
✅ See live prices
```

### Orders Tab
```
✅ View all orders
✅ View order details
✅ See customer info
✅ Check payment status
✅ Update order status
   - PENDING → PROCESSING → SHIPPED → DELIVERED
✅ See tracking info
```

### Customers Tab
```
✅ View all customers
✅ See purchase history
✅ View contact info
✅ Track customer value
```

### Leads Tab
```
✅ See product inquiries
✅ See contact form submissions
✅ Mark as contacted
✅ Export leads
```

### Messages Tab
```
✅ View unread messages
✅ Mark as read
✅ Reply to inquiries
```

### Newsletter Tab
```
✅ View subscribers
✅ See subscription date
✅ Export emails
```

### Settings Tab
```
✅ Business name
✅ Phone number
✅ WhatsApp number
✅ Business address
✅ GST number
✅ Shipping charges
✅ Social media links
✅ Meta tags for SEO
```

---

## 🔐 SECURITY & SESSIONS

- **Session Duration:** 7 days (auto-logout)
- **Password:** Hashed + salted (bcrypt)
- **Cookies:** HTTP-only, Secure, SameSite
- **Session Tracking:** IP address & user agent logged

---

## ❌ TROUBLESHOOTING

### Problem: Login page shows "Unauthorized"
**Solution:**
```bash
npx prisma db push  # Ensure tables exist
npm run dev         # Restart server
```

### Problem: Images won't upload
**Solution:**
- Check .env has Cloudinary credentials
- Images fallback to placeholder if not configured
- This is OK for testing

### Problem: Forgot Admin Password
**Solution:**
```bash
npx prisma studio
# Find Admin table → Click delete → Restart server
# Login page auto-creates new admin
```

### Problem: Server won't start
**Solution:**
```bash
npm install
npm run dev
# Check that database connection in .env is valid
```

---

## ✅ NEXT STEPS

1. **Start server:** `npm run dev`
2. **Push database:** `npx prisma db push`
3. **Login:** http://localhost:3000/admin/login
4. **Create admin** via the form
5. **Add 5-10 products** with details & images
6. **Configure site settings**
7. **Setup Cloudinary** for real images
8. **Setup Razorpay** for payments
9. **Deploy to Vercel** for live site

---

## 📞 QUICK LINKS

- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin
- **Add Product:** http://localhost:3000/admin/products/new
- **Shop Page:** http://localhost:3000/shop
- **Checkout:** http://localhost:3000/checkout

---

**🎉 You're ready to add your jewelry products! Start by logging in and adding your first item.**
