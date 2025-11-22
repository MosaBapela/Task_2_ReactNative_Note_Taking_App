import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { getCurrentUser } from '../utils/storage';

export default function Register() {
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

  return <RegisterScreen />;
}
