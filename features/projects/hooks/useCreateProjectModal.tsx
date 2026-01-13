import { useModal } from '@/components/providers/ModalProvider';
import { ProjectCreateForm } from '../components/forms/ProjectCreateForm';

export const useCreateProjectModal = () => {
  const { openModal, closeWithReplace } = useModal('create-project');

  const openStub = () => {
    openModal({
      title: 'Create New Project',
      description: 'Start organizing your tasks in a new project board.',
      children: <ProjectCreateForm closeModal={closeWithReplace} />,
      config: {
        showFooter: false,
      },
    });
  };

  return { open: openStub };
};
