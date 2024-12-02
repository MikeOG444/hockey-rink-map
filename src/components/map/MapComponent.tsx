import { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap } from '@react-google-maps/api';

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (onLoadCallback) {
      onLoadCallback(google.maps);
    }
  }, [onLoadCallback]);

  const onUnmount = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && selectedLocation) {
      console.log('MapComponent updating location:', selectedLocation);
      map.panTo(selectedLocation);
      map.setZoom(15);

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.map = null;
      }

      // Create new marker
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: selectedLocation
      });
    }
  }, [map, selectedLocation]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={selectedLocation || defaultCenter}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapId: process.env.REACT_APP_GOOGLE_MAPS_ID
      }}
    />
  );
};

export default MapComponent; 