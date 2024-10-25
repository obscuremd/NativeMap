import Mapbox, { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import React from 'react';

import { useScooter } from '~/Providers/ScooterProvider';
import pin from '~/assets/pin.png';

const SingleScooterMarker = () => {
  const { selectedScooter } = useScooter();

  if (!selectedScooter) {
    return null; // No scooter selected, return nothing
  }

  const scooter = selectedScooter[0]
  // Log the selected scooter to verify its properties

  // Extract latitude and longitude
  const { lat, long } = scooter;
  console.log(lat, long)

  // Validate coordinates
  if (typeof lat !== 'number' || typeof long !== 'number') {
    console.error('Invalid coordinates:', { lat, long });
    return null; // Prevent further execution if coordinates are invalid
  }

  // Convert selected scooter to a GeoJSON feature collection
  const points = [point([long, lat], { scooter })]; // Order: [longitude, latitude]
  const scooterFeatures = featureCollection(points);

  return (
    <ShapeSource id="singleScooter" shape={scooterFeatures}>
      <SymbolLayer
        id="singleScooterIcon"
        style={{
          iconImage: 'pin',
          iconSize: 0.3,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  );
};

export default SingleScooterMarker;
