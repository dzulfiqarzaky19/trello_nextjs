import { useModal } from '@/components/providers/ModalProvider';
import { ProjectEditForm } from '../components/forms/ProjectEditForm';
import { Project } from '../types';

export const useEditProjectModal = ({ project }: { project: Project }) => {
  const { openModal, closeWithReplace } = useModal('edit-project');

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openModal({
      title: 'Edit Project',
      description: 'Update your project details.',
      children: (
        <ProjectEditForm project={project} closeModal={closeWithReplace} />
      ),
      config: {
        showFooter: false,
      },
    });
  };

  return handleEdit;
};
