import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileForm } from './ProfileForm';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUseMe = vi.fn();
vi.mock('@/features/auth/api/useMe', () => ({
  useMe: () => mockUseMe(),
}));

const mockMutateAsync = vi.fn();
vi.mock('../api/useProfile', () => ({
  useProfile: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

describe('ProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading spinner when data is fetching', () => {
    mockUseMe.mockReturnValue({ data: null });

    render(<ProfileForm />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('populates the form with existing profile data', () => {
    mockUseMe.mockReturnValue({
      data: {
        user: { email: 'test@example.com' },
        profile: { full_name: 'John Doe', role: 'Developer', bio: 'My bio' },
      },
    });

    render(<ProfileForm />);

    expect(screen.getByLabelText(/full name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/role/i)).toHaveValue('Developer');
    expect(screen.getByLabelText(/bio/i)).toHaveValue('My bio');
    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      'test@example.com'
    );
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
  });

  it('enables the "Save Changes" button only when the form is dirty', async () => {
    mockUseMe.mockReturnValue({
      data: {
        user: { email: 'test@example.com' },
        profile: { full_name: 'John Doe', role: 'Dev', bio: '' },
      },
    });

    render(<ProfileForm />);

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    const nameInput = screen.getByLabelText(/full name/i);

    expect(saveButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: 'Johnathan' } });
    expect(saveButton).not.toBeDisabled();

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(saveButton).toBeDisabled();
  });

  it('calls mutateAsync and shows success toast on successful submit', async () => {
    mockUseMe.mockReturnValue({
      data: {
        user: { email: 'test@example.com' },
        profile: { full_name: 'John Doe', role: 'Dev', bio: '' },
      },
    });
    mockMutateAsync.mockResolvedValue({ response: 'success' });

    render(<ProfileForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        json: {
          fullName: 'Jane Doe',
          role: 'Dev',
          bio: '',
        },
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Profile updated successfully'
      );
    });
  });

  it('shows error toast if the mutation fails', async () => {
    mockUseMe.mockReturnValue({
      data: {
        user: { email: 'a@b.com' },
        profile: { full_name: 'John', role: 'Dev', bio: '' },
      },
    });
    mockMutateAsync.mockRejectedValue(new Error('API Error'));

    render(<ProfileForm />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Johnny' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
    });
  });
});
