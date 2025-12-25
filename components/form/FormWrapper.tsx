'use client';

import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

type FormWrapperProps = {
  children: ReactNode;
  action: (formData: FormData) => Promise<any>;
  closeModal?: () => void;
  className?: string;
};

export const FormWrapper = ({
  children,
  action,
  closeModal,
  className,
}: FormWrapperProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    console.log(Object.fromEntries(formData));

    try {
      const result = await action(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Operation completed successfully!');
      }

      if (closeModal) closeModal();
    } catch (err) {
      toast.error('Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};
