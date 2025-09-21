import { RoomSuitabilityData, RoomSuitabilityTag } from '@/lib/types/shopify';

// Default room suitability data based on the image
const defaultRoomSuitability: RoomSuitabilityData = {
    rooms: [
        { id: 'kitchen', name: 'Kitchen', icon: 'kitchen', category: 'room' },
        { id: 'bathroom', name: 'Bathroom', icon: 'bathroom', category: 'room' },
        { id: 'bedroom', name: 'Bedroom', icon: 'bedroom', category: 'room' },
        { id: 'lounge', name: 'Lounge', icon: 'lounge', category: 'room' },
    ],
    features: [
        { id: 'stairs', name: 'Stairs', icon: 'stairs', category: 'feature' },
        { id: 'underfloor-heating', name: 'Underfloor Heating!', icon: 'heating', category: 'feature' },
    ],
};

// Icon mapping for different room types - matching the design exactly
const iconMap: Record<string, string> = {
    kitchen: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', // Refrigerator icon
    bathroom: 'M9 2v2H7v16h2v2h6v-2h2V4h-2V2H9zm2 2h2v16h-2V4z', // Bathtub icon
    bedroom: 'M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z', // Bed icon
    lounge: 'M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2z', // Sofa icon
    stairs: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 2v4l-2-1.5L7 9V5h4zm2 14H9v-2h4v2zm4-4H7v-2h10v2zm0-4H7V9h10v2z', // Stairs icon
    heating: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', // Heating icon
};

// Parse room suitability data from Shopify metafield
export function parseRoomSuitabilityData(roomSuitabilityMetafield: { value?: string } | null | undefined): RoomSuitabilityData {
    if (!roomSuitabilityMetafield?.value) {
        return defaultRoomSuitability;
    }

    try {
        const data = JSON.parse(roomSuitabilityMetafield.value);

        if (data && typeof data === 'object') {
            const rooms: RoomSuitabilityTag[] = [];
            const features: RoomSuitabilityTag[] = [];

            // Parse rooms and features from the data
            if (data.rooms && Array.isArray(data.rooms)) {
                data.rooms.forEach((room: { id?: string; name: string; icon?: string }) => {
                    if (room.name) {
                        rooms.push({
                            id: room.id || room.name.toLowerCase().replace(/\s+/g, '-'),
                            name: room.name,
                            icon: room.icon || room.name.toLowerCase(),
                            category: 'room',
                        });
                    }
                });
            }

            if (data.features && Array.isArray(data.features)) {
                data.features.forEach((feature: { id?: string; name: string; icon?: string }) => {
                    if (feature.name) {
                        features.push({
                            id: feature.id || feature.name.toLowerCase().replace(/\s+/g, '-'),
                            name: feature.name,
                            icon: feature.icon || feature.name.toLowerCase(),
                            category: 'feature',
                        });
                    }
                });
            }

            return { rooms, features };
        }
    } catch (error) {
        console.warn('Failed to parse room suitability data:', error);
    }

    return defaultRoomSuitability;
}

// Get SVG path for an icon
export function getIconPath(iconName: string): string {
    return iconMap[iconName] || iconMap.kitchen; // fallback to kitchen icon
}

// Parse description from product data
export function parseProductDescription(description: string): string[] {
    if (!description) {
        return [];
    }

    // Split description into paragraphs, removing HTML tags
    const cleanDescription = description.replace(/<[^>]*>/g, '');
    const paragraphs = cleanDescription
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

    return paragraphs;
}
