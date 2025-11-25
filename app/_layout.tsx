import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { getCurrentUser } from './utils/storage';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/auth/login');
      } else {
        router.replace('/(tabs)');
      }
    };
    checkAuth();
  }, []);

  return <Slot />;
}
