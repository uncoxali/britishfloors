// Shopify API Types
export interface ShopifyImage {
    id: string;
    url: string;
    altText?: string;
    width: number;
    height: number;
}

export interface ShopifyMoney {
    amount: string;
    currencyCode: string;
}

export interface ShopifyPriceRange {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
}

export interface ShopifySelectedOption {
    name: string;
    value: string;
}

export interface ShopifyMetafield {
    id?: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
}

export interface ShopifyCollection {
    id: string;
    title: string;
    handle: string;
    description: string;
    image?: ShopifyImage;
    metafields?: ShopifyMetafield[] | null;
    products?: {
        pageInfo: ShopifyPageInfo;
        edges: Array<{
            node: ShopifyProduct;
        }>;
    };
}

export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml?: string;
    tags?: string[];
    priceRange: ShopifyPriceRange;
    compareAtPriceRange?: ShopifyPriceRange;
    images: {
        edges: Array<{
            node: ShopifyImage;
        }>;
    };
    variants: {
        edges: Array<{
            node: ShopifyProductVariant;
        }>;
    };
    options?: ShopifyProductOption[];
    metafields?: ShopifyMetafield[] | null;
    costPerItem?: {
        namespace: string;
        key: string;
        value: string;
        type: string;
    } | null;
    specifications?: {
        reference?: {
            id: string;
            type?: string;
            fields: Array<{
                key: string;
                value: string;
            }>;
        };
        references?: {
            nodes: Array<{
                id: string;
                type?: string;
                fields: Array<{
                    key: string;
                    value: string;
                }>;
            }>;
        };
    } | null;
    dimensions?: {
        reference?: {
            id: string;
            type?: string;
            fields: Array<{
                key: string;
                value: string;
            }>;
        };
        references?: {
            nodes: Array<{
                id: string;
                type?: string;
                fields: Array<{
                    key: string;
                    value: string;
                }>;
            }>;
        };
    } | null;
    collections?: {
        edges: Array<{
            node: ShopifyCollection;
        }>;
    };
    roomSuitability?: {
        namespace: string;
        key: string;
        value: string;
        type: string;
        reference?: {
            id: string;
            type?: string;
            fields: Array<{
                key: string;
                value: string;
            }>;
        };
        references?: {
            nodes: Array<{
                id: string;
                type?: string;
                fields: Array<{
                    key: string;
                    value: string;
                }>;
            }>;
        };
    } | null;
}

// Room Suitability Types
export interface RoomSuitabilityTag {
    id: string;
    name: string;
    icon: string;
    category: 'room' | 'feature';
}

export interface RoomSuitabilityData {
    rooms: RoomSuitabilityTag[];
    features: RoomSuitabilityTag[];
}

export interface ShopifyPageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}

export interface ShopifyProductsResponse {
    products: {
        pageInfo: ShopifyPageInfo;
        edges: Array<{
            node: ShopifyProduct;
        }>;
    };
}

export interface ShopifyCollectionsResponse {
    collections: {
        edges: Array<{
            node: ShopifyCollection;
        }>;
    };
}

// Blog Types
export interface ShopifyBlog {
    id: string;
    title: string;
    handle: string;
    description?: string;
    image?: ShopifyImage;
    articles?: {
        pageInfo: ShopifyPageInfo;
        edges: Array<{
            node: ShopifyArticle;
        }>;
    };
}

export interface ShopifyArticle {
    id: string;
    title: string;
    handle: string;
    excerpt?: string;
    content?: string;
    contentHtml?: string;
    publishedAt: string;
    image?: ShopifyImage;
    author?: {
        name: string;
    };
    tags?: string[];
}

export interface ShopifyBlogsResponse {
    blogs: {
        pageInfo: ShopifyPageInfo;
        edges: Array<{
            node: ShopifyBlog;
        }>;
    };
}

export interface ShopifyArticlesResponse {
    articles: {
        pageInfo: ShopifyPageInfo;
        edges: Array<{
            node: ShopifyArticle;
        }>;
    };
}

// Cart Types
export interface CartItem {
    id: string;
    variantId: string;
    productId: string;
    title: string;
    handle: string;
    variantTitle: string;
    price: ShopifyMoney;
    quantity: number;
    image?: ShopifyImage;
    availableForSale: boolean;
    isSample?: boolean;
    type?: 'main' | 'sample';
}

export interface Cart {
    items: CartItem[];
    totalQuantity: number;
    subtotal: ShopifyMoney;
    total: ShopifyMoney;
}

// API Response Types
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    loading?: boolean;
}

export interface ShopifyProductVariant {
    id: string;
    title: string;
    price: ShopifyMoney;
    compareAtPrice?: ShopifyMoney;
    availableForSale: boolean;
    selectedOptions?: ShopifySelectedOption[];
}

export interface ShopifyProductOption {
    id: string;
    name: string;
    values: string[];
}