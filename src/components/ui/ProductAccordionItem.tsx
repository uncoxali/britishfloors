import React from 'react';

interface ProductAccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'golden';
}

const ProductAccordionItem: React.FC<ProductAccordionItemProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  variant = 'default',
}) => {
  const containerClass =
    variant === 'golden'
      ? 'bg-white border-2 border-[#C99D55] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'
      : 'bg-white border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200';

  const headerClass =
    variant === 'golden'
      ? isOpen
        ? 'bg-[#C99D55] text-white hover:bg-[#B8904A] transition-all duration-300'
        : 'bg-white text-[#C99D55] hover:bg-[#FDF8F0] transition-all duration-300'
      : isOpen
      ? 'bg-blue-900 text-white hover:bg-blue-800 transition-all duration-300'
      : 'bg-white text-blue-900 hover:bg-blue-50 transition-all duration-300';

  const borderClass =
    variant === 'golden' && isOpen ? 'border-t border-[#C99D55]/30' : 'border-t border-gray-200';

  return (
    <div className={containerClass}>
      <button
        onClick={onToggle}
        className={`w-full p-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          variant === 'golden' ? 'focus:ring-[#C99D55]' : 'focus:ring-blue-500'
        } ${headerClass}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className='font-semibold text-left'>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {isOpen && (
        <div
          className='transition-all duration-300 ease-in-out'
          id={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <div className={`px-5 pb-5 ${borderClass}`}>
            <div className='pt-4'>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAccordionItem;
