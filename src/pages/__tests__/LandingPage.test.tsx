import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from '../LandingPage';
import { auth } from '../../config/firebase';

// Mock Firebase Auth
jest.mock('../../config/firebase', () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

// Mock react-firebase-hooks
jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false, undefined], // [user, loading, error]
}));

// Mock MapComponent
jest.mock('../../components/map/MapComponent', () => ({
  __esModule: true,
  default: () => <div data-testid="map-component" />,
}));

describe('LandingPage', () => {
  it('renders the title', () => {
    render(<LandingPage />);
    expect(screen.getByText('Hockey Rink Map')).toBeInTheDocument();
  });

  it('shows login button when user is not authenticated', () => {
    render(<LandingPage />);
    expect(screen.getByText('Login / Sign Up')).toBeInTheDocument();
  });

  it('opens auth modal when login button is clicked', () => {
    render(<LandingPage />);
    fireEvent.click(screen.getByText('Login / Sign Up'));
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('renders map component', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('map-component')).toBeInTheDocument();
  });

  // Add more tests as needed
}); 