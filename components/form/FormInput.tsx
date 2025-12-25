import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import React from 'react';

interface IFormInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = ({ label, error, ...props }: IFormInput) => {
  return (
    <Field>
      <FieldLabel htmlFor={props.name}>{label}</FieldLabel>
      <Input {...props} />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};
