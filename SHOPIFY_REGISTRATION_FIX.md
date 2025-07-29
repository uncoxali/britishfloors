# Shopify Registration Fix Guide

## 🚨 **مشکل: "Failed to create customer in Shopify"**

### 🔍 **تشخیص مشکل:**

1. **Shopify credentials تنظیم نشده‌اند**
2. **Admin API permissions ناقص هستند**
3. **Development store درست setup نشده**
4. **Environment variables درست load نمی‌شوند**

## 🛠️ **راه‌حل‌ها:**

### **راه‌حل 1: تست اتصال Shopify**

به این آدرس بروید و تست کنید:

```
http://localhost:3000/debug/shopify
```

این صفحه موارد زیر را تست می‌کند:

- ✅ Environment variables
- ✅ Admin API connection
- ✅ Customer API permissions
- ✅ Customer creation capability

### **راه‌حل 2: تنظیم Shopify Credentials**

#### **مرحله 1: ایجاد Shopify Partner Account**

1. به [Shopify Partners](https://partners.shopify.com) بروید
2. ثبت‌نام کنید
3. یک development store ایجاد کنید

#### **مرحله 2: ایجاد Private App**

1. **Development Store** → Settings → Apps and sales channels
2. **Develop apps** → Create an app
3. **App name:** British Floors Authentication
4. **Admin API integration** → Configure
5. **API access scopes:**
   - `read_customers`
   - `write_customers`
   - `read_orders`
   - `write_orders`
6. **Install app** → Admin API access token را کپی کنید

#### **مرحله 3: تنظیم Environment Variables**

فایل `.env.local` را به‌روزرسانی کنید:

```env
# Shopify Store Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_admin_access_token_here

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-for-development
```

### **راه‌حل 3: Fallback Mode (Development)**

اگر Shopify credentials ندارید، سیستم به صورت خودکار fallback mode استفاده می‌کند:

- ✅ کاربران می‌توانند ثبت‌نام کنند
- ✅ Mock data استفاده می‌شود
- ✅ برای development مناسب است

### **راه‌حل 4: Restart Server**

بعد از تغییر environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## 🔧 **Debug Steps:**

### **Step 1: Check Environment Variables**

```bash
# در terminal پروژه:
echo $NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
echo $SHOPIFY_ADMIN_ACCESS_TOKEN
```

### **Step 2: Test API Connection**

```bash
curl -H "X-Shopify-Access-Token: YOUR_TOKEN" \
     https://YOUR_STORE.myshopify.com/admin/api/2024-01/shop.json
```

### **Step 3: Check Network Tab**

1. Developer Tools → Network
2. Try to register
3. Check the API response

## 🐛 **مشکلات رایج:**

### **1. "Missing Shopify credentials"**

**راه‌حل:** Environment variables را در `.env.local` تنظیم کنید

### **2. "401 Unauthorized"**

**راه‌حل:** Admin API access token را بررسی کنید

### **3. "403 Forbidden"**

**راه‌حل:** API permissions را بررسی کنید

### **4. "404 Not Found"**

**راه‌حل:** Store domain را بررسی کنید

## 📋 **Checklist:**

- [ ] Shopify Partner account ایجاد شده
- [ ] Development store ساخته شده
- [ ] Private app ایجاد شده
- [ ] Admin API permissions تنظیم شده
- [ ] Admin API access token کپی شده
- [ ] Environment variables در `.env.local` تنظیم شده
- [ ] Server restart شده
- [ ] Debug page تست شده

## 🎯 **نتیجه:**

پس از تکمیل این مراحل:

- ✅ Registration کار می‌کند
- ✅ Login کار می‌کند
- ✅ Customer data در Shopify ذخیره می‌شود
- ✅ سیستم production-ready است

## 📞 **پشتیبانی:**

اگر مشکل حل نشد:

1. **Debug page** را بررسی کنید
2. **Network tab** را چک کنید
3. **Console errors** را بررسی کنید
4. **Shopify documentation** را مطالعه کنید
