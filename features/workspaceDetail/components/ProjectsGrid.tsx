import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { IWorkspaceDetail } from '../schema';
import { BoardList } from '@/features/projects/components/BoardList';
import { Modal } from '@/components/Modal';
import { CreateBoardForm } from '@/features/projects/components/CreateBoardForm';
import { Project } from '@/features/projects/types';

interface ProjectsGridProps {
    workspace: IWorkspaceDetail;
}

export const ProjectsGrid = ({ workspace }: ProjectsGridProps) => {
    // Map IProject (from zod) to Project (from types). They should be compatible.
    const projects = workspace.projects as unknown as Project[];

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Workspace Projects</h2>
                <div className="flex items-center gap-x-2">
                    <Modal
                        trigger={
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Project
                            </Button>
                        }
                    >
                        <CreateBoardForm workspaceId={workspace.id} />
                    </Modal>
                </div>
            </div>

            <BoardList boards={projects} workspaceId={workspace.id} />
        </div>
    );
};
