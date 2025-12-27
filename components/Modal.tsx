'use client';

import { useState, cloneElement, isValidElement } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export const Modal = ({
  children,
  trigger,
  modalClass,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  modalClass?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen =
    externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

  const childrenWithProps = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        closeModal: () => setOpen(false),
      })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={modalClass}>{childrenWithProps}</DialogContent>
    </Dialog>
  );
};
