import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkspaceCreateForm } from './WorkspaceCreateForm';
import { toast } from 'sonner';

const mockMutateAsync = vi.fn();
vi.mock('../api/useCreateWorkspace', () => ({
  useCreateWorkspace: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

const mockInvalidateQueries = vi.fn();
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/components/form/FormSubmit', () => ({
  FormSubmit: ({ label, isDisabled }: any) => (
    <button type="submit" disabled={isDisabled}>
      {label}
    </button>
  ),
}));

vi.mock('@/components/ui/dialog', () => ({
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

describe('WorkspaceCreateForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<WorkspaceCreateForm />);
    expect(screen.getByLabelText(/workspace name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/workspace slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/workspace image url/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeInTheDocument();
  });

  it('automatically updates the slug when name is entered', async () => {
    render(<WorkspaceCreateForm />);
    const nameInput = screen.getByLabelText(/workspace name/i);
    const slugInput = screen.getByLabelText(/workspace slug/i);

    fireEvent.change(nameInput, { target: { value: 'My New Workspace' } });

    expect(slugInput).toHaveValue('my-new-workspace');
  });

  it('shows validation error for short workspace name', async () => {
    render(<WorkspaceCreateForm />);
    const nameInput = screen.getByLabelText(/workspace name/i);

    fireEvent.change(nameInput, { target: { value: 'ab' } });
    fireEvent.blur(nameInput);

    expect(
      await screen.findByText(/workspace name must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it('successfully submits the form', async () => {
    mockMutateAsync.mockResolvedValue({ data: { id: '123' } });
    render(<WorkspaceCreateForm />);

    const nameInput = screen.getByLabelText(/workspace name/i);
    fireEvent.change(nameInput, { target: { value: 'Valid Name' } });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        json: {
          name: 'Valid Name',
          slug: 'valid-name',
          imageUrl: '',
        },
      });
      expect(toast.success).toHaveBeenCalledWith('Workspace Created!');
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['workspaces'],
      });
    });
  });

  it('handles API error response', async () => {
    mockMutateAsync.mockResolvedValue({ error: 'Slug already taken' });
    render(<WorkspaceCreateForm />);

    fireEvent.change(screen.getByLabelText(/workspace name/i), {
      target: { value: 'Existing WS' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Slug already taken');
    });
  });

  it('handles unexpected throwing error', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network error'));
    render(<WorkspaceCreateForm />);

    fireEvent.change(screen.getByLabelText(/workspace name/i), {
      target: { value: 'Throwing Error WS' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  it('disables submit button when form is not dirty', () => {
    render(<WorkspaceCreateForm />);
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    expect(submitButton).toBeDisabled();
  });
});
