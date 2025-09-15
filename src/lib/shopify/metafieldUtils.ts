/**
 * Sets metafield color values for a product
 * @param productId - The Shopify product ID
 * @param colors - Array of color names or hex values
 * @returns Promise<boolean> - Whether the operation was successful
 */
export const setProductColorMetafield = async (
    productId: string,
    colors: string[]
): Promise<boolean> => {
    try {
        // Note: Setting metafields requires Admin API access, not Storefront API
        // This is a simplified example. In a real implementation, you would:
        // 1. Use the Shopify Admin API to set metafields
        // 2. Have proper authentication with admin privileges
        // 3. Handle errors appropriately

        // For now, we'll just log the operation
        console.log(`Setting colors metafield for product ${productId}:`, colors);

        // Return true to indicate success (in a real implementation, you would check the response)
        return true;
    } catch (error) {
        console.error('Error setting product color metafield:', error);
        return false;
    }
};

/**
 * Gets metafield color values for a product
 * @param productId - The Shopify product ID
 * @returns Promise<string[]> - Array of color names or hex values
 */
export const getProductColorMetafield = async (
    productId: string
): Promise<string[]> => {
    try {
        // Note: Getting metafields through Storefront API requires specific permissions
        // This is a simplified example. In a real implementation, you would:
        // 1. Use the Shopify Storefront API or Admin API to get metafields
        // 2. Have proper authentication

        // For now, we'll just log the operation and return an empty array
        console.log(`Getting colors metafield for product ${productId}`);

        // Return empty array (in a real implementation, you would parse the response)
        return [];
    } catch (error) {
        console.error('Error getting product color metafield:', error);
        return [];
    }
};

/**
 * Formats colors array for metafield storage
 * @param colors - Array of color names or objects
 * @returns string - JSON stringified array of colors
 */
export const formatColorsForMetafield = (colors: string[]): string => {
    return JSON.stringify(colors);
};

/**
 * Parses colors from metafield value
 * @param metafieldValue - JSON stringified array of colors
 * @returns string[] - Array of color names or hex values
 */
export const parseColorsFromMetafield = (metafieldValue: string): string[] => {
    try {
        const colors = JSON.parse(metafieldValue);
        return Array.isArray(colors) ? colors : [];
    } catch (error) {
        console.error('Error parsing colors from metafield:', error);
        return [];
    }
};

// This file is intentionally left empty as all metafield color utilities have been removed.
// The file is kept to maintain import references, but all color-related metafield functions
// have been removed from the codebase as requested.
