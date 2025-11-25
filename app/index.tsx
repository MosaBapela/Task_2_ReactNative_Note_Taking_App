import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { clearAllStorage } from './utils/storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const initializeApp = async () => {
      // Clear all saved data including users
      await clearAllStorage();
      // Always redirect to login page
      router.replace('/auth/login');
    };
    initializeApp();
  }, []);

  return null;
}
