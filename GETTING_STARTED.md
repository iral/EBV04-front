# Getting Started - DevCollab - UdeA

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ instalado
- npm

### Instalación
```bash
npm install
```

### Ejecutar en Desarrollo
```bash
npm run dev
```

### Construir para Producción
```bash
npm run build
```

---

## 🔐 Registro de Usuarios

Puedes registrarte con uno de los roles disponibles:
- **Desarrollador** - Para crear y colaborara en proyectos
- **Reclutador** - Para gestionar proyectos y buscar talento

El rol de **Administrador** solo puede ser asignado por otro administrador.

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/     # Componentes de React
│   ├── routes.ts       # Definición de rutas
│   └── App.tsx         # Componente principal
├── contexts/           # Contextos de React (Auth)
├── services/           # Servicios API
├── types/              # Tipos TypeScript
└── styles/             # Estilos globales
```

---

## 🛠️ Tecnologías

- **Frontend**: React, TypeScript, Vite
- **Estilos**: Tailwind CSS, shadcn/ui
- **Backend**: Spring Boot (Java), PostgreSQL
- **Autenticación**: JWT

---

## 📝记己录 de Cambios

### v1.0.0 - Lanzamiento Inicial
- Registro y autenticación
- Creación y publicación de proyectos
- Sistema de postulaciones
- Debates técnicos por proyecto
- Mensajería entre usuarios
- Panel de administración