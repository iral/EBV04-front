import { Link } from 'react-router';
import { Plus, Filter } from 'lucide-react';

const MOCK_PROJECTS = [
  { id: 1, title: 'E-commerce con React', description: 'Tienda online con carrito de compras', tech: ['React', 'Node.js'], status: 'Buscando', members: 2 },
  { id: 2, title: 'API REST con Django', description: 'Backend para gestión de inventario', tech: ['Django', 'Python'], status: 'En desarrollo', members: 3 },
  { id: 3, title: 'Dashboard Analytics', description: 'Panel de visualización de datos', tech: ['React', 'TypeScript'], status: 'Buscando', members: 1 },
];

export default function DashboardV2() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl text-blue-600">CodeF@ctory</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
            <Plus size={18} />
            Nuevo proyecto
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-56">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={18} className="text-blue-600" />
                <h2 className="text-sm">Filtros</h2>
              </div>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  React
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Django
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Python
                </label>
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-4">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="bg-white p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-blue-600">{project.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{project.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{project.members} miembros</span>
                  <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">Ver más →</Link>
                </div>
              </div>
            ))}

            <div className="flex gap-2 justify-center mt-6">
              <button className="w-9 h-9 bg-blue-600 text-white rounded">1</button>
              <button className="w-9 h-9 bg-white border rounded hover:bg-gray-50">2</button>
              <button className="w-9 h-9 bg-white border rounded hover:bg-gray-50">3</button>
            </div>
          </main>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2">
        <Link to="/prototype/v1" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm">
          ← V1
        </Link>
        <Link to="/prototype/v3" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">
          Ver Versión 3 →
        </Link>
      </div>
    </div>
  );
}
