// ============================================================================
// API CONTRACTS - Developer Collaboration Platform
// ============================================================================

// User & Authentication Types
export type UserRole = 'developer' | 'moderator' | 'admin';
export type AccountStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  stack: string[];
  bio?: string;
  avatar?: string;
  createdAt: string;
  projectsCount: number;
  collaborationsCount: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  stack: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RecoveryQuestion {
  id: string;
  question: string;
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordRecoveryVerifyRequest {
  email: string;
  answers: { questionId: string; answer: string }[];
}

export interface PasswordResetRequest {
  recoveryToken: string;
  newPassword: string;
}

// Project Types
export type ProjectStatus = 'draft' | 'seeking_collaborators' | 'in_development' | 'completed';

export interface Project {
  id: string;
  title: string;
  description: string;
  stackRequired: string[];
  status: ProjectStatus;
  creatorId: string;
  creator: User;
  collaborators: User[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  applicationCount: number;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  stackRequired: string[];
  status: 'draft' | 'seeking_collaborators';
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  stackRequired?: string[];
}

// Application Types
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'closed';

export interface Application {
  id: string;
  projectId: string;
  project: Project;
  applicantId: string;
  applicant: User;
  message?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  projectId: string;
  message?: string;
}

export interface UpdateApplicationRequest {
  status: ApplicationStatus;
}

// Thread & Comment Types
export type ThreadCategory = 'architecture' | 'stack' | 'feature' | 'bug';

export interface Thread {
  id: string;
  projectId: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  category: ThreadCategory;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
}

export interface Comment {
  id: string;
  threadId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface CreateThreadRequest {
  projectId: string;
  title: string;
  content: string;
  category: ThreadCategory;
}

export interface CreateCommentRequest {
  threadId: string;
  content: string;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
}

// Analytics Types
export interface PlatformMetrics {
  totalUsers: number;
  activeUsersLastWeek: number;
  totalProjects: number;
  projectsSeekingCollaborators: number;
  projectsInDevelopment: number;
  projectsCompleted: number;
}

export interface MonthlyRegistrations {
  month: string;
  count: number;
}

// Filter & Search Types
export interface ProjectFilters {
  stack?: string[];
  status?: ProjectStatus[];
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Notification Types
export type NotificationType =
  | 'application_received'
  | 'application_accepted'
  | 'application_rejected'
  | 'project_started'
  | 'new_thread'
  | 'new_comment'
  | 'new_message'
  | 'account_suspended';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// Error Response
export interface ApiError {
  code: string;
  message: string;
  field?: string;
}
