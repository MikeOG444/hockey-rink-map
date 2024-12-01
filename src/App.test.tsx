import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import App from './App';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn()
}));

// Setup mock before tests
beforeEach(() => {
  // Create a mock auth object
  const mockAuth = {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null); // Simulate no user logged in
      return () => {}; // Return unsubscribe function
    }),
    currentUser: null
  };

  // Make getAuth return our mock auth object
  (getAuth as jest.Mock).mockReturnValue(mockAuth);

  // Mock the auth hook before each test
  (useAuthState as jest.Mock).mockImplementation(() => [null, false, undefined]);
});

// Update the cleanup after each test
afterEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  // Clean up mounted components
  cleanup();
});

test('renders header text', () => {
  render(<App />);
  const headerElement = screen.getByText(/Hockey Rink Map/i);
  expect(headerElement).toBeInTheDocument();
});
