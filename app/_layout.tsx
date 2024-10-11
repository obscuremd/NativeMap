import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthProvider from '~/Providers/AuthProvider';
import RideProvider from '~/Providers/RIdeProvider';
import ScooterProvider from '~/Providers/ScooterProvider';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ScooterProvider>
          <RideProvider>
            <Stack screenOptions={{headerShown:false}}/>
            <StatusBar style="light" />
          </RideProvider>
        </ScooterProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
