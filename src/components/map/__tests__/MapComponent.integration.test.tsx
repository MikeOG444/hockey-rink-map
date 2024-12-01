import { render, screen, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapComponent from '../MapComponent';

// Simplified mock
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children, onLoad }: { children: React.ReactNode, onLoad: (map: any) => void }) => {
    // Immediately call onLoad and return
    setTimeout(() => onLoad({ panTo: jest.fn() }), 0);
    return <div data-testid="google-map">{children}</div>;
  },
  useJsApiLoader: () => ({
    isLoaded: true,
    loadError: null,
  }),
  Marker: () => <div data-testid="map-marker" />,
}));

describe('MapComponent Integration', () => {
  const mockLocation = {
    lat: 43.653225,
    lng: -79.383186,
  };

  beforeEach(() => {
    cleanup();
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('updates marker position when location changes', () => {
    const { rerender } = render(<MapComponent />);
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByTestId('map-marker')).not.toBeInTheDocument();
    
    rerender(<MapComponent selectedLocation={mockLocation} />);
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('map-marker')).toBeInTheDocument();
  });

  it('handles map load errors', () => {
    const mockCallback = jest.fn();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<MapComponent onLoadCallback={mockCallback} />);
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(mockCallback).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
}); 