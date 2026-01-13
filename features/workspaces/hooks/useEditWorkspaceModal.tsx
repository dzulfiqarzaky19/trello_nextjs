import { useModal } from '@/components/providers/ModalProvider';
import { workspaceSchema } from '../schema';
import { z } from 'zod';
import { WorkspaceEditForm } from '../components/forms/WorkspaceEditForm';

export const useEditWorkspaceModal = () => {
  const { openModal, closeWithReplace } = useModal('edit-workspace');

  const openEditWorkspaceModal = (
    workspace: z.infer<typeof workspaceSchema>
  ) => {
    openModal({
      title: 'Edit Workspace',
      description: 'Update your workspace details.',
      children: (
        <WorkspaceEditForm
          workspace={workspace}
          closeModal={closeWithReplace}
        />
      ),
      config: {
        showFooter: false,
      },
    });
  };

  return openEditWorkspaceModal;
};
