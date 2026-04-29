import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { api } from '../../../services/api';
import type { User, PlatformMetrics, MonthlyRegistrations } from '../../../types/api';
import {
  Shield, Users, FolderKanban, TrendingUp, UserCog, Ban, CheckCircle2,
  BarChart3, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Sidebar from '../dashboard/Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [registrations, setRegistrations] = useState<MonthlyRegistrations[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'moderator') {
      navigate('/dashboard');
      toast.error('No tienes permisos para acceder a esta sección');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, registrationsData, usersData] = await Promise.all([
        api.getPlatformMetrics(),
        api.getMonthlyRegistrations(),
        api.getAllUsers(),
      ]);
      setMetrics(metricsData);
      setRegistrations(registrationsData);
      setUsers(usersData);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'developer' | 'moderator' | 'admin') => {
    try {
      await api.updateUserRole(userId, newRole);
      await loadData();
      toast.success('Rol actualizado exitosamente');
      setSelectedUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar rol');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres suspender esta cuenta?')) return;

    try {
      await api.suspendUser(userId, 'Suspendido por el administrador');
      await loadData();
      toast.success('Usuario suspendido');
      setSelectedUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al suspender usuario');
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      await api.reactivateUser(userId);
      await loadData();
      toast.success('Usuario reactivado');
      setSelectedUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al reactivar usuario');
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="h-full px-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Panel de Administración</h2>
              <p className="text-xs text-muted-foreground">Gestión de usuarios y analíticas</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Metrics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Usuarios</span>
                  <Users size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold">{metrics.totalUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.activeUsersLastWeek} activos esta semana
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Proyectos</span>
                  <FolderKanban size={20} className="text-secondary" />
                </div>
                <p className="text-3xl font-bold">{metrics.totalProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  En la plataforma
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">En Desarrollo</span>
                  <Activity size={20} className="text-chart-2" />
                </div>
                <p className="text-3xl font-bold">{metrics.projectsInDevelopment}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Proyectos activos
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Completados</span>
                  <CheckCircle2 size={20} className="text-chart-3" />
                </div>
                <p className="text-3xl font-bold">{metrics.projectsCompleted}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Proyectos finalizados
                </p>
              </motion.div>
            </div>

            {/* Registration Chart */}
            <div className="mb-8 p-6 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Registros Mensuales</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={registrations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141824',
                      border: '1px solid rgba(0, 255, 65, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#00ff41"
                    strokeWidth={2}
                    dot={{ fill: '#00ff41', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Users Management */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <UserCog className="w-5 h-5 text-secondary" />
                  <h3 className="text-lg font-semibold">Gestión de Usuarios</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Usuario</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rol</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Proyectos</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <Users size={16} className="text-primary" />
                            </div>
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-destructive/10 text-destructive'
                                : u.role === 'moderator'
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-muted/50 text-foreground/70'
                            }`}
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              u.status === 'active'
                                ? 'bg-chart-3/10 text-chart-3'
                                : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {u.status === 'active' ? 'Activo' : 'Suspendido'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{u.projectsCount}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {user?.role === 'admin' && u.id !== user.id && (
                              <>
                                <button
                                  onClick={() => setSelectedUser(u)}
                                  className="p-2 hover:bg-secondary/10 text-secondary rounded-md transition-colors"
                                  title="Cambiar rol"
                                >
                                  <UserCog size={16} />
                                </button>
                                {u.status === 'active' ? (
                                  <button
                                    onClick={() => handleSuspendUser(u.id)}
                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                                    title="Suspender"
                                  >
                                    <Ban size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleReactivateUser(u.id)}
                                    className="p-2 hover:bg-chart-3/10 text-chart-3 rounded-md transition-colors"
                                    title="Reactivar"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Cambiar Rol de Usuario</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Selecciona el nuevo rol para <strong>{selectedUser.name}</strong>
            </p>

            <div className="space-y-2 mb-6">
              {(['developer', 'moderator', 'admin'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleChangeRole(selectedUser.id, role)}
                  className={`w-full p-3 rounded-md text-left transition-all border ${
                    selectedUser.role === role
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-muted/30 border-border hover:bg-muted'
                  }`}
                >
                  <span className="font-medium capitalize">{role}</span>
                  {role === 'admin' && (
                    <p className="text-xs text-muted-foreground mt-1">Acceso total al sistema</p>
                  )}
                  {role === 'moderator' && (
                    <p className="text-xs text-muted-foreground mt-1">Puede moderar contenido</p>
                  )}
                  {role === 'developer' && (
                    <p className="text-xs text-muted-foreground mt-1">Usuario estándar</p>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2 px-4 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-all"
            >
              Cancelar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
