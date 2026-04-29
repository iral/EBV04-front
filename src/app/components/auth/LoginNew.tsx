import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Mail, Lock, Terminal, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function LoginNew() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success('¡Bienvenido de vuelta!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background grid */}
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-lg p-8 backdrop-blur-sm">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-3 mb-8"
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
            <h2 className="text-xl mb-2">Iniciar sesión</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ingresa tus credenciales para acceder a la plataforma
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/recovery"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
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
                    <span>INICIAR SESIÓN</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">¿No tienes cuenta? </span>
                <Link
                  to="/register"
                  className="text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
                >
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Quick login helper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-accent/50 border border-border/50 rounded-md"
        >
          <p className="text-xs text-muted-foreground mb-2">
            <span className="text-primary" style={{ fontFamily: 'var(--font-mono)' }}>Demo:</span> Usa cualquier email de mockUsers
          </p>
          <div className="flex flex-wrap gap-2">
            {['ana@example.com', 'carlos@example.com', 'maria@example.com'].map((demoEmail) => (
              <button
                key={demoEmail}
                onClick={() => setEmail(demoEmail)}
                className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted border border-border/50 rounded text-foreground/70 hover:text-foreground transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {demoEmail}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
