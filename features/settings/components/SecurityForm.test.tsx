import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecurityForm } from './SecurityForm';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockMutateAsync = vi.fn();
vi.mock('../api/useSecurity', () => ({
  useSecurity: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

describe('SecurityForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both password inputs', () => {
    render(<SecurityForm />);
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  it('shows validation error if new password is the same as current password', async () => {
    render(<SecurityForm />);

    const currentInput = screen.getByLabelText(/current password/i);
    const newInput = screen.getByLabelText(/new password/i);
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    await act(async () => {
      fireEvent.change(currentInput, { target: { value: 'password123' } });
      fireEvent.change(newInput, { target: { value: 'password123' } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      await screen.findByText(/the passwords are the same/i)
    ).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('calls mutateAsync and resets form on success', async () => {
    mockMutateAsync.mockResolvedValue({ response: 'ok' });
    render(<SecurityForm />);

    const currentInput = screen.getByLabelText(/current password/i);
    const newInput = screen.getByLabelText(/new password/i);
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    await act(async () => {
      fireEvent.change(currentInput, { target: { value: 'old-password' } });
      fireEvent.change(newInput, { target: { value: 'new-password' } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        json: {
          currentPassword: 'old-password',
          newPassword: 'new-password',
        },
      });
    });
  });

  it('calls mutateAsync even if API returns an error', async () => {
    mockMutateAsync.mockResolvedValue({ error: 'Incorrect current password' });

    render(<SecurityForm />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'wrong-pass' },
      });
      fireEvent.change(screen.getByLabelText(/new password/i), {
        target: { value: 'valid-new-pass' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });
});
