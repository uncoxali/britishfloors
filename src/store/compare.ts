import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/types/shopify';

interface CompareStore {
    items: ShopifyProduct[];
    maxItems: number;
    addItem: (product: ShopifyProduct) => void;
    removeItem: (productId: string) => void;
    isInCompare: (productId: string) => boolean;
    clearCompare: () => void;
    getCompareCount: () => number;
    getMaxItems: () => number;
}

export const useCompareStore = create<CompareStore>()(
    persist(
        (set, get) => ({
            items: [],
            maxItems: 4,

            addItem: (product: ShopifyProduct) => {
                const { items, maxItems } = get();
                if (items.length >= maxItems) {
                    return; // Max items reached
                }
                if (!items.find(item => item.id === product.id)) {
                    set(state => ({
                        items: [...state.items, product],
                    }));
                }
            },

            removeItem: (productId: string) => {
                set(state => ({
                    items: state.items.filter(item => item.id !== productId),
                }));
            },

            isInCompare: (productId: string) => {
                const { items } = get();
                return items.some(item => item.id === productId);
            },

            clearCompare: () => {
                set({ items: [] });
            },

            getCompareCount: () => {
                const { items } = get();
                return items.length;
            },

            getMaxItems: () => {
                const { maxItems } = get();
                return maxItems;
            },
        }),
        {
            name: 'compare-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
); 