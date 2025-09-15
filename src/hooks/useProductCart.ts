import { useState } from 'react';
import { ShopifyProduct } from '@/lib/types/shopify';
import { useCartStore } from '@/store/cart';
import { useCartDrawerStore } from '@/store/cartDrawer';
import { CartActions } from '@/types/product';

export const useProductCart = (product: ShopifyProduct) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isOrderingSample, setIsOrderingSample] = useState(false);

  const { addItem, isProductInCart } = useCartStore();
  const { open: openCart } = useCartDrawerStore();
  const isInCart = isProductInCart(product.id);

  const handleAddToCart = async (quantity: number) => {
    if (isInCart) {
      openCart();
      return;
    }

    setIsAddingToCart(true);
    try {
      const firstVariant = product.variants?.edges[0]?.node;
      if (firstVariant) {
        addItem(product, firstVariant, quantity);
        setTimeout(() => {
          openCart();
        }, 300);
      } else {
        console.error('No variants available for this product');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    }
  };

  const handleOrderSample = async () => {
    if (isInCart) {
      openCart();
      return;
    }

    setIsOrderingSample(true);
    try {
      const firstVariant = product.variants?.edges[0]?.node;
      if (firstVariant) {
        addItem(product, firstVariant, 1);
        setTimeout(() => {
          openCart();
        }, 300);
      } else {
        console.error('No variants available for this product');
      }
    } catch (error) {
      console.error('Error adding sample to cart:', error);
    } finally {
      setTimeout(() => {
        setIsOrderingSample(false);
      }, 500);
    }
  };

  const cartActions: CartActions = {
    handleAddToCart: () => handleAddToCart(1),
    handleOrderSample,
    isInCart,
    isAddingToCart,
    isOrderingSample,
  };

  return {
    ...cartActions,
    handleAddToCartWithQuantity: handleAddToCart,
  };
};