# Shopify Authentication Setup Guide

## 🔧 **پیش‌نیازها**

### 1. Shopify Partner Account

- ثبت‌نام در [Shopify Partners](https://partners.shopify.com)
- ایجاد یک development store

### 2. API Credentials

شما نیاز به دو نوع API credential دارید:

#### **Admin API Access Token**

- برای ایجاد و مدیریت customers
- دسترسی کامل به store data

#### **Storefront API Access Token**

- برای customer authentication
- دسترسی محدود و امن

## 🚀 **مراحل تنظیم**

### مرحله 1: ایجاد Shopify App

1. **Shopify Partners Dashboard** → Apps → Create App
2. **App Name:** British Floors Authentication
3. **App URL:** `https://your-domain.com`
4. **Allowed redirection URLs:** `https://your-domain.com/auth/callback`

### مرحله 2: تنظیم Admin API

1. **App Settings** → Admin API integration
2. **API Version:** 2024-01
3. **Admin API access scopes:**

   - `read_customers`
   - `write_customers`
   - `read_orders`
   - `write_orders`

4. **Install App** در development store
5. **Admin API access token** را کپی کنید

### مرحله 3: تنظیم Storefront API

1. **App Settings** → Storefront API
2. **Storefront API access scopes:**

   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_customer_tags`
   - `unauthenticated_read_customer_metafields`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customers`

3. **Storefront API access token** را کپی کنید

### مرحله 4: تنظیم Environment Variables

فایل `.env.local` را به‌روزرسانی کنید:

```env
# Shopify Store Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-for-development
```

## 🔐 **Authentication Flow**

### Registration Flow:

1. کاربر فرم ثبت‌نام را پر می‌کند (`/auth/register`)
2. سیستم customer جدید در Shopify ایجاد می‌کند
3. کاربر به‌طور خودکار وارد می‌شود
4. به صفحه account هدایت می‌شود

### Login Flow:

1. کاربر فرم ورود را پر می‌کند (`/auth/login`)
2. سیستم با Shopify Storefront API تایید می‌کند
3. Customer access token دریافت می‌کند
4. کاربر وارد می‌شود و به صفحه account هدایت می‌شود

## 🎯 **صفحات Authentication**

### 📝 Registration Page

- **URL:** `/auth/register`
- **ویژگی‌ها:**
  - فرم کامل ثبت‌نام
  - validation password
  - ایجاد customer واقعی در Shopify
  - redirect به account page

### 🔐 Login Page

- **URL:** `/auth/login`
- **ویژگی‌ها:**
  - فرم ورود ساده
  - تایید با Shopify Storefront API
  - مدیریت خطاها
  - redirect به account page

### 👤 Account Page

- **URL:** `/account`
- **ویژگی‌ها:**
  - نمایش اطلاعات کاربر
  - وضعیت Shopify connection
  - لینک به order history
  - تنظیمات حساب کاربری

## 🔒 **امنیت**

### نکات مهم:

1. **Admin API Token** را هرگز در client-side استفاده نکنید
2. **Storefront API Token** برای client-side authentication مناسب است
3. **Password Hashing** در Shopify به صورت خودکار انجام می‌شود
4. **Customer Access Tokens** برای session management استفاده کنید

### Best Practices:

- ✅ از HTTPS استفاده کنید
- ✅ Environment variables را در production محافظت کنید
- ✅ Rate limiting اعمال کنید
- ✅ Error handling مناسب پیاده‌سازی کنید

## 🐛 **مشکلات رایج**

### 1. "Missing Admin API credentials"

**راه حل:** Admin API access token را در `.env.local` تنظیم کنید

### 2. "Customer with this email already exists"

**راه حل:** از email متفاوت استفاده کنید یا customer موجود را حذف کنید

### 3. "Invalid credentials"

**راه حل:** مطمئن شوید که customer در Shopify ایجاد شده است

### 4. "Failed to authenticate with Shopify"

**راه حل:** Storefront API access token را بررسی کنید

## 📞 **پشتیبانی**

اگر مشکلی دارید:

1. **Shopify Partners Documentation** را بررسی کنید
2. **API Response** را در Network tab بررسی کنید
3. **Environment Variables** را دوباره بررسی کنید
4. **Development Store** را reset کنید

## 🎯 **نتیجه**

پس از تکمیل این مراحل:

- ✅ کاربران واقعی می‌توانند ثبت‌نام کنند
- ✅ ورود با Shopify Storefront API انجام می‌شود
- ✅ Customer data در Shopify ذخیره می‌شود
- ✅ Session management امن است
- ✅ Order history واقعی کار می‌کند
- ✅ سیستم کاملاً production-ready است
- ✅ وضعیت Shopify connection در account page نمایش داده می‌شود
