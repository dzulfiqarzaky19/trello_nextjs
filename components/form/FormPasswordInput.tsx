import { Field, FieldError, FieldLabel } from '../ui/field';
import { PasswordInput } from '../ui/password-input';
import React from 'react';

interface IFormPasswordInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormPasswordInput = React.forwardRef<
  HTMLInputElement,
  IFormPasswordInput
>(({ label, error, ...props }, ref) => {
  const inputId = props.id || props.name;

  return (
    <Field>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <PasswordInput id={inputId} ref={ref} {...props} />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
});

FormPasswordInput.displayName = 'FormPasswordInput';
