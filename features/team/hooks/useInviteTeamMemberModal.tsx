import { useModal } from '@/components/providers/ModalProvider';
import { InviteTeamMemberForm } from '../components/InviteTeamMemberForm';

export const useInviteTeamMemberModal = () => {
  const { openModal, closeWithReplace } = useModal('invite-team-member');

  const open = () => {
    openModal({
      title: 'Invite Team Member',
      description:
        'Select a workspace to invite new members or add existing users.',
      children: <InviteTeamMemberForm closeModal={closeWithReplace} />,
      config: {
        showFooter: false,
      },
    });
  };

  return { open };
};
