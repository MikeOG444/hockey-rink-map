import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };

export const mockGoogleMaps = () => {
  global.google = {
    maps: {
      Map: jest.fn(),
      Marker: jest.fn(),
      places: {
        Autocomplete: jest.fn(),
      },
      LatLng: jest.fn(),
      LatLngBounds: jest.fn(),
    },
  } as any;
}; 