import React from 'react';

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  icon,
}) => {
  return (
    <div className='bg-white border-2 border-gray-300 rounded-xl overflow-hidden'>
      <button 
        onClick={onToggle}
        className={`w-full p-4 flex items-center justify-between transition-colors ${
          isOpen 
            ? 'bg-blue-900 text-white hover:bg-blue-800' 
            : 'bg-white text-blue-900 hover:bg-gray-50'
        }`}
      >
        <div className='flex items-center gap-3'>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isOpen 
              ? 'bg-white bg-opacity-20' 
              : 'bg-blue-100'
          }`}>
            {icon || (
              <svg className={`w-5 h-5 ${
                isOpen ? 'text-white' : 'text-blue-600'
              }`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            )}
          </div>
          <span className='font-medium'>{title}</span>
        </div>
        <svg 
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : 'text-gray-400'
          }`} 
          fill='none' 
          stroke='currentColor' 
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {isOpen && (
        <div className='px-4 pb-4 border-t border-gray-200'>
          <div className='pt-4'>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;