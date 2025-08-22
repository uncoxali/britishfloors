# Shopify Setup Guide

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```bash
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token

# Environment
NODE_ENV=development
```

## How to Get Shopify Credentials

### 1. Store Domain

- Your Shopify store URL (e.g., `mystore.myshopify.com`)

### 2. Storefront Access Token

- Go to Shopify Admin → Settings → Apps and sales channels
- Click on "Develop apps"
- Create a new app or select existing one
- Go to "Configuration" → "Storefront API"
- Generate a new access token with required scopes:
  - `unauthenticated_read_product_listings`
  - `unauthenticated_read_product_inventory`
  - `unauthenticated_read_selling_plans`
  - `unauthenticated_read_checkouts`
  - `unauthenticated_write_checkouts`

### 3. Admin Access Token

- In the same app, go to "Configuration" → "Admin API"
- Generate a new access token with required scopes:
  - `read_customers`
  - `write_customers`
  - `read_orders`
  - `write_orders`

## Checkout Behavior

### With Shopify Credentials (Development & Production)

- Creates real Shopify checkout session
- Redirects user to Shopify checkout page
- Full Shopify integration with payment processing

### Without Shopify Credentials (Mock Mode)

- Creates simulated checkout for testing
- Redirects to cart page with success message
- Useful for development without Shopify setup

## Testing Checkout

1. Add products to cart
2. Sign in to your account
3. Click "Proceed to Checkout"
4. The system will:
   - If credentials are set: Redirect to Shopify checkout
   - If credentials are missing: Show mock checkout success

## Development vs Production

- **Development Mode**: Can use Shopify checkout if credentials are set
- **Production Mode**: Should always have Shopify credentials set
- **Mock Mode**: Only used when no Shopify credentials are available

## Troubleshooting

### Checkout not redirecting to Shopify

- Verify environment variables are set correctly
- Check browser console for errors
- Ensure Shopify store domain is correct
- Verify access tokens have correct permissions

### API Errors

- Check Shopify API response in console
- Verify product variant IDs exist in Shopify
- Ensure store is active and accessible

### Development Mode Issues

- Even in development, Shopify checkout works if credentials are set
- Mock mode only activates when credentials are completely missing
- Check `.env.local` file exists and has correct values
