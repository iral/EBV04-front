import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import type { Conversation, Message } from '../../../types/api';
import { MessageCircle, Send, Search, User, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '../dashboard/Sidebar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await api.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      toast.error('Error al cargar conversaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await api.getMessages(conversationId);
      setMessages(data);

      // Mark unread messages as read
      const unreadMessages = data.filter(m => !m.read && m.receiverId === user?.id);
      for (const msg of unreadMessages) {
        await api.markMessageAsRead(msg.id);
      }
    } catch (error) {
      toast.error('Error al cargar mensajes');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const otherParticipant = selectedConversation.participants.find(p => p.id !== user?.id);
    if (!otherParticipant) return;

    setIsSending(true);
    try {
      const message = await api.sendMessage({
        receiverId: otherParticipant.id,
        content: newMessage.trim(),
      });

      setMessages([...messages, message]);
      setNewMessage('');

      // Update conversation in list
      await loadConversations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherParticipant = conv.participants.find(p => p.id !== user?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== user?.id);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="h-full px-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Mensajes</h2>
              <p className="text-xs text-muted-foreground">Conversaciones con otros desarrolladores</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 border-r border-border flex flex-col bg-card/30">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar conversaciones..."
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredConversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const isSelected = selectedConversation?.id === conversation.id;

                    return (
                      <motion.button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'bg-secondary/10 border border-secondary/20'
                            : 'hover:bg-accent border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-full bg-secondary/20 flex items-center justify-center">
                              <User size={20} className="text-secondary" />
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-foreground">
                                  {conversation.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="font-medium truncate">{otherParticipant?.name}</p>
                              {conversation.lastMessage && (
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                                    addSuffix: true,
                                    locale: es,
                                  })}
                                </span>
                              )}
                            </div>
                            {conversation.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage.senderId === user?.id && 'Tú: '}
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="h-16 border-b border-border px-6 flex items-center gap-3 bg-card/50">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <User size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">{getOtherParticipant(selectedConversation)?.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Circle size={8} className="fill-primary text-primary" />
                      <span>Activo</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isMine = message.senderId === user?.id;

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-md ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            <div
                              className={`px-4 py-2.5 rounded-lg ${
                                isMine
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-card border border-border'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground px-1">
                              {formatDistanceToNow(new Date(message.createdAt), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {messages.length === 0 && (
                    <div className="text-center py-16">
                      <MessageCircle size={48} className="text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Aún no hay mensajes. Inicia la conversación.
                      </p>
                    </div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="border-t border-border p-4 bg-card/50">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="px-6 py-2.5 bg-secondary text-primary-foreground rounded-lg hover:bg-secondary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      <Send size={18} />
                      <span>ENVIAR</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={40} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
                  <p className="text-sm text-muted-foreground">
                    Elige una conversación de la lista para comenzar a chatear
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
