# Integra — Frontend

Aplicación web para gestionar sesiones de exposiciones/evaluaciones en vivo: el **profe (host)** crea salas, rúbricas y exposiciones, y los **alumnos** se unen con un código de sala para participar y ser evaluados en tiempo real.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) para el enrutamiento
- [Zustand](https://zustand-demo.pmnd.rs) para el estado global (sesión del host y del alumno)
- [TanStack Query](https://tanstack.com/query) para el manejo de datos remotos
- [Supabase](https://supabase.com) solo para el login con Google (OAuth) del host
- [Tailwind CSS](https://tailwindcss.com) para estilos
- [Zod](https://zod.dev) para validación de formularios
- [Oxlint](https://oxc.rs) como linter

## Requisitos previos

- Node.js 20+
- Una API backend compatible corriendo (ver `VITE_API_URL` abajo)
- (Opcional) Un proyecto de [Supabase](https://supabase.com) si se desea habilitar el login con Google

## Configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia el archivo de variables de entorno de ejemplo y complétalo con tus propios valores:

   ```bash
   cp .env.example .env
   ```

   Variables disponibles:

   | Variable | Descripción |
   | --- | --- |
   | `VITE_API_URL` | URL base de la API backend (ej. `http://localhost:8000`). |
   | `VITE_SUPABASE_URL` | URL de tu proyecto de Supabase (solo necesaria para el login con Google). |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública ("publishable"/anon) de tu proyecto de Supabase. |

   > ⚠️ **Nunca** subas el archivo `.env` al repositorio ni compartas tus claves reales. El archivo `.env` está en `.gitignore`; usa `.env.example` únicamente como plantilla, sin valores reales.

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Compila TypeScript y genera el build de producción
npm run preview   # Sirve localmente el build de producción
npm run lint      # Ejecuta Oxlint
```

## Estructura del proyecto

```
src/
├── components/   # Componentes reutilizables (layout, UI común)
├── constants/    # Endpoints y mensajes de la app
├── hooks/        # Hooks de autenticación (host y alumno)
├── pages/
│   ├── host/        # Login, registro, dashboard, salas y reportes del profe
│   └── participant/  # Registro, unión a sala y vista de juego del alumno
├── services/     # Cliente HTTP, autenticación y cliente de Supabase
├── store/        # Estado global (Zustand) para host y alumno
├── types/        # Tipos compartidos de TypeScript
└── utils/        # Validadores y utilidades
```

## Autenticación

El proyecto maneja dos tipos de credenciales independientes, cada una con su propio token guardado en `localStorage`:

- **Host (profe):** login con correo/contraseña contra la API propia, o login con Google vía Supabase.
- **Alumno:** login con boleta/contraseña contra la API propia.

Ningún token ni clave de API se encuentra hardcodeado en el código fuente; todos los valores sensibles se inyectan mediante variables de entorno (`VITE_*`) y nunca se commitean.
