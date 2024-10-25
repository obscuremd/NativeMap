/* eslint-disable prettier/prettier */
import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { Image, Text, View } from 'react-native';

import { Button } from './Button';

import { useScooter } from '~/Providers/ScooterProvider';
import { useRide } from '~/Providers/RIdeProvider';

const SelectedScooterSheet = () => {
  const { selectedScooter, setSelectedScooter, duration, distance} = useScooter();
  const {  startJourney } = useRide();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (selectedScooter) {
      bottomSheetRef?.current?.expand();
    }
  }, [selectedScooter]);

  return (
    <BottomSheet 
        ref={bottomSheetRef} 
        index={-1} 
        snapPoints={[200]} 
        enablePanDownToClose 
        backgroundStyle={{backgroundColor:'#414442'}}>  
      <BottomSheetView style={{flex:1, padding:10, gap:20  }}>
        {/* top */}
        <View style={{flexDirection:'row', alignItems:'center', gap:10,}}>
            <Image source={require('~/assets/scooter.png')} style={{ width: 60, height: 60 }} />
            <View style={{flex:1, gap:5}}>
                <Text style={{color:'white', fontSize:20, fontWeight:'600'}}>Pinoy - s</Text>
                <Text style={{color:'gray'}}>ID-{selectedScooter?.id} - Madison Avenue</Text>
            </View>
            
            <View style={{gap:5}}>
                <View style={{flexDirection:'row', alignItems:'center', gap:5, alignSelf:'flex-start'}}>
                    <FontAwesome6 name="bolt-lightning" size={18} color="#4AC2B3"  />
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>
                        {(distance ? distance / 1000 : 0).toFixed(1)} km
                    </Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', gap:5, alignSelf:'flex-start'}}>
                    <FontAwesome5 name="clock" size={18} color="#4AC2B3"  />
                    <Text style={{color:'white', fontWeight:'bold', fontSize:18}}>{(duration ? duration /60 : 0).toFixed(0)} min</Text>
                </View>
            </View>
        </View>
        {/* bottom */}
        <View>
            <Button 
              title='Start Journey' 
              onPress={(()=>selectedScooter &&[ startJourney(selectedScooter.id ),setSelectedScooter(null)])}/>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default SelectedScooterSheet;
