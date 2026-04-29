import { Link } from 'react-router';
import AppLayout from './AppLayout';

const MOCK_PROJECTS = [
  {
    id: 1,
    title: 'Proyecto para ty proyecto',
    description: 'Este proyecto tiene mucho talento un gran sistema de gestión de tareas.',
    technologies: ['React', 'Python', 'Django'],
  },
  {
    id: 2,
    title: 'Proyecto para empresarios',
    description: 'Este proyecto para genial un sistema de gestión de tareas.',
    technologies: ['React', 'Python', 'Django'],
  },
  {
    id: 3,
    title: 'Proyecto para empresarios',
    description: 'Este proyecto para genial un sistema de gestión de tareas.',
    technologies: ['React', 'Python'],
  },
];

export default function DashboardFigma() {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-5xl">
          <h1 className="text-2xl mb-6">Deste tl proyecto</h1>

          <div className="space-y-4">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs rounded-md"
                          style={{ backgroundColor: '#E8EDF5', color: '#5B7FBD' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/project-figma/${project.id}`}
                    className="px-4 py-2 text-sm rounded-md text-white ml-4"
                    style={{ backgroundColor: '#5B7FBD' }}
                  >
                    Ver más →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            <button className="w-8 h-8 rounded text-sm" style={{ backgroundColor: '#5B7FBD', color: 'white' }}>
              1
            </button>
            <button className="w-8 h-8 rounded text-sm text-gray-600 hover:bg-gray-100">2</button>
            <button className="w-8 h-8 rounded text-sm text-gray-600 hover:bg-gray-100">3</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
