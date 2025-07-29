'use client';

import React, { useState, useEffect } from 'react';
import CountryCodeSelect from './CountryCodeSelect';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = '123 456 7890',
  className = '',
  required = false,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Parse the full phone number to separate country code and number
  useEffect(() => {
    if (value) {
      // Find the country code from the value
      const countryCodes = [
        '+44',
        '+1',
        '+61',
        '+49',
        '+33',
        '+39',
        '+34',
        '+31',
        '+32',
        '+46',
        '+47',
        '+45',
        '+358',
        '+41',
        '+43',
        '+353',
        '+64',
        '+81',
        '+82',
        '+86',
        '+91',
        '+55',
        '+52',
        '+54',
        '+56',
        '+57',
        '+51',
        '+58',
        '+27',
        '+20',
        '+234',
        '+254',
        '+233',
        '+212',
        '+216',
        '+213',
        '+218',
        '+249',
        '+251',
        '+256',
        '+255',
        '+260',
        '+263',
        '+267',
        '+264',
        '+258',
        '+261',
        '+230',
        '+248',
        '+269',
        '+253',
        '+252',
        '+291',
        '+211',
        '+236',
        '+235',
        '+237',
        '+240',
        '+241',
        '+242',
        '+243',
        '+244',
        '+245',
        '+238',
        '+239',
        '+220',
        '+224',
        '+232',
        '+231',
        '+225',
        '+226',
        '+223',
        '+227',
        '+221',
        '+222',
        '+228',
        '+229',
        '+250',
        '+257',
        '+265',
        '+266',
        '+268',
      ];

      let foundCode = '+44'; // default
      for (const code of countryCodes) {
        if (value.startsWith(code)) {
          foundCode = code;
          break;
        }
      }

      setCountryCode(foundCode);
      setPhoneNumber(value.replace(foundCode, '').trim());
    }
  }, [value]);

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');

    // Format the number with spaces
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 9) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(
        9,
      )}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    onChange(`${countryCode} ${formatted}`);
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
    onChange(`${code} ${phoneNumber}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if ([8, 9, 27, 13, 46, 37, 39].includes(e.keyCode)) {
      return;
    }

    // Allow: numbers, space
    if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 32) {
      return;
    }

    e.preventDefault();
  };

  return (
    <div className='space-y-2'>
      <div className='flex space-x-2'>
        <div className='w-24'>
          <CountryCodeSelect value={countryCode} onChange={handleCountryCodeChange} />
        </div>
        <div className='flex-1 relative'>
          <input
            type='tel'
            value={phoneNumber}
            onChange={handlePhoneChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            required={required}
            className={`
              w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? 'border-red-300' : isFocused ? 'border-blue-500' : 'border-gray-300'}
              ${className}
            `}
          />
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <svg
              className='w-4 h-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
              />
            </svg>
          </div>
        </div>
      </div>
      {error && <p className='text-red-500 text-xs'>{error}</p>}
    </div>
  );
};

export default PhoneInput;
