import { useState } from 'react';
import { CalculationState, OrderState, ProductCalculations } from '@/types/product';
import { ftToM2, m2ToFt, calculateAreaWithWastage, calculatePacksNeeded } from '@/utils/productUtils';

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

    // Convert to square meters for internal calculations
    const areaInM2 = calculationState.unit === 'm2' ? baseArea : ftToM2(baseArea);

    // Calculate with wastage (in square meters)
    const areaWithWastageInM2 = calculateAreaWithWastage(areaInM2, calculationState.wastagePercent);

    // Calculate packs needed (based on square meters)
    const packsNeeded = calculatePacksNeeded(areaWithWastageInM2, packSize);

    // Total area covered (in square meters)
    const totalAreaCovered = packsNeeded * packSize;

    // Convert displayed area with wastage to the selected unit
    const areaWithWastage = calculationState.unit === 'm2' ? areaWithWastageInM2 : m2ToFt(areaWithWastageInM2);

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