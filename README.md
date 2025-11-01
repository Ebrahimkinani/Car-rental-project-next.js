# Cars Project - Next.js + TypeScript + Tailwind CSS

A production-grade, enterprise-ready Next.js application with clean architecture and scalable folder structure.

## 🚀 Tech Stack

- **Next.js 15** (Latest - App Router)
- **React 19** (Latest)
- **TypeScript 5.7** (Strict Mode)
- **Tailwind CSS v4** (Latest - CSS-first configuration)
- **ESLint + Prettier** (Code Quality)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── (routes)/          # Route groups
│   │   ├── dashboard/     # Dashboard route
│   │   └── auth/          # Authentication routes
│   └── api/               # API routes
│       ├── hello/         # Example API endpoint
│       ├── users/         # User endpoints
│       └── products/      # Product endpoints
├── components/            # React components
│   ├── ui/               # Reusable UI components (Button, Card, Input)
│   ├── layout/           # Layout components (Navbar, Footer)
│   └── shared/           # Shared components across routes
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useTheme.ts
├── lib/                  # Utility functions and configurations
│   ├── utils.ts          # General utilities
│   ├── constants.ts      # App-wide constants
│   └── validations.ts    # Validation schemas
├── services/             # External services and API clients
│   ├── api/             # API service layer
│   ├── auth/            # Authentication service
│   └── db/              # Database connections
├── types/                # TypeScript type definitions
│   └── index.ts
├── public/               # Static assets
└── styles/               # Global styles
    └── globals.css
```

## 🔒 Security

This project implements enterprise-grade security practices:

- **Environment Variables**: All sensitive data stored in `.env.local` (never committed)
- **Database Security**: MongoDB Atlas with encrypted connections and proper authentication
- **Input Validation**: Comprehensive validation using Mongoose schemas
- **Error Handling**: Secure error responses without data exposure
- **Connection Security**: Optimized MongoDB connection with security options

### Security Setup

1. **Environment Variables**:
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit with your actual credentials
   nano .env.local
   ```

2. **Validate Environment**:
   ```bash
   npm run validate-env
   ```

3. **Security Documentation**: See [SECURITY.md](./SECURITY.md) for detailed guidelines

## 🛠️ Getting Started

### Prerequisites

- **Node.js 20+** (Recommended: 20.x or 22.x LTS)
- npm, yarn, or pnpm package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎨 Features

- ✅ **Clean Architecture** - Separation of concerns with clear boundaries
- ✅ **TypeScript Strict Mode** - Type safety throughout the application
- ✅ **Path Aliases** - Clean imports with `@/` prefix
- ✅ **Dark Mode** - Built-in theme toggle
- ✅ **Reusable Components** - UI component library
- ✅ **Custom Hooks** - `useLocalStorage`, `useTheme`
- ✅ **API Routes** - Example endpoints
- ✅ **Code Quality** - ESLint + Prettier configured

## 🏗️ Development Standards

- Use functional components and React Hooks
- Keep business logic separate from UI components
- Use TypeScript interfaces for all data structures
- Follow the established folder structure
- Write clean, readable, and maintainable code

## 📦 Project Configuration

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Button } from "@/components/ui/Button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatDate } from "@/lib/utils";
```

### Tailwind CSS v4 Custom Theme

Custom color palette and spacing defined directly in `styles/globals.css` using the new Tailwind v4 `@theme` directive:

- Primary colors (blue shades) 
- Secondary colors (purple shades)
- Extended spacing scale
- Custom border radius
- CSS-first configuration (no tailwind.config.ts needed)

## 🔒 Environment Variables

See `.env.example` for all available environment variables.

Additionally:

- `NEXT_PUBLIC_WS_URL` (optional) — WebSocket endpoint for live notifications. If not set, notifications fall back to fetch and the realtime push remains a no-op.

## 📄 License

MIT

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

