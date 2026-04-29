import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../../../services/api';
import type { Notification } from '../../../types/api';
import { Bell, Check, Trash2, CheckCircle2, MessageSquare, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Sidebar from '../dashboard/Sidebar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const NOTIFICATION_ICONS = {
  application_received: Users,
  application_accepted: CheckCircle2,
  application_rejected: AlertCircle,
  project_started: Users,
  new_thread: MessageSquare,
  new_comment: MessageSquare,
  new_message: MessageSquare,
  account_suspended: AlertCircle,
};

const NOTIFICATION_COLORS = {
  application_received: 'text-primary',
  application_accepted: 'text-chart-3',
  application_rejected: 'text-destructive',
  project_started: 'text-secondary',
  new_thread: 'text-secondary',
  new_comment: 'text-secondary',
  new_message: 'text-primary',
  account_suspended: 'text-destructive',
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error('Error al cargar notificaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      toast.error('Error al marcar como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(unreadNotifications.map(n => api.markNotificationAsRead(n.id)));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      toast.error('Error al marcar notificaciones');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Notificaciones</h2>
                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm text-secondary hover:text-secondary/80 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Marcar todas como leídas</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md transition-all ${
                  filter === 'all'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-foreground/70 hover:bg-accent'
                }`}
              >
                Todas ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md transition-all ${
                  filter === 'unread'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-foreground/70 hover:bg-accent'
                }`}
              >
                Sin leer ({unreadCount})
              </button>
            </div>

            {/* Notifications List */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-card border border-border rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filter === 'unread'
                    ? 'Todas tus notificaciones están al día'
                    : 'Recibirás notificaciones sobre tus proyectos y colaboraciones'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification, index) => {
                  const Icon = NOTIFICATION_ICONS[notification.type];
                  const iconColor = NOTIFICATION_COLORS[notification.type];

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer group ${
                        notification.read
                          ? 'bg-card border-border hover:border-primary/30'
                          : 'bg-primary/5 border-primary/20 hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          notification.read ? 'bg-muted/50' : 'bg-primary/10'
                        }`}>
                          <Icon size={20} className={iconColor} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-foreground/80'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-2 hover:bg-accent rounded-md transition-colors opacity-0 group-hover:opacity-100"
                              title="Marcar como leída"
                            >
                              <Check size={16} className="text-primary" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
