import { Redirect, Slot } from 'expo-router';

import { useAuth } from '~/Providers/AuthProvider';

export default function HomeLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return <Slot />;
}
