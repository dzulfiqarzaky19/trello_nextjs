import { createSupabaseServer } from '@/lib/supabase/server';
import { TablesInsert, Json } from '@/lib/supabase/database.types';

type LogActivityProps = {
  action: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  workspaceId: string;
  userId: string;
  metadata?: Json;
};

export const logActivity = async ({
  action,
  entityType,
  entityId,
  entityTitle,
  workspaceId,
  userId,
  metadata,
}: LogActivityProps) => {
  const supabase = await createSupabaseServer();

  const logData: TablesInsert<'audit_logs'> = {
    action,
    entity_type: entityType,
    entity_id: entityId,
    entity_title: entityTitle,
    workspace_id: workspaceId,
    user_id: userId,
    metadata: metadata || null,
  };

  const { error } = await supabase.from('audit_logs').insert(logData);

  if (error) {
    console.error('[AUDIT_LOG_ERROR]', error);
  }
};
