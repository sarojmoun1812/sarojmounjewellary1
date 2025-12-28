# Saroj Moun Jewellery - D2C Silver Jewellery Platform

A modern, scalable e-commerce platform for selling premium handcrafted silver jewellery.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui, Framer Motion
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Razorpay
- **Shipping**: Shiprocket (optional)
- **Image Storage**: Cloudinary
- **Deployment**: Vercel (frontend), Railway/Supabase (database)

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin panel
│   ├── shop/             # Shop pages
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout flow
│   └── product/          # Product detail pages
├── components/
│   ├── ui/               # UI components (shadcn)
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── product-card.tsx
├── lib/
│   ├── db.ts            # Prisma client
│   ├── cart-store.ts    # Cart state management
│   └── utils.ts         # Utility functions
└── prisma/
    └── schema.prisma    # Database schema
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a `.env` file in the root directory (use `.env.example` as template):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sarojmoun"
RAZORPAY_KEY_ID="your_key"
RAZORPAY_KEY_SECRET="your_secret"
```

### 3. Initialize Database

```bash
npx prisma db push
npx prisma db seed  # (optional, if you create seed data)
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Primary**: `#1C1C1C` (Luxury black)
- **Accent**: `#C9A24D` (Gold)
- **Background**: `#FAFAFA`

### Fonts
- **Headings**: Playfair Display
- **Body**: Inter

## 📦 Key Features

### Customer-Facing
- ✅ Product browsing with filters
- ✅ Shopping cart with persistence
- ✅ Checkout with COD/Prepaid options
- ✅ Razorpay payment integration
- ✅ Order tracking
- ✅ Responsive design

### Admin Panel
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Customer database
- ✅ Basic analytics

## 🚢 Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Database (Railway/Supabase)
1. Create a PostgreSQL instance
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npx prisma db push`

## 📊 Database Schema

### Core Models
- **Product**: id, name, slug, price, images, category, stock
- **Order**: id, customer, items, total, status, payment info
- **Customer**: id, name, phone, email, orders
- **Admin**: id, email, passwordHash

## 🔐 Security

- Input validation with Zod
- Secure password hashing
- JWT for admin authentication
- HTTPS only in production
- Rate limiting on API routes

## 📈 Future Enhancements

- [ ] User accounts & wishlists
- [ ] Product reviews
- [ ] Instagram feed integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Inventory alerts
- [ ] Discount codes
- [ ] WhatsApp Business API integration

## 🤝 Contributing

This is a private business project. For issues or features, contact the admin.

## 📄 License

Private & Proprietary

---

**Built for Saroj Moun Jewellery**  
Premium Silver Jewellery | Made with ❤️ in India
