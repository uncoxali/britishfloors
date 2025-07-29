import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/types/shopify';

interface WishlistStore {
    items: ShopifyProduct[];
    addItem: (product: ShopifyProduct) => void;
    removeItem: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product: ShopifyProduct) => {
                const { items } = get();
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

            isInWishlist: (productId: string) => {
                const { items } = get();
                return items.some(item => item.id === productId);
            },

            clearWishlist: () => {
                set({ items: [] });
            },

            getWishlistCount: () => {
                const { items } = get();
                return items.length;
            },
        }),
        {
            name: 'wishlist-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
); 