// src/screens/notes/HomeScreen.tsx

import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CategoryCard from '../../components/CategoryCard';
import NoteCard from '../../components/NoteCard';
import { COLORS } from '../../constants/colors';
import { Category, Note, SortBy } from '../../types';
import { deleteNote, getCurrentUser, getNotes, searchNotes, sortNotes } from '../../utils/storage';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('dateDesc');
  const [categories, setCategories] = useState<Record<Category, number>>({
    work: 0,
    study: 0,
    personal: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async (): Promise<void> => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const userNotes = await getNotes(currentUser);
      setNotes(userNotes);
      setFilteredNotes(sortNotes(userNotes, sortBy));
      
      const counts: Record<Category, number> = {
        work: userNotes.filter(n => n.category === 'work').length,
        study: userNotes.filter(n => n.category === 'study').length,
        personal: userNotes.filter(n => n.category === 'personal').length,
      };
      setCategories(counts);
    }
  };

  const handleSearch = async (query: string): Promise<void> => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredNotes(sortNotes(notes, sortBy));
    } else {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const results = await searchNotes(currentUser, query);
        setFilteredNotes(sortNotes(results, sortBy));
      }
    }
  };

  const handleSort = (newSortBy: SortBy): void => {
    setSortBy(newSortBy);
    setFilteredNotes(sortNotes(filteredNotes, newSortBy));
  };

  const handleCategoryPress = (category: Category): void => {
    router.push(`/notes/category?category=${category}`);
  };

  const handleEditNote = (note: Note): void => {
    router.push(`/notes/edit?id=${note.id}`);
  };

  const handleDeleteNote = async (noteId: string): Promise<void> => {
    const result = await deleteNote(noteId);
    
    if (result.success) {
      loadNotes();
      Alert.alert('Success', 'Note deleted successfully');
    } else {
      Alert.alert('Error', 'Failed to delete note');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/notes/add')}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'dateDesc' && styles.sortButtonActive
          ]}
          onPress={() => handleSort('dateDesc')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'dateDesc' && styles.sortButtonTextActive
          ]}>
            Newest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'dateAsc' && styles.sortButtonActive
          ]}
          onPress={() => handleSort('dateAsc')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'dateAsc' && styles.sortButtonTextActive
          ]}>
            Oldest
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <CategoryCard
                category="work"
                noteCount={categories.work}
                onPress={() => handleCategoryPress('work')}
              />
              <CategoryCard
                category="study"
                noteCount={categories.study}
                onPress={() => handleCategoryPress('study')}
              />
              <CategoryCard
                category="personal"
                noteCount={categories.personal}
                onPress={() => handleCategoryPress('personal')}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? 'Search Results' : 'All Notes'}
              </Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => handleEditNote(item)}
            onDelete={handleDeleteNote}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No notes found' : 'No notes yet. Start by adding one!'}
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.darker,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.darker,
    fontSize: 14,
    fontWeight: '700',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    backgroundColor: COLORS.lightest,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.darkest,
    borderWidth: 1,
    borderColor: COLORS.lighter,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightest,
  },
  sortLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: COLORS.lightest,
  },
  sortButtonActive: {
    backgroundColor: COLORS.medium,
  },
  sortButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sortButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkest,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;