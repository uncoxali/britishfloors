'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMenuData, MenuData, MenuFilter } from '@/services/menuService';

interface MegaMenuProps {
  isOpen: boolean;
  activeCategory: string | null;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, activeCategory, onClose }) => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && activeCategory) {
        setLoading(true);
        try {
          const data = await getMenuData(activeCategory);
          setMenuData(data);
        } catch (error) {
          console.error('Error fetching menu data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isOpen, activeCategory]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed top-28 left-0 right-0 bg-white shadow-lg z-20 border-t border-gray-200'
      onMouseLeave={onClose}
    >
      <div className='max-w-5xl mx-auto px-8 py-6'>
        {loading ? (
          <div className='flex justify-center items-center h-40'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A4685]'></div>
          </div>
        ) : (
          <div className='flex'>
            {/* Left Column - Categories */}
            <div className='w-44 border-r border-gray-200 pr-4'>
              {menuData?.categories?.map((category, index) => (
                <div
                  key={index}
                  className={`mb-3 ${index === menuData.categories.length - 1 ? 'mt-6' : ''}`}
                >
                  <Link
                    href={`/products?category=${activeCategory}&filter=${category.slug}`}
                    className={`block py-1.5 text-sm ${
                      index === menuData.categories.length - 1
                        ? 'text-[#1A4685] font-semibold'
                        : 'text-gray-700 hover:text-[#1A4685]'
                    } transition-colors`}
                  >
                    {category.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Middle Columns - Filters */}
            <div className='flex-1 px-6'>
              <div className='grid grid-cols-5 gap-4'>
                {menuData?.filters?.main?.map((filter, index) => (
                  <div key={index} className='mb-3'>
                    <h3 className='text-[#1A4685] font-medium mb-2 text-sm'>{filter.name}</h3>
                    <ul className='space-y-2'>
                      {filter.options.map((option, optIndex) => (
                        <li key={optIndex} className='flex items-center'>
                          {filter.name === 'Colour' && option.color && (
                            <span
                              className='inline-block w-4 h-4 mr-2 rounded-full border border-gray-300'
                              style={{ backgroundColor: option.color }}
                            ></span>
                          )}
                          <Link
                            href={`/products?category=${activeCategory}&${filter.name.toLowerCase()}=${
                              option.value
                            }`}
                            className='text-xs text-gray-700 hover:text-[#1A4685] transition-colors whitespace-nowrap'
                          >
                            {filter.name === 'Price' ? (
                              <span className="whitespace-nowrap">{option.name}</span>
                            ) : (
                              option.name
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Featured Image */}
            <div className='w-64'>
              {menuData?.featuredImage && (
                <div className='relative h-64 w-full rounded-md overflow-hidden'>
                  <Image
                    src={menuData.featuredImage}
                    alt={`${activeCategory} featured image`}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, 256px'
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;