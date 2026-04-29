import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Mail, Lock, X } from 'lucide-react';

const TECHNOLOGIES = ['React', 'Django', 'Python', 'Node.js', 'TypeScript', 'Vue.js', 'Angular', 'Java'];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard-figma');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl mb-8 text-center" style={{ color: '#4A90E2' }}>
          CodeF@ctory
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-gray-700">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700">Tecnologías de interés</label>
            <div className="flex flex-wrap gap-2">
              {TECHNOLOGIES.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                    selectedTechs.includes(tech)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedTechs.includes(tech) ? { backgroundColor: '#4A90E2' } : {}}
                >
                  {tech}
                  {selectedTechs.includes(tech) && <X size={14} />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white transition-colors"
            style={{ backgroundColor: '#4A90E2' }}
          >
            Crear cuenta
          </button>

          <div className="text-center">
            <Link to="/" className="text-sm hover:underline" style={{ color: '#4A90E2' }}>
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
