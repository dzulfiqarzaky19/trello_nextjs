import { Header } from '@/components/header/Header';
import { ProjectsMain } from '@/features/projects/ProjectsMain';
import { getBoardDetails } from '@/features/projects/actions';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface ProjectDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Await params for Next.js 14+
    const { id } = await params;

    const { board, error } = await getBoardDetails(id);

    console.log('Board fetch result:', { board, error, boardId: id });

    if (error || !board) {
        console.error('Redirecting to /projects due to:', error || 'No board found');
        redirect('/projects');
    }

    return (
        <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
            <Header
                isProjectsPage
                label={board.title}
                description="Manage tasks, track progress, and collaborate with your team"
                boardId={id}
            />

            <ProjectsMain board={board} />
        </div>
    );
}
