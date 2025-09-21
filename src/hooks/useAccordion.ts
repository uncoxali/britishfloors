import { useState } from 'react';
import { AccordionState } from '@/types/product';

export const useAccordion = (initialState: Partial<AccordionState> = {}) => {
  const [accordionState, setAccordionState] = useState<AccordionState>({
    delivery: false,
    klarna: false,
    returns: false,
    ...initialState,
  });

  const toggleAccordion = (key: keyof AccordionState) => {
    setAccordionState(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return {
    accordionState,
    toggleAccordion,
  };
};