import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapComponent from '../MapComponent';

// Mock the environment variable
process.env.REACT_APP_GOOGLE_MAPS_API_KEY = 'test-api-key';

// Update the mock to handle more of the component's requirements
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children, onLoad, center, zoom }: any) => {
    // Simulate map load immediately
    setTimeout(() => {
      if (onLoad) {
        onLoad({
          panTo: jest.fn(),
          setCenter: jest.fn(),
          setZoom: jest.fn(),
        });
      }
    }, 0);
    return <div data-testid="google-map">{children}</div>;
  },
  useJsApiLoader: () => ({
    isLoaded: true,
    loadError: null,
  }),
  Marker: ({ position }: any) => (
    <div data-testid="map-marker" data-lat={position?.lat} data-lng={position?.lng} />
  ),
}));

describe('MapComponent', () => {
  const mockLocation = {
    lat: 43.653225,
    lng: -79.383186,
  };

  it('renders loading state when map is loaded', () => {
    render(<MapComponent />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders marker when location is selected', () => {
    render(<MapComponent selectedLocation={mockLocation} />);
    const marker = screen.getByTestId('map-marker');
    expect(marker).toBeInTheDocument();
    expect(marker.dataset.lat).toBe(mockLocation.lat.toString());
    expect(marker.dataset.lng).toBe(mockLocation.lng.toString());
  });

  it('does not render marker when no location is selected', () => {
    render(<MapComponent />);
    expect(screen.queryByTestId('map-marker')).not.toBeInTheDocument();
  });

  it('calls onLoadCallback when map loads', async () => {
    const mockCallback = jest.fn();
    render(<MapComponent onLoadCallback={mockCallback} />);
    
    // Wait for the next tick to allow the setTimeout in the mock to execute
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockCallback).toHaveBeenCalled();
  });
}); 