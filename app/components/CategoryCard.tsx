// src/components/CategoryCard.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_COLORS, COLORS } from '../constants/colors';
import { Category } from '../types';

/**
 * CategoryCard Component
 * Displays a category card with note count
 * 
 * Props:
 * - category: The category name (work, study, personal)
 * - noteCount: Number of notes in this category
 * - onPress: Function called when card is tapped
 */

interface CategoryCardProps {
  category: Category;
  noteCount: number;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, noteCount, onPress }) => {
  // Get the appropriate color for this category
  const categoryColor: string = CATEGORY_COLORS[category] || COLORS.medium;

  // Capitalize category name
  const displayName: string = category.charAt(0).toUpperCase() + category.slice(1);

  // Category icons (you can use actual icon libraries like react-native-vector-icons)
  const getCategoryEmoji = (): string => {
    switch (category) {
      case 'work':
        return '💼';
      case 'study':
        return '📚';
      case 'personal':
        return '✨';
      default:
        return '📝';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: categoryColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>{getCategoryEmoji()}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.categoryName}>{displayName}</Text>
        <Text style={styles.noteCount}>
          {noteCount} {noteCount === 1 ? 'note' : 'notes'}
        </Text>
      </View>

      <View style={styles.arrow}>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    boxShadow: '0px 4px 6px rgba(16, 9, 29, 0.2)',
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  noteCount: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '700',
  },
});

export default CategoryCard;