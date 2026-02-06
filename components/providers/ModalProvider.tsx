'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface ModalConfig {
  showFooter?: boolean;
  confirmLabel?: string;
  confirmVariant?: 'default' | 'destructive';
  onConfirm?: () => void;
  isConfirming?: boolean;
  className?: string; // override default max-w-md
  contentClassName?: string; // override default inner padding/spacing
}

interface ModalState {
  title: string;
  description?: string;
  children: React.ReactNode;
  config?: ModalConfig;
}

interface ModalContextType {
  modalState: ModalState | null;
  currentModalKey: string | null;
  openModal: (key: string, state: ModalState) => void;
  closeWithBack: () => void;
  closeWithReplace: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const currentModalKey = searchParams.get('modal');

  const openModal = useCallback(
    (key: string, state: ModalState) => {
      setModalState(state);
      const params = new URLSearchParams(searchParams.toString());
      params.set('modal', key);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const closeWithBack = useCallback(() => {
    setModalState(null);
    router.back();
  }, [router]);

  const closeWithReplace = useCallback(() => {
    setModalState(null);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return (
    <ModalContext.Provider
      value={{
        modalState,
        currentModalKey,
        openModal,
        closeWithBack,
        closeWithReplace,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Hook to manage a specific modal by key.
 * @param key - The modal identifier (e.g., 'create-workspace', 'delete-user')
 */
export const useModal = (key: string) => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  const {
    modalState,
    currentModalKey,
    openModal,
    closeWithBack,
    closeWithReplace,
  } = context;

  const isOpen = currentModalKey === key;

  const open = useCallback(
    (state: Omit<ModalState, 'key'>) => {
      openModal(key, state);
    },
    [openModal, key]
  );

  return useMemo(
    () => ({
      isOpen,
      modalState: isOpen ? modalState : null,
      openModal: open,
      closeWithBack,
      closeWithReplace,
    }),
    [isOpen, modalState, open, closeWithBack, closeWithReplace]
  );
};

export const useGlobalModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a ModalProvider');
  }
  return context;
};
