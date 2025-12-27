import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormInput } from './FormInput';
import { FormPasswordInput } from './FormPasswordInput';
import { FormTextarea } from './FormTextarea';
import { FormSubmit } from './FormSubmit';

vi.mock('react-dom', () => ({
  ...vi.importActual('react-dom'),
  useFormStatus: () => ({ pending: false }),
}));

describe('Form UI Atoms', () => {
  describe('FormInput', () => {
    it('associates label with input via auto-generated ID from name', () => {
      render(<FormInput label="Full Name" name="fullName" />);
      const input = screen.getByLabelText(/full name/i);
      expect(input).toHaveAttribute('id', 'fullName');
    });

    it('renders an icon when provided', () => {
      render(
        <FormInput
          label="Email"
          name="email"
          icon={<span data-testid="mail-icon" />}
        />
      );
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });

    it('shows error message when error prop is present', () => {
      render(<FormInput label="Name" name="name" error="Name is required" />);
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  describe('FormPasswordInput', () => {
    it('renders as a password field and links label', () => {
      render(<FormPasswordInput label="Password" name="password" />);
      const input = screen.getByLabelText(/password/i);
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveAttribute('id', 'password');
    });
  });

  describe('FormTextarea', () => {
    it('renders a textarea associated with the label', () => {
      render(<FormTextarea label="Bio" name="bio" />);
      const textarea = screen.getByLabelText(/bio/i);
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('id', 'bio');
    });
  });

  describe('FormSubmit', () => {
    it('shows label and is enabled by default', () => {
      render(<FormSubmit label="Save Changes" />);
      const button = screen.getByRole('button', { name: /save changes/i });
      expect(button).toBeEnabled();
    });

    it('shows loader and disables button when isSubmitting is true', () => {
      render(<FormSubmit label="Save Changes" isSubmitting={true} />);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
      expect(button.querySelector('svg')).toHaveClass('animate-spin');
    });

    it('stays disabled if isDisabled prop is passed', () => {
      render(<FormSubmit label="Save" isDisabled={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
