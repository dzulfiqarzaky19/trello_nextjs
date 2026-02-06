import { useModal } from '@/components/providers/ModalProvider';
import { useUpdateMemberRole } from '../api/useUpdateMemberRole';
import { useRemoveMember } from '../api/useRemoveMember';

interface MemberActionProps {
  workspaceId: string;
  userId: string;
  memberName: string;
}

export const useMemberActionModals = () => {
  const { openModal, closeWithBack } = useModal('member-action');
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const openPromote = ({
    workspaceId,
    userId,
    memberName,
  }: MemberActionProps) => {
    openModal({
      title: 'Promote to Admin',
      description: `Are you sure you want to promote ${memberName} to admin? They will have full control over this workspace.`,
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Promote',
        isConfirming: updateRole.isPending,
        onConfirm: () => {
          updateRole.mutate(
            { param: { userId }, json: { workspaceId, role: 'ADMIN' } },
            { onSuccess: () => closeWithBack() }
          );
        },
      },
    });
  };

  const openDemote = ({
    workspaceId,
    userId,
    memberName,
  }: MemberActionProps) => {
    openModal({
      title: 'Demote to Member',
      description: `Are you sure you want to demote ${memberName} to member? They will lose admin privileges.`,
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Demote',
        isConfirming: updateRole.isPending,
        onConfirm: () => {
          updateRole.mutate(
            { param: { userId }, json: { workspaceId, role: 'MEMBER' } },
            { onSuccess: () => closeWithBack() }
          );
        },
      },
    });
  };

  const openRemove = ({
    workspaceId,
    userId,
    memberName,
  }: MemberActionProps) => {
    openModal({
      title: 'Remove Member',
      description: `Are you sure you want to remove ${memberName} from this workspace? They will lose access to all projects.`,
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Remove',
        confirmVariant: 'destructive',
        isConfirming: removeMember.isPending,
        onConfirm: () => {
          removeMember.mutate(
            { param: { userId }, json: { workspaceId } },
            { onSuccess: () => closeWithBack() }
          );
        },
      },
    });
  };

  return { openPromote, openDemote, openRemove };
};
