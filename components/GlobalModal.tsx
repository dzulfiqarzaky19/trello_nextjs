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
import { cn } from '@/lib/utils';

export const GlobalModal = () => {
  const { modalState, currentModalKey, closeWithBack } = useGlobalModal();

  if (!modalState || !currentModalKey) return null;

  const { title, description, children, config } = modalState;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closeWithBack()}>
      <DialogContent
        className={cn(
          'p-0 overflow-hidden border-none shadow-2xl',
          config?.className
        )}
      >
        <div
          className={cn(
            'h-full flex flex-col p-6 space-y-6',
            config?.contentClassName
          )}
        >
          {(title || description) && (
            <DialogHeader className="space-y-2 shrink-0">
              {title && (
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}

          <div className="flex-1 min-h-0">{children}</div>

          {config?.showFooter && (
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
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
