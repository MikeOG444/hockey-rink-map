import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';
import { auth } from '../../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('../../../config/firebase', () => ({
  auth: {},
}));

describe('LoginForm', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password inputs', () => {
    render(<LoginForm onClose={mockOnClose} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({});
    (signInWithEmailAndPassword as jest.Mock).mockImplementation(mockSignIn);

    render(<LoginForm onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('displays error message on failed login', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginForm onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to login/i)).toBeInTheDocument();
    });
  });
}); 