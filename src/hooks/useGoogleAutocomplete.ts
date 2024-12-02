import { useRef, useEffect, useCallback } from 'react';

interface AutocompleteOptions {
  onPlaceSelect: (location: google.maps.LatLngLiteral, address: string) => void;
  onSearchQuery?: (query: string) => void;
}

const createAutocomplete = (element: HTMLInputElement) => {
  return new window.google.maps.places.Autocomplete(element, {
    types: ['geocode', 'establishment'],
    componentRestrictions: { country: 'ca' },
    fields: ['geometry', 'name', 'formatted_address']
  });
};

const extractPlaceData = (place: google.maps.places.PlaceResult) => {
  if (!place.geometry?.location) return null;
  
  return {
    location: {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    },
    address: place.name || place.formatted_address || ''
  };
};

export const useGoogleAutocomplete = ({ onPlaceSelect, onSearchQuery }: AutocompleteOptions) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    const placeData = place && extractPlaceData(place);
    if (placeData) {
      onPlaceSelect(placeData.location, placeData.address);
    }
  }, [onPlaceSelect]);

  useEffect(() => {
    if (searchInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = createAutocomplete(searchInputRef.current);
      autocompleteRef.current.addListener('place_changed', handlePlaceChanged);
    }

    // Cleanup function
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [handlePlaceChanged]);

  return { searchInputRef };
}; 