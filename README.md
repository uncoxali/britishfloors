# British Floors - Next.js E-commerce

A premium flooring e-commerce store built with Next.js 14, TypeScript, and Shopify Storefront API.

## Features

- 🛍️ **Flooring Catalog**: Browse premium flooring products with pagination and search
- 🎯 **Product Details**: View detailed flooring information with variant selection
- 🛒 **Shopping Cart**: Add/remove items, update quantities, persistent cart
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ⚡ **Performance**: Server-side rendering and optimized images
- 🔍 **Search**: Product search functionality
- 🎨 **Modern UI**: Clean, modern interface with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API**: Shopify Storefront API (GraphQL)
- **HTTP Client**: graphql-request
- **Animations**: Framer Motion
- **Image Optimization**: Sharp

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn**
3. **Shopify Partner Account** with a development store
4. **Storefront API Access Token**

## Shopify Setup

### 1. Create Shopify Partner Account

- Go to [Shopify Partners](https://partners.shopify.com)
- Create a new partner account or sign in

### 2. Create Development Store

- In your partner dashboard, click "Stores" → "Add store"
- Choose "Development store"
- Fill in the required information

### 3. Enable Storefront API

- Go to your development store admin
- Navigate to Settings → Apps and sales channels
- Click "Develop apps"
- Create a new app
- Under "Configuration", enable "Storefront API"
- Set the required scopes:
  - `read_products`
  - `read_collections`
  - `read_product_listings`
  - `read_inventory`

### 4. Get Access Token

- In your app settings, go to "API credentials"
- Generate a "Storefront API access token"
- Copy the token for use in your environment variables

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shopify-store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
   SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── products/          # Product pages
│   │   └── [handle]/      # Individual product pages
│   ├── cart/              # Shopping cart page
│   └── collections/       # Collection pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── product/          # Product-related components
│   ├── cart/             # Cart components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── shopify/          # Shopify API integration
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── hooks/                # Custom React hooks
└── store/                # State management (Zustand)
```

## Key Components

### Shopify Integration

- **`src/lib/shopify/client.ts`**: GraphQL client configuration
- **`src/lib/shopify/queries.ts`**: GraphQL queries for products, collections
- **`src/lib/shopify/api.ts`**: API service functions

### State Management

- **`src/store/cart.ts`**: Cart state management with Zustand
- Persistent cart storage using localStorage

### Components

- **`ProductCard`**: Product display component
- **`Header`**: Navigation with cart indicator
- **`Layout`**: Page layout wrapper
- **`Button`**: Reusable button component

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable                                      | Description                 | Required |
| --------------------------------------------- | --------------------------- | -------- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`            | Your Shopify store domain   | Yes      |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token | Yes      |
| `SHOPIFY_ADMIN_ACCESS_TOKEN`                  | Admin API access token      | No       |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Customization

### Styling

- Modify Tailwind classes in components
- Update color scheme in `tailwind.config.js`
- Add custom CSS in `src/app/globals.css`

### Shopify Configuration

- Update GraphQL queries in `src/lib/shopify/queries.ts`
- Modify API functions in `src/lib/shopify/api.ts`
- Add new product fields as needed

### Features

- Add authentication with Shopify Customer API
- Implement discount codes
- Add product reviews
- Integrate with Shopify Analytics

## Troubleshooting

### Common Issues

1. **"Missing Shopify environment variables"**

   - Ensure all required environment variables are set
   - Check that the store domain is correct

2. **"Failed to fetch products"**

   - Verify your Storefront API access token
   - Check that your store has products published
   - Ensure the API scopes are correctly set

3. **Cart not persisting**
   - Check browser localStorage settings
   - Ensure Zustand persist middleware is working

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Check the [Shopify Storefront API documentation](https://shopify.dev/docs/storefront-api)
- Review [Next.js documentation](https://nextjs.org/docs)
- Open an issue in this repository

## Roadmap

- [ ] Customer authentication
- [ ] Order history
- [ ] Wishlist functionality
- [ ] Product reviews
- [ ] Advanced filtering
- [ ] Multi-language support
- [ ] PWA features
- [ ] Analytics integration
# britishfloors
# britishfloors
# britishfloors
