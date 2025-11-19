// src/screens/notes/CategoryNotesScreen.tsx

import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import NoteCard from '../../components/NoteCard';
import { CATEGORY_COLORS, COLORS } from '../../constants/colors';
import { Note, RootStackParamList } from '../../types';
import { deleteNote, getCurrentUser, getNotes } from '../../utils/storage';

type CategoryNotesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CategoryNotes'>;
type CategoryNotesScreenRouteProp = RouteProp<RootStackParamList, 'CategoryNotes'>;

interface CategoryNotesScreenProps {
  navigation: CategoryNotesScreenNavigationProp;
  route: CategoryNotesScreenRouteProp;
}

const CategoryNotesScreen: React.FC<CategoryNotesScreenProps> = ({ route, navigation }) => {
  const { category } = route.params;
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async (): Promise<void> => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const allNotes = await getNotes(currentUser);
      const filtered = allNotes.filter(n => n.category === category);
      setNotes(filtered);
    }
  };

  const handleEditNote = (note: Note): void => {
    navigation.navigate('EditNote', { note });
  };

  const handleDeleteNote = async (noteId: string): Promise<void> => {
    await deleteNote(noteId);
    loadNotes();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: CATEGORY_COLORS[category] }]}>
        <Text style={styles.headerTitle}>
          {category.charAt(0).toUpperCase() + category.slice(1)} Notes
        </Text>
      </View>
      
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => handleEditNote(item)}
            onDelete={handleDeleteNote}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notes in this category yet</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightest,
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default CategoryNotesScreen;