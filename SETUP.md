# 🚀 Quick Start Guide

This guide will help you get your Next.js project up and running.

## Prerequisites

Make sure you have the following installed:
- **Node.js** 20.x or later (Recommended: 20.x LTS or 22.x LTS)
- **npm**, **yarn**, or **pnpm** package manager

Check your Node.js version:
```bash
node --version  # Should show v20.x.x or higher
```

## Installation Steps

### 1. Verify Node.js Version

Make sure you're using Node.js 20 or later:

```bash
node --version  # Should show v20.x.x or v22.x.x
```

If you need to upgrade Node.js, visit [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

This will install all the necessary dependencies including:
- **Next.js 15** (Latest)
- **React 19** (Latest with new compiler)
- **TypeScript 5.7** (Latest)
- **Tailwind CSS v4** (Latest - CSS-first configuration)
- **ESLint & Prettier**

### 3. Run Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### 4. Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure Overview

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── (routes)/          # Route groups
│   │   ├── dashboard/     # Dashboard
│   │   └── auth/          # Auth pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   └── shared/           # Shared components
├── hooks/                # Custom hooks
├── lib/                  # Utilities
├── services/             # API services
├── types/                # TypeScript types
├── public/               # Static assets
└── styles/               # Global styles
```

## 🎨 Available Features

### Dark Mode
The application includes a built-in dark mode toggle. Click the sun/moon icon in the navbar to switch themes.

### Custom Hooks
- `useLocalStorage` - Persist state in localStorage
- `useTheme` - Manage light/dark theme
- `useMediaQuery` - Responsive design helper

### UI Components
- Button (with variants: primary, secondary, outline, ghost, danger)
- Card (with optional header, description, footer)
- Input & Textarea (with validation support)
- ThemeToggle
- LoadingSpinner
- Container

### Example Pages
- Home (`/`) - Landing page
- Dashboard (`/dashboard`) - Dashboard example
- Login (`/auth/login`) - Authentication form
- Register (`/auth/register`) - Registration form
- Forgot Password (`/auth/forgot-password`)
- About (`/about`)
- Contact (`/contact`)

### API Routes
- `/api/hello` - Example endpoint
- `/api/users` - Users CRUD operations
- `/api/users/[id]` - Individual user operations
- `/api/products` - Products endpoints

## 🛠️ Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Format code
npm run format
```

## 🎯 Next Steps

1. **Customize the theme**: Edit `tailwind.config.ts` to change colors, fonts, etc.
2. **Add your content**: Replace placeholder content with your own
3. **Add environment variables**: Copy `.env.example` to `.env.local` and add your keys
4. **Connect a database**: Add your database connection in `services/db/`
5. **Set up authentication**: Implement NextAuth or custom JWT auth
6. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 🐛 Troubleshooting

### Port already in use
If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 npm run dev
```

### Dependencies issues
If you encounter dependency issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
Make sure all dependencies are installed and try restarting your IDE.

---

**Happy coding! 🎉**

