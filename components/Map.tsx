import Mapbox, {
  Camera,
  CircleLayer,
  Images,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import React from 'react';

import LineRoute from './LineRoute';
import SingleScooterMarker from './SIngleScooterMarker';
import ScooterMarker from './ScooterMarker';

import { useRide } from '~/Providers/RIdeProvider';
import { useScooter } from '~/Providers/ScooterProvider';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const Map = () => {
  const { ride, rideRoute } = useRide();
  const { directionCoordinate } = useScooter();

  // const points = nearbyScooters.map((scooter) => point([scooter.long, scooter.lat], { scooter }));

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followZoomLevel={11} followUserLocation />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

      {rideRoute && ride && (
        <>
          <SingleScooterMarker />
          {directionCoordinate && <LineRoute coordinate={directionCoordinate} />}
          <LineRoute coordinate={rideRoute} />
        </>
      )}

      {!ride && (
        <>
          <ScooterMarker />
          {directionCoordinate && <LineRoute coordinate={directionCoordinate} />}
        </>
      )}
    </MapView>
  );
};

export default Map;
