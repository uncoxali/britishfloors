import { ShopifyMoney } from '@/lib/types/shopify';

export const formatPrice = (money: ShopifyMoney): string => {
    const { amount, currencyCode } = money;
    const numericAmount = parseFloat(amount);

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
    }).format(numericAmount);
};

export const formatPriceRange = (minPrice: ShopifyMoney, maxPrice: ShopifyMoney): string => {
    if (minPrice.amount === maxPrice.amount) {
        return formatPrice(minPrice);
    }

    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const classNames = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
}; 