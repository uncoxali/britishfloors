# Shopify API Authentication Setup

## 🔧 **Step 1: Shopify Partner Account Setup**

1. **Create a Shopify Partner Account:**

   - Go to [partners.shopify.com](https://partners.shopify.com)
   - Sign up for a free partner account

2. **Create a Development Store:**
   - In your partner dashboard, click "Stores" → "Add store"
   - Choose "Development store"
   - Fill in store details and create

## 🔑 **Step 2: Get API Credentials**

### **Storefront API (for customer-facing features):**

1. Go to your development store admin
2. Navigate to **Settings** → **Apps and sales channels**
3. Click **Develop apps**
4. Create a new app
5. Go to **Configuration** → **Storefront API**
6. Enable the required scopes:
   - `read_products`
   - `read_collections`
   - `read_customers`
   - `write_customers`
   - `read_orders`
   - `write_orders`
7. Copy the **Storefront access token**

### **Admin API (for backend operations):**

1. In the same app, go to **Configuration** → **Admin API access scopes**
2. Enable the required scopes:
   - `read_products`
   - `write_products`
   - `read_customers`
   - `write_customers`
   - `read_orders`
   - `write_orders`
3. Install the app in your store
4. Copy the **Admin access token**

## 📝 **Step 3: Environment Variables**

Create a `.env.local` file in your project root with:

```env
# Shopify Store Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key

# For development, you can generate a secret with:
# openssl rand -base64 32
```

## 🚀 **Step 4: Test the Setup**

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Test Authentication:**
   - Go to `/auth/register` to create an account
   - Go to `/auth/login` to sign in
   - Use these test credentials:
     - Email: `demo@example.com`
     - Password: `password123`

## 🔐 **Step 5: Real Shopify Integration**

To integrate with real Shopify customers:

1. **Update the validation API** (`src/app/api/auth/validate/route.ts`):

   ```typescript
   // Replace mock validation with Shopify customer API calls
   const response = await fetch(
     `${SHOPIFY_ADMIN_API_URL}/customers/search.json?query=email:${email}`,
     {
       headers: {
         'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
         'Content-Type': 'application/json',
       },
     },
   );
   ```

2. **Update the registration API** (`src/app/api/auth/register/route.ts`):
   ```typescript
   // Create customer in Shopify
   const response = await fetch(`${SHOPIFY_ADMIN_API_URL}/customers.json`, {
     method: 'POST',
     headers: {
       'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       customer: {
         first_name: firstName,
         last_name: lastName,
         email: email,
         password: password,
         password_confirmation: password,
       },
     }),
   });
   ```

## 🛡️ **Security Considerations**

1. **Never expose API keys** in client-side code
2. **Use environment variables** for all sensitive data
3. **Implement proper password hashing** in production
4. **Add rate limiting** to authentication endpoints
5. **Use HTTPS** in production

## 📚 **Additional Resources**

- [Shopify Storefront API Documentation](https://shopify.dev/docs/storefront-api)
- [Shopify Admin API Documentation](https://shopify.dev/docs/admin-api)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## 🎯 **Current Features**

✅ **Authentication System:**

- User registration
- User login/logout
- Session management
- Protected routes

✅ **Shopify Integration:**

- Product fetching
- Collection browsing
- Cart management
- Wishlist functionality

✅ **Ready for Production:**

- Environment configuration
- API route structure
- Error handling
- TypeScript support
