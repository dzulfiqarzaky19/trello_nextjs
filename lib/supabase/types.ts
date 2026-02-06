/**
 * Custom types for Supabase joined queries.
 * These define the exact shape of data returned when using `.select()` with relations.
 */

import { Tables } from './database.types';

// ============================================
// Joined Query Types
// ============================================

/**
 * Project with its parent workspace data.
 * Used when querying: `.select('*, workspaces(workspace_id, name)')`
 */
export interface ProjectWithWorkspace extends Tables<'projects'> {
  workspaces: Pick<Tables<'workspaces'>, 'id' | 'name'> | null;
}

/**
 * Column with its parent project data (including workspace info).
 * Used when querying: `.select('*, projects(workspace_id, name)')`
 */
export interface ColumnWithProject extends Tables<'columns'> {
  projects: Pick<Tables<'projects'>, 'workspace_id' | 'name'> | null;
}

/**
 * Task with its parent project data (including workspace info).
 * Used when querying: `.select('*, projects(workspace_id, name)')`
 */
export interface TaskWithProject extends Tables<'tasks'> {
  projects: Pick<Tables<'projects'>, 'workspace_id' | 'name'> | null;
}

/**
 * Member with its parent workspace data.
 * Used when querying: `.select('*, workspaces(image_url)')`
 */
export interface MemberWithWorkspace extends Tables<'members'> {
  workspaces: Pick<Tables<'workspaces'>, 'image_url'> | null;
}

/**
 * Audit log with profile data for the user who performed the action.
 * Used when querying: `.select('*, profiles(full_name, email, avatar_url)')`
 */
export interface AuditLogWithProfile extends Tables<'audit_logs'> {
  profiles: Pick<
    Tables<'profiles'>,
    'full_name' | 'email' | 'avatar_url'
  > | null;
}

/**
 * Partial member type for role and workspace image queries.
 * Used by WorkspaceService.getMember(): `.select('role, workspaces(image_url)')`
 * Note: Supabase returns workspace as a single object (not array) when using .single() on members.
 * However, due to Supabase's type inference, we accept either array or object.
 */
export interface MemberPartial {
  role: string | null;
  workspaces:
    | { image_url: string | null }
    | { image_url: string | null }[]
    | null;
}

// ============================================
// Metadata Types for Audit Logs
// ============================================

/**
 * Metadata for status/position change actions.
 */
export interface ChangeMetadata {
  from?: string | number;
  to?: string | number;
  projectName?: string;
}

/**
 * Metadata for task assignment actions.
 */
export interface AssignMetadata {
  to_user?: string;
  projectName?: string;
}

/**
 * Metadata for move actions (column or task).
 */
export interface MoveMetadata {
  from_column?: string;
  to_column?: string;
  from_position?: number;
  to_position?: number;
  projectName?: string;
}

/**
 * Union type for all possible metadata shapes.
 */
export type AuditLogMetadata =
  | ChangeMetadata
  | AssignMetadata
  | MoveMetadata
  | null;

// ============================================
// Type Guards for Joined Query Types
// ============================================

/**
 * Type guard to check if a column query result has joined project data.
 */
export function hasProjectData(
  data: unknown
): data is { projects: { workspace_id: string; name: string } | null } {
  if (typeof data !== 'object' || data === null) return false;
  if (!('projects' in data)) return false;
  const projects = (data as { projects: unknown }).projects;
  if (projects === null) return true;
  return (
    typeof projects === 'object' &&
    projects !== null &&
    'workspace_id' in projects &&
    'name' in projects
  );
}

/**
 * Type guard to check if member data has workspace image.
 */
export function hasWorkspaceImage(data: unknown): data is {
  workspaces:
    | { image_url: string | null }
    | { image_url: string | null }[]
    | null;
} {
  if (typeof data !== 'object' || data === null) return false;
  if (!('workspaces' in data)) return false;
  const workspaces = (data as { workspaces: unknown }).workspaces;
  if (workspaces === null) return true;
  if (Array.isArray(workspaces)) {
    return workspaces.length === 0 || 'image_url' in workspaces[0];
  }
  return typeof workspaces === 'object' && 'image_url' in workspaces;
}

/**
 * Helper function to extract workspace image URL from member query result.
 * Handles both array and object workspace formats from Supabase.
 */
export function getWorkspaceImageUrl(data: unknown): string | null | undefined {
  if (!hasWorkspaceImage(data)) return undefined;
  const workspaces = data.workspaces;
  if (workspaces === null) return null;
  if (Array.isArray(workspaces)) {
    return workspaces[0]?.image_url;
  }
  return workspaces.image_url;
}

// ============================================
// Error Types
// ============================================

/**
 * Standard error shape for try-catch blocks.
 * Supabase and other errors typically have a `message` property.
 */
export interface AppError {
  message: string;
  code?: string;
  details?: string;
}

/**
 * Type guard to check if an error has a message property.
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as AppError).message === 'string'
  );
}

/**
 * Safely extract error message from unknown error.
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
