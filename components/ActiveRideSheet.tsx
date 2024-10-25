import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import { Image, Text, View } from 'react-native';

import { Button } from './Button';

import { useRide } from '~/Providers/RIdeProvider';

const ActiveRideSheet = () => {
  const { finishJourney, ride } = useRide();

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (ride) {
      bottomSheetRef?.current?.expand();
    }else{
        bottomSheetRef?.current?.close();
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
            <Text style={{color:'white', fontSize:20, fontWeight:'600'}}>Ride Started</Text>
            <Button title="FInish Journey" onPress={finishJourney} />
        </BottomSheetView>
      )}
    </BottomSheet>
  );
};

export default ActiveRideSheet;
