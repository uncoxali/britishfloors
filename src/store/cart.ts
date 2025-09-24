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
    addItem: (product: ShopifyProduct, variant: ShopifyProductVariant, quantity?: number, isSample?: boolean) => void;
    removeItem: (variantId: string, isSample?: boolean) => void;
    updateQuantity: (variantId: string, quantity: number, isSample?: boolean) => void;
    clearCart: () => void;
    applyDiscount: (code: string) => void;
    removeDiscount: () => void;
    calculateTotals: () => void;
    validateCart: () => { isValid: boolean; errors: string[] };
    isProductInCart: (productId: string, isSample?: boolean) => boolean;
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

            addItem: (product: ShopifyProduct, variant: ShopifyProductVariant, quantity = 1, isSample?: boolean) => {
                const { items } = get();
                const isActuallySample = isSample === true;
                const itemType = isActuallySample ? 'sample' : 'main';
                const existingItem = items.find(item =>
                    item.variantId === variant.id &&
                    item.isSample === isActuallySample
                );

                if (existingItem) {
                    // Update existing item quantity
                    get().updateQuantity(variant.id, existingItem.quantity + quantity, isActuallySample);
                } else {
                    // Validate product and variant data before adding
                    if (!product.id || !variant.id || !variant.price?.amount) {
                        console.error('Invalid product or variant data:', { product, variant });
                        return;
                    }

                    // For samples, try to find a sample variant from options
                    let selectedVariant = variant;
                    let itemPrice = variant.price;

                    if (isActuallySample) {
                        console.log('Looking for sample variant in product options:', product.options);
                        console.log('Available variants:', product.variants.edges.map(edge => ({
                            id: edge.node.id,
                            title: edge.node.title,
                            selectedOptions: edge.node.selectedOptions
                        })));

                        // Look for sample option in product options
                        const sampleOption = product.options?.find(option =>
                            option.name.toLowerCase().includes('type') ||
                            option.name.toLowerCase().includes('variant') ||
                            option.name.toLowerCase().includes('style')
                        );

                        console.log('Found sample option:', sampleOption);

                        if (sampleOption && sampleOption.values.some(value => value.toLowerCase().includes('sample'))) {
                            // Find variant with sample option
                            const sampleVariant = product.variants.edges.find(edge =>
                                edge.node.selectedOptions?.some(option =>
                                    option.name === sampleOption.name &&
                                    option.value.toLowerCase().includes('sample')
                                )
                            );

                            console.log('Found sample variant:', sampleVariant);

                            if (sampleVariant) {
                                selectedVariant = sampleVariant.node;
                                itemPrice = sampleVariant.node.price;
                                console.log('Using sample variant with price:', itemPrice);
                            }
                        }

                        // Always use minVariantPrice for samples to ensure consistent pricing
                        if (product.priceRange?.minVariantPrice) {
                            itemPrice = product.priceRange.minVariantPrice;
                            console.log('Using minVariantPrice for sample:', itemPrice);
                        }
                    }

                    // Add new item
                    const newItem: CartItem = {
                        id: `${product.id}-${selectedVariant.id}${isActuallySample ? '-sample' : ''}`,
                        variantId: selectedVariant.id,
                        productId: product.id,
                        title: product.title || 'Unknown Product',
                        handle: product.handle || '',
                        variantTitle: isActuallySample ? 'Sample' : (selectedVariant.title || 'Default Variant'),
                        price: itemPrice,
                        quantity,
                        image: product.images.edges[0]?.node,
                        availableForSale: selectedVariant.availableForSale,
                        isSample: isActuallySample,
                        type: itemType,
                    };

                    set(state => ({
                        items: [...state.items, newItem],
                    }));
                }

                get().calculateTotals();
            },

            removeItem: (variantId: string, isSample?: boolean) => {
                set(state => ({
                    items: state.items.filter(item =>
                        !(item.variantId === variantId &&
                            (isSample === undefined || item.isSample === isSample))
                    ),
                }));
                get().calculateTotals();
            },

            updateQuantity: (variantId: string, quantity: number, isSample?: boolean) => {
                if (quantity <= 0) {
                    get().removeItem(variantId, isSample);
                    return;
                }

                set(state => ({
                    items: state.items.map(item =>
                        item.variantId === variantId &&
                            (isSample === undefined || item.isSample === isSample)
                            ? { ...item, quantity }
                            : item
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

                // Validate items before calculation
                const validItems = items.filter(item =>
                    item.variantId &&
                    item.quantity > 0 &&
                    item.price?.amount &&
                    parseFloat(item.price.amount) > 0
                );

                validItems.forEach(item => {
                    totalQuantity += item.quantity;
                    subtotalAmount = calculateMoney(subtotalAmount, multiplyMoney(item.price.amount, item.quantity));
                    currencyCode = item.price.currencyCode || 'GBP';
                });

                const { discountAmount } = get();
                const subtotalWithDiscount = parseFloat(subtotalAmount) - discountAmount;
                const tax = subtotalWithDiscount * 0.20; // 20% VAT for UK
                const totalAmount = subtotalWithDiscount + tax;

                set({
                    totalQuantity,
                    subtotal: { amount: subtotalAmount, currencyCode },
                    total: { amount: totalAmount.toFixed(2), currencyCode },
                });

                // Return the calculated values
                return {
                    subtotal: parseFloat(subtotalAmount),
                    tax: tax,
                    total: totalAmount,
                };
            },

            // Add method to validate cart items
            validateCart: () => {
                const { items } = get();
                const errors: string[] = [];

                if (items.length === 0) {
                    errors.push('Cart is empty');
                    return { isValid: false, errors };
                }

                items.forEach((item, index) => {
                    if (!item.variantId) {
                        errors.push(`Item ${index + 1}: Missing variant ID`);
                    }
                    if (!item.quantity || item.quantity <= 0) {
                        errors.push(`Item ${index + 1}: Invalid quantity`);
                    }
                    if (!item.price?.amount || parseFloat(item.price.amount) <= 0) {
                        errors.push(`Item ${index + 1}: Invalid price`);
                    }
                    if (!item.title) {
                        errors.push(`Item ${index + 1}: Missing product title`);
                    }
                });

                return {
                    isValid: errors.length === 0,
                    errors
                };
            },

            // Check if a product is already in the cart
            isProductInCart: (productId: string, isSample?: boolean) => {
                const { items } = get();
                return items.some(item =>
                    item.productId === productId &&
                    (isSample === undefined || item.isSample === isSample)
                );
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
); 