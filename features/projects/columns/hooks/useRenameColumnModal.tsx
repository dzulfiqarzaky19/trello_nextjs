import { useModal } from '@/components/providers/ModalProvider';
import { RenameColumnForm } from '../components/RenameColumnForm';

export const useRenameColumnModal = () => {
  const { openModal, closeWithBack } = useModal('rename-column');

  const openRenameColumnModal = (columnId: string, currentTitle: string) => {
    openModal({
      title: 'Rename List',
      children: (
        <RenameColumnForm
          columnId={columnId}
          currentTitle={currentTitle}
          closeModal={closeWithBack}
        />
      ),
    });
  };

  return openRenameColumnModal;
};
