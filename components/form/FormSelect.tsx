import { Field, FieldError, FieldLabel } from '../ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';
import {
    Control,
    Controller,
    FieldValues,
    Path,
} from 'react-hook-form';

interface IFormSelect<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    placeholder?: string;
    options: { label: string; value: string }[];
    className?: string;
}

export const FormSelect = <T extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    options,
    className,
}: IFormSelect<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Field className={cn(className)}>
                    <FieldLabel htmlFor={name}>
                        {label || name.charAt(0).toUpperCase() + name.slice(1)}
                    </FieldLabel>
                    <Select onValueChange={onChange} value={value}>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error && <FieldError>{error.message}</FieldError>}
                </Field>
            )}
        />
    );
};
