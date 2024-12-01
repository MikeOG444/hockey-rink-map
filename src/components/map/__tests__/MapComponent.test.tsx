import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapComponent from '../MapComponent';

// Mock the Google Maps JavaScript API
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children, onLoad }: { children: React.ReactNode, onLoad: (map: any) => void }) => {
    // Call onLoad with mock map object
    onLoad({ panTo: jest.fn() });
    return <div data-testid="google-map">{children}</div>;
  },
  useJsApiLoader: () => ({
    isLoaded: true,
    loadError: null,
  }),
  Marker: () => <div data-testid="map-marker" />,
}));

describe('MapComponent', () => {
  const mockLocation = {
    lat: 43.653225,
    lng: -79.383186,
  };

  // Clean up after each test
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  // Clean up after all tests
  afterAll(() => {
    jest.resetModules();
  });

  it('renders loading state when map is not loaded', () => {
    render(<MapComponent />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders marker when location is selected', () => {
    render(<MapComponent selectedLocation={mockLocation} />);
    expect(screen.getByTestId('map-marker')).toBeInTheDocument();
  });

  it('does not render marker when no location is selected', () => {
    render(<MapComponent />);
    expect(screen.queryByTestId('map-marker')).not.toBeInTheDocument();
  });

  it('calls onLoadCallback when map loads', () => {
    const mockCallback = jest.fn();
    render(<MapComponent onLoadCallback={mockCallback} />);
    expect(mockCallback).toHaveBeenCalledWith(expect.any(Object));
  });
}); 