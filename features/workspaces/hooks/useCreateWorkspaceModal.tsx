import { useModal } from '@/components/providers/ModalProvider';
import { WorkspaceCreateForm } from '../components/forms/WorkspaceCreateForm';

export const useCreateWorkspaceModal = () => {
  const { openModal, closeWithReplace } = useModal('create-workspace');

  const openCreateWorkspaceModal = () => {
    openModal({
      title: 'Create New Board',
      description: 'Start organizing your tasks in a new project board.',
      children: <WorkspaceCreateForm closeModal={closeWithReplace} />,
      config: {
        showFooter: false,
      },
    });
  };

  return openCreateWorkspaceModal;
};
