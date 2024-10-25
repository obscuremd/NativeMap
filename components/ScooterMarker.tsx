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
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import React from 'react';

import { useScooter } from '~/Providers/ScooterProvider';
import pin from '~/assets/pin.png';

const ScooterMarker = () => {
  const { setSelectedScooter, nearbyScooters } = useScooter();

  const points = nearbyScooters.map((scooter) => point([scooter.long, scooter.lat], { scooter }));
  const scooterFeatures = featureCollection(points);

  const onPointPress = async (event: OnPressEvent) => {
    // console.log(JSON.stringify(event,null,2))
    if (
      event?.features?.length && // Check if there are features
      event.features[0]?.properties && // Ensure properties is not null or undefined
      event.features[0].properties.scooter // Check if the scooter property exists
    ) {
      setSelectedScooter(event.features[0].properties.scooter);
    } else {
      console.log('No valid scooter data found on point press');
    }
  };

//   console.log('features:',scooterFeatures)

  return (
    <>
      <ShapeSource id="scooters" cluster shape={scooterFeatures} onPress={onPointPress}>
        <SymbolLayer
          id="cluster-count"
          style={{
            textField: ['get', 'point_count'],
            textSize: 16,
            textColor: '#ffffff',
            textPitchAlignment: 'map',
          }}
        />

        <CircleLayer
          id="clusters"
          belowLayerID="cluster-count"
          filter={['has', 'point_count']}
          style={{
            circleColor: '#4AC2B3',
            circlePitchAlignment: 'map',
            circleRadius: 20,
            circleOpacity: 0.7,
            circleStrokeWidth: 2,
            circleStrokeColor: 'white',
          }}
        />

        <SymbolLayer
          id="scooterIcon"
          filter={['!', ['has', 'point_count']]}
          style={{
            iconImage: 'pin',
            iconSize: 0.3,
            iconAllowOverlap: true,
            iconAnchor: 'bottom',
          }}
        />

        <Images images={{ pin }} />
      </ShapeSource>

      
    </>
  );
};

export default ScooterMarker;
