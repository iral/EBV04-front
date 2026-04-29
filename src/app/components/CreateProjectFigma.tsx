import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppLayout from './AppLayout';
import { Info } from 'lucide-react';

const TECHNOLOGIES = ['React', 'Python', 'Django', 'JavaScript', 'HTML', 'Vue.js', 'Node.js', 'TypeScript'];

export default function CreateProjectFigma() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handlePublish = () => {
    if (!title || !description || selectedTechs.length === 0) {
      alert('Por favor completa todos los campos');
      return;
    }
    alert('Proyecto publicado exitosamente');
    navigate('/dashboard-figma');
  };

  const handleDraft = () => {
    alert('Proyecto guardado como borrador');
    navigate('/dashboard-figma');
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-2xl">Crear Proyecto</h1>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm text-gray-700">Título del Proyecto</label>
                  <Info size={14} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Título del Proyecto"
                />
              </div>

              <div>
                <h3 className="text-lg mb-4">Título del Proyecto</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Este proyecto busca desarrollar un sistema de gestión de tareas colaborativo.
                </p>
                <div className="flex gap-2 mb-6">
                  {['React', 'Python', 'Django'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded-md"
                      style={{ backgroundColor: '#E8EDF5', color: '#5B7FBD' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 resize-vertical"
                  rows={4}
                  placeholder="Describe tu proyecto..."
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Tecnologías</label>
                <div className="flex flex-wrap gap-2">
                  {TECHNOLOGIES.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        selectedTechs.includes(tech)
                          ? 'text-white'
                          : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                      style={selectedTechs.includes(tech) ? { backgroundColor: '#5B7FBD' } : {}}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleDraft}
                  className="px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Guardar borrador
                </button>
                <button
                  onClick={handlePublish}
                  className="px-6 py-2 text-sm rounded-md text-white"
                  style={{ backgroundColor: '#5B7FBD' }}
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
