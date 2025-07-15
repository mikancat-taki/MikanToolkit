# Replit.md - Mikan Tools

## Overview

This is a Japanese utility tools web application called "みかんツール" (Mikan Tools) built with React/TypeScript frontend and Express.js backend. The application provides various utility tools including SQL formatting, code formatting, color picking, temperature conversion, calculator, file comparison, and photo metadata extraction.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom Mikan (orange) color palette
- **UI Components**: Radix UI components with shadcn/ui system
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Format Requests Table**: Stores SQL/code formatting history with content, language, and formatted results
- **Migration System**: Drizzle Kit for database schema management

### Tool Categories
1. **Text Processing Tools**
   - SQL Formatter: Formats SQL queries with various dialect support
   - Code Formatter: Formats JavaScript, TypeScript, JSON, HTML, CSS

2. **Image Processing Tools**
   - Color Picker: Extract colors from screen with hex/RGB/HSL conversion
   - Screen Capture: Capture screen, window, or area selections

3. **Conversion Tools**
   - Temperature Converter: Convert between Celsius, Fahrenheit, and Kelvin
   - Calculator: Basic arithmetic with history tracking

4. **File Operations**
   - File Compare: Compare two files and highlight differences
   - Photo Metadata: Extract EXIF data from images

### UI Architecture
- **Layout**: Sidebar navigation with responsive design
- **Components**: Reusable UI components following shadcn/ui patterns
- **Theming**: CSS custom properties with light/dark mode support
- **Mobile**: Responsive design with mobile-first approach

## Data Flow

1. **Client-Side**: React components handle user interactions
2. **API Layer**: Express.js routes process requests (prefixed with `/api`)
3. **Database Layer**: Drizzle ORM manages PostgreSQL interactions
4. **Storage Interface**: Abstract storage layer with in-memory fallback
5. **Response**: JSON responses with proper error handling

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Library**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Utilities**: Date-fns, class-variance-authority, clsx
- **Development**: Vite, TypeScript, ESLint

### Backend Dependencies
- **Core**: Express.js, TypeScript, Node.js
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple
- **Utilities**: Zod for validation, nanoid for ID generation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Utility Libraries
- **SQL Formatting**: sql-formatter library
- **File Processing**: Built-in browser APIs for file operations
- **Image Processing**: Canvas API for image manipulation
- **Screen Capture**: Screen Capture API for screenshots

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with hot reload
- **Backend**: tsx with file watching for TypeScript execution
- **Database**: PostgreSQL connection via environment variables
- **Integration**: Vite middleware serves frontend through Express

### Production
- **Build Process**: 
  - Frontend: Vite build to `dist/public`
  - Backend: esbuild bundle to `dist/index.js`
- **Deployment**: Single Node.js process serving both frontend and API
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Static Files**: Express serves built frontend files

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (development/production)
- `REPL_ID`: Replit environment identifier

### Database Management
- **Migrations**: Drizzle Kit with `npm run db:push` command
- **Schema**: Centralized in `shared/schema.ts`
- **Connection**: Serverless PostgreSQL via Neon Database