import { useState, useEffect } from 'react';

interface InventoryCostData {
    success: boolean;
    productId?: string;
    productTitle?: string;
    variantId?: string;
    unitCost?: {
        amount: number;
        currencyCode: string;
    };
    error?: string;
    details?: unknown;
    suggestion?: string;
    solution?: string;
    requiredScopes?: string[];
    productFound?: boolean;
}

interface UseInventoryCostReturn {
    costPerItem: number | null;
    currencyCode: string | null;
    isLoading: boolean;
    error: string | null;
}

export function useInventoryCost(productId: string): UseInventoryCostReturn {
    const [costPerItem, setCostPerItem] = useState<number | null>(null);
    const [currencyCode, setCurrencyCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) {
            setCostPerItem(null);
            setCurrencyCode(null);
            setError(null);
            return;
        }

        const fetchInventoryCost = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Extract numeric ID from Shopify GID format
                const numericId = productId.includes('gid://shopify/Product/')
                    ? productId.split('/').pop()
                    : productId;

                console.log('Fetching inventory cost for product ID:', numericId);

                const response = await fetch(`/api/admin/inventory-cost?productId=${numericId}`);
                const data: InventoryCostData = await response.json();

                console.log('Inventory cost response:', data);

                if (!response.ok) {
                    // Handle different error types
                    if (response.status === 404) {
                        console.warn('Unit cost not available:', data.error);
                        setCostPerItem(null);
                        setCurrencyCode(null);
                        setError(null); // Don't show error for missing cost data
                        return;
                    }

                    if (response.status === 403) {
                        console.warn('Permission error:', data.error);
                        if (data.solution) {
                            console.warn('Solution:', data.solution);
                        }
                        if (data.requiredScopes) {
                            console.warn('Required scopes:', data.requiredScopes);
                        }
                        setCostPerItem(null);
                        setCurrencyCode(null);

                        // Show specific error for missing scopes
                        if (data.error?.includes('read_products')) {
                            setError('Missing read_products scope in Admin API token');
                        } else if (data.error?.includes('read_inventory')) {
                            setError('Missing read_inventory scope in Admin API token');
                        } else {
                            setError('Admin API permission error');
                        }
                        return;
                    }

                    throw new Error(data.error || `HTTP ${response.status}`);
                }

                if (data.success && data.unitCost) {
                    console.log('Setting inventory cost:', data.unitCost.amount);
                    setCostPerItem(data.unitCost.amount);
                    setCurrencyCode(data.unitCost.currencyCode);
                } else {
                    console.warn('No valid unit cost in response');
                    setCostPerItem(null);
                    setCurrencyCode(null);
                }
            } catch (err) {
                console.error('Error fetching inventory cost:', err);
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                setCostPerItem(null);
                setCurrencyCode(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventoryCost();
    }, [productId]);

    return {
        costPerItem,
        currencyCode,
        isLoading,
        error,
    };
}