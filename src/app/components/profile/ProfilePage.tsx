import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import type { UserRole } from '../../../types/api';
import { User, Mail, Code2, Calendar, Edit2, Save, X, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Sidebar from '../dashboard/Sidebar';

const TECHNOLOGIES = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django', 'FastAPI',
  'TypeScript', 'JavaScript', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB',
  'Redis', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Next.js', 'Tailwind CSS'
];

interface Role {
  id: number;
  name: string;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setSelectedTechs(user.stack || []);
      setSelectedRole(user.role);
      if (user.isAdmin) {
        api.getRoles().then(setRoles).catch(() => {});
      }
    }
  }, [user]);

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const addCustomTech = () => {
    if (customTech.trim() && !selectedTechs.includes(customTech.trim())) {
      setSelectedTechs([...selectedTechs, customTech.trim()]);
      setCustomTech('');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    try {
      await api.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        stack: selectedTechs
      });
      
      await refreshUser();
      
      toast.success('Perfil actualizado exitosamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedRole || selectedRole === user?.role) {
      setIsEditingRole(false);
      return;
    }

    try {
      await api.updateUserRole(user!.id, selectedRole as UserRole);
      await refreshUser();
      toast.success('Rol actualizado exitosamente');
      setIsEditingRole(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error al actualizar el rol');
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setSelectedTechs(user?.stack || []);
    setIsEditing(false);
  };

  if (!user || !user.name) return null;

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Mi Perfil</h2>
                <p className="text-xs text-muted-foreground">Gestiona tu información personal</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all flex items-center gap-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <Edit2 size={18} />
                <span>EDITAR</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-all flex items-center gap-2"
                >
                  <X size={18} />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <Save size={18} />
                  <span>GUARDAR</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg overflow-hidden mb-6"
            >
              {/* Header with Avatar */}
              <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
              <div className="px-8 pb-8">
                <div className="flex items-end gap-6 -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-full bg-card border-4 border-border flex items-center justify-center">
                    <User size={48} className="text-primary" />
                  </div>
                  <div className="flex-1 pt-16">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold">{user.name}</h1>
                      {isEditingRole ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 focus:outline-none"
                          >
                            {roles.map((role) => (
                              <option key={role.id} value={role.name.toLowerCase()}>
                                {role.name === 'DEVELOPER' ? 'Desarrollador' : 
                                 role.name === 'RECRUITER' ? 'Reclutador' : 
                                 role.name === 'ADMIN' ? 'Administrador' : role.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handleRoleUpdate}
                            className="p-1 text-green-500 hover:bg-green-500/10 rounded"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRole(user.role);
                              setIsEditingRole(false);
                            }}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className="px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {user.role.toUpperCase()}
                          </span>
                          {user.isAdmin && (
                            <button
                              onClick={() => setIsEditingRole(true)}
                              className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
                              title="Editar rol"
                            >
                              <Shield size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{user.projectsCount}</p>
                    <p className="text-sm text-muted-foreground">Proyectos Creados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">{user.collaborationsCount}</p>
                    <p className="text-sm text-muted-foreground">Colaboraciones</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-chart-3">
                      {user.projectsCount + user.collaborationsCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Participaciones</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-lg p-8 mb-6"
            >
              <h3 className="text-lg font-semibold mb-6">Información Personal</h3>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm mb-2 text-foreground/80">Nombre completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-muted/30 rounded-md">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm mb-2 text-foreground/80 flex items-center gap-2">
                    <Mail size={16} />
                    Correo electrónico
                  </label>
                  <p className="px-4 py-2.5 bg-muted/30 rounded-md text-muted-foreground">
                    {user.email} <span className="text-xs">(no modificable)</span>
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm mb-2 text-foreground/80">Biografía</label>
                  {isEditing ? (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Cuéntanos sobre ti, tus intereses y experiencia..."
                      className="w-full px-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      rows={4}
                      maxLength={500}
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-muted/30 rounded-md">
                      {user.bio || <span className="text-muted-foreground italic">Sin biografía</span>}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-muted-foreground mt-1">{bio.length}/500 caracteres</p>
                  )}
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm mb-2 text-foreground/80 flex items-center gap-2">
                    <Calendar size={16} />
                    Miembro desde
                  </label>
                  <p className="px-4 py-2.5 bg-muted/30 rounded-md">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Code2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Stack Técnico</h3>
              </div>

              {isEditing ? (
                <>
                  {/* Selected Technologies */}
                  {selectedTechs.length > 0 && (
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md">
                      <div className="flex flex-wrap gap-2">
                        {selectedTechs.map((tech) => (
                          <motion.div
                            key={tech}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-3 py-1.5 bg-primary/20 text-primary rounded-md flex items-center gap-2 border border-primary/30"
                          >
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{tech}</span>
                            <button
                              onClick={() => toggleTech(tech)}
                              className="hover:bg-primary/30 rounded-sm p-0.5 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technology Selection */}
                  <div className="p-4 bg-input-background border border-border rounded-md max-h-64 overflow-y-auto mb-3">
                    <div className="flex flex-wrap gap-2">
                      {TECHNOLOGIES.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`px-3 py-1.5 rounded-md text-sm transition-all border ${
                            selectedTechs.includes(tech)
                              ? 'bg-secondary/20 text-secondary border-secondary opacity-50'
                              : 'bg-muted/30 text-foreground/70 hover:bg-muted border-border/50'
                          }`}
                          style={{ fontFamily: 'var(--font-mono)' }}
                          disabled={selectedTechs.includes(tech)}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Technology */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTech())}
                      placeholder="Agregar tecnología personalizada..."
                      className="flex-1 px-3 py-2 bg-input-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={addCustomTech}
                      className="px-4 py-2 bg-secondary/10 text-secondary rounded-md hover:bg-secondary/20 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-md border border-secondary/20"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
