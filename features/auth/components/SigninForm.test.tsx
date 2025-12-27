import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SigninForm } from './SigninForm';
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
vi.mock('../api/useLogin', () => ({
    useLogin: () => ({
        mutateAsync: mockMutateAsync,
    }),
}));

describe('SigninForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders email and password fields', () => {
        render(<SigninForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('shows Zod validation errors for invalid email', async () => {
        render(<SigninForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
        fireEvent.click(submitButton);

        const errorMessage = await screen.findByText(/invalid email address/i);

        expect(errorMessage).toBeInTheDocument();
        expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('redirects to home and shows success toast on successful login', async () => {
        mockMutateAsync.mockResolvedValue({ response: { user: { id: '1' } } });

        render(<SigninForm />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                json: { email: 'test@example.com', password: 'password123' },
            });
            expect(toast.success).toHaveBeenCalledWith('Signed in successfully');
            expect(mockPush).toHaveBeenCalledWith('/');
            expect(mockRefresh).toHaveBeenCalled();
        });
    });

    it('shows error toast when API returns an error', async () => {
        mockMutateAsync.mockResolvedValue({ error: 'Invalid login credentials' });

        render(<SigninForm />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-pass' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid login credentials');
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
});