import { useState } from 'react';
import { CalculationState, OrderState, ProductCalculations } from '@/types/product';
import { ftToM2, calculateAreaWithWastage, calculatePacksNeeded } from '@/utils/productUtils';

export const useCalculator = (packSize: number, pricePerM2: number) => {
  const [calculationState, setCalculationState] = useState<CalculationState>({
    calcMethod: 'area',
    area: '',
    width: '',
    length: '',
    unit: 'm2',
    wastagePercent: 0,
  });

  const [orderState, setOrderState] = useState<OrderState>({
    quantity: 1,
  });

  const updateCalculationState = (updates: Partial<CalculationState>) => {
    setCalculationState(prev => ({ ...prev, ...updates }));
  };

  const updateOrderState = (updates: Partial<OrderState>) => {
    setOrderState(prev => ({ ...prev, ...updates }));
  };

  const calculations: ProductCalculations = (() => {
    const areaFromArea = Number(calculationState.area) || 0;
    const areaFromDims = (() => {
      const w = Number(calculationState.width) || 0;
      const l = Number(calculationState.length) || 0;
      return w * l;
    })();
    
    const baseArea = calculationState.calcMethod === 'area' ? areaFromArea : areaFromDims;
    const areaInM2 = calculationState.unit === 'm2' ? baseArea : ftToM2(baseArea);
    const areaWithWastage = calculateAreaWithWastage(areaInM2, calculationState.wastagePercent);
    const packsNeeded = calculatePacksNeeded(areaWithWastage, packSize);
    const totalAreaCovered = packsNeeded * packSize;
    const totalPriceCalculate = totalAreaCovered * pricePerM2;
    const totalPriceOrder = orderState.quantity * packSize * pricePerM2;

    return {
      baseArea,
      areaInM2,
      areaWithWastage,
      packsNeeded,
      totalAreaCovered,
      totalPriceCalculate,
      totalPriceOrder,
    };
  })();

  return {
    calculationState,
    orderState,
    calculations,
    updateCalculationState,
    updateOrderState,
  };
};