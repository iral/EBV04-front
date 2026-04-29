import { useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Terminal, Home, FolderKanban, MessageCircle, User, Settings,
  LogOut, Shield, BarChart3, Users
} from 'lucide-react';
import { toast } from 'sonner';

const MENU_ITEMS = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderKanban, label: 'Mis Proyectos', path: '/my-projects' },
  { icon: MessageCircle, label: 'Mensajes', path: '/messages' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const ADMIN_ITEMS = [
  { icon: Shield, label: 'Administración', path: '/admin' },
  { icon: Users, label: 'Usuarios', path: '/admin/users' },
  { icon: BarChart3, label: 'Analíticas', path: '/admin/analytics' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada');
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="h-16 border-b border-border px-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
          <Terminal className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
            DevCollab
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {MENU_ITEMS.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-all ${
              window.location.pathname === path
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-foreground/70 hover:bg-accent hover:text-foreground'
            }`}
          >
            <Icon size={20} />
            <span className="text-sm">{label}</span>
          </button>
        ))}

        {isAdmin && (
          <>
            <div className="pt-4 pb-2 px-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Administración
              </div>
            </div>
            {ADMIN_ITEMS.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-all ${
                  window.location.pathname === path
                    ? 'bg-secondary/10 text-secondary border border-secondary/20'
                    : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className="mb-3 p-3 bg-accent/50 rounded-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          {user?.role !== 'developer' && (
            <div className="flex items-center gap-1">
              <Shield size={12} className="text-secondary" />
              <span className="text-xs text-secondary uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                {user?.role}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-foreground/70 hover:bg-accent hover:text-foreground transition-all mb-2"
        >
          <Settings size={18} />
          <span className="text-sm">Configuración</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
