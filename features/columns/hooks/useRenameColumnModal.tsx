import { useModal } from '@/components/providers/ModalProvider';
import { RenameColumnForm } from '../components/RenameColumnForm';

export const useRenameColumnModal = () => {
    const { openModal } = useModal('rename-column');

    const openRenameColumnModal = (columnId: string, currentTitle: string) => {
        openModal({
            title: 'Rename List',
            children: (
                <RenameColumnForm columnId={columnId} currentTitle={currentTitle} />
            ),
        });
    };

    return openRenameColumnModal;
};
