import React from 'react';

interface RoomSuitabilityProps {
  tags: string[];
}

interface RoomItem {
  name: string;
  icon: React.ReactNode;
  tag: string;
}

const RoomSuitability: React.FC<RoomSuitabilityProps> = ({ tags }) => {
  // Define available rooms with their icons and corresponding tags
  const availableRooms: RoomItem[] = [
    {
      name: 'Kitchen',
      tag: 'kitchen',
      icon: (
        <svg
          className='w-8 h-8 text-[#C99D55]'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
          />
        </svg>
      ),
    },
    {
      name: 'Bathroom',
      tag: 'bathroom',
      icon: (
        <svg
          className='w-8 h-8 text-[#C99D55]'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18A2 2 0 0 1 23 12v2c0 1.1-.9 2-2 2H3a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2ZM21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2'
          />
        </svg>
      ),
    },
    {
      name: 'Bedroom',
      tag: 'bedroom',
      icon: (
        <svg
          className='w-8 h-8 text-[#C99D55]'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 13.5l3 3 7-7M12 21H3a2 2 0 01-2-2V7a2 2 0 012-2h3.5l2 2H21a2 2 0 012 2v6'
          />
          <rect
            x='2'
            y='3'
            width='20'
            height='14'
            rx='2'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
          />
          <path d='M7 7h10M7 10h8M7 13h6' stroke='currentColor' strokeWidth={1.5} />
        </svg>
      ),
    },
    {
      name: 'Lounge',
      tag: 'lounge',
      icon: (
        <svg
          className='w-8 h-8 text-[#C99D55]'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 14V6a2 2 0 00-2-2H7a2 2 0 00-2 2v8M5 14h14l1 5H4l1-5z'
          />
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 10h6' />
        </svg>
      ),
    },
    {
      name: 'Stairs',
      tag: 'stairs',
      icon: (
        <svg
          className='w-8 h-8 text-[#C99D55]'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 21h18M4 18h4V14h4V10h4V6h4V3'
          />
        </svg>
      ),
    },
    {
      name: 'Underfloor Heating',
      tag: 'underfloor-heating',
      icon: (
        <svg
          className='w-8 h-8 text-[#C99D55]'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1}
            d='M8 12h1M11 12h1M14 12h1'
          />
        </svg>
      ),
    },
  ];

  // Filter rooms based on product tags (case-insensitive matching)
  const suitableRooms = availableRooms.filter((room) =>
    tags.some(
      (tag) =>
        tag.toLowerCase().includes(room.tag.toLowerCase()) ||
        room.tag.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(room.name.toLowerCase()) ||
        room.name.toLowerCase().includes(tag.toLowerCase()),
    ),
  );

  // If no specific room tags found, show all rooms as default
  const roomsToShow = suitableRooms.length > 0 ? suitableRooms : availableRooms;

  return (
    <div className='grid grid-cols-2 gap-3'>
      {roomsToShow.map((room) => {
        const isAvailable = suitableRooms.length === 0 || suitableRooms.includes(room);

        return (
          <div
            key={room.name}
            className={`flex items-center p-3 rounded-xl border-2 transition-all duration-200 ${
              isAvailable
                ? 'border-[#C99D55] bg-amber-50 hover:bg-amber-100'
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}
          >
            <div className='mr-3 flex-shrink-0'>{room.icon}</div>
            <span
              className={`font-medium text-sm ${isAvailable ? 'text-gray-800' : 'text-gray-500'}`}
            >
              {room.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default RoomSuitability;
