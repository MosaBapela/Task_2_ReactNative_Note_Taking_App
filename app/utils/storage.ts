// @ts-ignore: module has no type declarations in this project
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Note, SortBy, StorageResult, User } from '../types';


// Storage Keys - constants to avoid typos
const STORAGE_KEYS = {
  USERS: '@users',
  CURRENT_USER: '@currentUser',
  SESSION_START: '@sessionStart',
  NOTES: '@notes',
} as const;

// Save a new user to storage
export const saveUser = async (user: User): Promise<StorageResult> => {
  try {
    const users = await getAllUsers();
    users.push(user);
    if (Platform.OS === 'web') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving user:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get all registered users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    let usersJson;
    if (Platform.OS === 'web') {
      usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    } else {
      usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    }
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Find a user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    console.log('[getUserByEmail] Fetching user with email:', email);
    const users = await getAllUsers();
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    console.log('[getUserByEmail] Found user:', user);
    return user;
  } catch (error) {
    console.error('[getUserByEmail] Error finding user:', error);
    return null;
  }
};

// Update user credentials
export const updateUser = async (email: string, updates: Partial<User>): Promise<StorageResult> => {
  try {
    const users = await getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    if (Platform.OS === 'web') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    const currentUser = await getCurrentUser();
    if (currentUser === email) {
      await setCurrentUser(updates.email || email);
    }

    return { success: true, user: users[userIndex] };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: (error as Error).message };
  }
};


// Set current logged-in user and session start time
export const setCurrentUser = async (email: string): Promise<StorageResult> => {
  try {
    console.log('[setCurrentUser] Setting current user email:', email);
    const sessionStart = Date.now().toString();
    if (Platform.OS === 'web') {
      // For web, use localStorage as fallback
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
      localStorage.setItem(STORAGE_KEYS.SESSION_START, sessionStart);
      console.log('[setCurrentUser] Current user set successfully on web.');
      return { success: true };
    }
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_START, sessionStart);
    console.log('[setCurrentUser] Current user set successfully on native.');
    return { success: true };
  } catch (error) {
    console.error('[setCurrentUser] Error setting current user:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Get current logged-in user
export const getCurrentUser = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      // For web, use localStorage as fallback
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    }
    return await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Logout - clear current user
export const logout = async (): Promise<StorageResult> => {
  try {
    if (Platform.OS === 'web') {
      // For web, use localStorage as fallback
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return { success: true };
    }
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: (error as Error).message };
  }
};


// Get all notes for a specific user
export const getNotes = async (userEmail: string): Promise<Note[]> => {
  try {
    let notesJson;
    if (Platform.OS === 'web') {
      notesJson = localStorage.getItem(STORAGE_KEYS.NOTES);
    } else {
      notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    }
    const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
    return allNotes.filter(note => note.userEmail === userEmail);
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

// Save a new note
export const saveNote = async (note: Omit<Note, 'id' | 'dateAdded' | 'dateModified'>): Promise<StorageResult> => {
  try {
    let notesJson;
    if (Platform.OS === 'web') {
      notesJson = localStorage.getItem(STORAGE_KEYS.NOTES);
    } else {
      notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    }
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];

    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };

    notes.push(newNote);
    if (Platform.OS === 'web') {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    }
    return { success: true, note: newNote };
  } catch (error) {
    console.error('Error saving note:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Update an existing note
export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<StorageResult> => {
  try {
    let notesJson;
    if (Platform.OS === 'web') {
      notesJson = localStorage.getItem(STORAGE_KEYS.NOTES);
    } else {
      notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    }
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];

    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex === -1) {
      return { success: false, error: 'Note not found' };
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      ...updates,
      dateModified: new Date().toISOString(),
    };

    if (Platform.OS === 'web') {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    }
    return { success: true, note: notes[noteIndex] };
  } catch (error) {
    console.error('Error updating note:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Delete a note
export const deleteNote = async (noteId: string): Promise<StorageResult> => {
  try {
    console.log('deleteNote called with noteId:', noteId);
    let notesJson;
    if (Platform.OS === 'web') {
      notesJson = localStorage.getItem(STORAGE_KEYS.NOTES);
    } else {
      notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    }
    const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
    console.log('Current notes count before deletion:', notes.length);

    const filteredNotes = notes.filter(n => n.id !== noteId);
    console.log('Notes count after filtering:', filteredNotes.length);

    if (Platform.OS === 'web') {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filteredNotes));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filteredNotes));
    }
    console.log('Note deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Search notes by content
export const searchNotes = async (userEmail: string, searchTerm: string): Promise<Note[]> => {
  try {
    const notes = await getNotes(userEmail);
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return notes.filter(note => {
      const noteText = note.content.toLowerCase();
      const noteTitle = (note.title || '').toLowerCase();
      return noteText.includes(lowerSearchTerm) || noteTitle.includes(lowerSearchTerm);
    });
  } catch (error) {
    console.error('Error searching notes:', error);
    return [];
  }
};

// Sort notes
export const sortNotes = (notes: Note[], sortBy: SortBy = 'dateDesc'): Note[] => {
  const sortedNotes = [...notes];
  
  switch (sortBy) {
    case 'dateAsc':
      return sortedNotes.sort((a, b) => 
        new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      );
    case 'dateDesc':
      return sortedNotes.sort((a, b) => 
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    default:
      return sortedNotes;
  }
};


// Get session start time
export const getSessionStart = async (): Promise<number | null> => {
  try {
    let sessionStart;
    if (Platform.OS === 'web') {
      sessionStart = localStorage.getItem(STORAGE_KEYS.SESSION_START);
    } else {
      sessionStart = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_START);
    }
    return sessionStart ? parseInt(sessionStart, 10) : null;
  } catch (error) {
    console.error('Error getting session start:', error);
    return null;
  }
};

// Check if session is expired (5 minutes = 300000 ms)
export const isSessionExpired = async (): Promise<boolean> => {
  try {
    const sessionStart = await getSessionStart();
    if (!sessionStart) return true;

    const now = Date.now();
    const sessionDuration = now - sessionStart;
    const maxSessionTime = 5 * 60 * 1000; // 5 minutes in milliseconds

    return sessionDuration > maxSessionTime;
  } catch (error) {
    console.error('Error checking session expiration:', error);
    return true;
  }
};

// Clear all storage (useful for development/testing)
export const clearAllStorage = async (): Promise<StorageResult> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.clear();
    } else {
      await AsyncStorage.clear();
    }
    return { success: true };
  } catch (error) {
    console.error('Error clearing storage:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Default export so expo-router doesn't complain about missing default exports
export default {};