'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface IFormSubmitProps {
  label: string;
  isSubmitting?: boolean;
}

export const FormSubmit = ({ label, isSubmitting }: IFormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || isSubmitting}>
      {pending ||
        (isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
      {label}
    </Button>
  );
};
