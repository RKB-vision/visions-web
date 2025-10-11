# Visions Web - AI Projects Blog

A professional blog platform for showcasing AI projects and tools, featuring an Apple-inspired design aesthetic.

> 🚀 **Ready to deploy to Vercel or Netlify!** See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions.

## Features

- **Professional Apple-inspired Design**: Clean, modern interface with intuitive navigation
- **AI Tools & Projects Section**: Dedicated area to showcase AI projects and tools
- **Authentication System**: User login/logout functionality
- **Survey System**: Pre-defined surveys for user feedback
- **Admin Panel**: Advanced options for user management
  - Assign special tags to users (TOP SUPPORTER, TRUSTED, etc.)
  - View survey responses with username information
- **Favorites System**: Users can mark projects as favorites
- **Chat System**: Messaging functionality for users with "TRUSTED" status
- **Social Profiles**: Integration with social media platforms

## Admin Guide

### How to Add New Projects

1. Navigate to the `content/projects` directory
2. Create a new Markdown file with the following format:
   ```md
   ---
   title: "Project Title"
   description: "Brief description of the project"
   date: "YYYY-MM-DD"
   image: "/images/projects/project-image.jpg"
   tags: ["AI", "Machine Learning", "NLP"]
   featured: true/false
   ---

   Project content goes here...
   ```

### Admin Features

- **User Management**: Access the admin panel at `/admin` to manage users
- **Assign Tags**: From the admin panel, select a user and assign special tags
- **Survey Results**: View and export survey responses from the admin dashboard
- **Content Management**: Add, edit, or remove projects and blog posts

### Configuration

Key configuration files:
- `src/config/auth.ts` - Authentication settings
- `src/config/admin.ts` - Admin panel configuration
- `src/config/surveys.ts` - Survey question configuration

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/YOUR_USERNAME/visions-web.git
   cd visions-web
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
3. **Generate authentication secret**
   ```bash
   openssl rand -base64 32
   ```
   Add the output to your `.env` file as `AUTH_SECRET`

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:5000](http://localhost:5000)

### Default Test Accounts
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Deployment

This app is ready to deploy to:
- ✅ **Vercel** (recommended) - See [DEPLOYMENT.md](./DEPLOYMENT.md)
- ✅ **Netlify** - See [DEPLOYMENT.md](./DEPLOYMENT.md)  
- ✅ **Replit** - Currently running here

**Custom Domain**: Configured for `www.visions.com.np` - DNS setup in [DEPLOYMENT.md](./DEPLOYMENT.md)

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Authentication (NextAuth.js)
- Content Management (Markdown)
