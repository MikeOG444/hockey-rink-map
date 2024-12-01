import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthModal from '../AuthModal';
import { auth } from '../../../config/firebase';

// Mock Firebase Auth
jest.mock('../../../config/firebase', () => ({
  auth: {
    signInWithPopup: jest.fn(),
  },
}));

describe('AuthModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);
    expect(screen.getByRole('tab', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('switches between login and signup forms', () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);
    const signUpTab = screen.getByRole('tab', { name: 'Sign Up' });
    fireEvent.click(signUpTab);
    expect(screen.getByRole('tab', { name: 'Sign Up' })).toHaveAttribute('aria-selected', 'true');
  });

  it('closes modal when backdrop is clicked', () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);
    // Click the backdrop (the modal overlay)
    const backdrop = screen.getByRole('presentation').firstChild;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('renders Google sign-in button', () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });
}); 