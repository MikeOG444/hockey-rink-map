import '@testing-library/jest-dom';

// Basic google maps mock
global.google = {
  maps: {
    Map: jest.fn(),
    Marker: jest.fn(),
    places: {
      Autocomplete: jest.fn(),
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

// Clean up
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});
