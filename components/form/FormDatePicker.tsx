import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface IFormDatePicker<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const FormDatePicker = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  className,
  disabled,
}: IFormDatePicker<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, ...field },
        fieldState: { error },
      }) => (
        <Field className={cn(className)}>
          <FieldLabel htmlFor={name}>
            {label || name.charAt(0).toUpperCase() + name.slice(1)}
          </FieldLabel>
          <Input
            {...field}
            id={name}
            type="date"
            placeholder={placeholder}
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              onChange(
                e.target.value ? new Date(e.target.value).toISOString() : null
              );
            }}
            disabled={disabled}
            className="w-full justify-start text-left font-normal"
          />
          {error && <FieldError>{error.message}</FieldError>}
        </Field>
      )}
    />
  );
};
