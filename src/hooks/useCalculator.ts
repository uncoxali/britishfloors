import { useState } from 'react';
import { CalculationState, OrderState, ProductCalculations } from '@/types/product';
import { ftToM2, calculateAreaWithWastage, calculatePacksNeeded } from '@/utils/productUtils';

export const useCalculator = (packSize: number, pricePerM2: number, adminCostPerPack?: number | null) => {
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
    const packsNeeded = calculatePacksNeeded(areaWithWastage, packSize); // round up
    const totalAreaCovered = packsNeeded * packSize;
    
    // Use admin cost per pack if available, otherwise calculate from price per m2
    const pricePerPack = adminCostPerPack || (packSize * pricePerM2);
    const totalPriceCalculate = packsNeeded * pricePerPack;
    const totalPriceOrder = orderState.quantity * pricePerPack;

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