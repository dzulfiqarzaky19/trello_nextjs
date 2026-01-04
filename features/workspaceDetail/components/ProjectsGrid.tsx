import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IProject, IWorkspaceDetail } from '../schema';

interface ProjectsGridProps {
    workspace: IWorkspaceDetail;
}

const ProjectCard = ({ project, workspace }: { project: IProject, workspace: IWorkspaceDetail }) => {
    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-start gap-x-3">
                    <div className="h-10 w-10 rounded bg-indigo-100 flex items-center justify-center">
                        {project.image_url ?
                            <img src={project.image_url} alt={project.name} className="h-full w-full object-cover rounded" />
                            : <div className="h-5 w-5 bg-indigo-500 rounded-sm" />
                        }
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">{project.name}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    {project.status === 'ACTIVE' && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">ACTIVE</Badge>}
                    {project.status === 'COMPLETED' && <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">COMPLETED</Badge>}
                    {project.status === 'ARCHIVED' && <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">ARCHIVED</Badge>}

                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2">
                    Complete overhaul of the company website with new branding.
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                    {/* Assignees removed as per requirements */}
                </div>

                <span className="text-[10px] text-muted-foreground bg-gray-50 px-2 py-1 rounded">
                    Last update: {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                </span>
            </CardFooter>
        </Card>
    )
}

export const ProjectsGrid = ({ workspace }: ProjectsGridProps) => {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Workspace Projects</h2>
                <div className="flex items-center gap-x-2">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workspace.projects.map(project => (
                    <ProjectCard key={project.id} project={project} workspace={workspace} />
                ))}
                {workspace.projects.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 bg-muted/20 border-2 border-dashed border-muted rounded-lg text-center">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">No projects yet</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Get started by creating your first project in this workspace.</p>
                        <Button>Create Project</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
