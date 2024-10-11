import { createContext, PropsWithChildren, useContext, useEffect, useId, useState } from 'react';
import { Alert } from 'react-native';

import { useAuth } from './AuthProvider';

import { supabase } from '~/lib/supabase';

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
  ride: RideProps | undefined;
}

const RideProvider = ({ children }: PropsWithChildren) => {
  const [ride, setRide] = useState<RideProps | undefined>(undefined);

  const { userId } = useAuth();

  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .single();

      if (data) {
        console.log("data:",data);
        setRide(data);
      } else if (error) {
        console.log('error:',error);
      }
    };
    fetchActiveRide();
  }, []);

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
        console.log(data);
        setRide(data);
      }
    }
  };

  return <RideContext.Provider value={{ startJourney, ride }}>{children}</RideContext.Provider>;
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

export default RideProvider;
