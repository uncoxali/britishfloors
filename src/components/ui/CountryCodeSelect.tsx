'use client';

import React, { useState } from 'react';

interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { code: 'CG', name: 'Republic of the Congo', dialCode: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'Democratic Republic of the Congo', dialCode: '+243', flag: '🇨🇩' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'ST', name: 'São Tomé and Príncipe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225', flag: '🇨🇮' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿' },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCountry =
    countryCodes.find((country) => country.dialCode === value) || countryCodes[0];

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dialCode.includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={`relative ${className}`}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between'
      >
        <div className='flex items-center space-x-2'>
          <span>{selectedCountry.flag}</span>
          <span className='text-sm font-medium'>{selectedCountry.dialCode}</span>
        </div>
        <svg
          className='w-4 h-4 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
          <div className='p-2 border-b border-gray-200'>
            <input
              type='text'
              placeholder='Search countries...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>
          <div className='max-h-48 overflow-auto'>
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type='button'
                onClick={() => {
                  onChange(country.dialCode);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className='w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3'
              >
                <span className='text-lg'>{country.flag}</span>
                <div className='flex-1'>
                  <div className='text-sm font-medium text-gray-900'>{country.name}</div>
                  <div className='text-xs text-gray-500'>{country.dialCode}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelect;
