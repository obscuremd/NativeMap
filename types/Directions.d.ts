interface RouteGeometry {
    coordinates: [number, number][];
  }
  
  interface Route {
    geometry: RouteGeometry;
    duration: number;
    distance: number;
  }
  
  interface DirectionsResponse {
    routes: Route[];
  }

  interface Scooter {
    id: number;
    long: number;
    lat: number;
    // Add any other properties related to the scooter here
  }



  