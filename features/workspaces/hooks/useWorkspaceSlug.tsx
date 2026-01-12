'use client';

import { useParams } from 'next/navigation';

export const useWorkspaceSlug = () => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return workspaceId;
};
