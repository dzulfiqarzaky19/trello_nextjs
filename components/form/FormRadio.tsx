import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Field, FieldLabel, FieldError } from '../ui/field';
import { Label } from '../ui/label';

interface IOption {
  id: string;
  value: string;
  label: string;
}

interface IFormRadio<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: IOption[];
  className?: string;
  renderOption?: (
    option: IOption,
    isSelected: boolean,
    onChange: (value: string) => void
  ) => React.ReactNode;
}

export const FormRadio = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  className,
  renderOption,
}: IFormRadio<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field className={className}>
          <FieldLabel>{label}</FieldLabel>
          <div className="flex gap-2">
            {options.map((option) => {
              const isSelected = value === option.value;

              if (renderOption) {
                return (
                  <React.Fragment key={option.id}>
                    {renderOption(option, isSelected, onChange)}
                  </React.Fragment>
                );
              }

              return (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${name}-${option.id}`}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => onChange(option.value)}
                    className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Label htmlFor={`${name}-${option.id}`}>{option.label}</Label>
                </div>
              );
            })}
          </div>
          {error && <FieldError>{error.message}</FieldError>}
        </Field>
      )}
    />
  );
};
