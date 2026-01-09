'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGlobalModal } from './providers/ModalProvider';

export const GlobalModal = () => {
  const { modalState, currentModalKey, closeWithBack } = useGlobalModal();

  if (!modalState || !currentModalKey) return null;

  const { title, description, children, config } = modalState;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closeWithBack()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="grow">{children}</div>

          {config?.showFooter && (
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={closeWithBack}
                disabled={config?.isConfirming}
              >
                Cancel
              </Button>
              <Button
                variant={config?.confirmVariant ?? 'default'}
                onClick={config?.onConfirm}
                disabled={config?.isConfirming}
                className="min-w-[100px]"
              >
                {config?.isConfirming
                  ? 'Loading...'
                  : (config?.confirmLabel ?? 'Confirm')}
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
