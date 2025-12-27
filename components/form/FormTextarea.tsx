import * as React from 'react';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Textarea } from '../ui/textarea';

interface IFormTextarea extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  IFormTextarea
>(({ label, error, ...props }, ref) => {
  const inputId = props.id || props.name;

  return (
    <Field>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <Textarea id={inputId} ref={ref} {...props} />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
});

FormTextarea.displayName = 'FormTextarea';
