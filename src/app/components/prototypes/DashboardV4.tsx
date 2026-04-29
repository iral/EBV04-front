import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Filter, Search, TrendingUp, Users, Clock, Star, ChevronDown, Bell, Settings, User } from 'lucide-react';

const MOCK_PROJECTS = [
  {
    id: 1,
    title: 'E-commerce con React',
    description: 'Tienda online con carrito de compras y sistema de pagos integrado',
    tech: ['React', 'Node.js', 'MongoDB'],
    status: 'Buscando',
    members: 2,
    views: 45,
    featured: true,
    owner: 'María García',
    avatar: 'MG',
    updated: '2h ago'
  },
  {
    id: 2,
    title: 'API REST con Django',
    description: 'Backend para gestión de inventario con autenticación JWT',
    tech: ['Django', 'Python', 'PostgreSQL'],
    status: 'En desarrollo',
    members: 3,
    views: 32,
    featured: false,
    owner: 'Carlos López',
    avatar: 'CL',
    updated: '5h ago'
  },
  {
    id: 3,
    title: 'Dashboard Analytics',
    description: 'Panel de visualización de datos en tiempo real con gráficos interactivos',
    tech: ['React', 'TypeScript', 'Chart.js'],
    status: 'Buscando',
    members: 1,
    views: 67,
    featured: true,
    owner: 'Ana Silva',
    avatar: 'AS',
    updated: '1d ago'
  },
];

const STATS = [
  { label: 'Proyectos activos', value: '12', icon: TrendingUp, color: '#4A90E2', change: '+3' },
  { label: 'Colaboradores', value: '48', icon: Users, color: '#50C878', change: '+12' },
  { label: 'Esta semana', value: '8', icon: Clock, color: '#FFA500', change: '+2' },
];

export default function DashboardV4() {
  const [activeTab, setActiveTab] = useState('todos');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)' }}>
                  <span className="font-bold">CF</span>
                </div>
                <h1 className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CodeF@ctory
                </h1>
              </div>
              <nav className="flex gap-1">
                {['Todos', 'Mis proyectos', 'Destacados'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      activeTab === tab.toLowerCase().replace(' ', '-')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar proyectos, tecnologías..."
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-72 bg-white/80"
                />
              </div>
              <button className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center">
                <Settings size={20} className="text-gray-600" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">
                  JD
                </div>
                <ChevronDown size={16} className="text-gray-600" />
              </button>
              <Link
                to="/create-project"
                className="px-5 py-2.5 rounded-xl text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)' }}
              >
                <Plus size={20} />
                Nuevo proyecto
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-5 mb-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                  <span className="text-sm px-2 py-1 rounded-lg bg-green-50 text-green-600">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-6">
          <aside className="w-72">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Filter size={20} style={{ color: '#4A90E2' }} />
                  <h2 className="font-semibold">Filtros</h2>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Limpiar</button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm mb-3 text-gray-700">Estado del proyecto</h3>
                <div className="space-y-2">
                  {['Buscando colaboradores', 'En desarrollo', 'Completado'].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                        style={{ accentColor: '#4A90E2' }}
                      />
                      <span className="text-sm group-hover:text-blue-600 transition-colors">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm mb-3 text-gray-700">Tecnologías</h3>
                <div className="space-y-2">
                  {['React', 'Django', 'Python', 'Node.js', 'TypeScript', 'Vue.js'].map((tech) => (
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
            </div>
          </aside>

          <main className="flex-1 space-y-5">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm" style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)' }}>
                      {project.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl" style={{ color: '#4A90E2' }}>{project.title}</h3>
                        {project.featured && (
                          <Star size={16} fill="#FFA500" className="text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Por {project.owner}</span>
                        <span>•</span>
                        <span>Actualizado {project.updated}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm text-white shadow-sm whitespace-nowrap"
                    style={{ backgroundColor: project.status === 'Buscando' ? '#4A90E2' : '#50C878' }}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Users size={16} />
                      <span>{project.members} miembros</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TrendingUp size={16} />
                      <span>{project.views} vistas</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm transition-colors">
                      Guardar
                    </button>
                    <Link
                      to="/dashboard"
                      className="px-5 py-2 rounded-xl text-white text-sm hover:shadow-lg transition-all"
                      style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)' }}
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center gap-2 mt-8">
              <button className="w-10 h-10 rounded-xl text-white shadow-md hover:shadow-lg transition-shadow" style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)' }}>
                1
              </button>
              <button className="w-10 h-10 rounded-xl bg-white border hover:bg-gray-50 transition-colors">2</button>
              <button className="w-10 h-10 rounded-xl bg-white border hover:bg-gray-50 transition-colors">3</button>
              <button className="w-10 h-10 rounded-xl bg-white border hover:bg-gray-50 transition-colors">4</button>
            </div>
          </main>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Link
          to="/prototype/v3"
          className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-xl hover:shadow-2xl transition-all"
        >
          ← Ver Versión 3
        </Link>
      </div>
    </div>
  );
}
