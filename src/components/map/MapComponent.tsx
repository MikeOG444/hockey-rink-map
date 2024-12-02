import { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useMarkerCreation } from '../../hooks/useMarkerCreation';

interface MarkerInfo {
  marker: google.maps.marker.AdvancedMarkerElement;
  infoWindow: google.maps.InfoWindow;
}

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
  searchResults?: google.maps.places.PlaceResult[];
}

const MapComponent = ({ onLoadCallback, selectedLocation, searchResults }: MapComponentProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerInfo[]>([]);
  const activeInfoWindow = useRef<google.maps.InfoWindow | null>(null);

  // Debug function to log place details
  const logPlaceDetails = (place: google.maps.places.PlaceResult | null, source: string) => {
    console.group(`Place Details from ${source}`);
    console.log('Place:', {
      name: place?.name,
      address: place?.formatted_address,
      rating: place?.rating,
      types: place?.types,
      placeId: place?.place_id
    });
    console.groupEnd();
  };

  const createInfoWindow = useCallback((place: google.maps.places.PlaceResult | null, position: google.maps.LatLngLiteral) => {
    console.log('Creating info window for:', place?.name || 'unknown location');
    
    if (place) {
      logPlaceDetails(place, 'createInfoWindow');
    }

    const content = place ? `
      <div style="padding: 12px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #333;">${place.name || 'Location'}</h3>
        ${place.formatted_address ? `<p style="margin: 0; color: #666;">${place.formatted_address}</p>` : ''}
        ${place.rating ? `<p style="margin: 4px 0;">Rating: ${place.rating} ⭐</p>` : ''}
        ${place.types ? `<p style="margin: 4px 0; color: #666;">Type: ${place.types[0].replace(/_/g, ' ')}</p>` : ''}
      </div>
    ` : `
      <div style="padding: 8px;">
        <p style="margin: 0;">Location: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</p>
      </div>
    `;

    return new google.maps.InfoWindow({
      content,
      ariaLabel: place?.name || "Location Info"
    });
  }, []);

  const handleMarkerClick = useCallback((marker: google.maps.marker.AdvancedMarkerElement) => {
    console.log('Marker clicked');
    
    if (activeInfoWindow.current) {
      console.log('Closing existing info window');
      activeInfoWindow.current.close();
    }

    const markerInfo = markersRef.current.find(info => info.marker === marker);
    if (markerInfo) {
      console.log('Opening info window for:', markerInfo.marker.title);
      markerInfo.infoWindow.open({
        map,
        anchor: marker
      });
      activeInfoWindow.current = markerInfo.infoWindow;
    } else {
      console.warn('No marker info found for clicked marker');
    }
  }, [map]);

  const { createMarkerRef } = useMarkerCreation(map);

  const createMarker = useCallback((
    position: google.maps.LatLngLiteral,
    title: string = '',
    place: google.maps.places.PlaceResult | null = null
  ) => {
    const marker = createMarkerRef(position, title, place, handleMarkerClick);
    const infoWindow = createInfoWindow(place, position);
    return { marker, infoWindow };
  }, [createMarkerRef, handleMarkerClick, createInfoWindow]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (onLoadCallback) {
      onLoadCallback(google.maps);
    }
  }, [onLoadCallback]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach(({ marker, infoWindow }) => {
      marker.map = null;
      infoWindow.close();
    });
    markersRef.current = [];
  };

  // Handle single selected location
  useEffect(() => {
    if (map && selectedLocation) {
      clearMarkers();
      
      map.panTo(selectedLocation);
      map.setZoom(15);

      const markerInfo = createMarker(selectedLocation, '', null);
      markersRef.current = [markerInfo];
    }
  }, [map, selectedLocation, createMarker]);

  const createMarkerElement = useCallback(() => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.cursor = 'pointer'; // Make sure cursor shows it's clickable
    
    markerElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" 
           height="40" 
           viewBox="0 0 24 24" 
           width="40"
           style="position: absolute; left: -20px; top: -20px;"
           fill="#FF0000">
        <g><rect fill="none" height="24" width="24"/></g>
        <g><g>
          <path d="M2,17v3l2,0v-4H3C2.45,16,2,16.45,2,17z"/>
          <path d="M9,16H5v4l4.69-0.01c0.38,0,0.72-0.21,0.89-0.55l0.87-1.9l-1.59-3.48L9,16z"/>
          <g><path d="M21.71,16.29C21.53,16.11,21.28,16,21,16h-1v4l2,0v-3C22,16.72,21.89,16.47,21.71,16.29z"/></g>
          <path d="M13.6,12.84L17.65,4H14.3l-1.76,3.97l-0.49,1.1L12,9.21L9.7,4H6.35l4.05,8.84l1.52,3.32L12,16.34l1.42,3.1 c0.17,0.34,0.51,0.55,0.89,0.55L19,20v-4h-4L13.6,12.84z"/>
        </g></g>
      </svg>
    `;

    return markerElement;
  }, []);

  // Handle search results
  useEffect(() => {
    if (map && searchResults?.length) {
      console.log('Processing search results:', searchResults.length);
      clearMarkers();

      const bounds = new google.maps.LatLngBounds();
      const service = new google.maps.places.PlacesService(map);
      
      const processResults = async () => {
        console.group('Processing Search Results');
        
        const markerPromises = searchResults.map(async (result) => {
          if (!result.geometry?.location) {
            console.warn('No geometry location for result:', result.name);
            return null;
          }
          
          const position = {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          };
          
          bounds.extend(result.geometry.location);

          try {
            console.log('Fetching details for place ID:', result.place_id);
            const detailedPlace = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
              if (!result.place_id) {
                reject('No place ID available');
                return;
              }

              service.getDetails(
                {
                  placeId: result.place_id,
                  fields: [
                    'name',
                    'formatted_address',
                    'rating',
                    'types',
                    'geometry',
                    'website',
                    'formatted_phone_number',
                    'opening_hours'
                  ]
                },
                (place, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    console.log('Received place details:', place);
                    resolve(place);
                  } else {
                    reject(status);
                  }
                }
              );
            });

            const markerElement = createMarkerElement();
            const marker = new google.maps.marker.AdvancedMarkerElement({
              map,
              position,
              title: detailedPlace.name,
              content: markerElement
            });

            const infoWindow = createInfoWindow(detailedPlace, position);

            // Test event listeners
            markerElement.addEventListener('mouseover', () => {
              console.log('Marker mouseover event triggered');
              if (activeInfoWindow.current) {
                activeInfoWindow.current.close();
              }
              infoWindow.open({
                map,
                anchor: marker
              });
              activeInfoWindow.current = infoWindow;
            });

            markerElement.addEventListener('click', () => {
              console.log('Marker click event triggered');
              if (activeInfoWindow.current) {
                activeInfoWindow.current.close();
              }
              infoWindow.open({
                map,
                anchor: marker
              });
              activeInfoWindow.current = infoWindow;
            });

            return { marker, infoWindow };
          } catch (error) {
            console.error('Error processing place:', error);
            return null;
          }
        });

        console.log('Waiting for all markers to be created...');
        const markers = (await Promise.all(markerPromises)).filter((markerInfo): markerInfo is MarkerInfo => markerInfo !== null);
        console.log('Created markers:', markers.length);
        
        markersRef.current = markers;

        if (markers.length > 0) {
          map.fitBounds(bounds);
          if (markers.length === 1) {
            map.setZoom(15);
          }
        }
        
        console.groupEnd();
      };

      processResults();
    }
  }, [map, searchResults, createInfoWindow]);

  // Update the text search request to include more fields
  const handleSearchQuery = (query: string) => {
    const mapElement = document.querySelector('div[aria-label="Map"]');
    if (!mapElement) return;
    
    const service = new google.maps.places.PlacesService(mapElement as HTMLDivElement);
    
    service.textSearch(
      {
        query: query
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // @ts-ignore
          setSearchResults(results);
          // @ts-ignore 
          setSelectedLocation(null);
        }
      }
    );
  };

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