const BASE_URL = 'https://api.mapbox.com';
const mapBoxKey = process.env.EXPO_PUBLIC_MAPBOX_KEY || 'sk.eyJ1Ijoib2JzY3VyZW1kIiwiYSI6ImNtMXl0Y3g4bzAwM2MyanF2bjFxd2ExMDAifQ.6hfkV4GSm3rrx6YSMUE9WA'

export async function getDirections(from:Array<number>, to:Array<number>) {
  const response = await fetch(
    `${BASE_URL}/directions/v5/mapbox/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${mapBoxKey}`
  );
  const json = await response.json();
  return json;
}

export async function fetchDirectionBasedOnCoords(coordinates:[number, number][]) {
  const coordinatesString = coordinates.map((coord) => `${coord[0]},${coord[1]}`).join(';');
  const response = await fetch(
    `${BASE_URL}/matching/v5/mapbox/cycling/${coordinatesString}?annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=${mapBoxKey}`
  );
  const json = await response.json();
  return json;
}
