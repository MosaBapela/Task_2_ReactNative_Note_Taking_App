// src/screens/notes/EditNoteScreen.tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATEGORY_COLORS, COLORS } from '../../constants/colors';
import { Category, Note } from '../../types';
import { getCurrentUser, getNotes, updateNote } from '../../utils/storage';

const EditNoteScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ note?: string; id?: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<Category>('personal');

  useEffect(() => {
    const loadNote = async () => {
      if (searchParams.note) {
        try {
          const parsedNote = JSON.parse(decodeURIComponent(searchParams.note));
          setNote(parsedNote);
          setTitle(parsedNote.title || '');
          setContent(parsedNote.content);
          setCategory(parsedNote.category);
        } catch (error) {
          console.error('Error parsing note:', error);
          Alert.alert('Error', 'Invalid note data');
          router.back();
        }
      } else if (searchParams.id) {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          Alert.alert('Error', 'User not logged in');
          router.back();
          return;
        }
        const notes = await getNotes(currentUser);
        const foundNote = notes.find(n => n.id === searchParams.id);
        if (foundNote) {
          setNote(foundNote);
          setTitle(foundNote.title || '');
          setContent(foundNote.content);
          setCategory(foundNote.category);
        } else {
          Alert.alert('Error', 'Note not found');
          router.back();
        }
      } else {
        Alert.alert('Error', 'No note data provided');
        router.back();
      }
    };
    loadNote();
  }, [searchParams.note, searchParams.id, router]);

  const handleUpdate = async (): Promise<void> => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter note content');
      return;
    }

    const result = await updateNote(note.id, {
      title: title.trim(),
      content: content.trim(),
      category,
    });

    if (result.success) {
      router.back();
    } else {
      Alert.alert('Error', 'Failed to update note');
    }
  };

  const categories: Category[] = ['work', 'study', 'personal'];

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title (Optional)</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter note title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  { backgroundColor: CATEGORY_COLORS[cat] },
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.categoryButtonText}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Enter your note here..."
            placeholderTextColor={COLORS.textLight}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdate}
        >
          <Text style={styles.saveButtonText}>Update Note</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightest,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkest,
    borderWidth: 1,
    borderColor: COLORS.lighter,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    opacity: 0.6,
  },
  categoryButtonActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  categoryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  contentInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.darkest,
    borderWidth: 1,
    borderColor: COLORS.lighter,
    minHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightest,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.lighter,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.darker,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditNoteScreen;