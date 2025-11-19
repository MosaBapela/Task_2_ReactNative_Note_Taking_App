// src/constants/colors.ts

/**
 * Color palette for the Notes Application
 * Using a purple theme with gradient from light to dark
 */

interface ColorPalette {
  lightest: string;
  lighter: string;
  light: string;
  medium: string;
  dark: string;
  darker: string;
  darkest: string;
  white: string;
  black: string;
  error: string;
  success: string;
  warning: string;
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  textWhite: string;
}

interface CategoryColors {
  work: string;
  study: string;
  personal: string;
}

export const COLORS: ColorPalette = {
  // Light to Dark Purple Gradient
  lightest: '#d9d8d9',  // Very light purple-gray - for backgrounds
  lighter: '#b3a3ba',    // Light purple - for secondary elements
  light: '#8d769a',      // Medium-light purple - for cards, inputs
  medium: '#68507b',     // Medium purple - for active elements
  dark: '#46315c',       // Dark purple - for headers, buttons
  darker: '#28193d',     // Darker purple - for primary buttons
  darkest: '#10091d',    // Darkest purple - for text, backgrounds
  
  // Utility Colors
  white: '#FFFFFF',
  black: '#000000',
  error: '#FF6B6B',
  success: '#51CF66',
  warning: '#FFD93D',
  
  // Text Colors
  textPrimary: '#10091d',
  textSecondary: '#46315c',
  textLight: '#8d769a',
  textWhite: '#FFFFFF',
};

/**
 * Category Colors - Each category gets a unique shade
 */
export const CATEGORY_COLORS: CategoryColors = {
  work: '#68507b',      // Medium purple
  study: '#8d769a',     // Light purple
  personal: '#46315c',  // Dark purple
};

export default COLORS;