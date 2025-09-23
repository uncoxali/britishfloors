import { RoomSuitabilityData, RoomSuitabilityTag } from '@/lib/types/shopify';

// Icon mapping for different room types - matching the design exactly
const iconMap: Record<string, string> = {
    kitchen: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
    bathroom: 'M9 2v2H7v16h2v2h6v-2h2V4h-2V2H9zm2 2h2v16h-2V4z',
    bedroom: 'M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z',
    lounge: 'M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2z',
    conservatory: 'M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.27 5.82 22 7 13.87 2 9l6.91-.74L12 2z',
    stairs: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 2v4l-2-1.5L7 9V5h4zm2 14H9v-2h4v2zm4-4H7v-2h10v2zm0-4H7V9h10v2z',
    'underfloor-heating!': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    heating: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
};

// Parse room suitability data from product tags
export function parseRoomSuitabilityFromTags(tags: string[] | undefined): RoomSuitabilityData {
    if (!tags || !Array.isArray(tags)) {
        return { rooms: [], features: [] };
    }

    const rooms: RoomSuitabilityTag[] = [];
    const features: RoomSuitabilityTag[] = [];

    // Define room types that should be categorized as rooms
    const roomTypes = ['kitchen', 'bathroom', 'bedroom', 'lounge', 'living-room', 'dining-room', 'hallway', 'office', 'study', 'conservatory'];

    // Define feature types that should be categorized as features
    const featureTypes = ['stairs', 'underfloor-heating', 'underfloor heating!', 'heating', 'waterproof', 'slip-resistant', 'easy-clean', 'durable'];

    tags.forEach(tag => {
        const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
        const lowerTag = tag.toLowerCase();

        // Check if tag is a room type
        if (roomTypes.includes(lowerTag) || roomTypes.includes(normalizedTag)) {
            rooms.push({
                id: normalizedTag,
                name: tag, // Use original tag name with proper capitalization
                icon: lowerTag.replace(/\s+/g, '-'),
                category: 'room',
            });
        }
        // Check if tag is a feature type
        else if (featureTypes.includes(lowerTag) || featureTypes.includes(normalizedTag)) {
            features.push({
                id: normalizedTag,
                name: tag, // Use original tag name
                icon: lowerTag.replace(/\s+/g, '-'),
                category: 'feature',
            });
        }
    });

    return { rooms, features };
}

// Fallback function for metafield data (if still needed)
export function parseRoomSuitabilityData(roomSuitabilityMetafield: { value?: string } | null | undefined): RoomSuitabilityData {
    if (!roomSuitabilityMetafield?.value) {
        return { rooms: [], features: [] };
    }

    try {
        const data = JSON.parse(roomSuitabilityMetafield.value);

        if (data && typeof data === 'object') {
            const rooms: RoomSuitabilityTag[] = [];
            const features: RoomSuitabilityTag[] = [];

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

    return { rooms: [], features: [] };
}

// Get SVG path for an icon
export function getIconPath(iconName: string): string {
    const normalizedName = iconName.toLowerCase().replace(/\s+/g, '-');
    return iconMap[normalizedName] || iconMap.kitchen; // fallback to kitchen icon
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
