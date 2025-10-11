# Visions Web - AI Projects Blog

## Overview

Visions Web is a professional blog platform for showcasing AI projects and tools, featuring an Apple-inspired design aesthetic. The application provides a modern, clean interface for users to explore AI projects, read blog posts, participate in surveys, and engage with the community through chat and favorites features.

The platform supports user authentication, role-based access control (admin/trusted user privileges), and social engagement features. It's built with Next.js 15 and uses modern React patterns with TypeScript for type safety.

## Recent Changes

**October 11, 2025 - Vercel to Replit Migration**
- Migrated project from Vercel to Replit environment
- Updated Next.js dev and start scripts to bind to `0.0.0.0:5000` for Replit compatibility
- Fixed TypeScript path alias in `tsconfig.json` from `@/* → ./*` to `@/* → ./src/*` to correctly resolve component imports
- Removed Turbopack flags from build scripts (not needed for Replit)
- Configured Replit workflow to run Next.js development server
- Configured deployment settings for production with autoscale target
- App successfully running on Replit without errors

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 with React 19
- Uses App Router architecture for modern routing and layouts
- Server and client components pattern for optimal performance
- TypeScript for type safety across the application
- Tailwind CSS v4 for styling with custom design system

**UI/UX Design Philosophy**:
- Apple-inspired minimalist design aesthetic
- Black/white color scheme with blue accents
- Responsive design supporting mobile, tablet, and desktop
- Smooth animations using Framer Motion
- Sticky navigation with blur backdrop effect

**Component Structure**:
- Reusable components in `src/components/` directory
- Page-level components in `app/` directory following App Router conventions
- Client components marked with 'use client' directive for interactivity
- Shared layout with persistent navigation and footer

### Authentication & Authorization

**Authentication Provider**: NextAuth.js v5 (beta)
- Credentials-based authentication (email/password)
- OAuth providers configured (Google, GitHub) - requires environment setup
- Session management with SessionProvider wrapper
- Protected routes using session status checks

**User Roles & Permissions**:
- Admin role: Full access to admin panel and user management
- Trusted users: Access to chat features
- Regular users: Basic access to projects, favorites, and surveys
- User tags system (TOP SUPPORTER, TRUSTED, etc.) for community recognition

**Session Handling**:
- Client-side session checks using `useSession` hook
- Redirect patterns for unauthenticated users
- Role-based UI rendering and feature access

### Data Management

**Current Implementation**: Mock data stored in JavaScript/TypeScript files
- Projects data in component files and mock arrays
- User data in authentication route handler
- In-memory favorites and survey responses

**Planned Architecture** (evident from structure):
- Content-based architecture with Markdown files in `content/` directory
- Frontmatter metadata for project/post configuration
- File-based CMS approach for easy content management

**State Management**:
- React hooks (useState, useEffect) for local component state
- NextAuth session state for global authentication
- No external state management library currently used

### Key Features & User Flows

**Content Discovery**:
- Hero section with call-to-action buttons
- Featured projects grid with filtering by tags
- Blog posts with author information
- Statistics dashboard showing platform metrics

**User Engagement**:
- Favorites system for bookmarking projects
- Survey functionality for user feedback
- Chat system restricted to trusted users
- Social profile integration

**Admin Capabilities**:
- User management panel at `/admin` route
- Tag assignment to users
- Survey response viewing with username tracking
- Content moderation tools

### Routing Structure

- `/` - Home page with hero, featured content, and stats
- `/projects` - AI tools and projects listing
- `/blog` - Blog posts
- `/about` - About page
- `/auth/signin` - Authentication page
- `/auth/signup` - User registration
- `/profile` - User profile management
- `/favorites` - User's favorited projects
- `/chat` - Messaging (trusted users only)
- `/admin` - Admin panel (admin only)
- `/surveys` - Feedback surveys

## External Dependencies

### Core Framework & UI
- **Next.js 15.5.4**: React framework with App Router
- **React 19.1.0**: UI library
- **Tailwind CSS v4**: Utility-first CSS framework
- **Framer Motion 12.23.24**: Animation library for smooth transitions

### Authentication
- **NextAuth.js v5.0.0-beta.29**: Authentication solution supporting:
  - Credentials provider (email/password)
  - Google OAuth (requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
  - GitHub OAuth (requires GITHUB_ID, GITHUB_CLIENT_SECRET)

### Development Tools
- **TypeScript 5.x**: Static type checking
- **ESLint 9.x**: Code linting with Next.js config
- **PostCSS**: CSS processing for Tailwind

### Font & Icons
- **Geist fonts**: Modern sans-serif and monospace fonts from Vercel
- **Font Awesome 6.5.1**: Icon library (referenced in legacy HTML)

### Future Integrations (Not Yet Implemented)
Based on the architecture, the system is designed to support:
- Database integration (structure suggests Drizzle ORM compatibility)
- Content Management System for Markdown files
- Real-time chat functionality
- Social media API integrations
- Analytics and tracking systems

### Environment Configuration Required
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Base URL for authentication callbacks
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `GITHUB_ID` & `GITHUB_SECRET`: GitHub OAuth credentials
- Database connection string (when database is added)

### Deployment
- Configured to run on port 5000
- Supports both development and production builds
- Static optimization for non-dynamic routes