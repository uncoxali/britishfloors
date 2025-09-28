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
    getProducts: async (first: number = 12, after?: string): Promise<ShopifyProductsResponse | null> => {
        try {
            // Pass the published status filter as part of the variables
            const variables = { first, after, query: "published_status:published" };
            const data = await shopifyClient.request(GET_PRODUCTS, variables);
            return data as ShopifyProductsResponse;
        } catch (error) {
            console.error('Error fetching products:', error);
            // Log more detailed error information
            if (error && typeof error === 'object' && 'response' in error) {
                console.error('Response error:', (error as { response?: unknown }).response);
            }
            if (error && typeof error === 'object' && 'request' in error) {
                console.error('Request error:', (error as { request?: unknown }).request);
            }
            // Return a more graceful fallback instead of throwing
            return null;
        }
    },

    // Get product by handle
    getProductByHandle: async (handle: string): Promise<{ product: ShopifyProduct | null }> => {
        try {
            const variables = { handle };
            const data = await shopifyClient.request(GET_PRODUCT_BY_HANDLE, variables);
            return data as { product: ShopifyProduct };
        } catch (error) {
            console.error('Error fetching product:', error);
            // Log more detailed error information
            if (error && typeof error === 'object' && 'response' in error) {
                console.error('Response error:', (error as { response?: unknown }).response);
            }
            if (error && typeof error === 'object' && 'request' in error) {
                console.error('Request error:', (error as { request?: unknown }).request);
            }
            // Return a more graceful fallback instead of throwing
            return { product: null };
        }
    },

    // Get collections
    getCollections: async (first: number = 10): Promise<ShopifyCollectionsResponse | null> => {
        try {
            const variables = { first };
            const data = await shopifyClient.request(GET_COLLECTIONS, variables);
            return data as ShopifyCollectionsResponse;
        } catch (error) {
            console.error('Error fetching collections:', error);
            return null;
        }
    },

    // Get collection by handle with products
    getCollectionByHandle: async (
        handle: string,
        first: number = 12,
        after?: string
    ): Promise<{ collection: ShopifyCollection | null }> => {
        try {
            const variables = { handle, first, after };
            const data = await shopifyClient.request(GET_COLLECTION_BY_HANDLE, variables) as { collection: ShopifyCollection };
            return data as { collection: ShopifyCollection };
        } catch (error) {
            console.error('Error fetching collection:', error);
            return { collection: null };
        }
    },

    // Search products
    searchProducts: async (query: string, first: number = 12, after?: string): Promise<ShopifyProductsResponse | null> => {
        try {
            console.log('Searching products with query:', query);
            // Combine the search query with the published status filter
            const combinedQuery = `${query} AND published_status:published`;
            const variables = { query: combinedQuery, first, after };
            console.log('GraphQL variables:', variables);
            const data = await shopifyClient.request(SEARCH_PRODUCTS, variables);
            console.log('Search products response:', data);
            return data as ShopifyProductsResponse;
        } catch (error) {
            console.error('Error searching products:', error);
            // Log more detailed error information
            if (error && typeof error === 'object' && 'response' in error) {
                console.error('Response error:', (error as { response?: unknown }).response);
            }
            if (error && typeof error === 'object' && 'request' in error) {
                console.error('Request error:', (error as { request?: unknown }).request);
            }
            if (error && typeof error === 'object' && 'message' in error) {
                console.error('Error message:', (error as { message?: unknown }).message);
            }
            // Return a more graceful fallback instead of throwing
            return null;
        }
    },

    // Get blogs
    getBlogs: async (first: number = 10, after?: string): Promise<ShopifyBlogsResponse | null> => {
        try {
            const variables = { first, after };
            const data = await shopifyClient.request(GET_BLOGS, variables);
            return data as ShopifyBlogsResponse;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            // Return a more graceful fallback instead of throwing
            return null;
        }
    },

    // Get articles
    getArticles: async (first: number = 10, after?: string): Promise<ShopifyArticlesResponse | null> => {
        try {
            const variables = { first, after };
            const data = await shopifyClient.request(GET_ARTICLES, variables);
            return data as ShopifyArticlesResponse;
        } catch (error) {
            console.error('Error fetching articles:', error);
            // Return a more graceful fallback instead of throwing
            return null;
        }
    },

    // Get blog by handle with articles
    getBlogByHandle: async (
        handle: string,
        first: number = 12,
        after?: string
    ): Promise<{ blog: ShopifyBlog | null }> => {
        try {
            const variables = { handle, first, after };
            const data = await shopifyClient.request(GET_BLOG_BY_HANDLE, variables);
            return data as { blog: ShopifyBlog };
        } catch (error) {
            console.error('Error fetching blog:', error);
            // Return a more graceful fallback instead of throwing
            return { blog: null };
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

    // Get products from the same collection (for "You May Also Like" section)
    getCollectionProducts: async (product: ShopifyProduct, limit: number = 4): Promise<ShopifyProduct[]> => {
        try {
            // Only get products from the same collection - no fallbacks
            if (product.collections && product.collections.edges.length > 0) {
                const validCollections = product.collections.edges;

                if (validCollections.length > 0) {
                    // Use the first valid collection (most relevant one for this product)
                    const collection = validCollections[0].node;

                    // Fetch products from the same collection
                    try {
                        const collectionResponse = await shopifyApi.getCollectionByHandle(collection.handle, limit + 5);

                        // Check if products exist in the response
                        if (collectionResponse.collection && collectionResponse.collection.products) {
                            // Get products and exclude the current product
                            const collectionProducts = collectionResponse.collection.products.edges
                                .map(edge => edge.node)
                                .filter(p => p.id !== product.id) // Exclude current product
                                .slice(0, limit); // Limit to requested number

                            return collectionProducts;
                        }
                    } catch (collectionError) {
                        console.error('Error fetching collection products:', collectionError);
                        // Return empty array if collection fetch fails
                        return [];
                    }
                }
            }

            // Return empty array if no collection data or no products found
            return [];
        } catch (error) {
            console.error('Error fetching collection products:', error);
            return [];
        }
    },

    // Get similar products from the same collection
    getSimilarProducts: async (product: ShopifyProduct, limit: number = 6): Promise<ShopifyProduct[]> => {
        try {
            // Try to get products from the same collection if the product belongs to any
            if (product.collections && product.collections.edges.length > 0) {
                const validCollections = product.collections.edges;

                if (validCollections.length > 0) {
                    // Prioritize collections based on relevance
                    // 1. Try collections with "featured" or "best" in title
                    // 2. Try collections with more products
                    // 3. Fall back to first collection

                    let selectedCollection = null;

                    // First, look for featured collections
                    const featuredCollections = validCollections.filter(edge =>
                        edge.node.title.toLowerCase().includes('featured') ||
                        edge.node.title.toLowerCase().includes('best')
                    );

                    if (featuredCollections.length > 0) {
                        selectedCollection = featuredCollections[0].node;
                    } else {
                        // If no featured collections, select the one with the most products
                        // For now, we'll use the first collection since we don't have product counts
                        selectedCollection = validCollections[0].node;
                    }

                    // Fetch products from the selected collection
                    try {
                        const collectionResponse = await shopifyApi.getCollectionByHandle(selectedCollection.handle, limit + 10);

                        // Check if products exist in the response
                        if (collectionResponse.collection && collectionResponse.collection.products) {
                            // Shuffle products to provide variety
                            const shuffledProducts = collectionResponse.collection.products.edges
                                .map(edge => edge.node)
                                .filter(p => p.id !== product.id) // Exclude current product
                                .sort(() => Math.random() - 0.5) // Shuffle array
                                .slice(0, limit);

                            if (shuffledProducts.length > 0) {
                                return shuffledProducts;
                            }
                        }
                    } catch (collectionError) {
                        console.error('Error fetching collection products:', collectionError);
                        // Continue to fallback methods
                    }
                }
            }

            // Fallback to search-based approach if no collection data or no products found
            try {
                const productTitle = product.title.toLowerCase();
                const searchTerms = productTitle.split(' ').slice(0, 2).join(' '); // Use first 2 words

                const response = await shopifyApi.searchProducts(searchTerms, limit + 3); // Get more to filter out current product
                // Check if we got a valid response
                if (response && response.products && response.products.edges) {
                    const similarProducts = response.products.edges
                        .map(edge => edge.node)
                        .filter(p => p.id !== product.id) // Exclude current product
                        .slice(0, limit);

                    return similarProducts;
                }
            } catch (searchError) {
                console.error('Error searching for similar products:', searchError);
            }

            return [];
        } catch (error) {
            console.error('Error fetching similar products:', error);
            return [];
        }
    },
}; 