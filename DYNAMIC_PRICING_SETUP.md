# 🪙 Dynamic Silver Pricing - Setup Guide

## ✅ What's Implemented

1. **Auto Silver Rate Fetching** - Updates every 6 hours from MetalPriceAPI
2. **Smart Caching** - Reduces API calls, saves money
3. **Dynamic Price Calculation** - `(Weight × Rate) + Making + Profit`
4. **Manual Override** - Admin can set rates manually
5. **Fallback System** - Works even if API fails

---

## 📋 Setup Steps

### 1️⃣ Get Free API Key

Visit: **https://metalpriceapi.com/**

- Sign up (Free account)
- Get API key (100 requests/month FREE)
- Copy your API key

### 2️⃣ Add API Key to .env

```env
METAL_PRICE_API_KEY="your_actual_api_key_here"
```

### 3️⃣ Update Database Schema

```bash
npx prisma db push
```

This creates the `SilverRate` table.

### 4️⃣ Test API

```bash
curl http://localhost:3000/api/silver-rate
```

Should return:
```json
{
  "success": true,
  "ratePerGram": 95.50,
  "updatedAt": "2025-12-24T...",
  "cached": false
}
```

---

## 💰 How to Add Products

### New Product Structure:

```javascript
{
  name: "Temple Necklace",
  silverWeight: 50.5,        // grams
  makingCharges: 50000,      // ₹500 in paise
  profitPercent: 20,         // 20% profit
  fixedPrice: null,          // null = auto-calculate
  category: "Necklaces",
  images: [...],
  stock: 10
}
```

### Price Calculation Example:

| Field | Value |
|-------|-------|
| Silver Weight | 50g |
| Today's Rate | ₹95/g |
| Making Charges | ₹500 |
| Profit | 20% |

**Calculation:**
```
Silver Cost = 50 × 95 = ₹4,750
+ Making = ₹500
= Subtotal = ₹5,250
+ Profit (20%) = ₹1,050
= Final Price = ₹6,300
```

---

## 🔄 How Auto-Update Works

1. **First Request** → Fetches from API → Stores in DB
2. **Next 6 hours** → Returns cached rate from DB (fast!)
3. **After 6 hours** → Fetches fresh rate automatically
4. **Client Cache** → Also cached in browser for 6 hours

**Result:** Only ~4 API calls per day! (Well within free tier)

---

## 🎨 Display Silver Rate on Website

### Add to Homepage:

```tsx
import { SilverRateIndicator } from "@/components/silver-rate-indicator";

// In your component
<SilverRateIndicator />
```

### Add to Navbar:

```tsx
import { SilverRateBadge } from "@/components/silver-rate-indicator";

// In navbar
<SilverRateBadge />
```

---

## 🛠️ Admin Manual Override

If you want to set a custom rate:

```bash
POST /api/silver-rate
{
  "ratePerGram": 98.50
}
```

Or add a button in admin panel.

---

## 📊 Price Breakdown (Optional)

Show customers how price is calculated:

```tsx
import { calculateProductPrice } from "@/lib/pricing";

const breakdown = calculateProductPrice(
  {
    silverWeight: 50,
    makingCharges: 50000,
    profitPercent: 20
  },
  silverRate
);

// Display:
// Silver: ₹4,750
// Making: ₹500
// Profit: ₹1,050
// Total: ₹6,300
```

---

## ⚡ Performance

- **Server-side cache:** 6 hours
- **Client-side cache:** 6 hours  
- **API calls per day:** ~4
- **Page load:** No delay (cached)

---

## 🔒 Fallback Safety

If API fails:
- Uses ₹95/gram default
- Shows last cached rate
- Website keeps working!

---

## 💡 Pro Tips

1. **API Limit:** 100 calls/month free = ~3 calls/day. We use 4/day with caching!
2. **Update Time:** Best to update at 6 AM, 12 PM, 6 PM, 12 AM
3. **Manual Override:** Use on festivals/special offers
4. **Price Lock:** Set `fixedPrice` for items you don't want to auto-update

---

## 🚀 Next Steps

1. Update products in admin panel with `silverWeight`
2. Remove old `price` field entries
3. Test a few products
4. Add silver rate indicator to homepage
5. Add price disclaimer: "Price based on current silver rate"

---

## 📞 Support

If silver rate seems wrong:
1. Check API key in `.env`
2. Check database for `SilverRate` entries
3. Try manual POST to `/api/silver-rate`
4. Check browser console for errors

**Default fallback:** ₹95/gram (will work even without API!)
