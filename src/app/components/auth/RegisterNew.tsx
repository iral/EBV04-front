import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import { User, Mail, Lock, Terminal, ArrowRight, X, Code2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const TECHNOLOGIES = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django', 'FastAPI',
  'TypeScript', 'JavaScript', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB',
  'Redis', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Next.js', 'Tailwind CSS'
];

interface Role {
  id: number;
  name: string;
}

export default function RegisterNew() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState('DEVELOPER');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getRoles().then(setRoles).catch(() => {});
  }, []);

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (selectedTechs.length === 0) {
      toast.error('Selecciona al menos una tecnología');
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password, stack: selectedTechs, role: selectedRole });
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-card border border-border rounded-lg p-8 backdrop-blur-sm">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                DevCollab
              </h1>
              <p className="text-xs text-muted-foreground">Developer Collaboration Network</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl mb-2">Crear cuenta</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Únete a la red de desarrolladores colaborativos
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground/80">Nombre completo</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground/80">Correo electrónico</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground/80">Contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo 8 caracteres, una letra y un número
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground/80">Confirmar contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-primary" />
                  <label className="text-sm text-foreground/80">
                    Stack técnico <span className="text-primary">*</span>
                  </label>
                  {selectedTechs.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({selectedTechs.length} seleccionadas)
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 p-4 bg-input-background border border-border rounded-md max-h-64 overflow-y-auto">
                  {TECHNOLOGIES.map((tech) => (
                    <motion.button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-md text-sm transition-all flex items-center gap-2 border ${
                        selectedTechs.includes(tech)
                          ? 'bg-primary/20 text-primary border-primary'
                          : 'bg-muted/30 text-foreground/70 hover:bg-muted border-border/50'
                      }`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      <span>{tech}</span>
                      {selectedTechs.includes(tech) && <X size={14} />}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-primary" />
                  <label className="text-sm text-foreground/80">
                    Rol <span className="text-primary">*</span>
                  </label>
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  {roles.filter(r => r.name !== 'ADMIN').map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name === 'DEVELOPER' ? 'Desarrollador' : 
                       role.name === 'RECRUITER' ? 'Reclutador' : 
                       role.name === 'ADMIN' ? 'Administrador' : role.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <span>CREAR CUENTA</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">¿Ya tienes cuenta? </span>
                <Link
                  to="/"
                  className="text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
                >
                  Inicia sesión
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
