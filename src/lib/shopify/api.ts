import shopifyClient from './client';
import {
    GET_PRODUCTS,
    GET_PRODUCT_BY_HANDLE,
    GET_COLLECTIONS,
    GET_COLLECTION_BY_HANDLE,
    SEARCH_PRODUCTS,
    GET_BLOGS,
    GET_ARTICLES,
    GET_BLOG_BY_HANDLE,
} from './queries';
import {
    ShopifyProductsResponse,
    ShopifyCollectionsResponse,
    ShopifyProduct,
    ShopifyCollection,
    ShopifyBlogsResponse,
    ShopifyArticlesResponse,
    ShopifyBlog,
    ShopifyArticle,
} from '@/lib/types/shopify';

export const shopifyApi = {
    // Get products with pagination
    getProducts: async (first: number = 12, after?: string): Promise<ShopifyProductsResponse> => {
        try {
            const variables = { first, after };
            const data = await shopifyClient.request(GET_PRODUCTS, variables);
            return data as ShopifyProductsResponse;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products');
        }
    },

    // Get product by handle
    getProductByHandle: async (handle: string): Promise<{ product: ShopifyProduct }> => {
        try {
            const variables = { handle };
            const data = await shopifyClient.request(GET_PRODUCT_BY_HANDLE, variables);
            return data as { product: ShopifyProduct };
        } catch (error) {
            console.error('Error fetching product:', error);
            throw new Error('Failed to fetch product');
        }
    },

    // Get collections
    getCollections: async (first: number = 10): Promise<ShopifyCollectionsResponse> => {
        try {
            const variables = { first };
            const data = await shopifyClient.request(GET_COLLECTIONS, variables);
            return data as ShopifyCollectionsResponse;
        } catch (error) {
            console.error('Error fetching collections:', error);
            throw new Error('Failed to fetch collections');
        }
    },

    // Get collection by handle with products
    getCollectionByHandle: async (
        handle: string,
        first: number = 12,
        after?: string
    ): Promise<{ collection: ShopifyCollection }> => {
        try {
            const variables = { handle, first, after };
            const data = await shopifyClient.request(GET_COLLECTION_BY_HANDLE, variables);
            return data as { collection: ShopifyCollection };
        } catch (error) {
            console.error('Error fetching collection:', error);
            throw new Error('Failed to fetch collection');
        }
    },

    // Search products
    searchProducts: async (query: string, first: number = 12, after?: string): Promise<ShopifyProductsResponse> => {
        try {
            const variables = { query, first, after };
            const data = await shopifyClient.request(SEARCH_PRODUCTS, variables);
            return data as ShopifyProductsResponse;
        } catch (error) {
            console.error('Error searching products:', error);
            throw new Error('Failed to search products');
        }
    },

    // Get blogs
    getBlogs: async (first: number = 10, after?: string): Promise<ShopifyBlogsResponse> => {
        try {
            const variables = { first, after };
            const data = await shopifyClient.request(GET_BLOGS, variables);
            return data as ShopifyBlogsResponse;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw new Error('Failed to fetch blogs');
        }
    },

    // Get articles
    getArticles: async (first: number = 10, after?: string): Promise<ShopifyArticlesResponse> => {
        try {
            const variables = { first, after };
            const data = await shopifyClient.request(GET_ARTICLES, variables);
            return data as ShopifyArticlesResponse;
        } catch (error) {
            console.error('Error fetching articles:', error);
            throw new Error('Failed to fetch articles');
        }
    },

    // Get blog by handle with articles
    getBlogByHandle: async (
        handle: string,
        first: number = 12,
        after?: string
    ): Promise<{ blog: ShopifyBlog }> => {
        try {
            const variables = { handle, first, after };
            const data = await shopifyClient.request(GET_BLOG_BY_HANDLE, variables);
            return data as { blog: ShopifyBlog };
        } catch (error) {
            console.error('Error fetching blog:', error);
            throw new Error('Failed to fetch blog');
        }
    },

    // Get article by handle with full content
    getArticleByHandle: async (handle: string): Promise<{ article: ShopifyArticle | null }> => {
        try {
            console.log(`Fetching article with handle: ${handle}`);
            // Fetch all articles and find the one with matching handle
            const response = await shopifyApi.getArticlesWithContent(100);
            const articles = response.articles.edges.map((edge) => edge.node);
            console.log(`Found ${articles.length} articles total`);
            
            const article = articles.find((article) => article.handle === handle);
            
            if (article) {
                console.log(`Found article: ${article.title}`);
                return { article };
            } else {
                console.log(`No article found with handle: ${handle}`);
                console.log('Available article handles:', articles.map(a => a.handle));
                return { article: null };
            }
        } catch (error) {
            console.error('Error fetching article by handle:', error);
            return { article: null };
        }
    },

    // Get articles with full content for blogs page
    getArticlesWithContent: async (first: number = 10, after?: string): Promise<ShopifyArticlesResponse> => {
        try {
            const variables = { first, after };
            const data = await shopifyClient.request(GET_ARTICLES, variables);
            return data as ShopifyArticlesResponse;
        } catch (error) {
            console.error('Error fetching articles with content:', error);
            throw new Error('Failed to fetch articles with content');
        }
    },
}; 