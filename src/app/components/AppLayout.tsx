import { Link, useLocation } from 'react-router';
import { Code2, Search } from 'lucide-react';

const EPICS = [
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'django', name: 'Django', icon: '🎯' },
  { id: 'javascript', name: 'JavaScript', icon: '📜' },
  { id: 'vuejs', name: 'Vue.js', icon: '💚' },
  { id: 'html', name: 'HTML', icon: '🌐' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard-figma" className="flex items-center gap-2">
              <Code2 size={24} style={{ color: '#5B7FBD' }} />
              <h1 className="text-xl" style={{ color: '#5B7FBD' }}>CodeF@ctory</h1>
            </Link>
            <nav className="flex gap-6">
              <Link
                to="/dashboard-figma"
                className={`text-sm pb-1 ${
                  location.pathname === '/dashboard-figma'
                    ? 'border-b-2 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={location.pathname === '/dashboard-figma' ? { borderColor: '#5B7FBD' } : {}}
              >
                Inicio
              </Link>
              <Link
                to="/dashboard-figma"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Mis proyectos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 w-48"
              />
            </div>
            <Link
              to="/create-project-figma"
              className="px-4 py-1.5 text-sm rounded-md text-white flex items-center gap-2"
              style={{ backgroundColor: '#5B7FBD' }}
            >
              + Nuevo proyecto
            </Link>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
              👤
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="mb-2">
            <h2 className="text-sm px-3 py-2 text-gray-700">Épicas</h2>
          </div>
          <div className="space-y-1">
            {EPICS.map((epic) => (
              <button
                key={epic.id}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span className="text-base">{epic.icon}</span>
                <span>{epic.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
