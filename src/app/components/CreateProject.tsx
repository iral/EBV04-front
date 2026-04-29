import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, X } from 'lucide-react';

const TECHNOLOGIES = ['React', 'Django', 'Python', 'Node.js', 'TypeScript', 'Vue.js', 'Angular', 'Java', 'MongoDB', 'PostgreSQL'];

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSaveDraft = () => {
    alert('Proyecto guardado como borrador');
    navigate('/dashboard');
  };

  const handlePublish = () => {
    if (!title || !description || selectedTechs.length === 0) {
      alert('Por favor completa todos los campos');
      return;
    }
    alert('Proyecto publicado exitosamente');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 hover:underline" style={{ color: '#4A90E2' }}>
            <ArrowLeft size={20} />
            Volver al dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl mb-8" style={{ color: '#4A90E2' }}>
            Crear nuevo proyecto
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm text-gray-700">
                Título del proyecto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Plataforma de e-learning"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                rows={5}
                placeholder="Describe tu proyecto, objetivos y características principales..."
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">
                Tecnologías <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TECHNOLOGIES.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                      selectedTechs.includes(tech)
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={selectedTechs.includes(tech) ? { backgroundColor: '#4A90E2' } : {}}
                  >
                    {tech}
                    {selectedTechs.includes(tech) && <X size={14} />}
                  </button>
                ))}
              </div>
              {selectedTechs.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {selectedTechs.length} tecnología{selectedTechs.length > 1 ? 's' : ''} seleccionada{selectedTechs.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSaveDraft}
                className="flex-1 px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Guardar borrador
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 px-6 py-3 rounded-md text-white transition-colors"
                style={{ backgroundColor: '#4A90E2' }}
              >
                Publicar proyecto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
