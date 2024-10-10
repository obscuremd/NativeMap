/* eslint-disable prettier/prettier */
import * as Location from 'expo-location';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { getDirections } from '~/services/directions';

interface ScooterContextType {
    selectedScooter: Scooter | null;
    setSelectedScooter: (scooter: Scooter) => void;
    direction: DirectionsResponse | null;
    directionCoordinate: [number, number][] | undefined;
    duration: number | undefined;
    distance: number | undefined;
  }

const ScooterContext = createContext<ScooterContextType | undefined>(undefined);

const ScooterProvider = ({ children }: PropsWithChildren) => {
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [direction, setDirection] = useState<DirectionsResponse | null>(null);

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
            selectedScooter, 
            setSelectedScooter, 
            direction,
            directionCoordinate : direction?.routes?.[0]?.geometry?.coordinates,
            duration: direction?.routes?.[0].duration,
            distance: direction?.routes?.[0].distance
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
}
