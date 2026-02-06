import { useModal } from '@/components/providers/ModalProvider';
import { AddMemberForm } from '../components/AddMemberForm';

export const useAddMemberModal = () => {
  const { openModal, closeWithReplace } = useModal('add-member');

  const openStub = () => {
    openModal({
      title: 'Add Member',
      description:
        'Search for a user by email or name to add them to this workspace.',
      children: <AddMemberForm closeModal={closeWithReplace} />,
      config: {
        showFooter: false,
      },
    });
  };

  return { open: openStub };
};
