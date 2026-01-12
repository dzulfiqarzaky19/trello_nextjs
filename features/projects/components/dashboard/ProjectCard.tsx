'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ProjectListAction } from './ProjectListAction';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-32 relative overflow-hidden group border-0">
        {project.image_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.image_url})` }}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600" />
        )}

        <CardHeader className="relative z-10 p-4">
          <CardTitle className="text-white font-bold text-lg drop-shadow-md truncate pr-8">
            {project.name}
          </CardTitle>
        </CardHeader>

        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <ProjectListAction project={project} />
        </div>
      </Card>
    </Link>
  );
};
