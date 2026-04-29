# API Contracts - DevCollab Platform

## Resumen Ejecutivo

Este documento define los contratos de API para el backend de la plataforma DevCollab. Todos los contratos están implementados en `/src/types/api.ts` y los servicios mock en `/src/services/api.ts`.

## Endpoints Base

**Base URL**: `https://api.devcollab.com/v1` (a definir en producción)

**Headers requeridos**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 1. Autenticación

### POST `/auth/register`
Registro de nuevo usuario.

**Request**:
```typescript
{
  name: string;
  email: string;
  password: string;  // Min 8 chars, debe contener letra y número
  stack: string[];   // Al menos 1 tecnología
}
```

**Response** (200):
```typescript
{
  user: User;
  token: string;
  expiresAt: string;  // ISO 8601
}
```

**Errores**:
- 400: Email duplicado, contraseña débil, stack vacío
- 422: Validación de campos fallida

---

### POST `/auth/login`
Inicio de sesión.

**Request**:
```typescript
{
  email: string;
  password: string;
}
```

**Response** (200):
```typescript
{
  user: User;
  token: string;
  expiresAt: string;
}
```

**Errores**:
- 401: Credenciales inválidas
- 403: Cuenta suspendida

---

### POST `/auth/logout`
Cierre de sesión (invalida el token).

**Response** (204): No content

---

### POST `/auth/recovery/request`
Solicitar recuperación de contraseña.

**Request**:
```typescript
{
  email: string;
}
```

**Response** (200):
```typescript
{
  questions: RecoveryQuestion[];
}
```

**Nota**: Siempre responde igual independientemente de si el email existe (seguridad).

---

### POST `/auth/recovery/verify`
Verificar respuestas de seguridad.

**Request**:
```typescript
{
  email: string;
  answers: { questionId: string; answer: string }[];
}
```

**Response** (200):
```typescript
{
  recoveryToken: string;  // Token temporal de un solo uso
}
```

---

### POST `/auth/recovery/reset`
Resetear contraseña.

**Request**:
```typescript
{
  recoveryToken: string;
  newPassword: string;
}
```

**Response** (204): No content

---

## 2. Proyectos

### GET `/projects`
Listar proyectos con filtros.

**Query Parameters**:
- `search?: string` - Buscar en título/descripción
- `stack?: string[]` - Filtrar por tecnologías
- `status?: ProjectStatus[]` - Filtrar por estado
- `page?: number` - Página (default: 1)
- `pageSize?: number` - Items por página (default: 10, max: 50)

**Response** (200):
```typescript
{
  data: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

**Nota**: Solo muestra proyectos públicos (no borradores de otros usuarios).

---

### GET `/projects/:id`
Obtener detalle de un proyecto.

**Response** (200): `Project`

**Errores**:
- 404: Proyecto no encontrado
- 403: Acceso denegado (borrador ajeno)

---

### POST `/projects`
Crear proyecto.

**Request**:
```typescript
{
  title: string;
  description: string;
  stackRequired: string[];
  status: 'draft' | 'seeking_collaborators';
}
```

**Response** (201): `Project`

**Errores**:
- 401: No autenticado
- 400: Validación fallida

---

### PATCH `/projects/:id`
Actualizar proyecto (solo propietario).

**Request**:
```typescript
{
  title?: string;
  description?: string;
  stackRequired?: string[];
}
```

**Response** (200): `Project`

**Errores**:
- 403: No es el propietario
- 404: Proyecto no encontrado

---

### POST `/projects/:id/publish`
Publicar proyecto (cambiar de draft a seeking_collaborators).

**Response** (200): `Project`

**Errores**:
- 400: Campos requeridos incompletos
- 403: No es el propietario

---

### POST `/projects/:id/start-development`
Iniciar desarrollo (requiere al menos 1 colaborador).

**Response** (200): `Project`

**Errores**:
- 400: Sin colaboradores
- 403: No es el propietario

---

### POST `/projects/:id/complete`
Marcar proyecto como completado.

**Response** (200): `Project`

**Errores**:
- 400: Proyecto no está en desarrollo
- 403: No es el propietario

---

## 3. Postulaciones

### GET `/projects/:projectId/applications`
Listar postulaciones de un proyecto (solo propietario).

**Response** (200): `Application[]`

---

### GET `/applications/me`
Mis postulaciones.

**Response** (200): `Application[]`

---

### POST `/applications`
Postularse a un proyecto.

**Request**:
```typescript
{
  projectId: string;
  message?: string;  // Opcional
}
```

**Response** (201): `Application`

**Errores**:
- 400: Ya postulado, proyecto cerrado, es tu propio proyecto
- 429: Límite de postulaciones excedido (rate limiting)

---

### PATCH `/applications/:id`
Aceptar o rechazar postulación (solo propietario del proyecto).

**Request**:
```typescript
{
  status: 'accepted' | 'rejected';
}
```

**Response** (200): `Application`

**Errores**:
- 403: No es el propietario del proyecto

---

## 4. Debates Técnicos

### GET `/projects/:projectId/threads`
Listar debates de un proyecto.

**Response** (200): `Thread[]`

**Nota**: Solo colaboradores pueden ver los debates.

---

### POST `/threads`
Crear nuevo debate (solo colaboradores).

**Request**:
```typescript
{
  projectId: string;
  title: string;
  content: string;
  category: 'architecture' | 'stack' | 'feature' | 'bug';
}
```

**Response** (201): `Thread`

**Errores**:
- 403: No es colaborador del proyecto
- 429: Rate limiting (max 5 debates/hora)

---

### GET `/threads/:threadId/comments`
Listar comentarios de un debate.

**Response** (200): `Comment[]`

---

### POST `/comments`
Comentar en un debate.

**Request**:
```typescript
{
  threadId: string;
  content: string;
}
```

**Response** (201): `Comment`

**Errores**:
- 400: Contenido vacío
- 403: No es colaborador
- 429: Rate limiting

---

## 5. Mensajes

### GET `/conversations`
Listar conversaciones del usuario.

**Response** (200): `Conversation[]`

---

### GET `/conversations/:conversationId/messages`
Obtener mensajes de una conversación.

**Response** (200): `Message[]`

---

### POST `/messages`
Enviar mensaje directo.

**Request**:
```typescript
{
  receiverId: string;
  content: string;
}
```

**Response** (201): `Message`

**Errores**:
- 400: Contenido vacío
- 404: Usuario receptor no existe
- 429: Rate limiting (20 msg/hora usuarios nuevos, 100/hora usuarios establecidos)

---

### POST `/messages/:messageId/read`
Marcar mensaje como leído.

**Response** (204): No content

---

## 6. Notificaciones

### GET `/notifications`
Listar notificaciones del usuario.

**Response** (200): `Notification[]`

---

### POST `/notifications/:id/read`
Marcar notificación como leída.

**Response** (204): No content

---

## 7. Admin & Analytics

### GET `/admin/metrics`
Métricas de la plataforma (solo admin).

**Response** (200): `PlatformMetrics`

---

### GET `/admin/metrics/registrations`
Registros mensuales (solo admin).

**Response** (200): `MonthlyRegistrations[]`

---

### GET `/admin/users`
Listar todos los usuarios (solo admin/moderator).

**Response** (200): `User[]`

---

### PATCH `/admin/users/:userId/role`
Cambiar rol de usuario (solo admin).

**Request**:
```typescript
{
  role: 'developer' | 'moderator' | 'admin';
}
```

**Response** (200): `User`

**Errores**:
- 403: No es admin
- 400: Intento de auto-asignación de permisos críticos

---

### POST `/admin/users/:userId/suspend`
Suspender cuenta (admin/moderator).

**Request**:
```typescript
{
  reason: string;
}
```

**Response** (200): `User`

**Errores**:
- 403: No tiene permisos
- 400: Intento de auto-suspensión

---

### POST `/admin/users/:userId/reactivate`
Reactivar cuenta suspendida (solo admin).

**Response** (200): `User`

---

## Tipos de Datos

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'moderator' | 'admin';
  status: 'active' | 'suspended';
  stack: string[];
  bio?: string;
  avatar?: string;
  createdAt: string;
  projectsCount: number;
  collaborationsCount: number;
}
```

### Project
```typescript
{
  id: string;
  title: string;
  description: string;
  stackRequired: string[];
  status: 'draft' | 'seeking_collaborators' | 'in_development' | 'completed';
  creatorId: string;
  creator: User;
  collaborators: User[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  applicationCount: number;
}
```

### Application
```typescript
{
  id: string;
  projectId: string;
  project: Project;
  applicantId: string;
  applicant: User;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'closed';
  createdAt: string;
  updatedAt: string;
}
```

### Thread
```typescript
{
  id: string;
  projectId: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  category: 'architecture' | 'stack' | 'feature' | 'bug';
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
}
```

---

## Códigos de Error Comunes

- **400 Bad Request**: Validación fallida, reglas de negocio violadas
- **401 Unauthorized**: Token inválido o expirado
- **403 Forbidden**: Sin permisos suficientes
- **404 Not Found**: Recurso no encontrado
- **429 Too Many Requests**: Rate limiting activado
- **500 Internal Server Error**: Error del servidor

**Formato de error**:
```typescript
{
  code: string;        // Código de error único
  message: string;     // Mensaje legible
  field?: string;      // Campo específico (en validaciones)
}
```

---

## Seguridad

### Rate Limiting

- **Login**: 5 intentos/15 min por IP
- **Registro**: 3 registros/hora por IP
- **Postulaciones**: 10 postulaciones/día por usuario
- **Debates**: 5 hilos/hora por usuario
- **Comentarios**: 50 comentarios/hora por usuario
- **Mensajes**: 20/hora (usuarios nuevos), 100/hora (establecidos)

### Validaciones

- **Contraseña**: Min 8 caracteres, al menos 1 letra y 1 número
- **Email**: Formato RFC 5322
- **Inputs**: Sanitización contra XSS e inyección SQL
- **Files**: Validación de tipo MIME y escaneo de malware

### Headers de Seguridad

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

---

## Implementación Mock

El servicio mock actual (`/src/services/api.ts`) simula todas estas operaciones con:
- Delay artificial de 500ms
- Validaciones de negocio
- Almacenamiento en localStorage para auth
- Datos mock realistas en `/src/services/mockData.ts`

Para conectar con el backend real, reemplazar las llamadas en `api.ts` con fetch/axios a los endpoints correspondientes.
