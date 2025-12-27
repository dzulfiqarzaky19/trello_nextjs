import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignupForm } from './SignupForm';
import { toast } from 'sonner';

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockMutateAsync = vi.fn();
vi.mock('../api/useRegister', () => ({
  useRegister: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all registration fields', () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    render(<SignupForm />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password456' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    expect(
      await screen.findByText(/the passwords did not match/i)
    ).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('handles successful registration with auto-login', async () => {
    mockMutateAsync.mockResolvedValue({ response: { session: {} } });

    render(<SignupForm />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        json: {
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        },
      });
    });
  });

  it('handles successful registration requiring email confirmation', async () => {
    const message = 'Please check your email to confirm your account';
    mockMutateAsync.mockResolvedValue({ response: message });

    render(<SignupForm />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        json: {
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        },
      });
    });
  });
});
