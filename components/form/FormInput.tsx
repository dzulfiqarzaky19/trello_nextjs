import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import React from 'react';
import { cn } from '@/lib/utils';

interface IFormInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FormInput = ({
  label,
  error,
  icon,
  className,
  ...props
}: IFormInput) => {
  return (
    <Field>
      <FieldLabel htmlFor={props.name}>{label}</FieldLabel>
      <div className="relative">
        <Input className={cn(icon && 'pl-10', className)} {...props} />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};
