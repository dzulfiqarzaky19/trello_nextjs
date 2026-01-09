import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkspaceEditForm } from './WorkspaceEditForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockMutateAsync = vi.fn();
vi.mock('../../api/useUpdateWorkspace', () => ({
  useUpdateWorkspace: () => ({
    mutateAsync: mockMutateAsync,
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

describe('WorkspaceEditForm', () => {
  const mockWorkspace: any = {
    id: 'ws-1',
    name: 'Original Name',
    slug: 'original-name',
    image_url: 'http://example.com/img.png',
    user_id: 'user-1',
    members: [],
    created_at: null,
    updated_at: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial values', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceEditForm workspace={mockWorkspace} />
      </QueryClientProvider>
    );
    expect(screen.getByLabelText(/workspace name/i)).toHaveValue(
      'Original Name'
    );
    expect(screen.getByLabelText(/workspace slug/i)).toHaveValue(
      'original-name'
    );
  });

  it('updates slug automatically when name changes', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceEditForm workspace={mockWorkspace} />
      </QueryClientProvider>
    );
    const nameInput = screen.getByLabelText(/workspace name/i);
    const slugInput = screen.getByLabelText(/workspace slug/i);

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Brand New' } });
    });

    expect(slugInput).toHaveValue('brand-new');
  });

  it('submits successfully and calls callbacks', async () => {
    mockMutateAsync.mockResolvedValue({ data: { id: 'ws-1' } });
    const mockSuccess = vi.fn();
    const mockCloseModal = vi.fn();

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceEditForm
          workspace={mockWorkspace}
          onSuccess={mockSuccess}
          closeModal={mockCloseModal}
        />
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText(/workspace name/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        param: { workspaceId: 'ws-1' },
        form: expect.objectContaining({
          name: 'Updated Name',
        }),
      });
      expect(mockSuccess).toHaveBeenCalled();
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it('disables submit button if not dirty', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceEditForm workspace={mockWorkspace} />
      </QueryClientProvider>
    );
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for invalid slug', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceEditForm workspace={mockWorkspace} />
      </QueryClientProvider>
    );
    const slugInput = screen.getByLabelText(/workspace slug/i);

    await act(async () => {
      fireEvent.change(slugInput, { target: { value: 'Invalid Slug!' } });
      fireEvent.blur(slugInput);
    });

    expect(
      await screen.findByText(
        /slug can only contain letters, numbers, and hyphens/i
      )
    ).toBeInTheDocument();
  });

  it('handles unexpected throwing error in onSubmit', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network Error'));
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceEditForm workspace={mockWorkspace} />
      </QueryClientProvider>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/workspace name/i), {
        target: { value: 'New Name' },
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
