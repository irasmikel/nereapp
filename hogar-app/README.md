# 🏡 Hogar — Gestión del hogar personal

Una aplicación web PWA moderna y minimalista para gestionar tareas del hogar, rutinas de limpieza y mantenimientos. Diseñada para uso personal con enfoque *mobile-first*.

## ✨ Características

- **Dashboard** con resumen diario, progreso y rachas
- **Vista de hoy** con lista limpia, swipe-to-complete y filtros
- **Todas las tareas** con búsqueda, filtros y agrupación por habitación
- **Calendario** mensual con indicadores de tareas por día
- **Estadísticas** con gráficos semanales y desglose por categoría
- **Periodicidades avanzadas**: diaria, semanal, mensual, anual y personalizada
- **9 categorías/habitaciones** con iconos y colores diferenciados
- **Instalable como PWA** en móvil, tablet y escritorio
- **100% offline** — datos guardados en localStorage
- **Arquitectura lista para Firebase** — capa de storage desacoplada
- **Animaciones fluidas** con Framer Motion
- **Anti-agobio** — mensajes motivacionales, límites visuales, sensación de progreso

## 🛠 Tecnología

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 |
| Estilos | Tailwind CSS 3 |
| Animaciones | Framer Motion 11 |
| Routing | React Router 6 |
| PWA | vite-plugin-pwa |
| Persistencia | localStorage (Firebase-ready) |
| Fechas | date-fns 3 |

## 🚀 Inicio rápido

```bash
# 1. Clona el repositorio
git clone https://github.com/tuusuario/hogar-app.git
cd hogar-app

# 2. Instala dependencias
npm install

# 3. Arranca en desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📦 Build y deploy

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

### Deploy en Vercel (recomendado)

1. Sube el proyecto a GitHub
2. Entra en [vercel.com](https://vercel.com) → **Add New Project**
3. Selecciona tu repositorio
4. Configuración automática detecta Vite — pulsa **Deploy**
5. ✅ Listo en ~60 segundos

> Vercel detecta automáticamente Vite. No necesitas configuración adicional.

### Deploy manual (Netlify, etc.)

```bash
npm run build
# Sube la carpeta dist/ a tu hosting
```

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Layout.jsx          # Layout responsive (sidebar + bottom nav)
│   ├── Navigation.jsx      # Sidebar desktop / Bottom nav móvil
│   ├── TaskCard.jsx        # Tarjeta de tarea con swipe gestures
│   ├── AddTaskModal.jsx    # Modal/sheet para crear y editar tareas
│   ├── RecurrenceSelector.jsx  # Selector visual de periodicidades
│   ├── ProgressRing.jsx    # Anillo de progreso circular SVG
│   ├── CategoryBadge.jsx   # Badges y pills de categoría/prioridad
│   ├── EmptyState.jsx      # Estado vacío reutilizable
│   └── PageHeader.jsx      # Cabecera de página reutilizable
│
├── pages/
│   ├── Dashboard.jsx       # Inicio: resumen, progreso, hoy, próximas
│   ├── Today.jsx           # Vista de hoy con filtros y completado
│   ├── AllTasks.jsx        # Todas las tareas con búsqueda y filtros
│   ├── Calendar.jsx        # Calendario mensual con tareas por día
│   ├── Statistics.jsx      # Estadísticas, gráficos y rachas
│   └── Settings.jsx        # Ajustes, export/import, datos
│
├── hooks/
│   ├── useTasks.js         # Lógica central de tareas (CRUD, queries, stats)
│   ├── useSettings.js      # Preferencias de la app
│   └── useAppContext.js    # Contexto global compartido
│
├── services/
│   └── storage.js          # Capa de persistencia (localStorage → Firebase-ready)
│
├── data/
│   ├── categories.js       # Categorías, prioridades, días, mensajes
│   └── sampleData.js       # Tareas de ejemplo para el primer uso
│
└── utils/
    ├── dateUtils.js        # Utilidades de fecha y formato
    └── taskUtils.js        # Lógica de recurrencias, estadísticas, streaks
```

## 🗄 Modelo de datos

```js
// Tarea
{
  id: 'task-1234567-abc',
  title: 'Limpiar el baño',
  description: 'Incluye ducha, lavabo e inodoro',
  category: 'bathroom',          // Ver CATEGORIES en categories.js
  priority: 'high',              // 'low' | 'medium' | 'high'
  startDate: '2024-01-15',       // ISO date string
  recurrence: {
    type: 'weekly',              // 'none'|'daily'|'weekly'|'monthly'|'yearly'|'custom'
    daysOfWeek: [1, 4],          // 0=Dom ... 6=Sáb (para type='weekly')
    daysOfMonth: [1, 15],        // 1-31 (para type='monthly')
    interval: 2,                 // Para 'daily' y 'custom'
    intervalUnit: 'days',        // 'days'|'weeks'|'months' (para 'custom')
  },
  reminder: true,
  reminderTime: '09:00',
  notes: '',
  estimatedDuration: 30,         // minutos
  completedDates: ['2024-01-15', '2024-01-18'],  // fechas completadas
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-15T11:30:00Z',
}
```

## 🔥 Migración a Firebase (futuro)

Solo hay que cambiar la implementación en `src/services/storage.js`:

```js
// Actualmente: localStorage
export const storage = { get, set, remove, ... }

// Futuro: Firebase Firestore
export const storage = {
  async get(key) { ... },
  async set(key, value) { ... },
}
```

Los hooks de React y todos los componentes no necesitan cambios.

## 📱 PWA — Instalación en móvil

1. Abre la app en Chrome (Android) o Safari (iOS)
2. Pulsa **"Añadir a pantalla de inicio"** en el menú del navegador
3. La app se instala y funciona como una app nativa

## 🎨 Sistema de diseño

- **Tipografía**: DM Sans (Google Fonts)
- **Color principal**: Sage Green `#7FB08F`
- **Fondo**: Warm White `#FAFAF8`
- **Animaciones**: Framer Motion con spring physics
- **Espaciado**: Sistema 4px base, padding generoso
- **Bordes**: `rounded-2xl` / `rounded-3xl` como estándar
- **Sombras**: `shadow-soft` para elevación sutil

## 📄 Licencia

MIT — Uso personal libre.
