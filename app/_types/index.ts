export interface User {
  email: string;
  password: string;
  username: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  category: Category;
  userEmail: string;
  dateAdded: string;
  dateModified: string;
}

export type Category = 'work' | 'study' | 'personal';

export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
  user?: {
    email: string;
    username: string;
  };
}

export interface StorageResult {
  success: boolean;
  error?: string;
  note?: Note;
  user?: User;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export type SortBy = 'dateAsc' | 'dateDesc';


export type RootStackParamList = {
  Main: undefined;
  AddNote: undefined;
  EditNote: { note: Note };
  CategoryNotes: { category: Category };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
};

export default {};
