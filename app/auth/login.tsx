import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import { getCurrentUser } from '../utils/storage';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.replace('/(tabs)');
      }
    };
    checkAuth();
  }, []);

  return <LoginScreen />;
}
