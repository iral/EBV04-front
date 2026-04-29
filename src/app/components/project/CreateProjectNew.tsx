import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import { ArrowLeft, Code2, FileText, Save, Send, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Sidebar from '../dashboard/Sidebar';

const TECHNOLOGIES = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django', 'FastAPI',
  'TypeScript', 'JavaScript', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB',
  'Redis', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Next.js', 'Tailwind CSS',
  'Express', 'NestJS', 'Flask', 'Ruby on Rails', 'Go', 'Rust', 'Swift'
];

export default function CreateProjectNew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const addCustomTech = () => {
    if (customTech.trim() && !selectedTechs.includes(customTech.trim())) {
      setSelectedTechs([...selectedTechs, customTech.trim()]);
      setCustomTech('');
    }
  };

  const handleSave = async (status: 'draft' | 'seeking_collaborators') => {
    if (!title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    if (status === 'seeking_collaborators') {
      if (!description.trim()) {
        toast.error('La descripción es obligatoria para publicar');
        return;
      }
      if (selectedTechs.length === 0) {
        toast.error('Selecciona al menos una tecnología para publicar');
        return;
      }
    }

    setIsLoading(true);
    try {
      const project = await api.createProject({
        title: title.trim(),
        description: description.trim(),
        stackRequired: selectedTechs,
        status,
      });

      toast.success(
        status === 'draft'
          ? 'Borrador guardado exitosamente'
          : 'Proyecto publicado exitosamente'
      );
      navigate(`/project/${project.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h2 className="text-lg font-semibold">Crear Nuevo Proyecto</h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              {/* Introduction */}
              <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">¿Tienes una idea?</h3>
                    <p className="text-sm text-foreground/70">
                      Crea un proyecto y encuentra desarrolladores que compartan tu visión.
                      Puedes guardarlo como borrador o publicarlo inmediatamente.
                    </p>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm mb-2 text-foreground/80">
                    Título del Proyecto <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ej. Sistema de Gestión de Inventario en Tiempo Real"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    maxLength={100}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Sé claro y descriptivo</span>
                    <span>{title.length}/100</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm mb-2 text-foreground/80">
                    Descripción <span className="text-primary">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tu proyecto: objetivo, funcionalidades principales, alcance esperado..."
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    rows={6}
                    maxLength={1000}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Explica qué necesitas construir y por qué</span>
                    <span>{description.length}/1000</span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-primary" />
                    <label className="text-sm text-foreground/80">
                      Stack Técnico Requerido <span className="text-primary">*</span>
                    </label>
                    {selectedTechs.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({selectedTechs.length} seleccionadas)
                      </span>
                    )}
                  </div>

                  {/* Selected Technologies */}
                  {selectedTechs.length > 0 && (
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md">
                      <div className="flex flex-wrap gap-2">
                        {selectedTechs.map((tech) => (
                          <motion.div
                            key={tech}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="px-3 py-1.5 bg-primary/20 text-primary rounded-md flex items-center gap-2 border border-primary/30"
                          >
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{tech}</span>
                            <button
                              type="button"
                              onClick={() => toggleTech(tech)}
                              className="hover:bg-primary/30 rounded-sm p-0.5 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technology Selection */}
                  <div className="p-4 bg-input-background border border-border rounded-md max-h-80 overflow-y-auto">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {TECHNOLOGIES.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => toggleTech(tech)}
                          className={`px-3 py-1.5 rounded-md text-sm transition-all border ${
                            selectedTechs.includes(tech)
                              ? 'bg-secondary/20 text-secondary border-secondary opacity-50'
                              : 'bg-muted/30 text-foreground/70 hover:bg-muted border-border/50'
                          }`}
                          style={{ fontFamily: 'var(--font-mono)' }}
                          disabled={selectedTechs.includes(tech)}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>

                    {/* Custom Technology */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customTech}
                          onChange={(e) => setCustomTech(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTech())}
                          placeholder="¿No encuentras una tecnología? Agrégala aquí..."
                          className="flex-1 px-3 py-2 bg-background/50 border border-border/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          type="button"
                          onClick={addCustomTech}
                          className="px-4 py-2 bg-secondary/10 text-secondary rounded-md hover:bg-secondary/20 transition-colors flex items-center gap-2"
                        >
                          <Plus size={16} />
                          <span className="text-sm">Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information Box */}
                <div className="p-4 bg-accent/30 border border-border/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-secondary" />
                    Campos obligatorios
                  </h4>
                  <ul className="text-xs text-foreground/70 space-y-1 ml-6 list-disc">
                    <li>
                      <strong>Para guardar como borrador:</strong> Solo necesitas un título
                    </li>
                    <li>
                      <strong>Para publicar:</strong> Título, descripción completa y al menos una tecnología
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => handleSave('draft')}
                    disabled={isLoading || !title.trim()}
                    className="flex-1 px-6 py-3 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    <span>Guardar como Borrador</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('seeking_collaborators')}
                    disabled={isLoading || !title.trim() || !description.trim() || selectedTechs.length === 0}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        <span>PUBLICAR PROYECTO</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
