'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/Modal';
import { CreateBoardForm } from './CreateBoardForm';

interface Board {
    id: string;
    title: string;
    image_url: string | null;
    created_at: string;
    board_members: Array<{ user_id: string; role: string }>;
}

interface BoardListProps {
    boards: Board[];
}

export const BoardList = ({ boards }: BoardListProps) => {
    return (
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <Link key={board.id} href={`/projects/${board.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-32 relative overflow-hidden group">
                            {board.image_url && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                                    style={{ backgroundImage: `url(${board.image_url})` }}
                                />
                            )}
                            <CardHeader className="relative z-10">
                                <CardTitle className="text-lg">{board.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>{board.board_members?.length || 0} members</span>
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
                    <CreateBoardForm />
                </Modal>
            </div>

            {boards.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        You don't have any boards yet. Create one to get started!
                    </p>
                </div>
            )}
        </div>
    );
};
