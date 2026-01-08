# N-Body Simulator

## Overview

An interactive n-body gravitational physics simulator built as a scientific and educational web application. The simulator features real-time visualization of gravitational interactions between celestial bodies, multiple numerical integration methods (Euler, Verlet, RK4), energy conservation tracking, and preset orbital configurations. Designed with a professional, academic aesthetic suitable for portfolio demonstration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state, React hooks for local simulation state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Charts**: Recharts for energy visualization graphs

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Build System**: esbuild for server bundling, Vite for client

### Data Storage
- **Current Implementation**: In-memory storage (MemStorage class) for simulation presets
- **Database Ready**: Drizzle ORM configured with PostgreSQL schema definitions
- **Schema Location**: `shared/schema.ts` contains Zod schemas for type validation

### Core Simulation Components
- **Physics Engine**: Client-side physics calculations in `client/src/lib/physics.ts`
  - Vector math utilities (add, subtract, multiply, normalize)
  - Gravitational acceleration computation with softening
  - Three integration methods: Euler, Velocity Verlet, Runge-Kutta 4th order
  - System metrics calculation (kinetic/potential energy, momentum, center of mass)

- **Simulation State**: Managed via `useSimulation` custom hook
  - Body positions, velocities, masses, and visual properties
  - Configurable gravitational constant (G) and timestep (dt)
  - Trail history for orbit visualization
  - Energy conservation tracking over time

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components (control panel, canvas, data panel)
    hooks/        # Custom React hooks (useSimulation, useToast)
    lib/          # Utilities (physics engine, presets, query client)
    pages/        # Route components
server/           # Express backend
  routes.ts       # API endpoint definitions
  storage.ts      # Data persistence layer
  static.ts       # Production static file serving
  vite.ts         # Development server integration
shared/           # Shared types and schemas
  schema.ts       # Zod schemas for Body, SimulationState, Preset
```

### Key Design Decisions

1. **Client-side Physics Computation**: Physics calculations run entirely in the browser for responsive real-time simulation without network latency.

2. **Separation of Simulation and Persistence**: Simulation state is ephemeral (browser only), while presets can be saved/loaded via API.

3. **Type-safe API Contracts**: Zod schemas in `shared/schema.ts` provide runtime validation and TypeScript types for both client and server.

4. **Component Library Choice**: shadcn/ui provides accessible, customizable components without heavy bundle overhead.

## External Dependencies

### UI Framework
- **Radix UI**: Headless UI primitives for accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Data & State
- **@tanstack/react-query**: Async state management for API calls
- **Zod**: Runtime type validation and schema definition
- **Drizzle ORM**: SQL toolkit (configured for PostgreSQL)

### Visualization
- **Recharts**: Charting library for energy graphs
- **HTML Canvas API**: Direct canvas rendering for simulation visualization

### Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Fast server bundling
- **TypeScript**: Type safety across the stack

### Fonts (CDN)
- Inter: Primary UI font
- JetBrains Mono: Monospace font for data display