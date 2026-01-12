'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ProjectListAction } from './ProjectListAction';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => (
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
        <div className="mt-2 flex items-center gap-2">
          <div
            className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white/90 ${
              project.status === 'ACTIVE'
                ? 'bg-green-500/80'
                : project.status === 'COMPLETED'
                  ? 'bg-blue-500/80'
                  : 'bg-gray-500/80'
            }`}
          >
            {project.status || 'ACTIVE'}
          </div>
        </div>
      </CardHeader>

      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <ProjectListAction project={project} />
      </div>
    </Card>
  </Link>
);
