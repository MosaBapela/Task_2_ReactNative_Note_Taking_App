// src/components/NoteCard.tsx

import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_COLORS, COLORS } from '../constants/colors';
import { Note } from '../types';

/**
 * NoteCard Component
 * Displays a single note with title, content preview, date, and action buttons
 */

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onDelete }) => {
  // Format date to readable string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle delete with confirmation
  const handleDelete = (): void => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(note.id)
        },
      ]
    );
  };

  // Truncate long content for preview
  const getContentPreview = (content: string): string => {
    if (content.length > 100) {
      return content.substring(0, 100) + '...';
    }
    return content;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        { borderLeftColor: CATEGORY_COLORS[note.category] || COLORS.medium }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          {note.title && (
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
          )}
          <View style={styles.metaContainer}>
            <View 
              style={[
                styles.categoryBadge,
                { backgroundColor: CATEGORY_COLORS[note.category] || COLORS.medium }
              ]}
            >
              <Text style={styles.categoryText}>
                {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
              </Text>
            </View>
            <Text style={styles.date}>{formatDate(note.dateAdded)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={3}>
        {getContentPreview(note.content)}
      </Text>

      {note.dateModified !== note.dateAdded && (
        <Text style={styles.editedText}>
          Edited: {formatDate(note.dateModified)}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={onPress}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    boxShadow: '0px 2px 4px rgba(16, 9, 29, 0.1)',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkest,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  content: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  editedText: {
    fontSize: 11,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightest,
  },
  editButton: {
    backgroundColor: COLORS.medium,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NoteCard;