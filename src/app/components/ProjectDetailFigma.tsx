import { useState } from 'react';
import { useParams } from 'react-router';
import AppLayout from './AppLayout';
import { FileText } from 'lucide-react';

const MOCK_PROJECT = {
  title: 'Sistema de Gestión de Tareas',
  description: 'Este proyecto busca desarrollar un sistema de gestión de tareas colaborativo.',
  technologies: ['React', 'Python', 'Django'],
  status: 'Buscando Colaboradores',
  discussions: [
    {
      id: 1,
      user: 'Carlos User',
      time: '12 minutos - 15:00h',
      message: 'Estoy pensando en usar Django con React para la arquitectura ¿Qué opinan?',
      likes: 18,
    },
    {
      id: 2,
      user: 'Iván User',
      time: '18 minutos - 15:00h',
      message: 'Me parece genial podríamos usar Django como backend y React en el frontend',
      likes: 12,
    },
  ],
};

export default function ProjectDetailFigma() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'detalles' | 'discusiones'>('detalles');
  const [newComment, setNewComment] = useState('');

  const handlePostulate = () => {
    alert('¡Solicitud enviada! El creador revisará tu perfil.');
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    alert('Comentario enviado');
    setNewComment('');
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Project Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <FileText size={24} style={{ color: '#5B7FBD' }} />
                <div>
                  <h1 className="text-xl mb-1">Proyecto</h1>
                  <h2 className="text-2xl" style={{ color: '#5B7FBD' }}>
                    Crear Proyecto
                  </h2>
                </div>
              </div>
              <button
                onClick={handlePostulate}
                className="px-6 py-2 rounded-md text-white text-sm"
                style={{ backgroundColor: '#5B7FBD' }}
              >
                Postularme
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('detalles')}
                className={`pb-2 text-sm ${
                  activeTab === 'detalles'
                    ? 'border-b-2 text-gray-900'
                    : 'text-gray-600'
                }`}
                style={activeTab === 'detalles' ? { borderColor: '#5B7FBD' } : {}}
              >
                Detalles
              </button>
              <button
                onClick={() => setActiveTab('discusiones')}
                className={`pb-2 text-sm ${
                  activeTab === 'discusiones'
                    ? 'border-b-2 text-gray-900'
                    : 'text-gray-600'
                }`}
                style={activeTab === 'discusiones' ? { borderColor: '#5B7FBD' } : {}}
              >
                Discusiones
              </button>
              <div className="ml-auto pb-2 text-sm text-gray-500">
                💬 Tareas: (5)
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'detalles' ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl">{MOCK_PROJECT.title}</h3>
                <span
                  className="px-4 py-1 rounded-md text-sm"
                  style={{ backgroundColor: '#FFF3CD', color: '#856404' }}
                >
                  {MOCK_PROJECT.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {MOCK_PROJECT.description}
              </p>
              <div className="flex gap-2">
                {MOCK_PROJECT.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm rounded-md"
                    style={{ backgroundColor: '#E8EDF5', color: '#5B7FBD' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-4">
                  <button className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
                    Detalles
                  </button>
                  <button className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
                    Discusiones
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                {MOCK_PROJECT.discussions.map((discussion) => (
                  <div key={discussion.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{discussion.user}</span>
                        <span className="text-xs text-gray-500">{discussion.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{discussion.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <button className="hover:text-blue-600">👍 {discussion.likes}</button>
                        <button className="hover:text-blue-600">Responder</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                      <button
                        onClick={handleSendComment}
                        className="px-6 py-2 rounded-md text-white text-sm"
                        style={{ backgroundColor: '#5B7FBD' }}
                      >
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
