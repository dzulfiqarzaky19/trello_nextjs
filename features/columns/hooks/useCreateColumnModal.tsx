import { useModal } from '@/components/providers/ModalProvider';
import { ColumnForm } from '../components/ColumnForm';

export const useCreateColumnModal = () => {
  const { openModal, closeWithBack } = useModal('create-column');

  const openCreateColumnModal = () => {
    openModal({
      title: 'Create New Column',
      children: <ColumnForm closeModal={closeWithBack} />,
    });
  };

  return openCreateColumnModal;
};
