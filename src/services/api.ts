import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Project,
  Application,
  Thread,
  Comment,
  Message,
  Conversation,
  Notification,
  PlatformMetrics,
  MonthlyRegistrations,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateApplicationRequest,
  CreateThreadRequest,
  CreateCommentRequest,
  SendMessageRequest,
  PaginatedResponse,
  ProjectFilters,
} from '../types/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const AUTH_TOKEN_KEY = 'devcollab_auth_token';
const CURRENT_USER_KEY = 'devcollab_current_user';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  setToken(token: string, user: User): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // ============================================================================
  // Authentication
  // ============================================================================

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        stack: data.stack,
      }),
    });

    this.setToken(response.token, response.user);
    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    this.setToken(response.token, response.user);
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' }).catch(() => { });
    this.clearAuth();
  }

  // ============================================================================
  // Projects
  // ============================================================================

  async getProjects(filters?: ProjectFilters, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();
    params.append('page', String(page - 1));
    params.append('size', String(pageSize));

    if (filters?.stack?.length) {
      filters.stack.forEach(tech => params.append('technologyIds', tech));
    }

    const response = await this.request<{ content: Project[]; totalElements: number; number: number; size: number; totalPages: number }>(
      `/projects?${params.toString()}`
    );

    return {
      data: response.content,
      total: response.totalElements,
      page: response.number + 1,
      pageSize: response.size,
      totalPages: response.totalPages,
    };
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async publishProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}/publish`, {
      method: 'PUT',
    });
  }

  async startDevelopment(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}/start-development`, {
      method: 'POST',
    });
  }

  async completeProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}/complete`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // Applications
  // ============================================================================

  async getApplicationsForProject(projectId: string): Promise<Application[]> {
    return this.request<Application[]>(`/projects/${projectId}/applications`);
  }

  async getMyApplications(): Promise<Application[]> {
    return this.request<Application[]>('/applications/me');
  }

  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    return this.request<Application>(`/projects/${data.projectId}/apply`, {
      method: 'POST',
    });
  }

  async updateApplication(projectId: string, applicationId: string, status: 'accepted' | 'rejected'): Promise<Application> {
    return this.request<Application>(`/projects/${projectId}/applications/${applicationId}/${status}`, {
      method: 'PUT',
    });
  }

  // ============================================================================
  // Threads & Comments
  // ============================================================================

  async getThreadsForProject(projectId: string): Promise<Thread[]> {
    return this.request<Thread[]>(`/projects/${projectId}/threads`);
  }

  async createThread(data: CreateThreadRequest): Promise<Thread> {
    return this.request<Thread>('/threads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCommentsForThread(threadId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/threads/${threadId}/comments`);
  }

  async createComment(data: CreateCommentRequest): Promise<Comment> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // Messages
  // ============================================================================

  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/messages/conversations');
  }

  async getMessages(userId: string, page: number = 0): Promise<PaginatedResponse<Message>> {
    const response = await this.request<{ content: Message[]; totalElements: number }>(
      `/messages/conversations/${userId}?page=${page}`
    );

    return {
      data: response.content,
      total: response.totalElements,
      page: page + 1,
      pageSize: response.content.length,
      totalPages: 1,
    };
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/read`, { method: 'POST' });
  }

  // ============================================================================
  // Notifications
  // ============================================================================

  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.request(`/notifications/${id}/read`, { method: 'POST' });
  }

  // ============================================================================
  // Admin & Analytics
  // ============================================================================

  async getPlatformMetrics(): Promise<PlatformMetrics> {
    return this.request<PlatformMetrics>('/admin/metrics');
  }

  async getMonthlyRegistrations(): Promise<MonthlyRegistrations[]> {
    return this.request<MonthlyRegistrations[]>('/admin/metrics/registrations');
  }

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/admin/users');
  }

  async updateUserRole(userId: string, role: 'developer' | 'moderator' | 'admin'): Promise<User> {
    return this.request<User>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async suspendUser(userId: string, reason: string): Promise<User> {
    return this.request<User>(`/admin/users/${userId}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async reactivateUser(userId: string): Promise<User> {
    return this.request<User>(`/admin/users/${userId}/reactivate`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // User Profile
  // ============================================================================

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  // ============================================================================
  // Technologies
  // ============================================================================

  async getTechnologies(): Promise<{ id: string; name: string }[]> {
    return this.request<{ id: string; name: string }[]>('/technologies');
  }
}

export const api = new ApiService();