import * as Location from 'expo-location';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useAuth } from './AuthProvider';

import { supabase } from '~/lib/supabase';
import { getDirections } from '~/services/directions';

interface nearbyScooterProps {
  id: number;
  battery: number;
  lat: number;
  long: number;
  dist_meters: number;
}
interface ScooterContextType {
  selectedScooter: Scooter | null;
  setSelectedScooter: (scooter: Scooter) => void;
  direction: DirectionsResponse | null;
  directionCoordinate: [number, number][] | undefined;
  duration: number | undefined;
  distance: number | undefined;
  nearbyScooters: nearbyScooterProps[];
  
}

const ScooterContext = createContext<ScooterContextType | undefined>(undefined);

const ScooterProvider = ({ children }: PropsWithChildren) => {
  const [nearbyScooters, setNearbyScooters] = useState([]);
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [direction, setDirection] = useState<DirectionsResponse | null>(null);

  useEffect(() => {
    const fetchScooters = async () => {
      const myLocation = await Location.getCurrentPositionAsync();
      // console.log(myLocation.coords)
      const { data, error } = await supabase.rpc('nearby_drivers', {
        lat: myLocation.coords.latitude,
        long: myLocation.coords.longitude,
        max_dist_meters: 10000,
      });
      if (error) {
        Alert.alert('failed to fetch drivers');
      } else {
        // console.log(JSON.stringify(data, null, 2))
        setNearbyScooters(data);
      }
    };

    fetchScooters();
  }, []);

  useEffect(() => {
    const fetchDirections = async () => {
      const myLocation = await Location.getCurrentPositionAsync();
      // console.log(myLocation)
      if (selectedScooter) {
        const newDirection = await getDirections(
          [myLocation.coords.longitude, myLocation.coords.latitude],
          [selectedScooter.long, selectedScooter.lat]
        );
        // console.log('New Direction:', newDirection);
        setDirection(newDirection);
      }
    };

    if (selectedScooter) {
      fetchDirections();
    }
  }, [selectedScooter]);
  //   console.log('selectedScooter', direction)

  return (
    <ScooterContext.Provider
      value={{
        nearbyScooters,
        selectedScooter,
        setSelectedScooter,
        direction,
        directionCoordinate: direction?.routes?.[0]?.geometry?.coordinates,
        duration: direction?.routes?.[0].duration,
        distance: direction?.routes?.[0].distance,
      }}>
      {children}
    </ScooterContext.Provider>
  );
};

export default ScooterProvider;

export const useScooter = () => {
  const context = useContext(ScooterContext);
  if (!context) {
    throw new Error('useScooter must be used within a ScooterProvider');
  }
  return context;
};
