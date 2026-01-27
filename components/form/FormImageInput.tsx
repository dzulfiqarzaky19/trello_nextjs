import React, { useRef, useEffect, useMemo } from 'react';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { ImageIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  useWatch,
} from 'react-hook-form';
import Image from 'next/image';
import { isFile } from '@/lib/typeguard/isFile';

interface IFormImageInput<T extends FieldValues> {
  label: string;
  className?: string;
  control: Control<T>;
  name: Path<T>;
}

export const FormImageInput = <T extends FieldValues>({
  label,
  className,
  control,
  name,
}: IFormImageInput<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const value = useWatch({
    control,
    name,
  });

  const preview = useMemo(() => {
    if (isFile(value)) {
      return URL.createObjectURL(value);
    } else if (typeof value === 'string') {
      return value;
    }
    return null;
  }, [value]);

  useEffect(() => {
    if (preview && preview.startsWith('blob:')) {
      return () => URL.revokeObjectURL(preview);
    }
  }, [preview]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => {
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            onChange(file);
          }
        };

        const handleRemove = () => {
          onChange(null);
          if (inputRef.current) inputRef.current.value = '';
        };

        return (
          <Field className={className}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-4">
                <div className="relative flex items-center justify-center size-[72px] bg-neutral-100 border border-dashed border-neutral-300 rounded-full overflow-hidden">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      className="object-cover size-full"
                    />
                  ) : (
                    <ImageIcon className="size-8 text-neutral-400" />
                  )}
                </div>

                <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-2">
                    <Input
                      id={name}
                      type="file"
                      className="hidden"
                      accept=".jpg, .jpeg, .png"
                      ref={inputRef}
                      onChange={handleFileChange}
                    />

                    {!preview ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemove}
                      >
                        <XIcon className="size-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or JPEG. Max 1MB.
                  </p>
                </div>
              </div>
            </div>
            {error && <FieldError>{error.message}</FieldError>}
          </Field>
        );
      }}
    />
  );
};
