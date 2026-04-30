import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import type { Project, Application, Thread } from '../../../types/api';
import {
  ArrowLeft, Users, Calendar, Code2, Play, CheckCircle2, MessageSquare,
  Send, UserPlus, Clock, Check, X, Edit, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '../dashboard/Sidebar';

const STATUS_CONFIG = {
  draft: { label: 'Borrador', color: 'text-muted-foreground', bg: 'bg-muted/30' },
  seeking_collaborators: { label: 'Buscando Colaboradores', color: 'text-primary', bg: 'bg-primary/10' },
  in_development: { label: 'En Desarrollo', color: 'text-secondary', bg: 'bg-secondary/10' },
  completed: { label: 'Completado', color: 'text-chart-3', bg: 'bg-chart-3/10' },
};

export default function ProjectDetailNew() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'team' | 'discussions'>('overview');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    setIsLoading(true);
    try {
      const [projectData, applicationsData, threadsData] = await Promise.all([
        api.getProject(id!),
        api.getApplicationsForProject(id!),
        api.getThreadsForProject(id!),
      ]);
      setProject(projectData);
      setApplications(applicationsData);
      setThreads(threadsData);
    } catch (error) {
      toast.error('Error al cargar el proyecto');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!project) return;
    setIsApplying(true);
    try {
      await api.createApplication({
        projectId: project.id,
        message: applicationMessage || undefined,
      });
      toast.success('Postulación enviada exitosamente');
      setApplicationMessage('');
      await loadProjectData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar postulación');
    } finally {
      setIsApplying(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await api.updateApplication(applicationId, 'accepted');
      toast.success('Colaborador aceptado');
      await loadProjectData();
    } catch (error) {
      toast.error('Error al aceptar postulación');
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await api.updateApplication(applicationId, 'rejected');
      toast.success('Postulación rechazada');
      await loadProjectData();
    } catch (error) {
      toast.error('Error al rechazar postulación');
    }
  };

  const handlePublish = async () => {
    if (!project) return;
    try {
      await api.publishProject(project.id);
      toast.success('Proyecto publicado');
      await loadProjectData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al publicar');
    }
  };

  const handleStartDevelopment = async () => {
    if (!project) return;
    try {
      await api.startDevelopment(project.id);
      toast.success('Desarrollo iniciado');
      await loadProjectData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar desarrollo');
    }
  };

  const handleComplete = async () => {
    if (!project) return;
    try {
      await api.completeProject(project.id);
      toast.success('Proyecto completado');
      await loadProjectData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al completar proyecto');
    }
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const isOwner = user?.id === String(project.creatorId);
  const isCollaborator = project.collaborators.some(c => c.id === user?.id);
  const canViewApplications = isOwner || isCollaborator;
  const hasApplied = applications.some(a => String(a.applicantId) === user?.id);
  const canApply = !isOwner && !isCollaborator && !hasApplied && project.status === 'seeking_collaborators';
  const config = STATUS_CONFIG[project.status];

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="h-full px-6 flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-semibold line-clamp-1">{project.title}</h2>
            </div>
            <div className={`px-3 py-1.5 rounded-md text-sm ${config.bg} ${config.color}`}>
              {config.label}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Project Header */}
            <div className="bg-card border border-border rounded-lg p-8 mb-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-3">{project.title}</h1>
                  <p className="text-muted-foreground mb-6">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.stackRequired.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-sm rounded-md bg-secondary/10 text-secondary border border-secondary/20"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>Creado por {project.creator.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    {project.collaborators.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Code2 size={16} />
                        <span>{project.collaborators.length} colaboradores</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {isOwner && project.status === 'draft' && (
                    <button
                      onClick={handlePublish}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                      <Send size={18} />
                      <span>Publicar</span>
                    </button>
                  )}
                  {isOwner && project.status === 'seeking_collaborators' && project.collaborators.length > 0 && (
                    <button
                      onClick={handleStartDevelopment}
                      className="px-4 py-2 bg-secondary text-primary-foreground rounded-md hover:bg-secondary/90 transition-all flex items-center gap-2"
                    >
                      <Play size={18} />
                      <span>Iniciar Desarrollo</span>
                    </button>
                  )}
                  {isOwner && project.status === 'in_development' && (
                    <button
                      onClick={handleComplete}
                      className="px-4 py-2 bg-chart-3 text-primary-foreground rounded-md hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      <span>Marcar Completado</span>
                    </button>
                  )}
                  {canApply && (
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                      <UserPlus size={18} />
                      <span>Postularme</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Apply Section */}
              {canApply && activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-border pt-6"
                >
                  <h3 className="text-lg font-semibold mb-3">Postularme a este proyecto</h3>
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Mensaje opcional: cuéntale al creador por qué quieres colaborar..."
                    className="w-full p-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={4}
                  />
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {isApplying ? 'Enviando...' : 'Enviar Postulación'}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {['overview', 'applications', 'team', 'discussions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === tab
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-foreground/70 hover:bg-accent'
                  }`}
                >
                  {tab === 'overview' && 'Vista General'}
                  {tab === 'applications' && `Postulaciones (${applications.filter(a => a.status === 'pending').length})`}
                  {tab === 'team' && `Equipo (${project.collaborators.length})`}
                  {tab === 'discussions' && `Debates (${threads.length})`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-card border border-border rounded-lg p-6">
              {activeTab === 'applications' && canViewApplications && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Postulaciones Pendientes</h3>
                  {applications.filter(a => a.status === 'pending').length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No hay postulaciones pendientes</p>
                  ) : (
                    applications
                      .filter(a => a.status === 'pending')
                      .map((application) => (
                        <div key={application.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                  <Users size={20} className="text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{application.applicantName}</p>
                                  <p className="text-sm text-muted-foreground">{application.applicantEmail}</p>
                                </div>
                              </div>
                              {application.message && (
                                <p className="text-sm text-foreground/80 mt-3 p-3 bg-accent/30 rounded-md">
                                  {application.message}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {application.technologies?.map((tech) => (
                                  <span
                                    key={tech.id}
                                    className="px-2 py-0.5 text-xs rounded bg-muted/50 text-foreground/70"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                  >
                                    {tech.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptApplication(application.id)}
                                className="p-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectApplication(application.id)}
                                className="p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Miembros del Equipo</h3>
                  <div className="space-y-3">
                    {/* Creator */}
                    <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{project.creator.name}</p>
                          <p className="text-sm text-muted-foreground">Creador del proyecto</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                          OWNER
                        </span>
                      </div>
                    </div>
                    {/* Collaborators */}
                    {project.collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Code2 size={24} className="text-secondary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{collaborator.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {collaborator.stack.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="text-xs text-muted-foreground"
                                  style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'discussions' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Debates Técnicos</h3>
                  {(isOwner || isCollaborator) ? (
                    threads.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No hay debates aún. Sé el primero en iniciar una discusión técnica.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {threads.map((thread) => (
                          <div key={thread.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{thread.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{thread.content}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                  <span>{thread.author.name}</span>
                                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare size={14} />
                                    <span>{thread.commentsCount}</span>
                                  </div>
                                </div>
                              </div>
                              <span className="px-2 py-1 rounded text-xs bg-accent/50 text-foreground/70">
                                {thread.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Solo los colaboradores pueden ver los debates
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
