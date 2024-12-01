import { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 43.653225,
  lng: -79.383186
};

interface MapComponentProps {
  onLoadCallback?: (maps: typeof google.maps) => void;
  selectedLocation?: google.maps.LatLngLiteral | null;
}

const MapComponent = ({ onLoadCallback, selectedLocation }: MapComponentProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (onLoadCallback) {
      onLoadCallback(google.maps);
    }
  }, [onLoadCallback]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && selectedLocation) {
      console.log('MapComponent received location:', selectedLocation);
      map.panTo(selectedLocation);
    }
  }, [map, selectedLocation]);

  if (loadError) return <div>Map cannot be loaded right now</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={selectedLocation || defaultCenter}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {selectedLocation && (
        <Marker position={selectedLocation} />
      )}
    </GoogleMap>
  );
};

export default MapComponent; 