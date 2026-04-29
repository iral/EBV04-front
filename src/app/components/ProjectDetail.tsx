import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Users, MessageSquare, Send } from 'lucide-react';

const MOCK_PROJECT_DATA: Record<string, any> = {
  '1': {
    title: 'E-commerce con React',
    description: 'Tienda online con carrito de compras y sistema de pagos integrado. Buscamos desarrolladores con experiencia en React y Node.js para implementar funcionalidades de gestión de productos y procesamiento de pedidos.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    status: 'Buscando',
    members: 2,
    owner: 'María García',
    createdAt: '2026-03-15',
    discussions: [
      { id: 1, user: 'Juan Pérez', message: '¿Qué sistema de pagos vamos a usar?', time: '2h' },
      { id: 2, user: 'María García', message: 'Propongo usar Stripe por su facilidad de integración', time: '1h' },
    ]
  },
  '2': {
    title: 'API REST con Django',
    description: 'Backend para gestión de inventario con autenticación JWT y endpoints RESTful.',
    technologies: ['Django', 'Python', 'PostgreSQL'],
    status: 'En desarrollo',
    members: 3,
    owner: 'Carlos López',
    createdAt: '2026-03-10',
    discussions: [
      { id: 1, user: 'Ana Silva', message: 'Ya tengo lista la estructura base de la BD', time: '3h' },
    ]
  },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [discussions, setDiscussions] = useState(MOCK_PROJECT_DATA[id || '1']?.discussions || []);

  const project = MOCK_PROJECT_DATA[id || '1'] || MOCK_PROJECT_DATA['1'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Buscando': return '#4A90E2';
      case 'En desarrollo': return '#50C878';
      case 'Borrador': return '#FFA500';
      default: return '#6B7280';
    }
  };

  const handlePostulate = () => {
    alert('¡Solicitud enviada! El creador del proyecto revisará tu perfil.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setDiscussions([
      ...discussions,
      { id: discussions.length + 1, user: 'Tú', message: newMessage, time: 'ahora' }
    ]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 hover:underline" style={{ color: '#4A90E2' }}>
            <ArrowLeft size={20} />
            Volver al dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl mb-2" style={{ color: '#4A90E2' }}>
                {project.title}
              </h1>
              <p className="text-sm text-gray-500">
                Creado por {project.owner} • {project.createdAt}
              </p>
            </div>
            <span
              className="px-4 py-2 rounded-full text-white"
              style={{ backgroundColor: getStatusColor(project.status) }}
            >
              {project.status}
            </span>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {project.description}
          </p>

          <div className="mb-6">
            <h3 className="text-sm mb-2 text-gray-600">Tecnologías</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string) => (
                <span key={tech} className="px-3 py-1 bg-gray-100 rounded text-gray-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={20} />
              <span>{project.members} miembros</span>
            </div>
          </div>

          {project.status === 'Buscando' && (
            <button
              onClick={handlePostulate}
              className="w-full py-3 px-6 rounded-md text-white transition-colors"
              style={{ backgroundColor: '#4A90E2' }}
            >
              Postularme al proyecto
            </button>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={24} style={{ color: '#4A90E2' }} />
            <h2 className="text-2xl">Discusiones</h2>
          </div>

          <div className="space-y-4 mb-6">
            {discussions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay discusiones todavía. ¡Sé el primero en comentar!
              </p>
            ) : (
              discussions.map((discussion: any) => (
                <div key={discussion.id} className="border-l-4 pl-4 py-2" style={{ borderColor: '#4A90E2' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{discussion.user}</span>
                    <span className="text-xs text-gray-500">hace {discussion.time}</span>
                  </div>
                  <p className="text-gray-700">{discussion.message}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white flex items-center gap-2"
              style={{ backgroundColor: '#4A90E2' }}
            >
              <Send size={20} />
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
