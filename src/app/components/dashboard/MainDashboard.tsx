import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import type { Project, ProjectFilters } from '../../../types/api';
import {
  Terminal, Plus, Search, Filter, Code2, Users, Clock,
  CheckCircle2, MessageCircle, Bell, Settings, LogOut, User,
  Sparkles, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProjectCard from './ProjectCard';
import Sidebar from './Sidebar';

const STATUS_FILTERS = [
  { value: 'seeking_collaborators', label: 'Buscando Colaboradores', icon: Users },
  { value: 'in_development', label: 'En Desarrollo', icon: Code2 },
  { value: 'completed', label: 'Completados', icon: CheckCircle2 },
];

const TECH_FILTERS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django',
  'TypeScript', 'Java', 'PostgreSQL', 'MongoDB'
];

export default function MainDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [selectedTechs, selectedStatuses, searchQuery]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const filters: ProjectFilters = {
        search: searchQuery || undefined,
        stack: selectedTechs.length > 0 ? selectedTechs : undefined,
        status: selectedStatuses.length > 0 ? selectedStatuses as any : undefined,
      };
      const response = await api.getProjects(filters);
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedTechs([]);
    setSelectedStatuses([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTechs.length > 0 || selectedStatuses.length > 0 || searchQuery.length > 0;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Explorar Proyectos</h2>
              <span className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                style={{ fontFamily: 'var(--font-mono)' }}>
                {projects.length} proyectos
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 hover:bg-accent rounded-md transition-colors"
              >
                <Bell size={20} className="text-foreground/70" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="relative p-2 hover:bg-accent rounded-md transition-colors"
              >
                <MessageCircle size={20} className="text-foreground/70" />
              </button>
              <div className="h-6 w-px bg-border" />
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 hover:bg-accent px-3 py-1.5 rounded-md transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <span className="text-sm">{user?.name}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Search and Filter Bar */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar proyectos por título o descripción..."
                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                    showFilters || hasActiveFilters
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-card border-border hover:bg-accent'
                  }`}
                >
                  <Filter size={20} />
                  <span>Filtros</span>
                  {hasActiveFilters && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {selectedTechs.length + selectedStatuses.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/create-project')}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 font-medium"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <Plus size={20} />
                  <span>NUEVO PROYECTO</span>
                </button>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-card border border-border rounded-lg space-y-6">
                      {/* Status Filters */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 text-foreground/80">Estado del Proyecto</h3>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_FILTERS.map(({ value, label, icon: Icon }) => (
                            <button
                              key={value}
                              onClick={() => toggleStatus(value)}
                              className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 border ${
                                selectedStatuses.includes(value)
                                  ? 'bg-primary/20 text-primary border-primary'
                                  : 'bg-muted/30 text-foreground/70 hover:bg-muted border-border/50'
                              }`}
                            >
                              <Icon size={16} />
                              <span>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tech Filters */}
                      <div>
                        <h3 className="text-sm font-medium mb-3 text-foreground/80">Tecnologías</h3>
                        <div className="flex flex-wrap gap-2">
                          {TECH_FILTERS.map((tech) => (
                            <button
                              key={tech}
                              onClick={() => toggleTech(tech)}
                              className={`px-3 py-1.5 rounded-md text-sm transition-all border ${
                                selectedTechs.includes(tech)
                                  ? 'bg-secondary/20 text-secondary border-secondary'
                                  : 'bg-muted/30 text-foreground/70 hover:bg-muted border-border/50'
                              }`}
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              {tech}
                            </button>
                          ))}
                        </div>
                      </div>

                      {hasActiveFilters && (
                        <div className="pt-4 border-t border-border">
                          <button
                            onClick={clearFilters}
                            className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                          >
                            Limpiar todos los filtros
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            ) : projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No se encontraron proyectos</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {hasActiveFilters
                    ? 'Prueba ajustando los filtros de búsqueda'
                    : 'Sé el primero en crear un proyecto'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {projects.map((project, index) => (
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
