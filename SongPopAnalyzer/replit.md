# Spotify Song Popularity Analysis Dashboard

## Overview

A full-stack web application that enables users to upload CSV datasets (specifically Spotify song data) and automatically generates interactive visual analytics. The application processes uploaded files, performs statistical analysis, and renders multiple data visualizations including popularity distributions, top songs, feature correlations, yearly trends, and genre rankings.

**Tech Stack:**
- Frontend: React + TypeScript + Vite
- Backend: Express.js + Node.js
- UI Framework: shadcn/ui (Radix UI primitives) + Tailwind CSS
- Charts: Recharts
- Data Processing: PapaParse (CSV parsing)
- State Management: TanStack Query (React Query)
- Routing: Wouter

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component-Based React Application**
- Built with TypeScript for type safety across the entire frontend
- Vite as the build tool and development server for fast hot module replacement
- Single Page Application (SPA) architecture with client-side routing via Wouter

**UI Component System**
- shadcn/ui component library providing accessible, customizable primitives
- Design system based on Material Design 3 principles optimized for data-heavy analytics
- Tailwind CSS for utility-first styling with custom design tokens
- Typography: Inter (primary) and JetBrains Mono (data/numeric displays)
- Responsive grid layout system supporting mobile and desktop viewports

**State Management**
- TanStack Query for server state management, caching, and API request handling
- React hooks for local component state
- Query invalidation strategy for data freshness

**Routing Structure**
- `/` - Home page with CSV upload interface
- `/dashboard/:id` - Analytics dashboard displaying visualizations for uploaded dataset
- Fallback 404 page for invalid routes

**Data Visualization Strategy**
- Recharts library for all chart components (bar charts, line charts, area charts, heatmaps)
- Chart export functionality via html2canvas for PNG downloads
- Responsive chart containers that adapt to viewport size
- Custom chart cards with dropdown menus for export actions

### Backend Architecture

**Express.js REST API**
- ESM module system throughout the codebase
- Middleware stack: JSON body parsing, URL encoding, request logging
- File upload handling via Multer (10MB limit, CSV validation)
- Custom logging middleware tracking API requests with duration and response data

**API Endpoints**
- `POST /api/upload` - Accepts CSV file, parses content, validates structure, stores dataset, computes analysis, returns dataset ID
- `GET /api/analysis/:id` - Retrieves pre-computed analysis results for a dataset

**Data Processing Pipeline**
1. CSV file received and buffered in memory
2. PapaParse processes CSV with header detection, dynamic typing, and error handling
3. Column detection identifies relevant fields (popularity, song name, artist, genre, year)
4. Analytics computation generates all visualizations data
5. Results cached in storage layer for retrieval

**Analytics Engine (server/analytics.ts)**
- Automatic numeric column detection (>80% numeric values)
- Popularity distribution computation (bucketed ranges with counts)
- Top songs ranking (sorted by popularity score)
- Correlation matrix calculation for numeric features
- Yearly trend aggregation (average popularity per year)
- Genre ranking by average popularity (top 10)
- Flexible column detection supporting various CSV schemas

**Storage Layer**
- In-memory storage implementation (MemStorage class)
- Separate stores for datasets and analysis results
- Storage interface (IStorage) allows future database integration
- Dataset metadata tracking: ID, filename, upload timestamp, dimensions, column names

**Error Handling**
- File validation (CSV format, file size limits)
- CSV parsing error reporting with specific error messages
- HTTP error responses with descriptive messages
- Client-side error boundaries and toast notifications

### Development Workflow

**Build System**
- TypeScript compilation with strict mode enabled
- Vite for frontend bundling with React Fast Refresh
- esbuild for backend bundling (production builds)
- Separate dev and production npm scripts

**Path Aliases**
- `@/*` - Client source files
- `@shared/*` - Shared types and schemas (Zod validation)
- `@assets/*` - Static assets directory

**Development Features**
- Replit-specific plugins for error overlays and dev tooling
- Hot module replacement in development
- Source maps for debugging

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Headless component primitives (accordions, dialogs, dropdowns, tooltips, etc.)
- **Recharts**: Chart rendering library for all data visualizations
- **html2canvas**: Chart export to PNG functionality
- **react-dropzone**: File upload drag-and-drop interface
- **cmdk**: Command menu component
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class conflict resolution

### Data Processing
- **PapaParse**: CSV file parsing and validation
- **Zod**: Runtime type validation and schema definition

### Backend Services
- **Multer**: Multipart/form-data file upload handling
- **nanoid**: Unique ID generation for datasets

### Developer Tools
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation utilities

### Database Configuration
- Drizzle ORM configured with PostgreSQL dialect
- Database schema location: `./shared/schema.ts`
- Migrations output directory: `./migrations`
- Note: Currently using in-memory storage; database integration ready via storage interface

### Google Fonts
- Inter font family (variable weight)
- JetBrains Mono (for monospaced numeric displays)

### Styling
- Tailwind CSS with custom configuration
- PostCSS with autoprefixer
- Custom CSS variables for theming (light/dark mode support)