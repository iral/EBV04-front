# Getting Started - DevCollab Platform

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ instalado
- pnpm (recomendado) o npm

### Instalación

Ya está todo instalado. La aplicación usa Vite y está lista para ejecutarse.

### Ejecutar en Desarrollo

El servidor de desarrollo ya está corriendo. Simplemente abre la vista previa en Figma Make.

---

## 🔐 Usuarios de Prueba

Puedes usar cualquiera de estos correos para iniciar sesión (la contraseña no se valida en mock):

### Desarrolladores
```
ana@example.com       - Developer, 3 proyectos
carlos@example.com    - Developer, 2 proyectos
```

### Moderadores
```
maria@example.com     - Moderator, 5 proyectos
```

### Administradores
```
luis@example.com      - Admin, acceso completo
```

---

## 🗺️ Navegación de la Aplicación

### Flujo de Usuario Estándar

1. **Inicio** → Login (`/`)
   - Click en "Regístrate aquí" para crear cuenta nueva
   - O usa un email de demo y click en "INICIAR SESIÓN"

2. **Dashboard** (`/dashboard`)
   - Explora proyectos públicos
   - Usa filtros por tecnología y estado
   - Click en cualquier proyecto para ver detalles

3. **Crear Proyecto** (`/create-project`)
   - Click en "NUEVO PROYECTO" en el header
   - Opción 1: Guardar como borrador
   - Opción 2: Publicar directamente

4. **Mis Proyectos** (`/my-projects`)
   - Ver proyectos creados
   - Ver colaboraciones
   - Gestionar borradores

5. **Mensajes** (`/messages`)
   - Chat privado con otros usuarios
   - Ver historial de conversaciones

6. **Notificaciones** (`/notifications`)
   - Ver todas las notificaciones
   - Marcar como leídas

7. **Perfil** (`/profile`)
   - Editar información personal
   - Actualizar stack técnico

### Flujo de Administrador

**Iniciar sesión con**: `luis@example.com`

1. **Panel Admin** (`/admin`)
   - Ver métricas de la plataforma
   - Gráfica de registros mensuales
   - Gestión de usuarios (cambiar roles, suspender)

---

## 📋 Casos de Uso para Probar

### 1. Crear y Publicar un Proyecto

```
1. Login con ana@example.com
2. Click "NUEVO PROYECTO" (header)
3. Llenar formulario:
   - Título: "Sistema de Gestión de Tareas"
   - Descripción: "Plataforma colaborativa para gestión de proyectos..."
   - Stack: Seleccionar React, Node.js, PostgreSQL
4. Click "PUBLICAR PROYECTO"
5. Ver proyecto en estado "Buscando Colaboradores"
```

### 2. Postularse a un Proyecto

```
1. Login con carlos@example.com
2. Ir a Dashboard
3. Filtrar por Python (carlos tiene Python en su stack)
4. Click en "Social Analytics Dashboard"
5. Scroll hasta sección de postulación
6. Escribir mensaje: "Me interesa el backend con Python"
7. Click "Enviar Postulación"
8. Ver estado "En revisión"
```

### 3. Gestionar Postulaciones (Como Creador)

```
1. Login con ana@example.com
2. Ir a "Mis Proyectos"
3. Click en proyecto con postulaciones
4. Tab "Postulaciones"
5. Ver lista de postulantes
6. Click ✓ para aceptar o ✗ para rechazar
7. Ver colaborador agregado al equipo
```

### 4. Iniciar Desarrollo

```
1. Como creador con colaboradores aceptados
2. En detalle del proyecto
3. Click "Iniciar Desarrollo"
4. Confirmar acción
5. Ver estado cambia a "En Desarrollo"
6. Debates técnicos ahora disponibles
```

### 5. Completar Proyecto

```
1. Como creador de proyecto "En Desarrollo"
2. En detalle del proyecto
3. Click "Marcar como Completado"
4. Confirmar
5. Ver estado "Completado"
6. Proyecto archivado en historial
```

### 6. Gestión de Usuarios (Admin)

```
1. Login con luis@example.com
2. Ir a /admin
3. Ver tabla de usuarios
4. Click icono de UserCog en cualquier usuario
5. Cambiar rol (Developer → Moderator → Admin)
6. O suspender cuenta con icono Ban
```

### 7. Recuperar Contraseña

```
1. En pantalla de Login
2. Click "¿Olvidaste tu contraseña?"
3. Ingresar email (cualquiera de los mock)
4. Responder preguntas de seguridad
5. Ingresar nueva contraseña
6. Redirigir a login
```

### 8. Chat Privado

```
1. Login con cualquier usuario
2. Ir a /messages
3. Seleccionar conversación existente
4. Escribir mensaje y enviar
5. Ver historial actualizado
```

---

## 🎨 Características Visuales a Probar

### Animaciones
- Fade in de cards en grids
- Hover effects en ProjectCard
- Transiciones de tabs
- Loading skeletons
- Toast notifications

### Responsive
1. Reducir ventana a móvil (< 768px)
2. Ver que grid cambia a 1 columna
3. Sidebar se mantiene funcional
4. Forms se adaptan

### Estados Vacíos
- Dashboard sin proyectos filtrados
- Mis Proyectos sin colaboraciones
- Mensajes sin conversaciones
- Notificaciones sin items

---

## 🔧 Debugging

### Ver Estado de Autenticación

```javascript
// En consola del navegador
localStorage.getItem('devcollab_current_user')
localStorage.getItem('devcollab_auth_token')
```

### Limpiar Sesión

```javascript
// En consola del navegador
localStorage.clear()
location.reload()
```

### Ver Datos Mock

Importar directamente en componentes:
```typescript
import { mockUsers, mockProjects } from '../services/mockData';
console.log(mockUsers, mockProjects);
```

---

## 📱 Rutas Principales

```
/                       - Login
/register               - Registro
/recovery               - Recuperación de contraseña
/dashboard              - Dashboard principal
/create-project         - Crear proyecto
/project/:id            - Detalle de proyecto
/my-projects            - Mis proyectos
/messages               - Mensajes privados
/notifications          - Centro de notificaciones
/profile                - Perfil de usuario
/admin                  - Panel de administración
```

---

## 🐛 Problemas Comunes

### "No puedo iniciar sesión"
- Usa cualquier email de mockUsers
- La contraseña no se valida en modo mock
- Verifica que no estés suspendido

### "Los filtros no funcionan"
- Los filtros funcionan con datos mock
- Hay solo 5 proyectos de ejemplo
- Prueba con tecnologías existentes: React, Python, Node.js

### "Las notificaciones están vacías"
- Solo el usuario con id '1' (ana@example.com) tiene notificaciones mock
- Puedes agregar más en mockData.ts

### "El chat está vacío"
- Solo hay 2 conversaciones mock
- Usuario '1' tiene conversaciones con usuarios '2' y '3'

---

## 🎯 Testing de Validaciones

### Registro
```
❌ Email duplicado: Intenta registrar ana@example.com
✅ Email único: usuario@nuevo.com

❌ Contraseña débil: "abc123"
✅ Contraseña fuerte: "Password123"

❌ Sin stack: No seleccionar tecnologías
✅ Con stack: Seleccionar al menos 1
```

### Crear Proyecto
```
❌ Publicar sin descripción
✅ Guardar borrador sin descripción

❌ Publicar sin stack
✅ Publicar con todos los campos
```

### Postulaciones
```
❌ Postularse al propio proyecto
✅ Postularse a proyecto ajeno

❌ Postularse dos veces
✅ Primera postulación exitosa
```

---

## 📚 Documentación Adicional

- **Contratos de API**: Ver `API_CONTRACTS.md`
- **Implementación completa**: Ver `IMPLEMENTATION_SUMMARY.md`
- **Historias de Usuario**: Ver `src/imports/pasted_text/auth-stories.md`

---

## 💡 Tips de Desarrollo

### Agregar Mock Data

Editar `src/services/mockData.ts`:
```typescript
export const mockUsers: User[] = [
  // ... agregar nuevo usuario
];
```

### Modificar Validaciones

Editar `src/services/api.ts`:
```typescript
async register(data: RegisterRequest) {
  // ... modificar validaciones aquí
}
```

### Cambiar Tema de Colores

Editar `src/styles/theme.css`:
```css
:root {
  --primary: #00ff41;     /* Verde neón */
  --secondary: #00d9ff;   /* Cyan */
  /* ... otros colores */
}
```

---

## 🚀 Deploy a Producción

### Build de Producción

⚠️ **IMPORTANTE**: Este proyecto usa un setup especial de Figma Make.

**NO ejecutar**:
```bash
# ❌ NO HACER
npm run build
vite build
```

Para deploy real:
1. Migrar a setup estándar de Vite/React
2. Configurar backend real
3. Conectar base de datos
4. Configurar variables de entorno
5. Ejecutar build estándar

---

## 📞 Soporte

Para preguntas o issues:
1. Revisar `IMPLEMENTATION_SUMMARY.md`
2. Revisar `API_CONTRACTS.md`
3. Consultar código fuente con comentarios

---

**¡Listo para explorar!** 🎉

Inicia con el login, explora el dashboard, crea un proyecto y prueba todas las funcionalidades implementadas.
