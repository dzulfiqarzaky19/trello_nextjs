'use client';

import { useState, cloneElement, isValidElement } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export const Modal = ({
  children,
  trigger,
  modalClass,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  modalClass?: string;
}) => {
  const [open, setOpen] = useState(false);

  const childrenWithProps = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        closeModal: () => setOpen(false),
      })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={modalClass}>{childrenWithProps}</DialogContent>
    </Dialog>
  );
};
