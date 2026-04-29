import { Link } from 'react-router';

const MOCK_PROJECTS = [
  { id: 1, title: 'E-commerce con React', tech: 'React, Node.js', status: 'Buscando' },
  { id: 2, title: 'API REST con Django', tech: 'Django, Python', status: 'En desarrollo' },
  { id: 3, title: 'Dashboard Analytics', tech: 'React, TypeScript', status: 'Buscando' },
];

export default function DashboardV1() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-300 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl">CodeF@ctory</h1>
          <button className="border border-gray-400 px-3 py-1 text-sm">+ Nuevo</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-4">
          <div className="w-48 border border-gray-300 p-3">
            <h2 className="mb-2 text-sm">Filtros</h2>
            <div className="space-y-1 text-sm">
              <div><input type="checkbox" /> React</div>
              <div><input type="checkbox" /> Django</div>
              <div><input type="checkbox" /> Python</div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="border border-gray-300 p-4">
                <h3 className="mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{project.tech}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs border border-gray-400 px-2 py-1">{project.status}</span>
                  <Link to="/dashboard" className="text-sm underline">Ver más</Link>
                </div>
              </div>
            ))}

            <div className="flex gap-2 justify-center mt-4">
              <button className="w-8 h-8 border border-gray-400">1</button>
              <button className="w-8 h-8 border border-gray-400">2</button>
              <button className="w-8 h-8 border border-gray-400">3</button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <Link
          to="/prototype/v2"
          className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
        >
          Ver Versión 2 →
        </Link>
      </div>
    </div>
  );
}
