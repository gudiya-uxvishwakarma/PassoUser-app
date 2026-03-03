import apiService from './api.service';
import {ENDPOINTS} from '../config/api';

// Icon mapping for categories
const categoryIconMap = {
  'AC Repair': {icon: 'snow', iconFamily: 'Ionicons'},
  'AC Technician': {icon: 'snow', iconFamily: 'Ionicons'},
  'Refrigerator': {icon: 'fridge', iconFamily: 'MaterialCommunityIcons'},
  'Refrigerator Repair': {icon: 'fridge', iconFamily: 'MaterialCommunityIcons'},
  'Patient Caretaker': {icon: 'medical', iconFamily: 'Ionicons'},
  'Elder Care': {icon: 'people', iconFamily: 'Ionicons'},
  'Home Nurse': {icon: 'medical', iconFamily: 'Ionicons'},
  'Pest Control': {icon: 'bug', iconFamily: 'Ionicons'},
  'Plaster Worker': {icon: 'construct', iconFamily: 'Ionicons'},
  'Plumber': {icon: 'water', iconFamily: 'Ionicons'},
  'RO / Water Purifier': {icon: 'water-outline', iconFamily: 'Ionicons'},
  'Restaurant Cleaner': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Scaffolding Worker': {icon: 'construct', iconFamily: 'Ionicons'},
  'Security Guard': {icon: 'shield-checkmark', iconFamily: 'Ionicons'},
  'Septic Tank Cleaning': {icon: 'water', iconFamily: 'Ionicons'},
  'Shuttering Worker': {icon: 'hammer', iconFamily: 'Ionicons'},
  'Shuttering Carpenter': {icon: 'hammer', iconFamily: 'Ionicons'},
  'Society Cleaner': {icon: 'home', iconFamily: 'Ionicons'},
  'Sofa Cleaning': {icon: 'bed', iconFamily: 'Ionicons'},
  'Solar Panel Technician': {icon: 'sunny', iconFamily: 'Ionicons'},
  'Store Assistant': {icon: 'storefront', iconFamily: 'Ionicons'},
  'TV Installation': {icon: 'tv', iconFamily: 'Ionicons'},
  'Tandoor Master': {icon: 'flame', iconFamily: 'Ionicons'},
  'Tempo Driver': {icon: 'car', iconFamily: 'Ionicons'},
  'Tile Fitter': {icon: 'grid', iconFamily: 'Ionicons'},
  'Tile Layer': {icon: 'square', iconFamily: 'Ionicons'},
  'Tiles Fitter': {icon: 'apps', iconFamily: 'Ionicons'},
  'Two-Wheeler Delivery': {icon: 'bicycle', iconFamily: 'Ionicons'},
  'Waiter / Steward': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Warehouse Packer': {icon: 'cube', iconFamily: 'Ionicons'},
  'Watchman': {icon: 'eye', iconFamily: 'Ionicons'},
  'Water Tank Cleaner': {icon: 'water', iconFamily: 'Ionicons'},
  'Waterproofing': {icon: 'water', iconFamily: 'Ionicons'},
  'Waterproofing Tech': {icon: 'water', iconFamily: 'Ionicons'},
  'Welder / Fabricator': {icon: 'flame', iconFamily: 'Ionicons'},
  'Inverter Technician': {icon: 'battery-charging', iconFamily: 'Ionicons'},
  'Kitchen Deep Cleaning': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Laptop Repair': {icon: 'laptop', iconFamily: 'Ionicons'},
  'Laundry Service': {icon: 'shirt', iconFamily: 'Ionicons'},
  'Lift Operator': {icon: 'arrow-up', iconFamily: 'Ionicons'},
  'Loading Labour': {icon: 'cube', iconFamily: 'Ionicons'},
  'Mason (Mistri)': {icon: 'hammer', iconFamily: 'Ionicons'},
  'Mason (Raj Mistri)': {icon: 'construct', iconFamily: 'Ionicons'},
  'Milk Delivery': {icon: 'water', iconFamily: 'Ionicons'},
  'Mini Truck Driver': {icon: 'car', iconFamily: 'Ionicons'},
  'Mobile Repair': {icon: 'phone-portrait', iconFamily: 'Ionicons'},
  'Newspaper Delivery': {icon: 'newspaper', iconFamily: 'Ionicons'},
  'Office Boy': {icon: 'briefcase', iconFamily: 'Ionicons'},
  'POP / Ceiling Worker': {icon: 'construct', iconFamily: 'Ionicons'},
  'POP / Gypsum Worker': {icon: 'hammer', iconFamily: 'Ionicons'},
  'Packers & Movers': {icon: 'cube', iconFamily: 'Ionicons'},
  'Painter': {icon: 'color-palette', iconFamily: 'Ionicons'},
  'Painter (Construction)': {icon: 'brush', iconFamily: 'Ionicons'},
  'Dishwasher Service': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Driver (Daily)': {icon: 'car', iconFamily: 'Ionicons'},
  'Electrician': {icon: 'flash', iconFamily: 'Ionicons'},
  'Event Kitchen Helper': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Full-Time Maid': {icon: 'person', iconFamily: 'Ionicons'},
  'Furniture Assembly': {icon: 'bed', iconFamily: 'Ionicons'},
  'Garbage Collection': {icon: 'trash', iconFamily: 'Ionicons'},
  'Gardener / Mali': {icon: 'leaf', iconFamily: 'Ionicons'},
  'General Labour': {icon: 'hammer', iconFamily: 'Ionicons'},
  'Handyman': {icon: 'construct', iconFamily: 'Ionicons'},
  'Helper (Kitchen)': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Helper (Mazdoor)': {icon: 'person', iconFamily: 'Ionicons'},
  'Helper / Loader': {icon: 'cube', iconFamily: 'Ionicons'},
  'House Cleaning': {icon: 'home', iconFamily: 'Ionicons'},
  'Housekeeping Staff': {icon: 'home', iconFamily: 'Ionicons'},
  'Internet Technician': {icon: 'wifi', iconFamily: 'Ionicons'},
  'Babysitter / Nanny': {icon: 'person', iconFamily: 'Ionicons'},
  'Bar Tender': {icon: 'wine', iconFamily: 'Ionicons'},
  'Bathroom Cleaning': {icon: 'water', iconFamily: 'Ionicons'},
  'Borewell Operator': {icon: 'water', iconFamily: 'Ionicons'},
  'CCTV Installation': {icon: 'videocam', iconFamily: 'Ionicons'},
  'Car Cleaner': {icon: 'car', iconFamily: 'Ionicons'},
  'Carpenter': {icon: 'hammer', iconFamily: 'Ionicons'},
  'Catering Staff': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Civil Mason': {icon: 'construct', iconFamily: 'Ionicons'},
  'Cleaner (Commercial)': {icon: 'business', iconFamily: 'Ionicons'},
  'Cook': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Cook (Commercial)': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Courier Runner': {icon: 'bicycle', iconFamily: 'Ionicons'},
  'Data Entry Operator': {icon: 'laptop', iconFamily: 'Ionicons'},
  'Delivery Executive': {icon: 'bicycle', iconFamily: 'Ionicons'},
  'Demolition Worker': {icon: 'hammer', iconFamily: 'Ionicons'},
  'Dishwasher Boy': {icon: 'restaurant', iconFamily: 'Ionicons'},
  'Helper': {icon: 'person', iconFamily: 'Ionicons'},
  'Contractor': {icon: 'construct', iconFamily: 'Ionicons'},
  'Service Provider': {icon: 'briefcase', iconFamily: 'Ionicons'},
  'Worker': {icon: 'person', iconFamily: 'Ionicons'},
  'Crew / Team': {icon: 'people', iconFamily: 'Ionicons'},
};

// Get icon for category
const getCategoryIcon = (categoryName) => {
  return categoryIconMap[categoryName] || {icon: 'briefcase', iconFamily: 'Ionicons'};
};

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      console.log('🔍 Fetching categories from backend...');
      const response = await apiService.get(ENDPOINTS.CATEGORIES);
      
      console.log('✅ Categories response:', {
        success: response.data.success,
        count: response.data.data?.length || 0
      });
      
      // Map categories with icons
      const categoriesWithIcons = (response.data.data || []).map(category => ({
        ...category,
        ...getCategoryIcon(category.name),
      }));
      
      console.log(`✅ Mapped ${categoriesWithIcons.length} categories with icons`);
      
      return {
        success: true,
        data: categoriesWithIcons,
      };
    } catch (error) {
      console.error('❌ Get categories error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return {
        success: false,
        message: error.message || 'Failed to fetch categories',
        data: [],
      };
    }
  },

  // Get category by ID
  getCategoryById: async categoryId => {
    try {
      const response = await apiService.get(ENDPOINTS.CATEGORY_BY_ID(categoryId));
      
      // Add icon to category
      const category = response.data.data;
      const categoryWithIcon = {
        ...category,
        ...getCategoryIcon(category.name),
      };
      
      return {
        success: true,
        data: categoryWithIcon,
      };
    } catch (error) {
      console.error('❌ Get category error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch category',
        data: null,
      };
    }
  },
};

export default categoryService;
