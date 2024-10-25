import * as Location from 'expo-location';
import { createContext, PropsWithChildren, useContext, useEffect, useId, useState } from 'react';
import { Alert } from 'react-native';

import { useAuth } from './AuthProvider';
import { useScooter } from './ScooterProvider';

import { supabase } from '~/lib/supabase';
import { fetchDirectionBasedOnCoords } from '~/services/directions';

const RideContext = createContext<RideContextType | undefined>(undefined);

interface RideProps {
  created_at: string;
  driver_id: number;
  finished_at: string;
  id: number;
  user_id: string;
}

interface RideContextType {
  startJourney: (scooterId: number) => void;
  finishJourney: () => void;
  ride: RideProps | undefined;
  rideRoute: [number, number][];
}

const RideProvider = ({ children }: PropsWithChildren) => {
  const [ride, setRide] = useState<RideProps | undefined>(undefined);
  const [rideRoute, setRideRoute] = useState<[number, number][]>([]);

  const { userId } = useAuth();
  const { setSelectedScooter } = useScooter();

  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .single();

      if (data) {
        console.log('data:', data);
        setRide(data);
      } else if (error) {
        console.log('error:', error);
      }
    };
    fetchActiveRide();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync({ distanceInterval: 20 }, (newLocation) => {
        // console.log(newLocation.coords.latitude, newLocation.coords.longitude);
        setRideRoute((currentRoute) => [
          ...currentRoute,
          [newLocation.coords.longitude, newLocation.coords.latitude],
        ]);
      });
    };

    const fetchDriver = async () => {
      const driverId = ride?.driver_id;
      const { data, error } = await supabase.rpc('fetch_driver_location', { driver_id: driverId });

      if (error) {
        console.error('Error fetching driver:', error);
        return;
      }

      if (data) {
        // Log the driver data with extracted lat/long
        setSelectedScooter(data);
        console.log('Driver:', data);
      } else {
        console.log('No driver data found');
      }
    };
    
    fetchDriver();
    watchLocation();
  }, [ride]);

  //   console.log('ride', rideRoute)

  const startJourney = async (scooterId: number) => {
    if (ride) {
      Alert.alert('there is a ride in progress');
    } else if (scooterId === null) {
    } else {
      const { data, error } = await supabase
        .from('rides')
        .insert([{ user_id: userId, driver_id: scooterId }])
        .select()
        .single();
      if (error) {
        console.error(error);
        Alert.alert('failed to start ride');
      } else {
        Alert.alert('ride started');
        // console.log(data);
        setRide(data);
      }
    }
  };

  const finishJourney = async () => {
    if (!ride) {
    }

    const actualRoute = await fetchDirectionBasedOnCoords(rideRoute);
    // const rideRouteCoords = actualRoute.matchings[0].geometry.coordinates;
    // const rideRouteDuration = actualRoute.matchings[0].duration;
    // const rideRouteDistance = actualRoute.matchings[0].distance;
    // setRideRoute(actualRoute.matchings[0].geometry.coordinates);
    console.log('actual route', actualRoute);

    const { error } = await supabase
      .from('rides')
      .update({
        finished_at: new Date(),
        // routeDuration: rideRouteDuration,
        // routeDistance: rideRouteDistance,
        // routeCoords: rideRouteCoords,
      })
      .eq('id', ride?.id);
    if (error) {
      Alert.alert('error finishing ride');
    } else {
      setRide(undefined);
    }
  };

  return (
    <RideContext.Provider value={{ startJourney, ride, finishJourney, rideRoute }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

export default RideProvider;
