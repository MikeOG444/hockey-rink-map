import { useRef, useEffect } from 'react';

export const useMapMarkers = (map: google.maps.Map | null) => {
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];
  };

  const showSingleMarker = (location: google.maps.LatLngLiteral) => {
    clearMarkers();
    map?.panTo(location);
    map?.setZoom(15);

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: location
    });
    markersRef.current = [marker];
  };

  const showMultipleMarkers = (results: google.maps.places.PlaceResult[]) => {
    clearMarkers();
    const bounds = new google.maps.LatLngBounds();
    
    markersRef.current = results
      .filter(result => result.geometry?.location)
      .map(result => {
        const position = {
          lat: result.geometry!.location!.lat(),
          lng: result.geometry!.location!.lng()
        };
        bounds.extend(result.geometry!.location!);
        return new google.maps.marker.AdvancedMarkerElement({
          map,
          position,
          title: result.name
        });
      });

    if (markersRef.current.length > 0) {
      map?.fitBounds(bounds);
      if (markersRef.current.length === 1) {
        map?.setZoom(15);
      }
    }
  };

  useEffect(() => {
    return () => clearMarkers();
  }, []);

  return { showSingleMarker, showMultipleMarkers };
}; 