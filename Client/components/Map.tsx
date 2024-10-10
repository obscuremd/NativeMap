/* eslint-disable prettier/prettier */
import Mapbox, { Camera, CircleLayer, Images,  LineLayer, LocationPuck, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {featureCollection, point} from '@turf/helpers'
import { StyleSheet} from 'react-native';

import { useScooter } from '~/Providers/ScooterProvider';
import pin from '~/assets/pin.png'
import scooters from '~/data/scooters.json'

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const Map = () => {

    const {setSelectedScooter, directionCoordinate, duration} = useScooter()
    // console.log('time:', duration)

    const points = scooters.map((scooter)=> point([scooter.long, scooter.lat],{scooter}))
    const scooterFeatures = featureCollection(points)

    const onPointPress = async(event: OnPressEvent) =>{
      // console.log(JSON.stringify(event,null,2))
      if (
        event?.features?.length &&  // Check if there are features
        event.features[0]?.properties &&  // Ensure properties is not null or undefined
        event.features[0].properties.scooter // Check if the scooter property exists
      ) {
        setSelectedScooter(event.features[0].properties.scooter);
      } else {
        console.log('No valid scooter data found on point press');
      }
    }

  return (
      <MapView style={{ flex:1 }} styleURL='mapbox://styles/mapbox/dark-v11'>
        <Camera followZoomLevel={11} followUserLocation/>
        <LocationPuck puckBearingEnabled puckBearing='heading' pulsing={{isEnabled:true}}/>

        <ShapeSource id='scooters' cluster shape={scooterFeatures} onPress={onPointPress}>
            <SymbolLayer 
              id='cluster-count' 
              style={{
                textField:['get','point_count'],
                textSize: 16,
                textColor:'#ffffff',
                textPitchAlignment:'map'
              }}/>
            
            <CircleLayer 
              id='clusters' 
              belowLayerID='cluster-count'
              filter={['has', 'point_count']}
              style={{
                circleColor:'#4AC2B3',
                circlePitchAlignment:"map",
                circleRadius:20,
                circleOpacity:0.7,
                circleStrokeWidth:2,
                circleStrokeColor:'white'
                }}/>
            
            <SymbolLayer 
              id='scooterIcon' 
              filter={['!',['has', 'point_count']]} 
              style={{
                iconImage:'pin', 
                iconSize:0.3, 
                iconAllowOverlap:true, 
                iconAnchor:'bottom'}} />
            
            <Images images={{pin}}/>
        </ShapeSource>

        {directionCoordinate && (
          <ShapeSource
            id='routeSource'
            lineMetrics
            shape={{
              properties:{},
              type:'Feature',
              geometry:{
                type:'LineString',
                coordinates: directionCoordinate
              }
            }}>
              <LineLayer
                id='exampleLineLayer'
                style={{
                  lineColor:'#4AC2B3',
                  lineCap:'round',
                  lineJoin:'round',
                  lineWidth:2,
                  lineDasharray:[6,2]
                }}
              />
            </ShapeSource>
        )}
      
      </MapView>
  );
};

export default Map;
 
const styles = StyleSheet.create({});
