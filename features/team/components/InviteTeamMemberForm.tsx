'use client';

import { useGetWorkspaces } from '@/features/workspaces/api/useGetWorkspaces';
import { useGetMembers } from '@/features/workspaces/members/api/useGetMembers';
import { useForm, useWatch } from 'react-hook-form';
import { FormSelect } from '@/components/form/FormSelect';

import { DirectInviteSection } from './invite/DirectInviteSection';
import { InviteCodeSection } from './invite/InviteCodeSection';

export const InviteTeamMemberForm = () => {
  const { control } = useForm({
    defaultValues: {
      workspaceId: '',
    },
  });

  const selectedWorkspaceId = useWatch({
    control,
    name: 'workspaceId',
  });

  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useGetWorkspaces();
  const { data: membersData } = useGetMembers(selectedWorkspaceId || undefined);

  const selectedWorkspace = workspaces?.find(
    (w) => w.id === selectedWorkspaceId
  );
  const existingMemberIds =
    membersData?.data?.members.map((m) => m.user_id) || [];

  const workspaceOptions =
    workspaces?.map((w) => ({
      label: w.name,
      value: w.id,
    })) || [];

  return (
    <div className="space-y-6 py-4">
      <FormSelect
        control={control}
        name="workspaceId"
        label="Select Workspace"
        placeholder="Pick a workspace..."
        options={workspaceOptions}
        disabled={isLoadingWorkspaces}
      />

      {selectedWorkspaceId && selectedWorkspace && (
        <>
          <DirectInviteSection
            workspaceId={selectedWorkspaceId}
            workspaceName={selectedWorkspace.name}
            existingMemberIds={existingMemberIds}
          />

          <InviteCodeSection
            workspaceName={selectedWorkspace.name}
            inviteCode={selectedWorkspace.invite_code}
          />
        </>
      )}

      {!selectedWorkspaceId && (
        <div className="py-8 text-center border-2 border-dashed rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Please select a workspace to invite members
          </p>
        </div>
      )}
    </div>
  );
};
