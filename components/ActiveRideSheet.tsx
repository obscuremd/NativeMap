import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import { Image, Text, View } from 'react-native';

import { Button } from './Button';

import { useRide } from '~/Providers/RIdeProvider';

const ActiveRideSheet = () => {
  const { startJourney, ride } = useRide();

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (ride) {
      bottomSheetRef?.current?.expand();
    }
  }, [ride]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#414442' }}>
      {ride && (
        <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
          <View />

          <View>
            <Button title="FInish Journey" />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
};

export default ActiveRideSheet;
