// API service for fetching mega menu data

export interface MenuCategory {
  name: string;
  slug: string;
  subcategories?: MenuCategory[];
}

export interface MenuFilter {
  name: string;
  options: {
    name: string;
    value: string;
    color?: string;
    price?: string;
  }[];
}

export interface MenuData {
  categories: MenuCategory[];
  filters: {
    [key: string]: MenuFilter[];
  };
  featuredImage?: string;
}

// Mock data based on the design image
const menuData: { [key: string]: MenuData } = {
  'engineered-wood': {
    categories: [
      { name: 'Shop by Feature', slug: 'feature' },
      { name: 'Shop by Room', slug: 'room' },
      { name: 'Best Seller', slug: 'best-seller' },
      { name: 'View Full Collection', slug: 'collection' },
    ],
    filters: {
      main: [
        {
          name: 'Colour',
          options: [
            { name: 'White', value: 'white' },
            { name: 'Grey', value: 'grey', color: '#808080' },
            { name: 'Light', value: 'light', color: '#E8D0A9' },
            { name: 'Medium', value: 'medium', color: '#B68D40' },
            { name: 'Dark', value: 'dark', color: '#5D4A1F' },
          ],
        },
        {
          name: 'Price',
          options: [
            { name: '£30 - £39.99 Per m²', value: '30-39.99' },
            { name: '£40 - £49.99 Per m²', value: '40-49.99' },
            { name: '£50 - £59.99 Per m²', value: '50-59.99' },
            { name: '£60 - £69.99 Per m²', value: '60-69.99' },
            { name: 'Above £70 Per m²', value: '70-plus' },
          ],
        },
        {
          name: 'Finish',
          options: [
            { name: 'Oiled', value: 'oiled' },
            { name: 'Lacquered', value: 'lacquered' },
            { name: 'Invisible Oiled', value: 'invisible-oiled' },
            { name: 'Brushed', value: 'brushed' },
            { name: 'Distressed', value: 'distressed' },
            { name: 'Smoked', value: 'smoked' },
            { name: 'Unfinished', value: 'unfinished' },
          ],
        },
        {
          name: 'Floor Style',
          options: [
            { name: 'Unfinished', value: 'unfinished' },
            { name: 'Parquet', value: 'parquet' },
            { name: 'Herringbone', value: 'herringbone' },
            { name: 'Versailles', value: 'versailles' },
            { name: 'Prime Grade', value: 'prime-grade' },
            { name: 'Waterproof', value: 'waterproof' },
            { name: 'Random', value: 'random' },
            { name: 'Length', value: 'length' },
            { name: 'Narrow Wood', value: 'narrow-wood' },
          ],
        },
        {
          name: 'Species',
          options: [
            { name: 'Oak Flooring', value: 'oak' },
          ],
        },
      ],
    },
    featuredImage: '/images/mega-menu/engineered-wood.jpg',
  },
  'vinyl-lvt': {
    categories: [
      { name: 'Shop by Feature', slug: 'feature' },
      { name: 'Shop by Room', slug: 'room' },
      { name: 'Best Seller', slug: 'best-seller' },
      { name: 'View Full Collection', slug: 'collection' },
    ],
    filters: {
      main: [
        {
          name: 'Colour',
          options: [
            { name: 'White', value: 'white' },
            { name: 'Grey', value: 'grey', color: '#808080' },
            { name: 'Light', value: 'light', color: '#E8D0A9' },
            { name: 'Medium', value: 'medium', color: '#B68D40' },
            { name: 'Dark', value: 'dark', color: '#5D4A1F' },
          ],
        },
        {
          name: 'Price',
          options: [
            { name: '£20 - £29.99 Per m²', value: '20-29.99' },
            { name: '£30 - £39.99 Per m²', value: '30-39.99' },
            { name: '£40 - £49.99 Per m²', value: '40-49.99' },
            { name: '£50 - £59.99 Per m²', value: '50-59.99' },
          ],
        },
      ],
    },
    featuredImage: '/images/mega-menu/vinyl-lvt.jpg',
  },
  'laminate': {
    categories: [
      { name: 'Shop by Feature', slug: 'feature' },
      { name: 'Shop by Room', slug: 'room' },
      { name: 'Best Seller', slug: 'best-seller' },
      { name: 'View Full Collection', slug: 'collection' },
    ],
    filters: {
      main: [
        {
          name: 'Colour',
          options: [
            { name: 'White', value: 'white' },
            { name: 'Grey', value: 'grey', color: '#808080' },
            { name: 'Light', value: 'light', color: '#E8D0A9' },
            { name: 'Medium', value: 'medium', color: '#B68D40' },
            { name: 'Dark', value: 'dark', color: '#5D4A1F' },
          ],
        },
        {
          name: 'Price',
          options: [
            { name: '£20 - £29.99 Per m²', value: '20-29.99' },
            { name: '£30 - £39.99 Per m²', value: '30-39.99' },
            { name: '£40 - £49.99 Per m²', value: '40-49.99' },
          ],
        },
      ],
    },
    featuredImage: '/images/mega-menu/laminate.jpg',
  },
  'parquet': {
    categories: [
      { name: 'Shop by Feature', slug: 'feature' },
      { name: 'Shop by Room', slug: 'room' },
      { name: 'Best Seller', slug: 'best-seller' },
      { name: 'View Full Collection', slug: 'collection' },
    ],
    filters: {
      main: [
        {
          name: 'Colour',
          options: [
            { name: 'White', value: 'white' },
            { name: 'Grey', value: 'grey', color: '#808080' },
            { name: 'Light', value: 'light', color: '#E8D0A9' },
            { name: 'Medium', value: 'medium', color: '#B68D40' },
            { name: 'Dark', value: 'dark', color: '#5D4A1F' },
          ],
        },
        {
          name: 'Price',
          options: [
            { name: '£40 - £49.99 Per m²', value: '40-49.99' },
            { name: '£50 - £59.99 Per m²', value: '50-59.99' },
            { name: '£60 - £69.99 Per m²', value: '60-69.99' },
            { name: 'Above £70 Per m²', value: '70-plus' },
          ],
        },
      ],
    },
    featuredImage: '/images/mega-menu/parquet.jpg',
  },
  'accessories': {
    categories: [
      { name: 'Shop by Feature', slug: 'feature' },
      { name: 'Shop by Room', slug: 'room' },
      { name: 'Best Seller', slug: 'best-seller' },
      { name: 'View Full Collection', slug: 'collection' },
    ],
    filters: {
      main: [
        {
          name: 'Type',
          options: [
            { name: 'Underlay', value: 'underlay' },
            { name: 'Adhesives', value: 'adhesives' },
            { name: 'Trims', value: 'trims' },
            { name: 'Maintenance', value: 'maintenance' },
          ],
        },
        {
          name: 'Price',
          options: [
            { name: 'Under £20', value: 'under-20' },
            { name: '£20 - £50', value: '20-50' },
            { name: 'Above £50', value: 'above-50' },
          ],
        },
      ],
    },
    featuredImage: '/images/mega-menu/accessories.jpg',
  },
};

export const getMenuData = async (category: string): Promise<MenuData> => {
  // In a real application, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(menuData[category] || menuData['engineered-wood']);
    }, 100);
  });
};