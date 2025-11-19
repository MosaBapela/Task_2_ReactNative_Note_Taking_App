import { AuthResult, ValidationResult } from '../types';
import { getCurrentUser, getUserByEmail, saveUser, setCurrentUser } from './storage';

export const validateEmail = (email: string): boolean => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

export const validateUsername = (username: string): ValidationResult => {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  if (username.includes(' ')) {
    return { valid: false, message: 'Username cannot contain spaces' };
  }
  return { valid: true, message: '' };
};


export const registerUser = async (
  email: string, 
  password: string, 
  username: string
): Promise<AuthResult> => {
  try {
   
    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }
    
    const passwordValidation: ValidationResult = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.message };
    }
    
    const usernameValidation: ValidationResult = validateUsername(username);
    if (!usernameValidation.valid) {
      return { success: false, error: usernameValidation.message };
    }
    
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }
    
    
    const newUser = {
      email: email.toLowerCase(),
      password, 
      username,
      createdAt: new Date().toISOString(),
    };
    

    const result = await saveUser(newUser);
    
    if (result.success) {
      return { success: true, message: 'Registration successful!' };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
};


export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
   
    if (!email || !password) {
      return { success: false, error: 'Please enter email and password' };
    }
    
   
    const user = await getUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    
    if (user.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    
    await setCurrentUser(user.email);
    
    return { 
      success: true, 
      message: 'Login successful!',
      user: {
        email: user.email,
        username: user.username,
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
};


export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const currentUser: string | null = await getCurrentUser();
    return currentUser !== null;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};


export default {};