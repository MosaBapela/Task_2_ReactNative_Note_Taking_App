import { Tabs, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { getCurrentUser, isSessionExpired, logout } from '../utils/storage';

export default function TabLayout() {
  const router = useRouter();

  const checkAuthAndSession = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    const expired = await isSessionExpired();
    if (expired) {
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [
          {
            text: 'OK',
            onPress: async () => {
              await logout();
              router.replace('/auth/login');
            },
          },
        ]
      );
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndSession();
  }, [checkAuthAndSession]);

  useFocusEffect(
    useCallback(() => {
      checkAuthAndSession();
    }, [checkAuthAndSession])
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.darker,
        tabBarInactiveTintColor: COLORS.dark,
        tabBarStyle: {
          backgroundColor: COLORS.light,
        },
        headerStyle: {
          backgroundColor: COLORS.darker,
        },
        headerTintColor: COLORS.light,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
