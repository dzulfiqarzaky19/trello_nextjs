import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { WorkspaceListAction } from './WorkspaceListAction';
import { workspaceSchema } from '../schema';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CardAvatar } from '@/components/CardAvatar';

interface IWorkspaceListProps {
  workspace: z.infer<typeof workspaceSchema>;
}

export const WorkspaceCard = ({ workspace }: IWorkspaceListProps) => {
  const creator = workspace.user;

  const assignees = workspace.members.map((member) => ({
    id: member.user_id,
    name: member.profiles?.full_name || 'Member',
    image: member.profiles?.avatar_url || '',
  }));

  return (
    <Card
      key={workspace.id}
      className="group relative flex flex-col h-full min-h-[250px] overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer py-0"
    >
      <Link
        href={`/workspaces/${workspace.slug}`}
        className="flex flex-col grow"
      >
        <div className="relative h-32 w-full bg-muted">
          {workspace.image_url ? (
            <img
              src={workspace.image_url}
              alt={workspace.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-600" />
          )}
        </div>

        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xl font-bold truncate">
            {workspace.name}
          </CardTitle>

          {workspace.description && (
            <CardDescription className="line-clamp-2 text-sm text-gray-500 mt-1">
              {workspace.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="px-4 pb-4 grow">
          <Separator className="my-2" />
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center mt-auto">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800">
              <AvatarImage
                src={creator?.avatar_url || ''}
                alt={creator?.full_name || 'Creator'}
              />
              <AvatarFallback>
                {creator?.full_name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              by {creator?.full_name?.split(' ')[0] || 'Unknown'}
            </span>
          </div>

          <div className="flex items-center justify-end">
            <CardAvatar assignees={assignees} />
          </div>
        </CardFooter>
      </Link>

      <div className="absolute top-2 right-2 z-10">
        <WorkspaceListAction workspace={workspace} />
      </div>
    </Card>
  );
};
