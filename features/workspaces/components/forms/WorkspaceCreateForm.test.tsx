import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkspaceCreateForm } from './WorkspaceCreateForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockMutateAsync = vi.fn();
vi.mock('../../api/useCreateWorkspace', () => ({
  useCreateWorkspace: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

// Removed redundant @tanstack/react-query mock as we use QueryClientProvider

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
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceCreateForm />
      </QueryClientProvider>
    );
    expect(screen.getByLabelText(/workspace name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/workspace slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/workspace image/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeInTheDocument();
  });

  it('automatically updates the slug when name is entered', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceCreateForm />
      </QueryClientProvider>
    );
    const nameInput = screen.getByLabelText(/workspace name/i);
    const slugInput = screen.getByLabelText(/workspace slug/i);

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'My New Workspace' } });
    });

    expect(slugInput).toHaveValue('my-new-workspace');
  });

  it('shows validation error for short workspace name', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceCreateForm />
      </QueryClientProvider>
    );
    const nameInput = screen.getByLabelText(/workspace name/i);

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'ab' } });
      fireEvent.blur(nameInput);
    });

    expect(
      await screen.findByText(/workspace name must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it('successfully submits the form', async () => {
    mockMutateAsync.mockResolvedValue({ data: { id: '123' } });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceCreateForm />
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText(/workspace name/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Valid Name' } });
    });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        form: {
          name: 'Valid Name',
          slug: 'valid-name',
          image: undefined,
          description: '',
        },
      });
    });
    expect(submitButton).toBeDisabled();
  });

  it('handles API error response', async () => {
    mockMutateAsync.mockResolvedValue({ error: 'Slug already taken' });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceCreateForm />
      </QueryClientProvider>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/workspace name/i), {
        target: { value: 'Existing WS' },
      });
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  it('handles unexpected throwing error', async () => {
    // Use mockImplementationOnce with a controlled rejection
    mockMutateAsync.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceCreateForm />
      </QueryClientProvider>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/workspace name/i), {
        target: { value: 'Throwing Error WS' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    });

    // Wait for the form to handle the rejection
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  it('disables submit button when form is not dirty', () => {
    render(<WorkspaceCreateForm />);
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    expect(submitButton).toBeDisabled();
  });
});
