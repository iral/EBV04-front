import { Link } from 'react-router';
import { Plus, Filter, Search, TrendingUp, Users, Clock } from 'lucide-react';

const MOCK_PROJECTS = [
  { id: 1, title: 'E-commerce con React', description: 'Tienda online con carrito de compras', tech: ['React', 'Node.js', 'MongoDB'], status: 'Buscando', members: 2, views: 45 },
  { id: 2, title: 'API REST con Django', description: 'Backend para gestión de inventario', tech: ['Django', 'Python', 'PostgreSQL'], status: 'En desarrollo', members: 3, views: 32 },
  { id: 3, title: 'Dashboard Analytics', description: 'Panel de visualización de datos en tiempo real', tech: ['React', 'TypeScript', 'Chart.js'], status: 'Buscando', members: 1, views: 67 },
];

const STATS = [
  { label: 'Proyectos activos', value: '12', icon: TrendingUp, color: '#4A90E2' },
  { label: 'Colaboradores', value: '48', icon: Users, color: '#50C878' },
  { label: 'Esta semana', value: '8', icon: Clock, color: '#FFA500' },
];

export default function DashboardV3() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#4A90E2' }}>
              CF
            </div>
            <h1 className="text-2xl" style={{ color: '#4A90E2' }}>CodeF@ctory</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
              />
            </div>
            <button className="px-5 py-2 rounded-lg text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow" style={{ backgroundColor: '#4A90E2' }}>
              <Plus size={20} />
              Nuevo proyecto
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-6">
          <aside className="w-64">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} style={{ color: '#4A90E2' }} />
                <h2>Filtros</h2>
              </div>
              <div className="space-y-3">
                {['React', 'Django', 'Python', 'Node.js', 'TypeScript'].map((tech) => (
                  <label key={tech} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: '#4A90E2' }}
                    />
                    <span className="text-sm group-hover:text-blue-600 transition-colors">{tech}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-4">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl mb-1" style={{ color: '#4A90E2' }}>{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm text-white shadow-sm"
                    style={{ backgroundColor: project.status === 'Buscando' ? '#4A90E2' : '#50C878' }}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {project.members}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={16} />
                      {project.views} vistas
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg text-white text-sm hover:shadow-md transition-shadow"
                    style={{ backgroundColor: '#4A90E2' }}
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}

            <div className="flex gap-2 justify-center mt-8">
              <button className="w-10 h-10 rounded-lg text-white shadow-sm" style={{ backgroundColor: '#4A90E2' }}>1</button>
              <button className="w-10 h-10 rounded-lg bg-white border hover:bg-gray-50">2</button>
              <button className="w-10 h-10 rounded-lg bg-white border hover:bg-gray-50">3</button>
            </div>
          </main>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <Link to="/prototype/v2" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm shadow-md">
          ← V2
        </Link>
        <Link to="/prototype/v4" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm shadow-md">
          Ver Versión 4 →
        </Link>
      </div>
    </div>
  );
}
