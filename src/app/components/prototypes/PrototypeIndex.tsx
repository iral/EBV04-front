import { Link } from 'react-router';
import { ArrowLeft, Layers } from 'lucide-react';

const VERSIONS = [
  {
    version: 'v1',
    title: 'Versión 1 - Wireframe Básico',
    description: 'Estructura inicial con elementos básicos: header, filtros laterales, lista de proyectos y paginación.',
    features: ['Layout básico', 'Filtros simples', 'Cards de proyectos', 'Paginación básica'],
    color: '#9CA3AF',
  },
  {
    version: 'v2',
    title: 'Versión 2 - Diseño Mejorado',
    description: 'Mejoras visuales con sombras, espaciado mejorado, íconos y mejor jerarquía visual.',
    features: ['Íconos Lucide', 'Sombras y bordes redondeados', 'Mejor tipografía', 'Estados hover'],
    color: '#4A90E2',
  },
  {
    version: 'v3',
    title: 'Versión 3 - UI Moderna',
    description: 'Diseño moderno con gradientes, estadísticas, búsqueda y micro-interacciones.',
    features: ['Dashboard con estadísticas', 'Barra de búsqueda', 'Gradientes de fondo', 'Animaciones hover', 'Más información por proyecto'],
    color: '#357ABD',
  },
  {
    version: 'v4',
    title: 'Versión 4 - Versión Final Pulida',
    description: 'Versión completa con navegación por tabs, notificaciones, perfil de usuario y diseño premium.',
    features: ['Navegación con tabs', 'Header completo con notificaciones', 'Proyectos destacados', 'Filtros avanzados', 'Gradientes premium', 'Avatares de usuarios', 'Información de actualización'],
    color: '#1E40AF',
  },
];

export default function PrototypeIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers size={28} style={{ color: '#4A90E2' }} />
              <h1 className="text-2xl" style={{ color: '#4A90E2' }}>
                Prototipos CodeF@ctory
              </h1>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#4A90E2' }}
            >
              <ArrowLeft size={18} />
              Volver a la app
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4" style={{ color: '#4A90E2' }}>
            Evolución del Diseño
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Diseñamos el prototipo basado en las historias de usuario priorizadas del hito,
            enfocándonos en el flujo principal del usuario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {VERSIONS.map((version) => (
            <Link
              key={version.version}
              to={`/prototype/${version.version}`}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-blue-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: version.color }}
                >
                  {version.version.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl" style={{ color: version.color }}>
                    {version.title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                {version.description}
              </p>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-2">Características:</p>
                <ul className="space-y-1">
                  {version.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span style={{ color: version.color }}>•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm hover:underline" style={{ color: version.color }}>
                  Ver prototipo →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl mb-4" style={{ color: '#4A90E2' }}>
            Pantallas Completas del Sistema
          </h3>
          <p className="text-gray-600 mb-6">
            Además de las 4 versiones iterativas del Dashboard, el prototipo completo incluye:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Login', path: '/' },
              { name: 'Registro', path: '/register' },
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Crear Proyecto', path: '/create-project' },
              { name: 'Detalle Proyecto', path: '/project/1' },
            ].map((screen) => (
              <Link
                key={screen.name}
                to={screen.path}
                className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center"
              >
                <p className="text-sm" style={{ color: '#4A90E2' }}>
                  {screen.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
