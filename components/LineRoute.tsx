import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import React from 'react';

interface LineRouteProps {
  coordinate: [number, number][] | undefined; // Array of coordinate pairs
}

const LineRoute: React.FC<LineRouteProps> = ({ coordinate }) => {
  return (
    <>
      {coordinate && (
        <ShapeSource
          id="routeSource"
          lineMetrics
          shape={{
            properties: {},
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coordinate,
            },
          }}>
          <LineLayer
            id="exampleLineLayer"
            style={{
              lineColor: '#4AC2B3',
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: 2,
              lineDasharray: [6, 2],
            }}
          />
        </ShapeSource>
      )}
    </>
  );
};

export default LineRoute;
