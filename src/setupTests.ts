import '@testing-library/jest-dom';

// More comprehensive Google Maps mock
global.google = {
  maps: {
    Map: class {
      setCenter() {}
      setZoom() {}
      setOptions() {}
    },
    Marker: class {
      setMap() {}
    },
    LatLng: class {
      constructor(lat: number, lng: number) {}
    },
    places: {
      Autocomplete: class {
        addListener() {}
        getPlace() {
          return {};
        }
      },
    },
    event: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
} as any;

// Basic firebase mock
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock('./config/firebase', () => ({
  auth: {},
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()), // Return unsubscribe function
}));

// Mock react-firebase-hooks/auth
jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(() => [null, false, undefined]),
  useSignInWithEmailAndPassword: jest.fn(() => [jest.fn(), null, false, undefined]),
  useCreateUserWithEmailAndPassword: jest.fn(() => [jest.fn(), null, false, undefined]),
}));

// Clean up
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

// Add this to handle async operations
jest.setTimeout(10000);
