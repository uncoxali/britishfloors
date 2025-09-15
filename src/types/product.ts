export interface CalculationState {
  calcMethod: 'area' | 'dims';
  area: string;
  width: string;
  length: string;
  unit: 'm2' | 'ft2';
  wastagePercent: number;
}

export interface OrderState {
  quantity: number;
}

export interface AccordionState {
  delivery: boolean;
  klarna: boolean;
  returns: boolean;
}

export interface ProductCalculations {
  baseArea: number;
  areaInM2: number;
  areaWithWastage: number;
  packsNeeded: number;
  totalAreaCovered: number;
  totalPriceCalculate: number;
  totalPriceOrder: number;
}

export interface CartActions {
  handleAddToCart: () => Promise<void>;
  handleOrderSample: () => Promise<void>;
  isInCart: boolean;
  isAddingToCart: boolean;
  isOrderingSample: boolean;
}

export interface GalleryProps {
  images: Array<{ id: string; url: string; altText?: string | null }>;
  activeIndex: number;
  onImageSelect: (index: number) => void;
  productTitle: string;
}

export interface ColorSelectorProps {
  colors: string[];
  activeIndex: number;
  onColorSelect: (index: number) => void;
  images: Array<{ id: string; url: string; altText?: string | null }>;
}