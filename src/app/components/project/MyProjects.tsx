import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import type { Project } from '../../../types/api';
import { FolderKanban, Plus, FileText, Code2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import Sidebar from '../dashboard/Sidebar';
import ProjectCard from '../dashboard/ProjectCard';

type TabType = 'created' | 'collaborating' | 'drafts';

export default function MyProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('created');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.getMyProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createdProjects = projects.filter(p => String(p.creatorId) === user?.id && p.status !== 'draft');
  const draftProjects = projects.filter(p => String(p.creatorId) === user?.id && p.status === 'draft');
  const collaboratingProjects = projects.filter(p =>
    p.collaborators.some(c => String(c.id) === user?.id)
  );

  const getCurrentProjects = () => {
    switch (activeTab) {
      case 'created':
        return createdProjects;
      case 'collaborating':
        return collaboratingProjects;
      case 'drafts':
        return draftProjects;
      default:
        return [];
    }
  };

  const currentProjects = getCurrentProjects();

  const TABS = [
    { key: 'created' as TabType, label: 'Mis Proyectos', count: createdProjects.length, icon: FolderKanban },
    { key: 'collaborating' as TabType, label: 'Colaborando', count: collaboratingProjects.length, icon: Code2 },
    { key: 'drafts' as TabType, label: 'Borradores', count: draftProjects.length, icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Mis Proyectos</h2>
                <p className="text-xs text-muted-foreground">Gestiona tus proyectos y colaboraciones</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/create-project')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all flex items-center gap-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <Plus size={18} />
              <span>NUEVO</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Proyectos Creados</span>
                  <FolderKanban size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold">{createdProjects.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Colaboraciones</span>
                  <Code2 size={20} className="text-secondary" />
                </div>
                <p className="text-3xl font-bold">{collaboratingProjects.length}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Borradores</span>
                  <FileText size={20} className="text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold">{draftProjects.length}</p>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-card border border-border rounded-lg p-1">
              {TABS.map(({ key, label, count, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 px-4 py-3 rounded-md transition-all flex items-center justify-center gap-2 ${
                    activeTab === key
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-foreground/70 hover:bg-accent'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === key
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-card border border-border rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : currentProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'created' && <FolderKanban size={32} className="text-muted-foreground" />}
                  {activeTab === 'collaborating' && <Code2 size={32} className="text-muted-foreground" />}
                  {activeTab === 'drafts' && <FileText size={32} className="text-muted-foreground" />}
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {activeTab === 'created' && 'No has creado proyectos aún'}
                  {activeTab === 'collaborating' && 'No estás colaborando en ningún proyecto'}
                  {activeTab === 'drafts' && 'No tienes borradores guardados'}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeTab === 'created' && 'Crea tu primer proyecto y encuentra colaboradores'}
                  {activeTab === 'collaborating' && 'Postúlate a proyectos que te interesen'}
                  {activeTab === 'drafts' && 'Guarda ideas para desarrollarlas más tarde'}
                </p>
                {activeTab !== 'collaborating' && (
                  <button
                    onClick={() => navigate('/create-project')}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all inline-flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <Plus size={18} />
                    <span>CREAR PROYECTO</span>
                  </button>
                )}
                {activeTab === 'collaborating' && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2 bg-secondary text-primary-foreground rounded-md hover:bg-secondary/90 transition-all inline-flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <span>EXPLORAR PROYECTOS</span>
                  </button>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
