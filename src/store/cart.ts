import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, ShopifyMoney, ShopifyProduct, ShopifyProductVariant } from '@/lib/types/shopify';

interface CartStore {
    items: CartItem[];
    totalQuantity: number;
    subtotal: ShopifyMoney;
    total: ShopifyMoney;
    discountCode?: string;
    discountAmount: number;
    addItem: (product: ShopifyProduct, variant: ShopifyProductVariant, quantity?: number) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    applyDiscount: (code: string) => void;
    removeDiscount: () => void;
    calculateTotals: () => void;
}

const calculateMoney = (amount1: string, amount2: string): string => {
    return (parseFloat(amount1) + parseFloat(amount2)).toFixed(2);
};

const multiplyMoney = (amount: string, multiplier: number): string => {
    return (parseFloat(amount) * multiplier).toFixed(2);
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalQuantity: 0,
            subtotal: { amount: '0.00', currencyCode: 'USD' },
            total: { amount: '0.00', currencyCode: 'USD' },
            discountCode: undefined,
            discountAmount: 0,

            addItem: (product: ShopifyProduct, variant: ShopifyProductVariant, quantity = 1) => {
                const { items } = get();
                const existingItem = items.find(item => item.variantId === variant.id);

                if (existingItem) {
                    // Update existing item quantity
                    get().updateQuantity(variant.id, existingItem.quantity + quantity);
                } else {
                    // Add new item
                    const newItem: CartItem = {
                        id: `${product.id}-${variant.id}`,
                        variantId: variant.id,
                        productId: product.id,
                        title: product.title,
                        handle: product.handle,
                        variantTitle: variant.title,
                        price: variant.price,
                        quantity,
                        image: product.images.edges[0]?.node,
                        availableForSale: variant.availableForSale,
                    };

                    set(state => ({
                        items: [...state.items, newItem],
                    }));
                }

                get().calculateTotals();
            },

            removeItem: (variantId: string) => {
                set(state => ({
                    items: state.items.filter(item => item.variantId !== variantId),
                }));
                get().calculateTotals();
            },

            updateQuantity: (variantId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(variantId);
                    return;
                }

                set(state => ({
                    items: state.items.map(item =>
                        item.variantId === variantId ? { ...item, quantity } : item
                    ),
                }));
                get().calculateTotals();
            },

            clearCart: () => {
                set({
                    items: [],
                    totalQuantity: 0,
                    subtotal: { amount: '0.00', currencyCode: 'USD' },
                    total: { amount: '0.00', currencyCode: 'USD' },
                    discountCode: undefined,
                    discountAmount: 0,
                });
            },

            applyDiscount: (code: string) => {
                const { subtotal } = get();
                const discountPercentages: { [key: string]: number } = {
                    'SAVE10': 0.10,
                    'WELCOME20': 0.20,
                    'FLOORING15': 0.15,
                };

                const discountPercentage = discountPercentages[code.toUpperCase()];
                if (discountPercentage) {
                    const discountAmount = parseFloat(subtotal.amount) * discountPercentage;
                    set({
                        discountCode: code.toUpperCase(),
                        discountAmount,
                    });
                    get().calculateTotals();
                }
            },

            removeDiscount: () => {
                set({
                    discountCode: undefined,
                    discountAmount: 0,
                });
                get().calculateTotals();
            },

            calculateTotals: () => {
                const { items } = get();
                let totalQuantity = 0;
                let subtotalAmount = '0.00';
                let currencyCode = 'GBP';

                items.forEach(item => {
                    totalQuantity += item.quantity;
                    subtotalAmount = calculateMoney(subtotalAmount, multiplyMoney(item.price.amount, item.quantity));
                    currencyCode = item.price.currencyCode;
                });

                const { discountAmount } = get();
                const totalAmount = parseFloat(subtotalAmount) - discountAmount;

                set({
                    totalQuantity,
                    subtotal: { amount: subtotalAmount, currencyCode },
                    total: { amount: totalAmount.toFixed(2), currencyCode },
                });

                // Return the calculated values
                return {
                    subtotal: parseFloat(subtotalAmount),
                    tax: parseFloat(subtotalAmount) * 0.20, // 20% VAT for UK
                    total: totalAmount,
                };
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
); 