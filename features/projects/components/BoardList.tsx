'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/Modal';
import { CreateBoardForm } from './CreateBoardForm';
import { Project } from '../types';

interface BoardListProps {
  boards: Project[]; // Renamed from boards to projects conceptually but keeping prop name or changing it? Let's keep it to minimize shift or change to projects
  workspaceId?: string; // Optional context for creation
}

export const BoardList = ({ boards, workspaceId }: BoardListProps) => {
  return (
    <div className="p-4 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link key={board.id} href={`/projects/${board.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-32 relative overflow-hidden group">
              {board.image_url ? (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundImage: `url(${board.image_url})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-500 opacity-20 group-hover:opacity-30 transition-opacity" />
              )}
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg">{board.name}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {/* Status badge? */}
                  <span className="text-xs px-2 py-1 rounded bg-secondary">{board.status}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Create New Board Card */}
        <Modal
          trigger={
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-32 flex items-center justify-center bg-muted/50 hover:bg-muted border-dashed">
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <Plus className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Create New Board
                </span>
              </CardContent>
            </Card>
          }
        >
          <CreateBoardForm workspaceId={workspaceId} />
        </Modal>
      </div>

      {boards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You don't have any projects yet. Create one to get started!
          </p>
        </div>
      )}
    </div>
  );
};
