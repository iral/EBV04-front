import { useNavigate } from 'react-router';
import type { Project } from '../../../types/api';
import { Users, Calendar, Code2, CheckCircle2, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectCardProps {
  project: Project;
}

const STATUS_CONFIG = {
  draft: { label: 'Borrador', color: 'text-muted-foreground', bg: 'bg-muted/30', icon: Clock },
  seeking_collaborators: { label: 'Buscando Colaboradores', color: 'text-primary', bg: 'bg-primary/10', icon: Users },
  in_development: { label: 'En Desarrollo', color: 'text-secondary', bg: 'bg-secondary/10', icon: Code2 },
  completed: { label: 'Completado', color: 'text-chart-3', bg: 'bg-chart-3/10', icon: CheckCircle2 },
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const config = STATUS_CONFIG[project.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/project/${project.id}`)}
      className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all"
    >
      {/* Header with status */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <div className={`flex-shrink-0 px-2 py-1 rounded-md ${config.bg} flex items-center gap-1`}>
            <StatusIcon size={14} className={config.color} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Tech stack */}
      <div className="px-5 py-3 border-b border-border/50">
        <div className="flex flex-wrap gap-1.5">
          {project.stackRequired.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded bg-accent/50 text-foreground/70 border border-border/30"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {tech}
            </span>
          ))}
          {project.stackRequired.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded bg-muted/30 text-muted-foreground">
              +{project.stackRequired.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>{project.creator.name}</span>
          </div>
          {project.collaborators.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{project.collaborators.length}</span>
            </div>
          )}
        </div>
        {project.applicationCount > 0 && project.status === 'seeking_collaborators' && (
          <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
            {project.applicationCount} postulaciones
          </div>
        )}
      </div>
    </motion.div>
  );
}
