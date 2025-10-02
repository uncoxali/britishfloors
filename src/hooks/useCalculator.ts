import { useState } from 'react';
import { CalculationState, OrderState, ProductCalculations } from '@/types/product';
import { ftToM2, m2ToFt, feetToMeters, calculateAreaWithWastage, calculatePacksNeeded } from '@/utils/productUtils';

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

      if (calculationState.unit === 'm2') {
        // Width and length are in meters, multiply directly for square meters
        return w * l;
      } else {
        // Width and length are in feet, convert each to meters first, then multiply
        const wInMeters = feetToMeters(w);
        const lInMeters = feetToMeters(l);
        return wInMeters * lInMeters;
      }
    })();

    const baseArea = calculationState.calcMethod === 'area' ? areaFromArea : areaFromDims;

    // Convert to square meters for internal calculations
    // For area input: convert if needed, for dimensions: already converted above
    const areaInM2 = calculationState.calcMethod === 'area'
      ? (calculationState.unit === 'm2' ? baseArea : ftToM2(baseArea))
      : baseArea; // areaFromDims is already in square meters

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