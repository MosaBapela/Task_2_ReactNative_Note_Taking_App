import React from 'react';

// Render route children directly. The app provides its own NavigationContainer
// in `app/index.tsx`, so avoid creating another one here to prevent nested
// NavigationContainer errors when running on web.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
