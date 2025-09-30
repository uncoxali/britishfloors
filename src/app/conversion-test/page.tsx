'use client';

import React, { useEffect } from 'react';
import { ftToM2, m2ToFt } from '@/utils/productUtils';

export default function ConversionTest() {
  useEffect(() => {
    console.log('Unit Conversion Tests:');
    console.log('====================');

    // Test 1: Square meter to square foot conversion
    const oneSquareMeterInSquareFeet = m2ToFt(1);
    console.log(`1 square meter = ${oneSquareMeterInSquareFeet.toFixed(4)} square feet`);

    // Test 2: Square foot to square meter conversion
    const oneSquareFootInSquareMeters = ftToM2(1);
    console.log(`1 square foot = ${oneSquareFootInSquareMeters.toFixed(6)} square meters`);

    // Test 3: Round trip conversion
    const roundTrip = ftToM2(m2ToFt(10));
    console.log(`Round trip conversion of 10 m²: ${roundTrip.toFixed(6)} m²`);

    console.log('\nLinear Conversion Reference:');
    console.log('==========================');
    console.log('1 meter = 3.28084 feet (linear)');
    console.log('1 square meter = 10.7639 square feet (area)');
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Unit Conversion Tests</h1>
      <p>Check the browser console for test results.</p>
    </div>
  );
}