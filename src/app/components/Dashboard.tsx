import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Filter } from 'lucide-react';

const MOCK_PROJECTS = [
  {
    id: 1,
    title: 'E-commerce con React',
    description: 'Tienda online con carrito de compras',
    technologies: ['React', 'Node.js', 'MongoDB'],
    status: 'Buscando',
    members: 2,
  },
  {
    id: 2,
    title: 'API REST con Django',
    description: 'Backend para gestión de inventario',
    technologies: ['Django', 'Python', 'PostgreSQL'],
    status: 'En desarrollo',
    members: 3,
  },
  {
    id: 3,
    title: 'Dashboard Analytics',
    description: 'Panel de visualización de datos en tiempo real',
    technologies: ['React', 'TypeScript', 'Chart.js'],
    status: 'Buscando',
    members: 1,
  },
  {
    id: 4,
    title: 'App móvil de tareas',
    description: 'Gestor de tareas con sincronización',
    technologies: ['React Native', 'Firebase'],
    status: 'Borrador',
    members: 1,
  },
  {
    id: 5,
    title: 'Blog con Vue.js',
    description: 'Plataforma de blogging moderna',
    technologies: ['Vue.js', 'Node.js'],
    status: 'Buscando',
    members: 2,
  },
  {
    id: 6,
    title: 'Chatbot con IA',
    description: 'Asistente virtual para atención al cliente',
    technologies: ['Python', 'TensorFlow', 'Flask'],
    status: 'En desarrollo',
    members: 4,
  },
];

const FILTERS = ['React', 'Django', 'Python', 'Node.js', 'TypeScript', 'Vue.js'];

export default function Dashboard() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filteredProjects = selectedFilters.length > 0
    ? MOCK_PROJECTS.filter(project =>
        project.technologies.some(tech => selectedFilters.includes(tech))
      )
    : MOCK_PROJECTS;

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Buscando': return '#4A90E2';
      case 'En desarrollo': return '#50C878';
      case 'Borrador': return '#FFA500';
      default: return '#6B7280';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl" style={{ color: '#4A90E2' }}>
            CodeF@ctory
          </h1>
          <Link
            to="/create-project"
            className="px-4 py-2 rounded-md text-white flex items-center gap-2"
            style={{ backgroundColor: '#4A90E2' }}
          >
            <Plus size={20} />
            Nuevo proyecto
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} style={{ color: '#4A90E2' }} />
                <h2 className="text-lg">Filtros</h2>
              </div>
              <div className="space-y-2">
                {FILTERS.map((filter) => (
                  <label key={filter} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter)}
                      onChange={() => toggleFilter(filter)}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: '#4A90E2' }}
                    />
                    <span className="text-sm">{filter}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="space-y-4">
              {displayedProjects.map((project) => (
                <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl mb-1">{project.title}</h3>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-sm text-white"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{project.members} miembros</span>
                    <Link
                      to={`/project/${project.id}`}
                      className="px-4 py-2 rounded-md text-white text-sm"
                      style={{ backgroundColor: '#4A90E2' }}
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-md transition-colors ${
                      currentPage === page ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    style={currentPage === page ? { backgroundColor: '#4A90E2' } : {}}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
